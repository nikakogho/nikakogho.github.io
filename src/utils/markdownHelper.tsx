// --- Utility Functions for Markdown Handling ---

// VERY basic normalization: lowercase, replace spaces with hyphens.
// You might need more robust logic depending on your filenames.
export function normalizeNoteName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

// Finds the module key matching a normalized note path within a specific vault
export function findNoteModuleKey(
    normalizedPath: string, // e.g., 'folder/note-b'
    vaultId: string,
    modules: Record<string, () => Promise<any>> // Result of import.meta.glob
): string | undefined {
    // Construct the expected start of the path for the given vault
    const vaultPrefix = `/vaults/${vaultId}/`;

    return Object.keys(modules).find(key => {
        if (!key.startsWith(vaultPrefix) || !key.endsWith('.md')) {
            return false;
        }
        // Extract path relative to vault, remove extension, normalize
        const relativePath = key.substring(vaultPrefix.length, key.length - 3); // Remove '.md'
        // Basic normalization for comparison (match normalizeNoteName logic)
        const keyNormalized = relativePath.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-\/]+/g, ''); // Allow slashes
        return keyNormalized === normalizedPath;
    });
}


// Retrieves all note paths for a specific vault
export function getVaultNotePaths(
    vaultId: string,
    modules: Record<string, () => Promise<any>>
): { path: string; displayName: string }[] {
    const vaultPrefix = `/vaults/${vaultId}/`;
    return Object.keys(modules)
        .filter(key => key.startsWith(vaultPrefix) && key.endsWith('.md'))
        .map(key => {
            const relativePath = key.substring(vaultPrefix.length, key.length - 3); // Remove .md
            // Attempt to derive a display name (e.g., from filename before normalization)
            const parts = key.substring(vaultPrefix.length).split('/');
            const displayName = parts[parts.length - 1].replace('.md', ''); // Simple name from file
            return {
                path: relativePath.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-\/]+/g, ''), // Normalized path for URL
                displayName: displayName // Original filename for display
            };
        });
}