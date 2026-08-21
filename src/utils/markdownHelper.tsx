// src/utils/markdownHelper.ts

import { slug as githubSlug } from 'github-slugger';

// --- Type Definition ---
export interface VaultNote {
    fullPath: string; // Normalized full path relative to vault root (e.g., 'memory/types-of-memory')
    baseName: string; // Normalized base filename (e.g., 'types-of-memory')
    displayName: string; // Original filename for display (e.g., 'Types of Memory')
    moduleKey: string; // The original key from import.meta.glob
  }

// Type for the nodes in our file tree
export interface TreeNode {
  id: string; // Unique ID (e.g., the full normalized path)
  name: string; // Display name (folder or file name without extension)
  type: 'folder' | 'file';
  path: string; // Normalized path relative to vault root (used for links/keys)
  children?: TreeNode[]; // Array of child nodes for folders
}

interface VaultNoteLookup {
  byFullPath: Map<string, VaultNote>;
  byBaseName: Map<string, VaultNote[]>;
}

const vaultNoteLookupCache = new WeakMap<VaultNote[], VaultNoteLookup>();

function getVaultNoteLookup(notes: VaultNote[]): VaultNoteLookup {
  const cached = vaultNoteLookupCache.get(notes);
  if (cached) return cached;

  const byFullPath = new Map<string, VaultNote>();
  const byBaseName = new Map<string, VaultNote[]>();
  notes.forEach((note) => {
    byFullPath.set(note.fullPath, note);
    const matches = byBaseName.get(note.baseName) ?? [];
    matches.push(note);
    byBaseName.set(note.baseName, matches);
  });
  const lookup = { byFullPath, byBaseName };
  vaultNoteLookupCache.set(notes, lookup);
  return lookup;
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
      .replace(/[^a-z0-9/-]+/g, ''); // Allow letters, numbers, hyphens, slashes
  }

  export interface WikiLinkTarget {
    noteName: string;
    heading?: string;
  }

  /**
   * Separates the note and heading portions of an Obsidian wiki link target.
   * Splitting only on the first hash also keeps unusual headings containing a
   * hash intact. `[[#Heading]]` is represented as an empty note name and can
   * therefore be resolved against the currently open note.
   */
  export function parseWikiLinkTarget(target: string): WikiLinkTarget {
    const hashIndex = target.indexOf('#');

    if (hashIndex === -1) {
      return { noteName: target.trim() };
    }

    const noteName = target.slice(0, hashIndex).trim();
    const heading = target.slice(hashIndex + 1).trim();

    return {
      noteName,
      heading: heading || undefined,
    };
  }

  /**
   * Matches the heading-id algorithm used by rehype-slug. Keeping this in one
   * helper ensures that generated section links and rendered heading ids agree.
   */
  export function headingToAnchorId(heading: string): string {
    return githubSlug(heading.trim());
  }

  /**
   * Produces a forgiving comparison key so fragments survive harmless spacing
   * and punctuation differences such as `ResidualBlock` vs `Residual Block`.
   */
  export function normalizeHeadingLookupKey(heading: string): string {
    return heading
      .normalize('NFKD')
      .toLowerCase()
      .replace(/\p{Mark}/gu, '')
      .replace(/[^\p{Letter}\p{Number}]+/gu, '');
  }

  /**
   * Resolves an Obsidian link such as `Note#A section` to a website path and
   * optional heading id. An empty note part targets the current note.
   */
  export function resolveWikiLinkTarget(
    target: string,
    allVaultNotes: VaultNote[],
    currentNotePath = ''
  ): { notePath: string; anchorId?: string } {
    const { noteName, heading } = parseWikiLinkTarget(target);
    const notePath = noteName
      ? resolveWikiLink(noteName, allVaultNotes)
      : currentNotePath;

    return {
      notePath,
      anchorId: heading ? headingToAnchorId(heading) : undefined,
    };
  }
  
  // --- Note List Generation ---
  /**
   * Generates a structured list of all notes within a specific vault from the Vite module glob results.
   */
  export function getStructuredNexusNotes(
    modules: Record<string, unknown> // Result of import.meta.glob
  ): VaultNote[] {
    const vaultPrefix = `/Nexus/`;
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
  export function resolveWikiLink(name: string, allVaultNotes: VaultNote[], warnOnMissing = true): string {
      const normalizedInput = normalizeNoteName(name);
      const { byBaseName, byFullPath } = getVaultNoteLookup(allVaultNotes);
  
      // 1. Try to find a unique match based on the BASE filename
      const baseNameMatches = byBaseName.get(normalizedInput) ?? [];
  
      if (baseNameMatches.length === 1) {
        // Unique match found! Return the full normalized path of the matched note.
        return baseNameMatches[0].fullPath;
      } else if (baseNameMatches.length > 1) {
        // Ambiguous link - multiple notes have the same base name
        if (warnOnMissing) {
          console.warn(`[resolveWikiLink] Ambiguous wiki link found for "${name}". Multiple notes match:`, baseNameMatches.map(m => m.fullPath));
        }
        // Fallback: Try to match the input as a full path directly
        const fullPathMatch = byFullPath.get(normalizedInput);
        if (fullPathMatch) {
          return fullPathMatch.fullPath; // Handles [[somefolder/file2]] directly if base names clash
        }
        // If still ambiguous or not a direct full path match, return original (likely leads to '.new-link')
        return normalizedInput;
      } else {
        // 0 base name matches.
        // 2. Check if the input itself IS a full path that exists.
        const fullPathMatch = byFullPath.get(normalizedInput);
        if (fullPathMatch) {
          // Handles [[somefolder/file2]] when base name didn't match
          return fullPathMatch.fullPath;
        }
  
        // 3. No match found at all.
        if (warnOnMissing) {
          console.warn(`[resolveWikiLink] Wiki link "${name}" could not be resolved to any known note.`);
        }
        // Return original normalized input, which will likely be styled as a '.new-link'
        return normalizedInput;
      }
  }
  
  
  // --- Other Helper Functions (Keep if still needed) ---
  
  // Finds the module key matching a normalized note path within a specific vault
  // NOTE: Ensure this works correctly with the modules object passed to it (eager: false vs eager: true)
  export function findNoteModuleKey(
      normalizedPath: string,
      modules: Record<string, unknown>
  ): string | undefined {
      const vaultPrefix = `/Nexus/`;
      return Object.keys(modules).find(key => {
          if (!key.startsWith(vaultPrefix) || !key.endsWith('.md')) return false;
          const relativePath = key.substring(vaultPrefix.length, key.length - 3);
          const keyNormalized = normalizeNoteName(relativePath);
          return keyNormalized === normalizedPath;
      });
  }
  
/**
 * Builds a hierarchical file tree structure from Vite module glob results.
 */
export function buildFileTree(modules: Record<string, unknown>): TreeNode {
  // Root node represents the vault itself
  const root: TreeNode = { id: 'nexus', name: 'Nexus', type: 'folder', path: '', children: [] };
  const vaultPrefix = `/Nexus/`;
  // Use a map to keep track of created folder nodes for efficient lookup
  const folderNodes = new Map<string, TreeNode>();
  folderNodes.set('', root); // Root folder corresponds to empty relative path

  const sortedKeys = Object.keys(modules).sort();

  for (const key of sortedKeys) {
      if (key.startsWith(vaultPrefix) && key.endsWith('.md')) {
          const relativePathWithExt = key.substring(vaultPrefix.length);
          if (!relativePathWithExt || relativePathWithExt === '.md') continue;

          const parts = relativePathWithExt.split('/');
          let currentParentPath = ''; // Path of the parent folder node

          for (let i = 0; i < parts.length; i++) {
              const part = parts[i];
              const isLastPart = i === parts.length - 1;

              if (isLastPart) { // It's the file
                  const fileNameWithExt = part;
                  if (!fileNameWithExt || fileNameWithExt === '.md') continue;
                  const fileDisplayName = fileNameWithExt.replace('.md', '');
                  const filePathRelative = parts.join('/'); // e.g., Folder/SubFolder/Note.md
                  const fileFullPathNormalized = normalizeNoteName(filePathRelative.replace('.md', '')); // Path used for links

                  const parentNode = folderNodes.get(currentParentPath);
                  if (parentNode && parentNode.children) {
                       // Avoid adding duplicates if glob includes variations
                       if (!parentNode.children.some(n => n.path === fileFullPathNormalized && n.type === 'file')) {
                          parentNode.children.push({
                              id: fileFullPathNormalized, // Use normalized path as unique ID
                              name: fileDisplayName,
                              type: 'file',
                              path: fileFullPathNormalized, // Normalized path for linking
                          });
                       }
                  }
              } else { // It's a folder
                  const folderName = part;
                  const folderPath = parts.slice(0, i + 1).join('/'); // Path up to and including this folder

                  // Check if this folder node already exists
                  if (!folderNodes.has(folderPath)) {
                      const parentNode = folderNodes.get(currentParentPath);
                      if (parentNode && parentNode.children) {
                          const newFolderNode: TreeNode = {
                              id: normalizeNoteName(folderPath), // Use normalized folder path as ID
                              name: folderName,
                              type: 'folder',
                              path: normalizeNoteName(folderPath), // Path for potential future folder notes/links
                              children: [],
                          };
                          parentNode.children.push(newFolderNode);
                          folderNodes.set(folderPath, newFolderNode); // Register the new folder node
                      }
                  }
                   currentParentPath = folderPath; // Move down the path for the next iteration
              }
          }
      }
  }

   // Function to recursively sort children (folders first, then alphabetically)
   const sortChildren = (node: TreeNode) => {
       if (node.children && node.children.length > 0) {
           node.children.sort((a, b) => {
               if (a.type !== b.type) {
                   return a.type === 'folder' ? -1 : 1; // Folders first
               }
               return a.name.localeCompare(b.name); // Then alphabetically
           });
           node.children.forEach(sortChildren); // Recurse
       }
   };
   sortChildren(root); // Sort the entire tree starting from root

  return root;
}
