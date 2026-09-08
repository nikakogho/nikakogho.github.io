// src/pages/VaultLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FileTreeNode from '../components/FileTreeNode'; // Import tree node component
// Import helpers and types
import { VaultNote } from '../utils/markdownHelper';
import { allNexusNotes, nexusFileTree } from '../data/nexusNotes';
// Import an icon for the toggle button (optional)
import { FiSidebar, FiChevronLeft, FiLayers } from 'react-icons/fi';
import './VaultExplorer.css';

// Define the context type that will be passed down via Outlet
export interface VaultOutletContext {
  allVaultNotes: VaultNote[]; // Pass the flat list for MarkdownRenderer
}

const VaultLayout: React.FC = () => {
    const vaultId = "Nexus";

    // --- State for Sidebar Visibility ---
    const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar invisible by default

    // --- State for Expanded Folders ---
    // Stores folder paths (normalized) that are currently open
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    const allVaultNotes = allNexusNotes;
    const fileTree = nexusFileTree;

    // --- Handlers ---
    const toggleSidebar = () => setIsSidebarVisible(prev => !prev);

    const toggleFolderExpansion = (folderPath: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderPath]: !prev[folderPath] // Toggle the specific folder's state
        }));
    };
    // --- End Handlers ---

    if (!vaultId) {
        return <div>Error: Vault ID not found in layout.</div>;
    }

    // Context object to pass down to NotePage
    const outletContext: VaultOutletContext = { allVaultNotes: allVaultNotes };

    return (
        // Add conditional class for sidebar visibility styling
        <div className={`note-page-layout vault-workspace ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            <div className="vault-toolbar">
                <button type="button" onClick={toggleSidebar} className="vault-sidebar-toggle" aria-expanded={isSidebarVisible} aria-controls="vault-explorer">
                    <FiSidebar aria-hidden="true" /><span>{isSidebarVisible ? 'Hide explorer' : 'Browse notes'}</span>
                </button>
                <span className="vault-toolbar-label">Nexus / Library</span>
            </div>
            {/* Sidebar Area - Conditionally Rendered */}
            {isSidebarVisible && (
                <aside className="note-page-sidebar" id="vault-explorer" aria-label="Note explorer">
                    <div className="vault-explorer-heading"><FiLayers aria-hidden="true" /><div><h3>Library</h3><span>{allVaultNotes.length.toLocaleString()} notes in Nexus</span></div><button type="button" onClick={toggleSidebar} aria-label="Close note explorer"><FiChevronLeft /></button></div>
                    <div className="vault-tree-scroll">
                    {fileTree && fileTree.children && (
                         <ul className="file-tree-root">
                            {/* Render tree, passing down state and toggle function */}
                            {fileTree.children.map(node => (
                                <FileTreeNode
                                    key={node.id}
                                    node={node}
                                    vaultId={vaultId}
                                    expandedFolders={expandedFolders}
                                    onToggleFolder={toggleFolderExpansion}
                                />
                            ))}
                         </ul>
                    )}
                    {!fileTree?.children?.length && <p>No notes found.</p>}
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <article className="note-page-content">
                 {/* Toggle Button - Placed relative to content area */}

                {/* Child routes (NotePage) render here. Pass notes list via context */}
                <Outlet context={outletContext} />
            </article>
        </div>
    );
};

export default VaultLayout;
