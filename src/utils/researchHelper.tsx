// src/utils/researchHelper.tsx

import fm from 'front-matter';
import { normalizeNoteName } from './markdownHelper';
import { generateMarkdownPreview } from './postCollectionHelper';

export interface ResearchPostFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  cardImage?: string;
  url?: string;
  abstract?: string;
}

export interface ResearchPost {
  slug: string;
  frontmatter: ResearchPostFrontmatter;
  content: string;
  preview: string;
  moduleKey: string;
}

function hasFrontmatter(obj: unknown): obj is { attributes: ResearchPostFrontmatter; body: string } {
    if (typeof obj !== 'object' || obj === null) return false;
    const candidate = obj as { attributes?: unknown; body?: unknown };
    return typeof candidate.attributes === 'object' && candidate.attributes !== null && typeof candidate.body === 'string';
}

// Load markdown files from /vaults/Research/
const researchModules = import.meta.glob<string>('/vaults/Research/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

export function getAllResearchPosts(): ResearchPost[] {
    const posts: ResearchPost[] = [];

    for (const key in researchModules) {
        const rawContent = researchModules[key];
        if (!rawContent) continue;

        try {
            const parsedData = fm<ResearchPostFrontmatter>(rawContent);
            if (!hasFrontmatter(parsedData)) continue;

            const { attributes, body: markdownContent } = parsedData;

            if (!attributes.title || !attributes.date) continue;

            const parts = key.split('/');
            const filename = parts[parts.length - 1];
            const baseName = filename.replace('.md', '');
            const slug = normalizeNoteName(baseName);

            const tags = Array.isArray(attributes.tags)
                ? attributes.tags.map(String).map((tag) => tag.trim()).filter(Boolean)
                : [];

            posts.push({
                slug: slug,
                frontmatter: { ...attributes, tags },
                content: markdownContent.trim(),
                preview: generateMarkdownPreview(markdownContent),
                moduleKey: key,
            });
        } catch (error) {
            console.error(`Error processing research post ${key}:`, error);
        }
    }

    // Sort by date, most recent first
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

    return posts;
}

export function getResearchPostBySlug(slug: string): ResearchPost | undefined {
    const allPosts = getAllResearchPosts();
    return allPosts.find(post => post.slug === slug);
}
