import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, BlogPost } from '../utils/blogHelper';
import { getImageUrl } from '../utils/imageHelper'; // Reuse image helper

const POSTS_PER_PAGE = 5; // Adjust as needed

const BlogListPage: React.FC = () => {
    const allPosts: BlogPost[] = useMemo(() => getAllBlogPosts(), []);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    // Calculate posts for the current page
    const currentPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        return allPosts.slice(startIndex, endIndex);
    }, [allPosts, currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // Helper to format date nicely
    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            console.warn("Invalid date format:", dateString);
            return dateString; // Return original string if parsing fails
        }
    };

    return (
        <div className="blog-list-page">
            <h1>Blog Posts</h1>

            {currentPosts.length === 0 && <p>No blog posts found.</p>}

            <ul className="blog-post-list">
                {currentPosts.map((post) => (
                    <li key={post.slug} className="blog-post-preview">
                        <Link to={`/blog/${post.slug}`} className="blog-post-preview-link">
                            {/* Optional Card Image */}
                            {post.frontmatter.cardImage && (
                                <img
                                    src={getImageUrl(post.frontmatter.cardImage, 'Blog')} // Assuming images are relative to Blog vault
                                    alt={`${post.frontmatter.title} preview`}
                                    className="blog-preview-image"
                                    loading="lazy"
                                />
                            )}
                            <div className="blog-preview-content">
                                <h2>{post.frontmatter.title}</h2>
                                <p className="blog-preview-date">{formatDate(post.frontmatter.date)}</p>
                                <p className="blog-preview-text">{post.preview}</p>
                                {/* Optional Tags Display */}
                                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                                    <p className="blog-preview-tags">
                                        Tags: {post.frontmatter.tags.join(', ')}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}

            {/* Placeholder for future features */}
            <div className="blog-list-controls" style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '15px', opacity: 0.5 }}>
                <p>Future features:</p>
                <input type="text" placeholder="Search by title..." disabled />
                <input type="text" placeholder="Filter by tag..." disabled />
                <select disabled>
                    <option>Sort by Date (Newest First)</option>
                    <option>Sort by Date (Oldest First)</option>
                </select>
            </div>
        </div>
    );
};

export default BlogListPage;