import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import rehypeRaw from 'rehype-raw';
import { Link as RouterLink } from 'react-router-dom';
// Import the specific helper functions needed, including the new resolver and VaultNote type
import { VaultNote, resolveWikiLink } from '../utils/markdownHelper';
import { getImageUrl } from '../utils/imageHelper'; // Import your updated image helper

// Define the expected properties for the component
interface MarkdownRendererProps {
  markdown: string; // The raw Markdown content
  vaultId: string; // The ID of the current vault (for URL generation)
  allVaultNotes: VaultNote[]; // The list of all notes in the current vault, needed for link resolution
}

/**
 * React component to render Markdown content with enhanced WikiLink resolution,
 * HTML rendering enabled, and handling for non-existent links.
 * Uses user-provided base code. Includes workaround for potential remark-wiki-link bug.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, vaultId, allVaultNotes }) => {

  // --- Prepare data for remark-wiki-link ---
  const existingPermalinks = useMemo(() => {
    if (!Array.isArray(allVaultNotes)) {
        return [];
    }
    const paths = allVaultNotes.map(note => note.fullPath);
    // console.log("[MarkdownRenderer] Existing Permalinks for check:", paths);
    return paths;
  }, [allVaultNotes]);

  // Memoize the resolver function itself
  const pageResolverWrapper = useMemo(() => {
    return (name: string): string[] => {
      const resolvedPath = resolveWikiLink(name, allVaultNotes);
      // Previous check showed 'exists' was true here, but plugin added 'new-link' anyway.
      // const exists = existingPermalinks.includes(resolvedPath);
      // console.log(`[pageResolverWrapper] Does "${resolvedPath}" exist in Existing Permalinks? ${exists}`);
      return [resolvedPath]; // Return the resolved path for hrefTemplate
    };
  }, [allVaultNotes, existingPermalinks]);

  // Href template function
  const wikiHrefTemplate = (permalink: string): string => {
    // Generate the full href for the link component
    return `/vaults/${vaultId}/notes/${permalink}`;
  };
  // --- End WikiLink Configuration Data ---


  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        [
          remarkWikiLink,
          {
            pageResolver: pageResolverWrapper,
            hrefTemplate: wikiHrefTemplate,
            wikiLinkClassName: 'internal-link', // Still add base class
            aliasDivider: '|',
            existingPages: existingPermalinks, // Pass the list
          },
        ],
      ]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // --- Updated 'a' component override (WORKAROUND) ---
        a: ({ node, href, children, className, ...props }) => {
          const isInternalWikiLink = className?.includes('internal-link');

          if (isInternalWikiLink && href) {
            // --- Manual Check for Existence ---
            // Extract the permalink (resolved path) from the generated href
            let permalink = '';
            const hrefParts = href.split('/notes/');
            if (hrefParts.length > 1) {
                permalink = hrefParts[1];
            }

            // Check if this extracted permalink exists in our known list
            const exists = existingPermalinks.includes(permalink);
            // --- End Manual Check ---

            // console.log(`[Components.a] Internal Link "${children}". Href: "${href}". Permalink: "${permalink}". Exists check: ${exists}. Received className: "${className}"`);

            if (exists) {
              // Link target exists: Render the clickable RouterLink
              // console.log(`  -> Rendering as EXISTING link (RouterLink).`);
              // Pass className down in case 'internal-link' has styles, but ignore 'new-link' visually
              return <RouterLink to={href} className={'internal-link'} {...props}>{children}</RouterLink>;
            } else {
              // Link target does NOT exist (or permalink extraction failed): Render non-clickable span
              // Apply both classes so CSS can target .internal-link.new-link
              // console.log(`  -> Rendering as NEW link (span).`);
              return <span className={'internal-link new-link'} {...props}>{children}</span>;
            }
          }

          // Handle standard external/other links (same as before)
          const isExternal = href?.startsWith('http');
          return (
            <a
              href={href}
              className={`${className || ''}`}
              {...props}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          );
        },
        // --- End Updated 'a' component override ---

        img: ({ node, src, alt, ...props }) => {
          let resolvedSrc = src || '';
          if (src && !src.startsWith('http')) {
              resolvedSrc = getImageUrl(src, vaultId!);
          }
          return <img src={resolvedSrc} alt={alt || ''} {...props} loading="lazy" />;
        }
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

// Assuming VAULT_IDS is accessible here or passed down if needed for path checking
// Define it here or ensure it's imported/passed if defined elsewhere
// const VAULT_IDS = ['Neuroscience', 'Space', 'Bioengineering', 'Robots', 'AI']; // Keep if needed by getImageUrl fallback


export default MarkdownRenderer;
