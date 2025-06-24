// src/pages/VaultLayout.tsx
import React, { useState, useMemo } from 'react'; // Added useState
import { Outlet } from 'react-router-dom';
import FileTreeNode from '../components/FileTreeNode'; // Import tree node component
// Import helpers and types
import {
    getStructuredNexusNotes,
    VaultNote,
    buildFileTree} from '../utils/markdownHelper';
// Import an icon for the toggle button (optional)
import { FiMenu, FiX } from 'react-icons/fi';

// Import module metadata (eager, for immediate access to keys/structure)
const markdownModulesMeta = import.meta.glob('/Nexus/**/*.md', { eager: true });

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

    // --- Calculate Notes and Tree Structure (memoized) ---
    const allVaultNotes = useMemo(() => {
        return getStructuredNexusNotes(markdownModulesMeta);
    }, []);

    const fileTree = useMemo(() => {
        return buildFileTree(markdownModulesMeta);
    }, []);
    // --- End Data Calculation ---

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
        <div className={`note-page-layout ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            {/* Sidebar Area - Conditionally Rendered */}
            {isSidebarVisible && (
                <aside className="note-page-sidebar">
                    <h3>{vaultId} Files</h3>
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
                </aside>
            )}

            {/* Main Content Area */}
            <article className="note-page-content">
                 {/* Toggle Button - Placed relative to content area */}
                 <button
                    onClick={toggleSidebar}
                    className="sidebar-toggle-button" // Use single class now
                    aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
                    title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
                 >
                     {isSidebarVisible ? <FiX /> : <FiMenu />}
                 </button>

                {/* Child routes (NotePage) render here. Pass notes list via context */}
                <Outlet context={outletContext} />
            </article>
        </div>
    );
};

export default VaultLayout;
