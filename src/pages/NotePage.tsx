import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
// Import helpers and types - ensure normalizeNoteName and findNoteModuleKey are imported
import { findNoteModuleKey, getStructuredVaultNotes, VaultNote, normalizeNoteName } from '../utils/markdownHelper';
// Import the Outlet context type if defined in VaultLayout (optional, remove if not using layout)
// import { VaultOutletContext } from './VaultLayout'; // Adjust path if necessary

// Import markdown content modules (dynamic, raw)
const markdownContentModules = import.meta.glob('/vaults/**/*.md', { eager: false, as: 'raw' });
// Import module metadata (eager, for immediate access to keys/structure)
const markdownModulesMeta = import.meta.glob('/vaults/**/*.md', { eager: true });


const NotePage: React.FC = () => {
  const { vaultId, '*': notePath } = useParams<{ vaultId: string; '*': string }>();
  // const outletContext = useOutletContext<VaultOutletContext | null>(); // Remove if not using VaultLayout

  // --- State ---
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedNormalizedPath, setLoadedNormalizedPath] = useState<string>('');

  // --- Calculate all notes metadata (memoized) ---
  const allVaultNotes = useMemo(() => {
    // if (outletContext?.allVaultNotes) return outletContext.allVaultNotes; // Remove if not using VaultLayout
    if (!vaultId) return [];
    return getStructuredVaultNotes(vaultId, markdownModulesMeta);
    // Add outletContext back to dependency array if using it
  }, [vaultId]);

  // --- Calculate normalized path for the 'Home' note ---
  const homeNotePath = useMemo(() => normalizeNoteName('Home'), []);


  // --- Effect to load markdown content ---
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      setContent(null);
      setLoadedNormalizedPath('');

      if (!vaultId || notePath === undefined) {
        setError("Invalid vault or note path.");
        setIsLoading(false);
        return;
      }

      const normalizedPath = normalizeNoteName(notePath || '');

      // Use the *imported* findNoteModuleKey helper
      const moduleKey = findNoteModuleKey(normalizedPath, vaultId, markdownContentModules);

      if (moduleKey && markdownContentModules[moduleKey]) {
        try {
          const moduleLoader = markdownContentModules[moduleKey] as () => Promise<string>;
          const loadedContent = await moduleLoader();
          setContent(loadedContent);
          setLoadedNormalizedPath(normalizedPath);
        } catch (err) {
          console.error("Error loading module content:", err);
          setError(`Failed to load note content for "${notePath}".`);
        }
      } else {
        setError(`Note content module not found for "${notePath}" (normalized: ${normalizedPath}) in vault "${vaultId}".`);
      }
      setIsLoading(false);
    };

    loadContent();
  }, [vaultId, notePath]);


  // --- Determine Note Title ---
  const noteTitle = useMemo(() => {
      if (!loadedNormalizedPath || !allVaultNotes) return "Note";
      const currentNoteMeta = allVaultNotes.find(note => note.fullPath === loadedNormalizedPath);
      return currentNoteMeta ? currentNoteMeta.displayName : "Note";
  }, [loadedNormalizedPath, allVaultNotes]);
  // --- End Note Title ---


  // --- Render loading/error states ---
  if (isLoading) {
    return <div>Loading note...</div>;
  }
  if (error) {
    return <div>Error: {error} <Link to={`/vaults/${vaultId}`}>Back to vault</Link></div>;
  }
  if (!content) {
    return <div>Note content not available. <Link to={`/vaults/${vaultId}`}>Back to vault</Link></div>;
  }

  // --- Check if it's the Home page ---
  const isHomePage = loadedNormalizedPath === homeNotePath;
  // --- End Home Page Check ---


  // --- Render Note Content ---
  return (
     <div>
        {/* Render the explicit H1 title */}
        <h1>{noteTitle}</h1>

        {/* Conditionally render the "Back to" link */}
        {!isHomePage && (
            <>
                {/* Link back to vault root (will redirect to home) */}
                <Link to={`/vaults/${vaultId}`}>Back to {vaultId} Vault</Link>
                <hr/>
            </>
        )}

        {/* Render the actual markdown content */}
        <MarkdownRenderer
            markdown={content}
            vaultId={vaultId!}
            allVaultNotes={allVaultNotes} // Pass the memoized list
        />
     </div>
  );
};


// Removed the local definition of findNoteModuleKey - rely on import


export default NotePage;
