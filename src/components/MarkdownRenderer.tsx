import React, { useMemo } from 'react';
import ReactMarkdown, { ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkWikiLink from 'remark-wiki-link';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import type { Parent, PhrasingContent, Root } from 'mdast';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { Plugin } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
// Import the specific helper functions needed, including the new resolver and VaultNote type
import { VaultNote, resolveWikiLinkTarget } from '../utils/markdownHelper';
import { getImageUrl } from '../utils/imageHelper'; // Import your updated image helper
import { prefetchNexusNote } from '../data/nexusNotes';
import 'katex/dist/katex.min.css';

// Define the expected properties for the component
interface MarkdownRendererProps {
  markdown: string; // The raw Markdown content
  allVaultNotes: VaultNote[]; // The list of all notes in the current vault, needed for link resolution
  currentNotePath?: string; // Used by same-note links such as [[#A section]]
  vaultId?: string; // Selects the image namespace for Nexus, Blog, or Research
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps = React.ComponentPropsWithoutRef<'h1'> & ExtraProps;

const OBSIDIAN_IMAGE_EMBED_PATTERN = /!\[\[([^\]\n|]+?\.(?:png|jpe?g|gif|svg|webp|avif))(?:\|([^\]\n]+))?\]\]/gi;

function getObsidianImageAlt(imagePath: string, pipeValue?: string): string {
  const trimmedPipeValue = pipeValue?.trim();
  if (trimmedPipeValue && !/^\d+(?:x\d+)?$/i.test(trimmedPipeValue)) {
    return trimmedPipeValue;
  }

  const filename = imagePath.replace(/\\/g, '/').split('/').pop() ?? imagePath;
  return filename.replace(/\.[^.]+$/, '');
}

function getObsidianImageDimensions(pipeValue?: string): { width: number; height?: number } | undefined {
  const sizeMatch = pipeValue?.trim().match(/^(\d+)(?:x(\d+))?$/i);
  if (!sizeMatch) return undefined;

  return {
    width: Number(sizeMatch[1]),
    ...(sizeMatch[2] ? { height: Number(sizeMatch[2]) } : {}),
  };
}

/**
 * Turns Obsidian image embeds into real mdast image nodes before the wiki-link
 * plugin sees them. This keeps embeds inside code blocks untouched and supports
 * aliases and width hints such as ![[diagram.png|600]].
 */
const remarkObsidianImages: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'text', (node, index, parent) => {
    if (typeof index !== 'number' || !parent) return;

    const replacements: PhrasingContent[] = [];
    let cursor = 0;
    let foundEmbed = false;
    OBSIDIAN_IMAGE_EMBED_PATTERN.lastIndex = 0;

    for (const match of node.value.matchAll(OBSIDIAN_IMAGE_EMBED_PATTERN)) {
      const matchIndex = match.index ?? 0;
      if (matchIndex > cursor) {
        replacements.push({ type: 'text', value: node.value.slice(cursor, matchIndex) });
      }

      const imagePath = match[1].trim();
      const dimensions = getObsidianImageDimensions(match[2]);
      replacements.push({
        type: 'image',
        url: imagePath,
        alt: getObsidianImageAlt(imagePath, match[2]),
        ...(dimensions
          ? { data: { hProperties: dimensions } }
          : {}),
      });
      cursor = matchIndex + match[0].length;
      foundEmbed = true;
    }

    if (!foundEmbed) return;
    if (cursor < node.value.length) {
      replacements.push({ type: 'text', value: node.value.slice(cursor) });
    }

    (parent as Parent).children.splice(index, 1, ...replacements);
    return [SKIP, index + replacements.length];
  });
};

function getHrefPermalink(href: string): string {
  const notesPrefix = '/nexus/notes/';
  const prefixIndex = href.indexOf(notesPrefix);
  if (prefixIndex === -1) return '';

  const permalinkWithFragment = href.slice(prefixIndex + notesPrefix.length);
  const permalink = permalinkWithFragment.split('#', 1)[0];

  try {
    return decodeURIComponent(permalink);
  } catch {
    return permalink;
  }
}

/**
 * React component to render Markdown content with enhanced WikiLink resolution,
 * HTML rendering enabled, and handling for non-existent links.
 * Uses user-provided base code. Includes workaround for potential remark-wiki-link bug.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
  allVaultNotes,
  currentNotePath = '',
  vaultId = 'nexus',
}) => {
  const location = useLocation();

  // --- Prepare data for remark-wiki-link ---
  const existingPermalinks = useMemo(() => {
    if (!Array.isArray(allVaultNotes)) {
        return [];
    }
    const paths = allVaultNotes.map(note => note.fullPath);
    // console.log("[MarkdownRenderer] Existing Permalinks for check:", paths);
    return paths;
  }, [allVaultNotes]);

  const existingPermalinkSet = useMemo(
    () => new Set(existingPermalinks),
    [existingPermalinks],
  );

  // Memoize the resolver function itself
  const pageResolverWrapper = useMemo(() => {
    return (name: string): string[] => {
      const { notePath, anchorId } = resolveWikiLinkTarget(
        name,
        allVaultNotes,
        currentNotePath
      );
      const resolvedTarget = anchorId ? `${notePath}#${anchorId}` : notePath;
      return [resolvedTarget]; // Return the resolved path for hrefTemplate
    };
  }, [allVaultNotes, currentNotePath]);

  // Href template function
  const wikiHrefTemplate = (permalink: string): string => {
    // Generate the full href for the link component
    return `/nexus/notes/${permalink}`;
  };
  // --- End WikiLink Configuration Data ---

  const renderHeading = (Tag: HeadingTag) => {
    return ({ node, children, className, ...props }: HeadingProps) => {
      // ReactMarkdown exposes the source AST node for custom components, but it
      // must not be forwarded as an invalid DOM attribute.
      void node;
      const id = typeof props.id === 'string' ? props.id : undefined;
      const headingClassName = ['markdown-heading', className].filter(Boolean).join(' ');

      return (
        <Tag
          {...props}
          className={headingClassName}
          tabIndex={id ? -1 : undefined}
        >
          {children}
          {id && (
            <RouterLink
              to={{ pathname: location.pathname, hash: `#${id}` }}
              className="section-anchor"
              aria-label="Link to this section"
              title="Link to this section"
            >
              <span aria-hidden="true">#</span>
            </RouterLink>
          )}
        </Tag>
      );
    };
  };


  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkMath,
        remarkObsidianImages,
        [
          remarkWikiLink,
          {
            pageResolver: pageResolverWrapper,
            hrefTemplate: wikiHrefTemplate,
            wikiLinkClassName: 'internal-link', // Still add base class
            aliasDivider: '|',
            permalinks: existingPermalinks, // Pass the list
          },
        ],
      ]}
      rehypePlugins={[
        rehypeRaw,
        [rehypeKatex, { throwOnError: false, strict: 'ignore' }],
        rehypeSlug,
      ]}
      components={{
        h1: renderHeading('h1'),
        h2: renderHeading('h2'),
        h3: renderHeading('h3'),
        h4: renderHeading('h4'),
        h5: renderHeading('h5'),
        h6: renderHeading('h6'),
        // --- Updated 'a' component override (WORKAROUND) ---
        a: ({ node, href, children, className, ...props }) => {
          void node;
          const isInternalWikiLink = className?.includes('internal-link');

          if (isInternalWikiLink && href) {
            // --- Manual Check for Existence ---
            // Extract the permalink (resolved path) from the generated href
            const permalink = getHrefPermalink(href);

            // Check if this extracted permalink exists in our known list
            const exists = existingPermalinkSet.has(permalink);
            // --- End Manual Check ---

            // console.log(`[Components.a] Internal Link "${children}". Href: "${href}". Permalink: "${permalink}". Exists check: ${exists}. Received className: "${className}"`);

            if (exists) {
              // Link target exists: Render the clickable RouterLink
              // console.log(`  -> Rendering as EXISTING link (RouterLink).`);
              // Pass className down in case 'internal-link' has styles, but ignore 'new-link' visually
              return (
                <RouterLink
                  to={href}
                  className="internal-link"
                  onMouseEnter={() => prefetchNexusNote(permalink)}
                  onFocus={() => prefetchNexusNote(permalink)}
                  {...props}
                >
                  {children}
                </RouterLink>
              );
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

        img: ({ node, src, alt, className, width, height, style, ...props }) => {
          void node;
          let resolvedSrc = src || '';
          if (src && !src.startsWith('http')) {
              resolvedSrc = getImageUrl(src, vaultId);
          }
          const hasExplicitSize = width !== undefined || height !== undefined;
          const imageClassName = [
            'markdown-content-image',
            hasExplicitSize ? 'markdown-content-image--explicit-size' : '',
            className,
          ].filter(Boolean).join(' ');
          const imageStyle = height !== undefined
            ? { ...style, height, objectFit: 'contain' as const }
            : style;

          return (
            <img
              src={resolvedSrc}
              alt={alt || ''}
              className={imageClassName}
              width={width}
              height={height}
              style={imageStyle}
              {...props}
              loading="lazy"
            />
          );
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
