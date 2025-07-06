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
import { FiShare2 } from 'react-icons/fi';

// Import markdown content modules (dynamic, raw)
const markdownContentModules = import.meta.glob('/Nexus/**/*.md', { eager: false, as: 'raw' });

const NotePage: React.FC = () => {
  const { '*': notePath } = useParams<{ '*': string }>();
  const vaultId = "Nexus";

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
      const moduleKey = findNoteModuleKey(normalizedPath, markdownContentModules);
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
  if (error) { return <div>Error: {error} <Link to="/nexus">Back to Nexus</Link></div>; }
  if (!content) { return <div>Note content not available. <Link to="/nexus">Back to Nexus</Link></div>; }

  // --- Render Note Content Only ---
  // The surrounding layout (sidebar, toggle button) is now handled by VaultLayout
  return (
    <>
    <div className="note-header">
     <h1>{noteTitle}</h1>

      <Link to="/nexus/graph" className="graph-view-button" title="Open Graph View">
          <FiShare2 />
      </Link>
    </div>

      {/* Render the actual markdown content */}
      <MarkdownRenderer
          markdown={content}
          allVaultNotes={allVaultNotes} // Pass the list from context
      />
    </>
  );
};

export default NotePage;
