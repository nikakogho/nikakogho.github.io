// /scripts/sync-vault.js
// Note: Uses ES Module syntax (ensure "type": "module" in package.json)
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import dotenv from 'dotenv'; // Using explicit config loading
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
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

const vaultConfigs = [
    { id: 'nexus', baseDir: 'Nexus' },
    { id: 'blog', baseDir: path.join('vaults', 'Blog') },
    { id: 'research', baseDir: path.join('vaults', 'Research') },
];
const vaultBaseDirs = vaultConfigs.map(({ baseDir }) => baseDir);
const skipGit = process.argv.includes('--skip-git') || process.env.SKIP_GIT_SYNC === '1';

const manifestPath = path.resolve(__dirname, 'cloudinary-manifest.json');
const projectRoot = path.resolve(__dirname, '..');
const git = simpleGit(projectRoot);
const execFileAsync = promisify(execFile);

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
    await fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2), 'utf-8');
    console.log(`Manifest file saved with ${uploadedPathsLower.size} paths.`);
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

const localImagePattern = /\.(?:png|jpe?g|gif|svg|webp|avif)$/i;

function normalizeLocalImageReference(reference) {
    if (typeof reference !== 'string') return null;

    let cleanReference = reference.trim().replace(/^<|>$/g, '');
    if (!cleanReference || /^(?:https?:|data:|blob:|\/\/)/i.test(cleanReference)) return null;

    cleanReference = cleanReference.split(/[?#]/, 1)[0];
    try {
        cleanReference = decodeURIComponent(cleanReference);
    } catch {
        // A local filename can legally contain a percent sign. Keep it unchanged.
    }

    return localImagePattern.test(cleanReference) ? cleanReference : null;
}

/**
 * Finds standard Markdown images, Obsidian image embeds, HTML images, and
 * cardImage frontmatter without altering the source document.
 */
function collectLocalImageReferences(markdownContent) {
    const references = new Set();
    const addReference = (reference) => {
        const normalizedReference = normalizeLocalImageReference(reference);
        if (normalizedReference) references.add(normalizedReference);
    };

    const tree = unified().use(remarkParse).parse(markdownContent);
    visit(tree, 'image', (node) => addReference(node.url));

    const wikiEmbedPattern = /!\[\[([^\]\n|]+?\.(?:png|jpe?g|gif|svg|webp|avif))(?:\|[^\]\n]+)?\]\]/gi;
    for (const match of markdownContent.matchAll(wikiEmbedPattern)) addReference(match[1]);

    const htmlImagePattern = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
    for (const match of markdownContent.matchAll(htmlImagePattern)) addReference(match[1]);

    const cardImagePattern = /^\s*cardImage\s*:\s*["']?(.+?\.(?:png|jpe?g|gif|svg|webp|avif))["']?\s*$/gim;
    for (const match of markdownContent.matchAll(cardImagePattern)) addReference(match[1]);

    return references;
}

function getCloudinaryPublicId(vaultId, imageName) {
    return `${vaultId}/images/${path.basename(imageName, path.extname(imageName))}`.toLowerCase();
}

/**
 * Reads the actual Cloudinary inventory so the manifest remains a cache rather
 * than an unchecked source of truth.
 */
async function loadCloudinaryPublicIds() {
    const publicIds = new Set();

    for (const { id } of vaultConfigs) {
        let nextCursor;
        do {
            const result = await cloudinary.api.resources({
                type: 'upload',
                resource_type: 'image',
                prefix: `${id}/images/`,
                max_results: 500,
                ...(nextCursor ? { next_cursor: nextCursor } : {}),
            });

            for (const resource of result.resources ?? []) {
                if (typeof resource.public_id === 'string') {
                    publicIds.add(resource.public_id.toLowerCase());
                }
            }
            nextCursor = result.next_cursor;
        } while (nextCursor);
    }

    console.log(`Verified ${publicIds.size} image resources in Cloudinary.`);
    return publicIds;
}

/**
 * Uploads images referenced by one Markdown file. This function is deliberately
 * read-only with respect to every vault file; only the separate manifest may be
 * updated after a successful upload.
 */
async function processMarkdownFile(mdFilePath, uploadedImagesManifest, cloudinaryPublicIds, failures) {
    const markdownContent = await fs.readFile(mdFilePath, 'utf-8');
    const vaultConfig = vaultConfigs.find(({ baseDir }) => {
        const vaultPath = path.resolve(projectRoot, baseDir);
        return mdFilePath === vaultPath || mdFilePath.startsWith(vaultPath + path.sep);
    });

    if (!vaultConfig) {
        console.error(`Could not determine vault context for file: ${mdFilePath}`);
        return;
    }

    const vaultAbsPath = path.resolve(projectRoot, vaultConfig.baseDir);
    const imageReferences = collectLocalImageReferences(markdownContent);

    for (const imageReference of imageReferences) {
        const imageName = path.basename(imageReference.replace(/\\/g, '/'));
        const cloudinaryImageName = imageName.toLowerCase();
        const manifestKey = `${vaultConfig.id}/images/${cloudinaryImageName}`;
        const publicId = getCloudinaryPublicId(vaultConfig.id, cloudinaryImageName);

        if (cloudinaryPublicIds.has(publicId)) {
            uploadedImagesManifest.add(manifestKey);
            continue;
        }

        if (uploadedImagesManifest.delete(manifestKey)) {
            console.warn(`  - Stale manifest entry: "${manifestKey}" is missing from Cloudinary; retrying upload.`);
        }

        const localImagePathFull = await findImageFullPath(imageName, vaultAbsPath);
        if (!localImagePathFull) {
            const message = `Cannot find "${imageName}" in ${vaultConfig.baseDir} (referenced by ${path.basename(mdFilePath)})`;
            console.error(`  - Image failed: ${message}`);
            failures.push(message);
            continue;
        }

        console.log('Manifest key not found, uploading:', manifestKey);
        const success = await uploadToCloudinary(localImagePathFull, cloudinaryImageName, vaultConfig.id);
        if (success) {
            uploadedImagesManifest.add(manifestKey);
            cloudinaryPublicIds.add(publicId);
        } else {
            failures.push(`Upload failed for "${imageName}" referenced by ${path.basename(mdFilePath)}`);
        }
    }
}


/**
 * Runs Git commands to add, commit, and push changes if any are detected.
 */
async function runGitCommands() {
    try {
        console.log('Checking Git status...');
        const relativeManifestPath = path.relative(projectRoot, manifestPath);
        const syncPaths = [...vaultBaseDirs, relativeManifestPath]
            .map((entry) => entry.replace(/\\/g, '/'));

        console.log(`Staging synced vault content: ${syncPaths.join(', ')}`);
        await git.add(['--', ...syncPaths]);

        const stagedFiles = (await git.diff(['--cached', '--name-only']))
            .split(/\r?\n/)
            .map((entry) => entry.trim().replace(/\\/g, '/'))
            .filter(Boolean);
        const isSyncPath = (filePath) => syncPaths.some((syncPath) => (
            filePath === syncPath || filePath.startsWith(`${syncPath}/`)
        ));
        const unrelatedStagedFiles = stagedFiles.filter((filePath) => !isSyncPath(filePath));
        if (unrelatedStagedFiles.length > 0) {
            throw new Error(
                `Refusing to mix unrelated staged files into the vault commit: ${unrelatedStagedFiles.join(', ')}`
            );
        }

        if (stagedFiles.length === 0) {
            console.log('No changes staged for commit. Skipping commit and push.');
            return;
        }

        const commitMessage = `Sync vault content (${new Date().toISOString()})`;
        console.log(`Committing ${stagedFiles.length} synced files with message: "${commitMessage}"`);
        await git.commit(commitMessage);

        const status = await git.status();
        if (!status.current) {
            throw new Error('Cannot push while Git is in a detached HEAD state.');
        }
        console.log(`Pushing branch ${status.current} to origin...`);
        await git.push('origin', status.current);

        console.log('Git sync complete.');
    } catch (error) {
        console.error('Error during Git operations:', error);
        try {
             const statusOnError = await git.status();
             console.error("Git status during error:", statusOnError);
        } catch {
             console.error("Could not get Git status during error handling.");
        }
        throw error;
    }
}


// --- Main Execution ---
async function main() {
    console.log('Starting vault sync process...');

    // --- Configuration Checks ---
    if (vaultBaseDirs.length === 0) { console.error('Error: No vault directories configured. Exiting.'); process.exit(1); }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) { console.error('Error: Cloudinary credentials missing...'); process.exit(1); }
    // --- End Configuration Checks ---

    const uploadedImagesManifest = await loadManifest(); // Loads lowercase paths
    const initialManifestSnapshot = [...uploadedImagesManifest].sort().join('\n');
    const cloudinaryPublicIds = await loadCloudinaryPublicIds();
    const failures = [];
    const markdownFiles = await findMarkdownFiles();

    console.log(`Processing ${markdownFiles.length} Markdown files for Cloudinary sync...`);
    for (const mdFile of markdownFiles) {
        await processMarkdownFile(mdFile, uploadedImagesManifest, cloudinaryPublicIds, failures);
    }
    console.log('Finished processing Markdown files.');
    
    const finalManifestSnapshot = [...uploadedImagesManifest].sort().join('\n');
    if (finalManifestSnapshot !== initialManifestSnapshot) {
        await saveManifest(uploadedImagesManifest); // Saves lowercase paths
    } else {
        console.log('Cloudinary manifest is already current.');
    }

    if (failures.length > 0) {
        throw new Error(
            `Vault image sync failed for ${failures.length} reference(s):\n- ${failures.join('\n- ')}`
        );
    }

    if (skipGit) {
        console.log('Skipping Git commit/push (--skip-git or SKIP_GIT_SYNC=1).');
    } else {
        console.log('Refreshing generated Nexus indexes before the Git commit...');
        await execFileAsync(process.execPath, [path.resolve(__dirname, 'generate-nexus-data.mjs')], {
            cwd: projectRoot,
        });
        await runGitCommands();
    }

    console.log('Vault sync process finished.');
}

export {
    collectLocalImageReferences,
    getCloudinaryPublicId,
    normalizeLocalImageReference,
};

// Execute main only when launched directly, not when test helpers import it.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    main().catch(error => {
        console.error("An unexpected error occurred in main:", error);
        process.exit(1);
    });
}
