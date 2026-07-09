export type PostSortOrder = 'newest' | 'oldest';

export interface PostFilters {
  title: string;
  tag: string;
  keyword: string;
  dateFrom: string;
  dateTo: string;
  sortOrder: PostSortOrder;
}

export interface FilterablePost {
  slug: string;
  content: string;
  preview: string;
  frontmatter: {
    title: string;
    date: string;
    tags?: string[];
    cardImage?: string;
  };
}

export const DEFAULT_POST_FILTERS: PostFilters = {
  title: '',
  tag: '',
  keyword: '',
  dateFrom: '',
  dateTo: '',
  sortOrder: 'newest',
};

const normalizeSearchText = (value: string): string => value.trim().toLocaleLowerCase();

/**
 * Returns the calendar date written in frontmatter without allowing the viewer's
 * timezone to move a post into an adjacent day.
 */
export function getPostDateKey(dateValue: string): string {
  const match = String(dateValue).match(/\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  const timestamp = Date.parse(dateValue);
  return Number.isNaN(timestamp) ? '' : new Date(timestamp).toISOString().slice(0, 10);
}

function getPostTimestamp(dateValue: string): number {
  const timestamp = Date.parse(dateValue);
  if (!Number.isNaN(timestamp)) return timestamp;

  const dateKey = getPostDateKey(dateValue);
  return dateKey ? Date.parse(`${dateKey}T00:00:00Z`) : 0;
}

export function filterAndSortPosts<T extends FilterablePost>(
  posts: readonly T[],
  filters: PostFilters,
): T[] {
  const titleQuery = normalizeSearchText(filters.title);
  const tagQuery = normalizeSearchText(filters.tag);
  const keywordQuery = normalizeSearchText(filters.keyword);

  const filteredPosts = posts.filter((post) => {
    const title = post.frontmatter.title.toLocaleLowerCase();
    const tags = Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags : [];
    const postDate = getPostDateKey(post.frontmatter.date);

    if (titleQuery && !title.includes(titleQuery)) return false;
    if (tagQuery && !tags.some((tag) => tag.toLocaleLowerCase().includes(tagQuery))) return false;
    if (keywordQuery && !post.content.toLocaleLowerCase().includes(keywordQuery)) return false;
    if (filters.dateFrom && (!postDate || postDate < filters.dateFrom)) return false;
    if (filters.dateTo && (!postDate || postDate > filters.dateTo)) return false;

    return true;
  });

  const direction = filters.sortOrder === 'newest' ? -1 : 1;
  return filteredPosts.sort((a, b) => {
    const dateDifference = getPostTimestamp(a.frontmatter.date) - getPostTimestamp(b.frontmatter.date);
    if (dateDifference !== 0) return dateDifference * direction;
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
}

export function getAvailableTags(posts: readonly FilterablePost[]): string[] {
  const tagsByNormalizedName = new Map<string, string>();

  posts.forEach((post) => {
    if (!Array.isArray(post.frontmatter.tags)) return;
    post.frontmatter.tags.forEach((tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag) tagsByNormalizedName.set(trimmedTag.toLocaleLowerCase(), trimmedTag);
    });
  });

  return Array.from(tagsByNormalizedName.values()).sort((a, b) => a.localeCompare(b));
}

/**
 * Keeps the first meaningful Markdown block intact so emphasis, links, lists,
 * blockquotes, and inline math can be rendered on collection cards.
 */
export function generateMarkdownPreview(content: string): string {
  const blocks = content
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const firstContentBlock = blocks.find((block) => {
    const isHeadingOnly = /^#{1,6}\s+[^\n]+$/.test(block);
    const isImageOnly = /^!\[[^\]]*\]\([^)]*\)$/.test(block) || /^!\[\[[^\]]+\]\]$/.test(block);
    return !isHeadingOnly && !isImageOnly;
  });

  return firstContentBlock ?? '';
}
