import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import { getImageUrl } from '../utils/imageHelper';
import {
  DEFAULT_POST_FILTERS,
  FilterablePost,
  filterAndSortPosts,
  getAvailableTags,
  PostFilters,
} from '../utils/postCollectionHelper';
import { VaultNote } from '../utils/markdownHelper';

const POSTS_PER_PAGE = 5;
const EMPTY_VAULT_NOTES: VaultNote[] = [];

type CollectionKind = 'blog' | 'research';

interface PostCollectionPageProps<T extends FilterablePost> {
  kind: CollectionKind;
  title: string;
  posts: readonly T[];
  emptyLabel: string;
}

const formatDate = (dateString: string): string => {
  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) return dateString;

  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const PostCollectionPage = <T extends FilterablePost>({
  kind,
  title,
  posts,
  emptyLabel,
}: PostCollectionPageProps<T>) => {
  const [filters, setFilters] = useState<PostFilters>(DEFAULT_POST_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const availableTags = useMemo(() => getAvailableTags(posts), [posts]);
  const filteredPosts = useMemo(() => filterAndSortPosts(posts, filters), [posts, filters]);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  const classPrefix = kind === 'blog' ? 'blog' : 'research';
  const itemLabel = kind === 'blog' ? 'post' : 'paper';
  const tagOptionsId = `${kind}-tag-options`;
  const hasActiveFilters = Boolean(
    filters.title || filters.tag || filters.keyword || filters.dateFrom || filters.dateTo,
  );
  const invalidDateRange = Boolean(
    filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo,
  );

  const updateFilter = <K extends keyof PostFilters>(key: K, value: PostFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const resetControls = () => {
    setFilters(DEFAULT_POST_FILTERS);
    setCurrentPage(1);
  };

  return (
    <div className={`${classPrefix}-list-page content-list-page`}>
      <div className="content-list-header">
        <div>
          <p className="content-list-eyebrow">Explore the archive</p>
          <h1>{title}</h1>
        </div>
        <p className="content-list-count" aria-live="polite">
          {filteredPosts.length} {itemLabel}{filteredPosts.length === 1 ? '' : 's'}
        </p>
      </div>

      <section className="content-list-controls" aria-label={`${title} filters`}>
        <div className="content-filter-grid">
          <label>
            <span>Title</span>
            <input
              type="search"
              value={filters.title}
              onChange={(event) => updateFilter('title', event.target.value)}
              placeholder={`Search ${itemLabel} titles`}
              autoComplete="off"
            />
          </label>

          <label>
            <span>Keyword</span>
            <input
              type="search"
              value={filters.keyword}
              onChange={(event) => updateFilter('keyword', event.target.value)}
              placeholder="Search inside content"
              autoComplete="off"
            />
          </label>

          <label>
            <span>Tag</span>
            <input
              type="search"
              value={filters.tag}
              onChange={(event) => updateFilter('tag', event.target.value)}
              placeholder="Filter by tag"
              list={tagOptionsId}
              autoComplete="off"
            />
            <datalist id={tagOptionsId}>
              {availableTags.map((tag) => <option key={tag} value={tag} />)}
            </datalist>
          </label>

          <label>
            <span>From</span>
            <input
              type="date"
              value={filters.dateFrom}
              max={filters.dateTo || undefined}
              onChange={(event) => updateFilter('dateFrom', event.target.value)}
            />
          </label>

          <label>
            <span>To</span>
            <input
              type="date"
              value={filters.dateTo}
              min={filters.dateFrom || undefined}
              onChange={(event) => updateFilter('dateTo', event.target.value)}
            />
          </label>

          <label>
            <span>Sort</span>
            <select
              value={filters.sortOrder}
              onChange={(event) => updateFilter('sortOrder', event.target.value as PostFilters['sortOrder'])}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        <div className="content-filter-footer">
          <p className={invalidDateRange ? 'content-filter-error' : ''} role={invalidDateRange ? 'alert' : undefined}>
            {invalidDateRange ? 'Choose an end date on or after the start date.' : 'Filters update as you type.'}
          </p>
          <button
            type="button"
            className="content-filter-reset"
            onClick={resetControls}
            disabled={!hasActiveFilters && filters.sortOrder === 'newest'}
          >
            Clear filters
          </button>
        </div>
      </section>

      {currentPosts.length === 0 ? (
        <div className="content-list-empty">
          <h2>No matches found</h2>
          <p>{hasActiveFilters ? 'Try a broader title, tag, keyword, or date range.' : emptyLabel}</p>
          {hasActiveFilters && (
            <button type="button" onClick={resetControls}>Show every {itemLabel}</button>
          )}
        </div>
      ) : (
        <ul className={`${classPrefix}-post-list`}>
          {currentPosts.map((post) => {
            const tags = Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags : [];
            const postPath = `/${kind}/${post.slug}`;

            return (
              <li key={post.slug} className={`${classPrefix}-post-preview`}>
                {post.frontmatter.cardImage && (
                  <Link to={postPath} className="content-preview-image-link" aria-label={`Read ${post.frontmatter.title}`}>
                    <img
                      src={getImageUrl(post.frontmatter.cardImage, kind)}
                      alt=""
                      className={`${classPrefix}-preview-image`}
                      loading="lazy"
                    />
                  </Link>
                )}

                <div className={`${classPrefix}-preview-content`}>
                  <Link to={postPath} className="content-preview-title-link">
                    <h2>{post.frontmatter.title}</h2>
                  </Link>
                  <time className={`${classPrefix}-preview-date`} dateTime={post.frontmatter.date}>
                    {formatDate(post.frontmatter.date)}
                  </time>

                  {post.preview && (
                    <div className={`${classPrefix}-preview-text markdown-preview`}>
                      <MarkdownRenderer
                        markdown={post.preview}
                        allVaultNotes={EMPTY_VAULT_NOTES}
                        vaultId={kind}
                      />
                    </div>
                  )}

                  <div className="content-preview-footer">
                    {tags.length > 0 && (
                      <ul className={`${classPrefix}-preview-tags content-preview-tags`} aria-label="Tags">
                        {tags.map((tag) => (
                          <li key={tag}>
                            <button type="button" onClick={() => updateFilter('tag', tag)}>#{tag}</button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link to={postPath} className="content-preview-read-more">
                      Read {itemLabel}<span aria-hidden="true"> →</span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="pagination-controls" aria-label={`${title} pagination`}>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default PostCollectionPage;
