import type { TreeNode } from './markdownHelper';

/** Count files at every depth; folders themselves do not contribute. */
export function countTreeFiles(node: TreeNode): number {
  if (node.type === 'file') return 1;
  return (node.children ?? []).reduce((total, child) => total + countTreeFiles(child), 0);
}
