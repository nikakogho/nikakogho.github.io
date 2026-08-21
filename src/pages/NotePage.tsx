import React, { useState, useEffect, useMemo } from 'react';
// Import useOutletContext to get data from VaultLayout
import { useParams, Link, useLocation, useOutletContext } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
// Import helpers and types
import {
    normalizeHeadingLookupKey,
    normalizeNoteName
} from '../utils/markdownHelper';
// Import the context type definition from VaultLayout
import { VaultOutletContext } from './VaultLayout';
import { FiShare2 } from 'react-icons/fi';
import { loadNexusNote } from '../data/nexusNotes';

const NotePage: React.FC = () => {
  const { '*': notePath } = useParams<{ '*': string }>();
  const location = useLocation();
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
      const contentPromise = loadNexusNote(normalizedPath);
      if (contentPromise) {
        try {
          setContent(await contentPromise);
          setLoadedNormalizedPath(normalizedPath);
        } catch (err) { console.error("Error loading module content:", err); setError(`Failed to load note content for "${notePath}".`); }
      } else { setError(`Note content module not found for "${notePath}" (normalized: ${normalizedPath}) in vault "${vaultId}".`); }
      setIsLoading(false);
    };
    loadContent();
  }, [vaultId, notePath]);

  // HashRouter cannot rely on the browser's native anchor jump when note
  // content is loaded asynchronously. Scroll after the Markdown has mounted,
  // and mark the destination so it is visually easy to find.
  useEffect(() => {
    const clearSectionTarget = () => {
      document
        .querySelectorAll('.markdown-heading.is-section-target')
        .forEach(element => element.classList.remove('is-section-target'));
    };

    // Also clear the old highlight when navigating back to the note URL
    // without a section hash.
    clearSectionTarget();
    if (!content || isLoading || !location.hash) return;

    let anchorId = location.hash.slice(1);
    try {
      anchorId = decodeURIComponent(anchorId);
    } catch {
      // Keep the undecoded value when a malformed escape sequence is present.
    }

    let frameId = 0;
    let observerStopTimer = 0;
    let resizeObserver: ResizeObserver | undefined;

    const findSection = () => {
      const requestedHeadingKey = normalizeHeadingLookupKey(anchorId);
      return document.getElementById(anchorId) ?? Array.from(
        document.querySelectorAll<HTMLElement>('.markdown-heading[id]')
      ).find((heading) => normalizeHeadingLookupKey(heading.id) === requestedHeadingKey);
    };

    const revealSection = (target: HTMLElement, smooth: boolean) => {
      clearSectionTarget();
      target.classList.add('is-section-target');
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'smooth'
          : 'auto',
        block: 'start',
      });
    };

    frameId = window.requestAnimationFrame(() => {
      const target = findSection();
      if (!target) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return;
      }

      revealSection(target, true);

      // Images and web fonts can change the height above the destination after
      // the first jump. Keep the target aligned while those late assets settle.
      const noteArticle = target.closest('article');
      if (noteArticle && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          window.cancelAnimationFrame(frameId);
          frameId = window.requestAnimationFrame(() => revealSection(target, false));
        });
        resizeObserver.observe(noteArticle);
        observerStopTimer = window.setTimeout(() => resizeObserver?.disconnect(), 5000);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(observerStopTimer);
      resizeObserver?.disconnect();
    };
  }, [content, isLoading, loadedNormalizedPath, location.hash]);


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
          currentNotePath={loadedNormalizedPath}
          vaultId="nexus"
      />
    </>
  );
};

export default NotePage;
