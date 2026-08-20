import nexusIndex from '../generated/nexus-index.json';
import { TreeNode, VaultNote } from '../utils/markdownHelper';

const markdownContentModules = import.meta.glob<string>('/Nexus/**/*.md', {
  query: '?raw',
  import: 'default',
});

export const allNexusNotes = nexusIndex.notes as VaultNote[];
export const nexusFileTree = nexusIndex.fileTree as TreeNode;

const moduleKeyByPath = new Map(allNexusNotes.map((note) => [note.fullPath, note.moduleKey]));
const contentPromiseByPath = new Map<string, Promise<string>>();

export function loadNexusNote(normalizedPath: string): Promise<string> | null {
  const cached = contentPromiseByPath.get(normalizedPath);
  if (cached) return cached;

  const moduleKey = moduleKeyByPath.get(normalizedPath);
  const loader = moduleKey ? markdownContentModules[moduleKey] : undefined;
  if (!loader) return null;

  const promise = loader().catch((error) => {
    contentPromiseByPath.delete(normalizedPath);
    throw error;
  });
  contentPromiseByPath.set(normalizedPath, promise);
  return promise;
}

export function prefetchNexusNote(normalizedPath: string) {
  void loadNexusNote(normalizedPath);
}
