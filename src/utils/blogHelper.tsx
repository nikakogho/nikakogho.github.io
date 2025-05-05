import fm from 'front-matter';
import { normalizeNoteName } from './markdownHelper'; // Reuse normalization

// Define the expected structure of blog post frontmatter
export interface BlogPostFrontmatter {
  title: string;
  date: string; // Expecting ISO format string e.g., "2024-05-15" or "2024-05-15T10:00:00Z"
  tags?: string[];
  cardImage?: string; // Optional path relative to the post or vault asset folder
  // Add other metadata fields if needed
}

// Define the structure for a processed blog post
export interface BlogPost {
  slug: string; // Normalized, URL-friendly identifier
  frontmatter: BlogPostFrontmatter;
  content: string; // Raw Markdown content without frontmatter
  preview: string; // A short preview text
  moduleKey: string; // Original key from import.meta.glob
}

// Type guard to check if an object has frontmatter structure
function hasFrontmatter(obj: any): obj is { attributes: BlogPostFrontmatter; body: string } {
    return obj && typeof obj.attributes === 'object' && typeof obj.body === 'string';
}

// Import blog markdown files as raw text
// Adjust the path if your blog vault isn't named 'Blog'
const blogModules = import.meta.glob('/vaults/Blog/**/*.md', { eager: true, as: 'raw' });

/**
 * Extracts a short preview from Markdown content.
 * Basic implementation: takes the first paragraph or ~150 chars.
 */
function generatePreview(content: string): string {
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph && firstParagraph.length < 250) { // Prefer first paragraph if short
        // Basic cleanup - remove markdown headings, links, images for preview
        return firstParagraph.replace(/^[#]+ .*/gm, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '').trim();
    }
    // Fallback to character limit, try to end on a space
    const previewLimit = 150;
    let preview = content.substring(0, previewLimit).trim();
    if (content.length > previewLimit) {
        const lastSpace = preview.lastIndexOf(' ');
        if (lastSpace > 0) {
            preview = preview.substring(0, lastSpace);
        }
        preview += '...';
    }
     // Basic cleanup again
     return preview.replace(/^[#]+ .*/gm, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '').trim();
}


/**
 * Fetches, parses, and sorts all blog posts from the '/vaults/Blog/' directory.
 */
export function getAllBlogPosts(): BlogPost[] {
    const posts: BlogPost[] = [];

    for (const key in blogModules) {
        const rawContent = blogModules[key];
        if (!rawContent) continue;

        try {
            // Parse frontmatter and content
            const parsedData = fm<BlogPostFrontmatter>(rawContent);

            // Check if parsing was successful and data structure is correct
            if (!hasFrontmatter(parsedData)) {
                 console.warn(`Skipping blog post ${key}: Could not parse frontmatter correctly.`);
                 continue;
            }

            const { attributes, body: markdownContent } = parsedData;

            // Basic validation for required frontmatter
            if (!attributes.title || !attributes.date) {
                console.warn(`Skipping blog post ${key}: Missing title or date in frontmatter.`);
                continue;
            }

            // Extract filename and create slug
            const parts = key.split('/');
            const filename = parts[parts.length - 1];
            const baseName = filename.replace('.md', '');
            const slug = normalizeNoteName(baseName); // Use existing normalization

            posts.push({
                slug: slug,
                frontmatter: attributes,
                content: markdownContent.trim(),
                preview: generatePreview(markdownContent),
                moduleKey: key,
            });
        } catch (error) {
            console.error(`Error processing blog post ${key}:`, error);
        }
    }

    // Sort posts by date, most recent first
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

    return posts;
}

/**
 * Finds a specific blog post by its slug.
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    // Consider optimizing this if the number of posts grows very large
    // (e.g., generate a map on build or memoize the result of getAllBlogPosts)
    const allPosts = getAllBlogPosts();
    return allPosts.find(post => post.slug === slug);
}
