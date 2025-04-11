import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { findNoteModuleKey } from '../utils/markdownHelper';

// Import all markdown files using Vite's glob import
// Use eager: false for dynamic imports
const markdownModules = import.meta.glob('/vaults/**/*.md', { eager: false, as: 'raw' });
// console.log("Available Markdown Modules:", markdownModules); // Debugging

const NotePage: React.FC = () => {
  const { vaultId, '*': notePath } = useParams<{ vaultId: string; '*': string }>();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      setContent(null);

      if (!vaultId || !notePath) {
        setError("Invalid vault or note path.");
        setIsLoading(false);
        return;
      }

      // Normalize the incoming path from the URL
      const normalizedPath = notePath.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-\/]+/g, '');
      // console.log(`Looking for Vault: ${vaultId}, Normalized Path: ${normalizedPath}`); // Debug

      const moduleKey = findNoteModuleKey(normalizedPath, vaultId, markdownModules);
      // console.log(`Found module key: ${moduleKey}`); // Debug

      if (moduleKey && markdownModules[moduleKey]) {
        try {
          const moduleLoader = markdownModules[moduleKey] as () => Promise<string>;
          const loadedContent = await moduleLoader();
          // console.log("Loaded Content:", loadedContent); // Debug
          setContent(loadedContent);
        } catch (err) {
          console.error("Error loading module:", err);
          setError(`Failed to load note content for "${notePath}".`);
        }
      } else {
        setError(`Note "${notePath}" not found in vault "${vaultId}".`);
      }
      setIsLoading(false);
    };

    loadContent();
  }, [vaultId, notePath]); // Rerun effect if vaultId or notePath changes

  if (isLoading) {
    return <div>Loading note...</div>;
  }

  if (error) {
    return <div>Error: {error} <Link to={`/vaults/${vaultId}`}>Back to vault</Link></div>;
  }

  if (!content) {
    return <div>Note content not available. <Link to={`/vaults/${vaultId}`}>Back to vault</Link></div>;
  }

  // Pass vaultId to renderer for link generation context
  return (
     <div>
        {/* Optional: Breadcrumbs or Back link */}
        <Link to={`/vaults/${vaultId}`}>Back to {vaultId}</Link>
        <hr/>
        <MarkdownRenderer markdown={content} vaultId={vaultId!} />
     </div>
  );
};


export default NotePage;