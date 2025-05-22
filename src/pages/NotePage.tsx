import React, { useState, useEffect, useMemo } from 'react';
// Import useOutletContext to get data from VaultLayout
import { useParams, Link, useOutletContext } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
// Import helpers and types
import {
    findNoteModuleKey,
    normalizeNoteName
} from '../utils/markdownHelper';
// Import the context type definition from VaultLayout
import { VaultOutletContext } from './VaultLayout';

// Import markdown content modules (dynamic, raw)
const markdownContentModules = import.meta.glob('/vaults/**/*.md', { eager: false, as: 'raw' });

const NotePage: React.FC = () => {
  const { vaultId, '*': notePath } = useParams<{ vaultId: string; '*': string }>();
  // --- Get allVaultNotes from parent VaultLayout context ---
  const { allVaultNotes } = useOutletContext<VaultOutletContext>();

  // --- State ---
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedNormalizedPath, setLoadedNormalizedPath] = useState<string>('');

  // --- Effect to load markdown content ---
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true); setError(null); setContent(null); setLoadedNormalizedPath('');
      if (!vaultId || notePath === undefined) { setError("Invalid vault or note path."); setIsLoading(false); return; }
      const normalizedPath = normalizeNoteName(notePath || '');
      const moduleKey = findNoteModuleKey(normalizedPath, vaultId, markdownContentModules);
      if (moduleKey && markdownContentModules[moduleKey]) {
        try {
          const moduleLoader = markdownContentModules[moduleKey] as () => Promise<string>;
          setContent(await moduleLoader());
          setLoadedNormalizedPath(normalizedPath);
        } catch (err) { console.error("Error loading module content:", err); setError(`Failed to load note content for "${notePath}".`); }
      } else { setError(`Note content module not found for "${notePath}" (normalized: ${normalizedPath}) in vault "${vaultId}".`); }
      setIsLoading(false);
    };
    loadContent();
  }, [vaultId, notePath]);


  // --- Determine Note Title ---
  const noteTitle = useMemo(() => {
      // Use allVaultNotes from context
      if (!loadedNormalizedPath || !allVaultNotes) return "Note";
      const currentNoteMeta = allVaultNotes.find(note => note.fullPath === loadedNormalizedPath);
      return currentNoteMeta ? currentNoteMeta.displayName : "Note";
  }, [loadedNormalizedPath, allVaultNotes]);


  // --- Render loading/error states ---
  if (isLoading && !content) { return <div>Loading note...</div>; }
  if (error) { return <div>Error: {error} <Link to={`/vaults/${vaultId}`}>Back to vault</Link></div>; }
  if (!content) { return <div>Note content not available. <Link to={`/vaults/${vaultId}`}>Back to vault</Link></div>; } // Handle case where content is null after loading

  // --- Render Note Content Only ---
  // The surrounding layout (sidebar, toggle button) is now handled by VaultLayout
  return (
    <>
     { noteTitle !== "Home" && <h1>{noteTitle}</h1> }

      {/* Render the actual markdown content */}
      <MarkdownRenderer
          markdown={content}
          vaultId={vaultId!}
          allVaultNotes={allVaultNotes} // Pass the list from context
      />
    </>
  );
};

export default NotePage;
