import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; // Import necessary function for ES modules
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import { v2 as cloudinary } from 'cloudinary';
import simpleGit from 'simple-git';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Explicitly Load .env from Project Root ---
// Calculate the path to the .env file in the parent directory (project root)
const envPath = path.resolve(__dirname, '..', '.env');
// Load the .env file
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
    console.warn(`Warning: Could not load .env file from ${envPath}:`, dotenvResult.error.message);
} else {
    console.log(`Loaded environment variables from ${envPath}`);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Vault directories from .env, split into an array
const vaultBaseDirs = (process.env.VAULTS || '').split(',').map(d => `vaults/${d.trim()}`).filter(Boolean);
const manifestPath = path.resolve(__dirname, 'cloudinary-manifest.json'); // Path to manifest file
const projectRoot = path.resolve(__dirname, '..');

// Simple Git instance
const git = simpleGit(projectRoot);

// --- Helper Functions ---

/**
 * Loads the manifest file containing already uploaded image paths.
 * @returns {Promise<Set<string>>} A Set containing vault-relative paths of uploaded images.
 */
async function loadManifest() {
    try {
        const data = await fs.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(data);
        // Ensure uploadedImages is an array and convert to Set for efficient lookup
        return new Set(Array.isArray(manifest.uploadedImages) ? manifest.uploadedImages : []);
    } catch (error) {
        // If manifest doesn't exist or is invalid, start with an empty set
        console.warn('Manifest file not found or invalid. Starting fresh.', error.message);
        return new Set();
    }
}

/**
 * Saves the updated set of uploaded image paths to the manifest file.
 * @param {Set<string>} uploadedPaths - The Set containing vault-relative paths.
 */
async function saveManifest(uploadedPaths) {
    const manifestData = { uploadedImages: Array.from(uploadedPaths).sort() }; // Convert Set to sorted array
    try {
        await fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2), 'utf-8');
        console.log('Manifest file saved.');
    } catch (error) {
        console.error('Error saving manifest file:', error);
    }
}

/**
 * Uploads an image to Cloudinary.
 * @param {string} localImagePath - Full path to the local image file.
 * @param {string} publicId - The desired Cloudinary Public ID (vault-relative path).
 * @returns {Promise<boolean>} True if upload was successful, false otherwise.
 */
async function uploadToCloudinary(localImagePath, publicId) {
    try {
        console.log(`Uploading "${localImagePath}" with public_id "${publicId}"...`);
        const result = await cloudinary.uploader.upload(localImagePath, {
            public_id: publicId,
            overwrite: false, // Don't overwrite if already exists (idempotency)
            // Add other options like folder, tags, optimization if needed
            // folder: path.dirname(publicId) // Automatically put in folders matching path
        });
        console.log(`  -> Upload successful: ${result.secure_url}`);
        return true;
    } catch (error) {
        // Handle specific error types if needed (e.g., already exists might not be a failure)
        if (error.http_code === 409) { // Example: Conflict/Already Exists
             console.warn(`  -> Image already exists on Cloudinary (or conflict): ${publicId}`);
             return true; // Treat as success if it's already there
        }
        console.error(`  -> Upload failed for "${localImagePath}":`, error.message || error);
        return false;
    }
}

/**
 * Searches for an image file within a specific vault directory based on its name.
 * Assumes image names are unique within the vault for reliable linking.
 * @param {string} imageName - The base name of the image file (e.g., "neuron-sample.png").
 * @param {string} vaultAbsPath - The absolute path to the root of the vault being searched.
 * @returns {Promise<string | null>} The full absolute path to the found image, or null if not found or ambiguous.
 */
async function findImageFullPath(imageName, vaultAbsPath) {
    const cleanImageName = imageName.trim();
    if (!cleanImageName) return null;
    // Create a glob pattern to search recursively within the vault path
    const pattern = path.join(vaultAbsPath, '**', cleanImageName).replace(/\\/g, '/');
    try {
        // Use { absolute: true } to get absolute paths directly
        const matches = await glob(pattern, { nodir: true, absolute: true });

        if (matches.length === 1) {
            return matches[0]; // Return the full absolute path
        } else if (matches.length > 1) {
            console.warn(`  - Image search ambiguous: Found multiple files named "${cleanImageName}" in vault ${path.basename(vaultAbsPath)}. Using the first match: ${path.relative(projectRoot, matches[0])}`);
            return matches[0]; // Return first match for now
        } else {
            return null; // No match found
        }
    } catch (error) {
        console.error(`Error searching for image "${cleanImageName}" in "${vaultAbsPath}":`, error);
        return null;
    }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Scans vaults for images with spaces in names, renames them (space -> underscore),
 * and updates Markdown links `![](...)` and `![[...]]` embeds in all markdown files.
 */
async function preprocessRenameImagesAndLinks() {
    console.log('\n--- Starting Pre-processing: Renaming images with spaces ---');
    const imagePatterns = vaultBaseDirs.map(dir => path.join(dir, '**/*.{png,jpg,jpeg,gif,svg,webp}').replace(/\\/g, '/'));
    const allImageFiles = await glob(imagePatterns, { cwd: projectRoot, absolute: true });

    // Map<oldBasename, newBasename> - only store basenames for easier lookup
    const renamedFilesMap = new Map();
    let filesRenamedCount = 0;

    // 1. Rename image files with spaces
    console.log('Scanning for image files with spaces...');
    for (const oldPath of allImageFiles) {
        const oldBaseName = path.basename(oldPath);
        if (oldBaseName.includes(' ')) {
            const newBaseName = oldBaseName.replace(/\s+/g, '_'); // Replace spaces with underscores
            const newPath = path.join(path.dirname(oldPath), newBaseName);
            // Check if target already exists (e.g., my_image.png exists when renaming my image.png)
            try {
                 await fs.access(newPath);
                 console.warn(`  Skipping rename: Target file "${path.relative(projectRoot, newPath)}" already exists.`);
                 continue; // Skip rename if target exists
            } catch (accessError) {
                 // Target doesn't exist, proceed with rename
            }

            try {
                await fs.rename(oldPath, newPath);
                console.log(`  Renamed: "${path.relative(projectRoot, oldPath)}" -> "${path.relative(projectRoot, newPath)}"`);
                renamedFilesMap.set(oldBaseName, newBaseName); // Store mapping using base names
                filesRenamedCount++;
            } catch (error) {
                console.error(`  Error renaming "${path.relative(projectRoot, oldPath)}":`, error);
            }
        }
    }
    console.log(`Finished renaming ${filesRenamedCount} image file(s).`);

    // 2. Update links in Markdown files if any files were renamed
    if (renamedFilesMap.size === 0) {
        console.log('No files were renamed, skipping link updates.');
        console.log('--- Finished Pre-processing ---');
        return;
    }

    console.log('Scanning Markdown files to update links...');
    const markdownFiles = await findMarkdownFiles();
    let linksUpdatedCount = 0;
    let filesContentChangedCount = 0;

    for (const mdFilePath of markdownFiles) {
        let mdContent = await fs.readFile(mdFilePath, 'utf-8');
        let originalContent = mdContent; // Keep original to check if changes occurred
        let fileContentChanged = false;

        // Iterate through the map of renamed files
        for (const [oldBaseName, newBaseName] of renamedFilesMap.entries()) {
            // --- Update standard Markdown links: ![alt](path/old name.png) ---
            // Need a regex that captures the path part and the old name
            // This regex is complex: finds ![...]( potentially/relative/path/ içeren/old name.png )
            // It tries to handle relative paths before the filename within the parentheses.
            const standardLinkPattern = new RegExp(`\\!\\[([^\\]]*)\\]\\(([^\\)\\n]*?)${escapeRegex(oldBaseName)}\\)`, 'g');
            let standardMatch;
            let tempMdContent = mdContent; // Work on a temp copy for this pattern
            let standardLinkUpdated = false;
            while ((standardMatch = standardLinkPattern.exec(tempMdContent)) !== null) {
                const altText = standardMatch[1];
                const pathPart = standardMatch[2]; // Path before the filename
                const newLink = `![${altText}](${pathPart}${newBaseName})`;
                console.log(`  Updating standard link in ${path.basename(mdFilePath)}: "${standardMatch[0]}" -> "${newLink}"`);
                // Replace directly in the main content string - CAUTION with multiple replaces
                mdContent = mdContent.replace(standardMatch[0], newLink);
                fileContentChanged = true;
                standardLinkUpdated = true;
            }
            if (standardLinkUpdated) linksUpdatedCount++; // Count updates per file pattern

            // --- Update wikilink embeds: ![[old name.png]] ---
            // Simpler regex for this specific pattern
            const wikiEmbedPattern = new RegExp(`\\!\\[\\[${escapeRegex(oldBaseName)}\\]\\]`, 'g');
            const wikiReplacement = `![[${newBaseName}]]`;
            let wikiLinkUpdated = false;
            if (mdContent.includes(`![[${oldBaseName}]]`)) { // Quick check before regex replace
                 const updatedContent = mdContent.replace(wikiEmbedPattern, wikiReplacement);
                 if (updatedContent !== mdContent) {
                    console.log(`  Updating wikilink embed in ${path.basename(mdFilePath)}: "![[${oldBaseName}]]" -> "${wikiReplacement}"`);
                    mdContent = updatedContent;
                    fileContentChanged = true;
                    wikiLinkUpdated = true;
                 }
            }
            if (wikiLinkUpdated) linksUpdatedCount++; // Count updates per file pattern
        } // End loop through renamedFilesMap

        // Write file only if content actually changed
        if (fileContentChanged && mdContent !== originalContent) {
            try {
                await fs.writeFile(mdFilePath, mdContent, 'utf-8');
                console.log(`  -> Updated links in: ${path.relative(projectRoot, mdFilePath)}`);
                filesContentChangedCount++;
            } catch (error) {
                console.error(`  -> Error writing updated file ${mdFilePath}:`, error);
            }
        }
    } // End loop through markdownFiles

    console.log(`Finished scanning ${markdownFiles.length} Markdown files. Found/Updated ${linksUpdatedCount} link occurrences in ${filesContentChangedCount} files.`);
    console.log('--- Finished Pre-processing ---');
}

// --- Main Processing Logic ---

/**
 * Finds all markdown files in the configured vault directories.
 * @returns {Promise<string[]>} Array of absolute file paths.
 */
async function findMarkdownFiles() {
    const patterns = vaultBaseDirs.map(dir => path.join(projectRoot, dir, '**/*.md').replace(/\\/g, '/')); // Normalize paths for glob
    console.log('Searching for Markdown files in:', patterns);
    const files = await glob(patterns, { ignore: 'node_modules/**' });
    console.log(`Found ${files.length} markdown files.`);
    return files;
}

/**
 * Processes a single markdown file: finds local images, uploads new ones, updates links.
 * @param {string} mdFilePath - Absolute path to the markdown file.
 * @param {Set<string>} uploadedImagesManifest - The Set of already uploaded images.
 * @returns {Promise<boolean>} True if the file was modified, false otherwise.
 */
async function processMarkdownFile(mdFilePath, uploadedImagesManifest) {
    console.log(`Processing file: ${path.relative(projectRoot, mdFilePath)}`);
    const mdContent = await fs.readFile(mdFilePath, 'utf-8');
    let fileModified = false;

    // --- Determine Vault ID and Path for this file ---
    let vaultId = null;
    let vaultAbsPath = null; // Absolute path to the vault root dir

    for (const baseDir of vaultBaseDirs) {
        const fullBaseDir = path.resolve(projectRoot, baseDir);
        if (mdFilePath.startsWith(fullBaseDir)) {
            vaultId = path.basename(baseDir); // e.g., Neuroscience
            vaultAbsPath = fullBaseDir;       // e.g., /path/to/project/vaults/Neuroscience
            containingVaultDir = baseDir;     // e.g., vaults/Neuroscience
            break;
        }
    }

    if (!vaultId || !vaultAbsPath) {
        console.error(`Could not determine vault context for file: ${mdFilePath}`);
        return false; // Cannot process without vault context
    }
    // --- End Vault ID Determination ---


    const processor = unified().use(remarkParse);
    const tree = processor.parse(mdContent);
    const uploadPromises = []; // Collect upload promises

    // Use visit with an async callback pattern if needed, or collect nodes to process after visit
    const nodesToProcess = [];
    visit(tree, 'image', (node) => {
        nodesToProcess.push(node);
    });

    // Process nodes asynchronously after traversal
    for (const node of nodesToProcess) {
        const imageUrl = node.url; // This might be "image.png" or "relative/path/image.png"

        // Skip absolute URLs and data URIs
        if (!imageUrl || imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
            continue;
        }

        // --- Find the full local path using the new helper ---
        // Extract the base filename from the potentially relative path in Markdown
        const imageName = path.basename(imageUrl);
        const localImagePathFull = await findImageFullPath(imageName, vaultAbsPath);
        // --- End Find Path ---

        if (!localImagePathFull) {
            console.warn(`  - Image skipped: Cannot find local file for "${imageName}" in vault "${vaultId}" (referenced in ${path.basename(mdFilePath)})`);
            continue; // Skip if local file wasn't found in the vault
        }

        // Determine the vault-relative path (used as Cloudinary Public ID)
        // Use the found absolute path and the vault's absolute path
        const vaultRelativePath = path.relative(vaultAbsPath, localImagePathFull)
                                    .replace(/\\/g, '/'); // Normalize to forward slashes

        // Check if image needs processing
        const alreadyUploaded = uploadedImagesManifest.has(vaultRelativePath);
        // Link needs update if the URL in markdown doesn't match the vault-relative path
        const linkNeedsUpdate = node.url !== vaultRelativePath;

        if (!alreadyUploaded) {
            // Queue upload and potential link update
            const uploadPromise = uploadToCloudinary(localImagePathFull, vaultRelativePath)
                .then(success => {
                    if (success) {
                        uploadedImagesManifest.add(vaultRelativePath);
                        if (node.url !== vaultRelativePath) { // Check again in case it was already correct
                            node.url = vaultRelativePath;
                            fileModified = true;
                            console.log(`  - Link updated for newly uploaded image: ${vaultRelativePath}`);
                        }
                    }
                });
            uploadPromises.push(uploadPromise); // Add promise to the list
        } else if (linkNeedsUpdate) {
            // Already uploaded, just update the link
            console.log(`  - Link update needed for already uploaded image: ${imageUrl} -> ${vaultRelativePath}`);
            node.url = vaultRelativePath;
            fileModified = true;
        } else {
            // console.log(`  - Image link already correct: ${node.url}`);
        }
    } // End loop through nodes

    // Wait for all uploads for this file to complete
    if (uploadPromises.length > 0) {
        console.log(`Waiting for ${uploadPromises.length} image upload(s) for ${path.basename(mdFilePath)}...`);
        await Promise.all(uploadPromises);
    }

    // If any modifications were made, stringify the AST back to Markdown
    if (fileModified) {
        const newMdContent = unified().use(remarkStringify).stringify(tree);
        try {
            await fs.writeFile(mdFilePath, newMdContent, 'utf-8');
            console.log(`  -> File updated: ${path.relative(projectRoot, mdFilePath)}`);
            return true;
        } catch (error) {
            console.error(`  -> Error writing updated file ${mdFilePath}:`, error);
            return false;
        }
    }

    return false; // No modifications needed
}

/**
 * Runs Git commands to add, commit, and push changes if any are detected.
 */
async function runGitCommands() {
    try {
        console.log('Checking Git status...');

        // Stage all changes in the vault directories and the manifest file
        // This ensures text edits, new files, deleted files, and manifest updates are staged.
        const pathsToAdd = [...vaultBaseDirs, path.relative(projectRoot, manifestPath)];
        console.log(`Staging changes in: ${pathsToAdd.join(', ')}`);
        await git.add(pathsToAdd);

        // Check status *after* staging
        const status = await git.status();

        // Check if there are changes staged for commit
        const hasStagedChanges = status.staged.length > 0 ||
                                 status.files.some(f => f.index !== ' ' && pathsToAdd.some(p => f.path.startsWith(p))); // More robust check

        if (!hasStagedChanges) {
            console.log('No changes staged for commit. Skipping commit and push.');
            return;
        }

        // If changes are staged, proceed with commit and push
        const commitMessage = `Sync vault notes and images (${new Date().toISOString()})`;
        console.log(`Committing ${status.staged.length} staged changes with message: "${commitMessage}"`);
        await git.commit(commitMessage);

        console.log('Pushing to origin...');
        await git.push('origin', 'main'); // Adjust branch name if needed

        console.log('Git sync complete.');
    } catch (error) {
        console.error('Error during Git operations:', error);
         try {
             const statusOnError = await git.status();
             console.error("Git status during error:", statusOnError);
         } catch (statusError) {
             console.error("Could not get Git status during error handling.");
         }
    }
}


// --- Main Execution ---
async function main() {
    console.log('Starting vault sync process...');

    // --- Configuration Checks ---
    if (vaultBaseDirs.length === 0) {
        console.error('Error: No VAULT_DIRS configured in .env file. Exiting.');
        process.exit(1);
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Error: Cloudinary credentials missing in .env file (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Exiting.');
        process.exit(1);
    }
    // --- End Configuration Checks ---

    await preprocessRenameImagesAndLinks();

    const uploadedImagesManifest = await loadManifest();
    const initialManifestSize = uploadedImagesManifest.size;
    const markdownFiles = await findMarkdownFiles();
    // let overallFilesModified = false; // No longer needed to track this separately

    let imageUploaded = false;

    console.log(`Processing ${markdownFiles.length} Markdown files...`);
    for (const mdFile of markdownFiles) {
        // Await processing, but we don't strictly need the boolean return value here anymore
        imageUploaded |= await processMarkdownFile(mdFile, uploadedImagesManifest);
        // if (modified) { overallFilesModified = true; } // Tracking no longer needed here
    }
    console.log('Finished processing Markdown files.');

    // Save manifest only if new images were added
    const finalManifestSize = uploadedImagesManifest.size;
    if (imageUploaded || finalManifestSize !== initialManifestSize) {
        await saveManifest(uploadedImagesManifest);
    } else {
        console.log('No new images were uploaded. Manifest not saved.');
    }

    console.log('Done I guess')
    // --- Run Git Commands Unconditionally ---
    // The runGitCommands function will now check the actual Git status after staging.
    //await runGitCommands();
    // --- End Run Git Commands ---

    //console.log('Vault sync process finished.');
}

// Execute the main function
main().catch(error => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
});
