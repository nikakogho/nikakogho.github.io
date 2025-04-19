import React from 'react'; // Removed useState
import { Link, useParams, useLocation } from 'react-router-dom'; // Added useLocation
import { TreeNode } from '../utils/markdownHelper';

interface FileTreeNodeProps {
  node: TreeNode;
  expandedFolders: Record<string, boolean>;
  onToggleFolder: (folderPath: string) => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, expandedFolders, onToggleFolder }) => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const location = useLocation(); // Get current location

  // Determine if folder is open based on props, default to false (closed)
  const isOpen = expandedFolders[node.path] ?? false;

  // Determine if the current route matches this file node
  // Compare the end of the current hash path with the node's path
  const currentNotePath = location.hash.split('/notes/')[1]; // Extract path after /notes/
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
        <div className="node-label" onClick={handleToggle}>
          <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
          <span className="folder-icon">📁</span>
          <span className="node-name">{node.name}</span>
        </div>
        {/* Conditionally render children based on isOpen */}
        {isOpen && node.children && node.children.length > 0 && (
          <ul className="nested-tree">
            {node.children.map((childNode) => (
              // Pass down the state and toggle function recursively
              <FileTreeNode
                  key={childNode.id}
                  node={childNode}
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
    const filePath = `/vaults/${vaultId}/notes/${node.path}`;
    return (
      // Add active class if this is the currently viewed note
      <li className={`tree-node file-node ${isActiveFile ? 'active-file' : ''}`}>
         <div className="node-label">
            <span className="file-icon">📄</span>
            {/* Use Link component for navigation */}
            <Link to={filePath} className="node-link">
                 <span className="node-name">{node.name}</span>
            </Link>
         </div>
      </li>
    );
  }
};

export default FileTreeNode;
