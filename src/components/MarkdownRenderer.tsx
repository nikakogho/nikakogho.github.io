import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Plugin for GitHub Flavored Markdown (tables, task lists, etc.)
import remarkWikiLink from 'remark-wiki-link'; // Plugin for [[Wiki Link]] syntax
import { Link as RouterLink } from 'react-router-dom'; // For internal SPA navigation
// Import the specific helper functions needed, including the new resolver and VaultNote type
import { VaultNote, resolveWikiLink } from '../utils/markdownHelper';
import { getImageUrl } from '../utils/imageHelper'; // Helper to generate external image URLs

// Define the expected properties for the component
interface MarkdownRendererProps {
  markdown: string; // The raw Markdown content
  vaultId: string; // The ID of the current vault (for URL generation)
  allVaultNotes: VaultNote[]; // The list of all notes in the current vault, needed for link resolution
}

/**
 * React component to render Markdown content with enhanced WikiLink resolution
 * using a helper function from markdownHelper.ts.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, vaultId, allVaultNotes }) => {
  // --- WikiLink Configuration ---

  // This wrapper function is passed to remark-wiki-link.
  // It calls our external helper 'resolveWikiLink' with the necessary context (allVaultNotes).
  // remark-wiki-link expects pageResolver to return an array of strings (permalinks).
  const pageResolverWrapper = (name: string): string[] => {
    // Call the helper function from markdownHelper.ts to find the correct path
    const resolvedPath = resolveWikiLink(name, allVaultNotes);
    // Return the resolved path inside an array as expected by the plugin
    return [resolvedPath];
  };

  // Function to generate the final URL from the resolved permalink (path)
  // This part remains the same.
  const wikiHrefTemplate = (permalink: string): string => {
    // Constructs the path based on the application's routing structure
    return `/vaults/${vaultId}/notes/${permalink}`;
  };
  // --- End WikiLink Configuration ---


  return (
    <ReactMarkdown
      // --- Core Markdown Processing Plugins ---
      remarkPlugins={[
        remarkGfm, // Enable GFM features
        [
          remarkWikiLink, // Enable [[Wiki Link]] parsing
          {
            // Configuration for remark-wiki-link
            pageResolver: pageResolverWrapper, // Use the wrapper around our external helper
            hrefTemplate: wikiHrefTemplate, // Use our function to build the final URL
            wikiLinkClassName: 'internal-link', // CSS class for styling wiki links
            newClassName: 'new-link', // CSS class for wiki links to non-existent notes (optional)
            aliasDivider: '|', // Character used for [[Actual Note|Display Alias]]
          },
        ],
      ]}

      // --- Custom Rendering for Specific HTML Elements ---
      components={{
        // Override the default rendering for anchor `<a>` tags
        // Logic remains the same as before.
        a: ({ node, href, children, ...props }) => {
          const isInternalWikiLink = props.className === 'internal-link';
          if (href && isInternalWikiLink) {
            // Render internal wiki links using React Router
            return <RouterLink to={href}>{children}</RouterLink>;
          }
          // Handle standard external/other links
          const isExternal = href?.startsWith('http');
          return (
            <a
              href={href}
              {...props}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          );
        },

        // Override the default rendering for image `<img>` tags
        // Logic remains the same as before.
        img: ({ node, src, alt, ...props }) => {
          let resolvedSrc = src || '';
          console.log('About to resolve for image:', resolvedSrc); // Debugging
          // If src is not an absolute URL, resolve it using the image helper
          if (src && !src.startsWith('http')) {
            resolvedSrc = getImageUrl(src, vaultId!);
          }
          console.log('Resolved for image:', resolvedSrc); // Debugging
          // Render the image tag with lazy loading
          return <img src={resolvedSrc} alt={alt || ''} {...props} loading="lazy" />;
        }
      }}
    >
      {/* The raw Markdown string to be processed */}
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
