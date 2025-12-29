// src/utils/researchHelper.tsx

import fm from 'front-matter';
import { normalizeNoteName } from './markdownHelper';

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

function hasFrontmatter(obj: any): obj is { attributes: ResearchPostFrontmatter; body: string } {
    return obj && typeof obj.attributes === 'object' && typeof obj.body === 'string';
}

// Load markdown files from /vaults/Research/
const researchModules = import.meta.glob('/vaults/Research/**/*.md', { eager: true, as: 'raw' });

function generatePreview(content: string): string {
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph && firstParagraph.length < 250) {
        return firstParagraph.replace(/^[#]+ .*/gm, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '').trim();
    }
    const previewLimit = 150;
    let preview = content.substring(0, previewLimit).trim();
    if (content.length > previewLimit) {
        const lastSpace = preview.lastIndexOf(' ');
        if (lastSpace > 0) {
            preview = preview.substring(0, lastSpace);
        }
        preview += '...';
    }
     return preview.replace(/^[#]+ .*/gm, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '').trim();
}

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

            posts.push({
                slug: slug,
                frontmatter: attributes,
                content: markdownContent.trim(),
                preview: generatePreview(markdownContent),
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
