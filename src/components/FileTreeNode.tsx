import React, { useMemo } from 'react';
import { countTreeFiles } from '../utils/countTreeFiles';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { TreeNode } from '../utils/markdownHelper';
import { FiChevronRight, FiFileText, FiFolder, FiFolderMinus } from 'react-icons/fi';

interface FileTreeNodeProps {
  node: TreeNode;
  expandedFolders: Record<string, boolean>;
  onToggleFolder: (folderPath: string) => void;
  vaultId: string;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, expandedFolders, onToggleFolder, vaultId }) => {
  const location = useLocation(); // Get current location
  const fileCount = useMemo(() => countTreeFiles(node), [node]);

  // Determine if folder is open based on props, default to false (closed)
  const isOpen = expandedFolders[node.path] ?? false;

  // Determine if the current route matches this file node
  // Compare the end of the current hash path with the node's path
  const currentNotePath = decodeURIComponent(location.pathname.split('/notes/')[1] ?? '').split('#')[0];
  const isActiveFile = node.type === 'file' && currentNotePath === node.path;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Call the toggle function passed from VaultLayout using the node's path as ID
    onToggleFolder(node.path);
  };

  if (node.type === 'folder') {
    return (
      <li className="tree-node folder-node">
        {/* Use the handleToggle function */}
        <button type="button" className="node-label" onClick={handleToggle} aria-expanded={isOpen} title={node.name}>
          <FiChevronRight className={`tree-chevron${isOpen ? ' is-open' : ''}`} />
          {isOpen ? <FiFolderMinus className="tree-symbol" /> : <FiFolder className="tree-symbol" />}
          <span className="node-name">{node.name}</span>
          <span className="tree-count" title={`${fileCount} files, including subfolders`}>{fileCount}</span>
        </button>
        {/* Conditionally render children based on isOpen */}
        {isOpen && node.children && node.children.length > 0 && (
          <ul className="nested-tree">
            {node.children.map((childNode) => (
              // Pass down the state and toggle function recursively
              <FileTreeNode
                  key={childNode.id}
                  node={childNode}
                  vaultId={vaultId}
                  expandedFolders={expandedFolders}
                  onToggleFolder={onToggleFolder}
              />
            ))}
          </ul>
        )}
      </li>
    );
  } else {
    // Construct the link path (ensure hash is included)
    const filePath = `/nexus/notes/${node.path}`;
    return (
      // Add active class if this is the currently viewed note
      <li className={`tree-node file-node ${isActiveFile ? 'active-file' : ''}`}>
            <Link to={filePath} className="node-label node-link" aria-current={isActiveFile ? 'page' : undefined} title={node.name}>
                 <FiFileText className="tree-symbol" />
                 <span className="node-name">{node.name}</span>
            </Link>
      </li>
    );
  }
};

export default FileTreeNode;
