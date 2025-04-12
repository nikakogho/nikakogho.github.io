// src/utils/markdownHelper.ts

// --- Type Definition ---
export interface VaultNote {
    fullPath: string; // Normalized full path relative to vault root (e.g., 'memory/types-of-memory')
    baseName: string; // Normalized base filename (e.g., 'types-of-memory')
    displayName: string; // Original filename for display (e.g., 'Types of Memory')
    moduleKey: string; // The original key from import.meta.glob
  }
  
  // --- Normalization Function ---
  /**
   * Normalizes a note name or path for consistent linking and lookups.
   * Converts to lowercase, replaces spaces with hyphens, removes most non-alphanumeric characters except slashes and hyphens.
   */
  export function normalizeNoteName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-\/]+/g, ''); // Allow letters, numbers, hyphens, slashes
  }
  
  // --- Note List Generation ---
  /**
   * Generates a structured list of all notes within a specific vault from the Vite module glob results.
   */
  export function getStructuredVaultNotes(
    vaultId: string,
    modules: Record<string, any> // Result of import.meta.glob
  ): VaultNote[] {
    const vaultPrefix = `/vaults/${vaultId}/`;
    const notes: VaultNote[] = [];
  
    for (const key in modules) {
      if (key.startsWith(vaultPrefix) && key.endsWith('.md')) {
        const relativePathWithExtension = key.substring(vaultPrefix.length);
        // Ensure we don't process empty strings if path is just vaultId/
        if (!relativePathWithExtension || relativePathWithExtension === '.md') continue;
  
        const relativePath = relativePathWithExtension.substring(0, relativePathWithExtension.length - 3); // Remove .md
  
        const parts = relativePathWithExtension.split('/');
        const baseNameWithExtension = parts[parts.length - 1];
        // Handle potential empty filenames (though unlikely)
        if (!baseNameWithExtension || baseNameWithExtension === '.md') continue;
  
        const displayName = baseNameWithExtension.replace('.md', '');
        const baseNameNormalized = normalizeNoteName(displayName); // Normalize just the filename part
        const fullPathNormalized = normalizeNoteName(relativePath); // Normalize the full path
  
        notes.push({
          fullPath: fullPathNormalized,
          baseName: baseNameNormalized,
          displayName: displayName,
          moduleKey: key,
        });
      }
    }
    // Optional: Sort notes alphabetically by display name
    notes.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return notes;
  }
  
  // --- WikiLink Resolution Logic ---
  /**
   * Resolves a wiki link name (e.g., "My Note" or "Folder/My Note") to the correct
   * full normalized path based on the list of available notes in the vault.
   * Handles unique base name resolution and direct full path matching.
   */
  export function resolveWikiLink(name: string, allVaultNotes: VaultNote[]): string {
      const normalizedInput = normalizeNoteName(name);
  
      // 1. Try to find a unique match based on the BASE filename
      const baseNameMatches = allVaultNotes.filter(note => note.baseName === normalizedInput);
  
      if (baseNameMatches.length === 1) {
        // Unique match found! Return the full normalized path of the matched note.
        return baseNameMatches[0].fullPath;
      } else if (baseNameMatches.length > 1) {
        // Ambiguous link - multiple notes have the same base name
        console.warn(`[resolveWikiLink] Ambiguous wiki link found for "${name}". Multiple notes match:`, baseNameMatches.map(m => m.fullPath));
        // Fallback: Try to match the input as a full path directly
        const fullPathMatch = allVaultNotes.find(note => note.fullPath === normalizedInput);
        if (fullPathMatch) {
          return fullPathMatch.fullPath; // Handles [[somefolder/file2]] directly if base names clash
        }
        // If still ambiguous or not a direct full path match, return original (likely leads to '.new-link')
        return normalizedInput;
      } else {
        // 0 base name matches.
        // 2. Check if the input itself IS a full path that exists.
        const fullPathMatch = allVaultNotes.find(note => note.fullPath === normalizedInput);
        if (fullPathMatch) {
          // Handles [[somefolder/file2]] when base name didn't match
          return fullPathMatch.fullPath;
        }
  
        // 3. No match found at all.
        console.warn(`[resolveWikiLink] Wiki link "${name}" could not be resolved to any known note.`);
        // Return original normalized input, which will likely be styled as a '.new-link'
        return normalizedInput;
      }
  }
  
  
  // --- Other Helper Functions (Keep if still needed) ---
  
  // Example: Function to get paths for sidebar (can use getStructuredVaultNotes)
  export function getVaultNotePathsForSidebar(
      vaultId: string,
      modules: Record<string, any>
  ): { path: string; displayName: string }[] {
       return getStructuredVaultNotes(vaultId, modules).map(note => ({
           path: note.fullPath, // Use the full normalized path for the URL
           displayName: note.displayName
       }));
  }
  
  // Finds the module key matching a normalized note path within a specific vault
  // NOTE: Ensure this works correctly with the modules object passed to it (eager: false vs eager: true)
  export function findNoteModuleKey(
      normalizedPath: string,
      vaultId: string,
      modules: Record<string, () => Promise<any>> | Record<string, any>
  ): string | undefined {
      const vaultPrefix = `/vaults/${vaultId}/`;
      return Object.keys(modules).find(key => {
          if (!key.startsWith(vaultPrefix) || !key.endsWith('.md')) return false;
          const relativePath = key.substring(vaultPrefix.length, key.length - 3);
          const keyNormalized = normalizeNoteName(relativePath);
          return keyNormalized === normalizedPath;
      });
  }
  