// /scripts/sync-vault.js
// Note: Uses ES Module syntax (ensure "type": "module" in package.json)
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // Using explicit config loading
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import { v2 as cloudinary } from 'cloudinary';
import simpleGit from 'simple-git';

// --- ES Module Fix for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- End ES Module Fix ---

// --- Explicitly Load .env from Project Root ---
const envPath = path.resolve(__dirname, '..', '.env');
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
    console.warn(`Warning: Could not load .env file from ${envPath}:`, dotenvResult.error.message);
} else {
    console.log(`Loaded environment variables from ${envPath}`);
}
// --- End Loading .env ---


// --- Configuration ---
// Ensure Cloudinary config happens *after* dotenv loads
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const vaultBaseDirs = (process.env.VAULT_DIRS || '')
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);

const manifestPath = path.resolve(__dirname, 'cloudinary-manifest.json');
const projectRoot = path.resolve(__dirname, '..');
const git = simpleGit(projectRoot);

// --- Helper Functions ---

/**
 * Loads the manifest file containing already uploaded image paths.
 * Converts paths to lowercase for case-insensitive checking.
 * @returns {Promise<Set<string>>} A Set containing lowercase vaultId-prefixed vault-relative paths.
 */
async function loadManifest() {
    try {
        const data = await fs.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(data);
        // Ensure uploadedImages is an array and convert paths to lowercase
        const lowerCasePaths = (Array.isArray(manifest.uploadedImages) ? manifest.uploadedImages : [])
            .map(p => typeof p === 'string' ? p.toLowerCase() : '') // Convert to lowercase
            .filter(Boolean); // Remove empty strings
        console.log(`Loaded ${lowerCasePaths.length} paths from manifest.`);
        return new Set(lowerCasePaths);
    } catch (error) {
        if (error.code === 'ENOENT') {
             console.log('Manifest file not found. Starting fresh.');
        } else {
             console.warn('Manifest file invalid or unreadable. Starting fresh.', error.message);
        }
        return new Set(); // Return empty Set on error
    }
}

/**
 * Saves the updated set of uploaded image paths (as lowercase) to the manifest file.
 * @param {Set<string>} uploadedPathsLower - The Set containing lowercase vaultId-prefixed vault-relative paths.
 */
async function saveManifest(uploadedPathsLower) {
    // Convert Set back to a sorted array for stable output
    const manifestData = { uploadedImages: Array.from(uploadedPathsLower).sort() };
    try {
        await fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2), 'utf-8');
        console.log(`Manifest file saved with ${uploadedPathsLower.size} paths.`);
    } catch (error) {
        console.error('Error saving manifest file:', error);
    }
}


/**
 * Uploads an image to Cloudinary.
 * @param {string} localImagePath - Full path to the local image file.
 * @param {string} publicId - The desired Cloudinary Public ID (original case, vaultId-prefixed vault-relative path).
 * @returns {Promise<boolean>} True if upload was successful or image already exists, false otherwise.
 */
async function uploadToCloudinary(localImagePath, imageName, vaultId) {
    try {
        const imageNameWithoutSuffix = path.basename(imageName, path.extname(imageName));

        const folder = `${vaultId}/images`;
        console.log(`Uploading "${path.relative(projectRoot, localImagePath)}" with public_id "${imageName}"...`);
        const result = await cloudinary.uploader.upload(localImagePath, {
            public_id: imageNameWithoutSuffix, // Use original case for Cloudinary Public ID
            overwrite: false,    // Don't overwrite existing
            folder: folder, // Set folder based on path
            use_filename: true,  // Use the filename part of the public_id
            unique_filename: false, // Prevent Cloudinary from adding random chars
        });
        console.log(`  -> Upload successful: ${result.secure_url}`);
        return true;
    } catch (error) {
        if (error.http_code === 409) { // 409 Conflict usually means already exists with this public_id
             console.warn(`  -> Image already exists on Cloudinary (or conflict): ${imageName}`);
             return true; // Treat as success for manifest update purposes
        }
        // Log other errors
        console.error(`  -> Upload failed for "${localImagePath}" (image: ${imageName}) (vault: ${vaultId}):`, error.message || error);
        return false;
    }
}

/**
 * Searches for an image file within a specific vault directory based on its name.
 * Handles potential case-insensitivity of the filesystem.
 * @param {string} imageName - The base name of the image file (e.g., "neuron_sample.png").
 * @param {string} vaultAbsPath - The absolute path to the root of the vault being searched.
 * @returns {Promise<string | null>} The full absolute path to the found image (with original casing), or null.
 */
async function findImageFullPath(imageName, vaultAbsPath) {
    const cleanImageName = imageName.trim();
    if (!cleanImageName) return null;
    // Glob pattern to find the file recursively, case-insensitively
    const pattern = path.join(vaultAbsPath, '**', cleanImageName).replace(/\\/g, '/');
    try {
        const matches = await glob(pattern, {
            nodir: true,           // Match only files
            absolute: true,        // Return absolute paths
            caseSensitiveMatch: false // IMPORTANT: Find files regardless of case
        });

        if (matches.length === 1) {
            return matches[0]; // Unique match (case might differ from imageName)
        } else if (matches.length > 1) {
            // Try to find an exact case match among the results
            const exactMatch = matches.find(m => path.basename(m) === cleanImageName);
            if (exactMatch) return exactMatch; // Prefer exact case if found

            // If no exact case match, warn and return the first found (arbitrary)
            console.warn(`  - Image search ambiguous: Found multiple files matching "${cleanImageName}" (case-insensitive) in vault ${path.basename(vaultAbsPath)}. Using first found: ${path.relative(projectRoot, matches[0])}`);
            return matches[0];
        } else {
            return null; // No match found
        }
    } catch (error) {
        console.error(`Error searching for image "${cleanImageName}" in "${vaultAbsPath}":`, error);
        return null;
    }
}

/** Helper to escape characters special to regex */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


// --- Pre-processing Function for Renaming ---
/**
 * Scans vaults for images with spaces in names, renames them (space -> underscore),
 * and updates standard Markdown links `![](...)` and `![[...]]` embeds.
 */
async function preprocessRenameImagesAndLinks() {
    console.log('\n--- Starting Pre-processing: Renaming images with spaces ---');
    const imagePatterns = vaultBaseDirs.map(dir => path.join(dir, '**/*.{png,jpg,jpeg,gif,svg,webp}').replace(/\\/g, '/'));
    // Use cwd: projectRoot for globbing relative to project root
    const allImageFiles = await glob(imagePatterns, { cwd: projectRoot, absolute: true });

    const renamedFilesMap = new Map(); // Map<oldBasename, newBasename>
    let filesRenamedCount = 0;

    console.log(`Scanning ${allImageFiles.length} image files for spaces...`);
    for (const oldPath of allImageFiles) {
        const oldBaseName = path.basename(oldPath);
        if (oldBaseName.includes(' ')) {
            const newBaseName = oldBaseName.replace(/\s+/g, '_');
            const newPath = path.join(path.dirname(oldPath), newBaseName);
            try {
                 await fs.access(newPath); // Check if target exists
                 console.warn(`  Skipping rename: Target file "${path.relative(projectRoot, newPath)}" already exists.`);
                 continue;
            } catch (accessError) { /* OK: Target doesn't exist */ }

            try {
                await fs.rename(oldPath, newPath);
                console.log(`  Renamed: "${path.relative(projectRoot, oldPath)}" -> "${path.relative(projectRoot, newPath)}"`);
                renamedFilesMap.set(oldBaseName, newBaseName);
                filesRenamedCount++;
            } catch (error) {
                console.error(`  Error renaming "${path.relative(projectRoot, oldPath)}":`, error);
            }
        }
    }
    console.log(`Finished renaming ${filesRenamedCount} image file(s).`);

    if (renamedFilesMap.size === 0) {
        console.log('No files were renamed, skipping link updates.');
        console.log('--- Finished Pre-processing ---');
        return;
    }

    console.log('Scanning Markdown files to update links...');
    const markdownFiles = await findMarkdownFiles(); // findMarkdownFiles returns absolute paths
    let linksUpdatedCount = 0;
    let filesContentChangedCount = 0;

    for (const mdFilePath of markdownFiles) {
        let mdContent = await fs.readFile(mdFilePath, 'utf-8');
        let originalContent = mdContent;
        let fileContentChanged = false;

        for (const [oldBaseName, newBaseName] of renamedFilesMap.entries()) {
            // Update standard links ![alt](path/old name.png) -> ![alt](path/new_name.png)
            const standardLinkPattern = new RegExp(`\\!\\[([^\\]]*)\\]\\(([^\\(\\)]*?)${escapeRegex(oldBaseName)}\\)`, 'g');
            mdContent = mdContent.replace(standardLinkPattern, (match, altText, pathPart) => {
                // Ensure pathPart ends with / if it's not empty, handle windows paths if necessary
                const separator = pathPart && !pathPart.endsWith('/') ? '/' : '';
                const newLink = `![${altText}](${pathPart}${separator}${newBaseName})`;
                if (match !== newLink) {
                    fileContentChanged = true; linksUpdatedCount++;
                }
                return newLink;
            });

            // Update wikilink embeds ![[old name.png]] -> ![[new_name.png]]
            const wikiEmbedPattern = new RegExp(`\\!\\[\\[${escapeRegex(oldBaseName)}\\]\\]`, 'g');
            const wikiReplacement = `![[${newBaseName}]]`;
             mdContent = mdContent.replace(wikiEmbedPattern, (match) => {
                 if (match !== wikiReplacement) {
                     fileContentChanged = true; linksUpdatedCount++;
                 }
                 return wikiReplacement;
             });
        }

        if (fileContentChanged && mdContent !== originalContent) {
            try {
                await fs.writeFile(mdFilePath, mdContent, 'utf-8');
                console.log(`  -> Updated links in: ${path.relative(projectRoot, mdFilePath)}`);
                filesContentChangedCount++;
            } catch (error) {
                console.error(`  -> Error writing updated file ${mdFilePath}:`, error);
            }
        }
    }

    console.log(`Finished scanning ${markdownFiles.length} Markdown files. Found/Updated ${linksUpdatedCount} link occurrences in ${filesContentChangedCount} files.`);
    console.log('--- Finished Pre-processing ---');
}


// --- Main Processing Logic ---

/**
 * Finds all markdown files in the configured vault directories.
 * @returns {Promise<string[]>} Array of absolute file paths.
 */
async function findMarkdownFiles() {
    // Use relative paths for glob pattern when using cwd
    const patterns = vaultBaseDirs.map(dir => path.join(dir, '**/*.md').replace(/\\/g, '/'));
    // console.log('Searching for Markdown files in:', patterns); // Less verbose
    const files = await glob(patterns, {
        ignore: 'node_modules/**',
        cwd: projectRoot, // Search relative to project root
        absolute: true    // Still return absolute paths
    });
    // console.log(`Found ${files.length} markdown files.`);
    return files;
}

/**
 * Processes a single markdown file: finds local images (standard or converted wikilink),
 * uploads new ones, updates links to vault-ID-prefixed vault-relative paths in standard format.
 * Assumes images no longer have spaces in names due to pre-processing.
 * @param {string} mdFilePath - Absolute path to the markdown file.
 * @param {Set<string>} uploadedImagesManifest - The Set of already uploaded images (stores LOWERCASE paths).
 * @returns {Promise<boolean>} True if the file content was effectively changed and saved.
 */
async function processMarkdownFile(mdFilePath, uploadedImagesManifest) {
    const originalMdContent = await fs.readFile(mdFilePath, 'utf-8');
    let currentMdContent = originalMdContent;
    let astModified = false;
    let wikiLinksConverted = false;

    // Determine Vault ID and Path
    let vaultId = null;
    let vaultAbsPath = null;
    for (const baseDir of vaultBaseDirs) {
        const fullBaseDir = path.resolve(projectRoot, baseDir);
        if (mdFilePath.startsWith(fullBaseDir + path.sep) || mdFilePath === fullBaseDir) {
            vaultId = path.basename(baseDir); // Use base name of vault dir as ID
            vaultAbsPath = fullBaseDir;
            break;
        }
    }
    if (!vaultId || !vaultAbsPath) {
        console.error(`Could not determine vault context for file: ${mdFilePath}`);
        return false;
    }

    // Step 1: Convert ![[...]] to standard ![](...) format
    const wikiEmbedPattern = /!\[\[([^\]\n]+?\.(?:png|jpg|jpeg|gif|svg|webp))\]\]/gi;
    currentMdContent = currentMdContent.replace(wikiEmbedPattern, (match, imageName) => {
        const standardLink = `![${imageName}](${imageName})`; // Alt text defaults to filename
        if (match !== standardLink) { wikiLinksConverted = true; }
        return standardLink;
    });

    // Step 2: Process all standard image links via AST
    const processor = unified().use(remarkParse);
    const tree = processor.parse(currentMdContent); // Parse potentially modified content
    const uploadPromises = [];
    const nodesToProcess = [];
    visit(tree, 'image', (node) => { nodesToProcess.push(node); });

    for (const node of nodesToProcess) {
        const imageUrl = node.url;

        if (!imageUrl || imageUrl.startsWith('http') || imageUrl.startsWith('data:')) { continue; }

        const imageName = path.basename(imageUrl); // Should have underscores if renamed
        const localImagePathFull = await findImageFullPath(imageName, vaultAbsPath);

        if (!localImagePathFull) {
            console.warn(`  - Image skipped (sync phase): Cannot find local file for "${imageName}" in vault "${vaultId}" (referenced as "${imageUrl}" in ${path.basename(mdFilePath)})`);
            continue;
        }

        // Lowercase version for manifest checking/storage
        const cloudinaryPublicIdLower = imageName.toLowerCase();
        const manifestKey = `${vaultId.toLowerCase()}/images/${cloudinaryPublicIdLower}`;

        // Check manifest using the LOWERCASE prefixed ID
        const alreadyUploaded = uploadedImagesManifest.has(manifestKey);
        // Check if the node URL needs updating to the ORIGINAL CASE prefixed ID
        const linkNeedsUpdate = node.url !== cloudinaryPublicIdLower;

        if (!alreadyUploaded) {
            console.log('Manifest key not found, uploading:', manifestKey);

            // Upload using the ORIGINAL CASE prefixed ID
            const uploadPromise = uploadToCloudinary(localImagePathFull, cloudinaryPublicIdLower, vaultId)
                .then(success => {
                    if (success) {
                        // Add the LOWERCASE prefixed ID to the manifest
                        uploadedImagesManifest.add(manifestKey);
                        // Update AST node URL to the ORIGINAL CASE prefixed ID
                        if (node.url !== cloudinaryPublicIdLower) {
                            node.url = cloudinaryPublicIdLower;
                            astModified = true;
                            console.log(`  - Link updated post-upload: ${cloudinaryPublicIdLower} in ${path.basename(mdFilePath)}`);
                        }
                    }
                });
            uploadPromises.push(uploadPromise);
        } else if (linkNeedsUpdate) {
            // Already uploaded, just update the AST node URL to the ORIGINAL CASE prefixed ID
            console.log(`  - Link update needed (already uploaded): ${imageUrl} -> ${cloudinaryPublicIdLower} in ${path.basename(mdFilePath)}`);
            node.url = cloudinaryPublicIdLower;
            astModified = true;
        }
    } // End loop through image nodes

    if (uploadPromises.length > 0) {
        console.log(`Waiting for ${uploadPromises.length} image upload(s) for ${path.basename(mdFilePath)}...`);
        await Promise.all(uploadPromises);
    }

    // Step 3: Final Write Check
    const fileNeedsSaving = wikiLinksConverted || astModified;

    if (fileNeedsSaving) {
        // Stringify the potentially modified AST
        const finalContentToWrite = unified().use(remarkStringify).stringify(tree);
        // Only write if the final content is actually different from the original
        if (finalContentToWrite !== originalMdContent) {
             try {
                await fs.writeFile(mdFilePath, finalContentToWrite, 'utf-8');
                console.log(`  -> File updated (Sync Phase): ${path.relative(projectRoot, mdFilePath)}`);
                return true; // Return true: file was modified and saved
            } catch (error) {
                console.error(`  -> Error writing updated file ${mdFilePath}:`, error);
                return false; // Return false as save failed
            }
        } else {
             return false; // No effective change
        }
    }
    return false; // No modifications needed saving in this phase
}


/**
 * Runs Git commands to add, commit, and push changes if any are detected.
 */
async function runGitCommands() {
    try {
        console.log('Checking Git status...');
        // Use relative paths for git add
        const relativeManifestPath = path.relative(projectRoot, manifestPath);
        const pathsToAdd = [...vaultBaseDirs, relativeManifestPath];
        console.log(`Staging changes in: ${pathsToAdd.join(', ')}`);
        await git.add(pathsToAdd);

        const status = await git.status();
        // Check only staged changes after explicit add
        const hasStagedChanges = status.staged.length > 0;

        if (!hasStagedChanges) {
            console.log('No changes staged for commit. Skipping commit and push.');
            return;
        }

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
    if (vaultBaseDirs.length === 0) { console.error('Error: No VAULT_DIRS configured in .env file. Exiting.'); process.exit(1); }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) { console.error('Error: Cloudinary credentials missing...'); process.exit(1); }
    // --- End Configuration Checks ---

    // --- Run Pre-processing Step ---
    await preprocessRenameImagesAndLinks();
    // --- End Pre-processing Step ---

    const uploadedImagesManifest = await loadManifest(); // Loads lowercase paths
    const initialManifestSize = uploadedImagesManifest.size;
    const markdownFiles = await findMarkdownFiles();

    console.log('Manifest Content:', uploadedImagesManifest); // Debugging: Show manifest content

    console.log(`Processing ${markdownFiles.length} Markdown files for Cloudinary sync...`);
    for (const mdFile of markdownFiles) {
        await processMarkdownFile(mdFile, uploadedImagesManifest); // Uses/adds lowercase paths to manifest Set
    }
    console.log('Finished processing Markdown files.');
    
    // Save manifest only if new images were added
    const finalManifestSize = uploadedImagesManifest.size;
    if (finalManifestSize > initialManifestSize) {
        await saveManifest(uploadedImagesManifest); // Saves lowercase paths
    } else {
        console.log('No new images were uploaded. Manifest not saved.');
    }

    // Run Git commands (will check status internally)
    await runGitCommands();

    console.log('Vault sync process finished.');
}

// Execute the main function
main().catch(error => {
    console.error("An unexpected error occurred in main:", error);
    process.exit(1);
});
