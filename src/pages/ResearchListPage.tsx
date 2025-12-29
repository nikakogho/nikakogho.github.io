// src/pages/ResearchListPage.tsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllResearchPosts, ResearchPost } from '../utils/researchHelper';
import { getImageUrl } from '../utils/imageHelper';

const POSTS_PER_PAGE = 5;

const ResearchListPage: React.FC = () => {
    const allPosts: ResearchPost[] = useMemo(() => getAllResearchPosts(), []);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    const currentPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        return allPosts.slice(startIndex, endIndex);
    }, [allPosts, currentPage]);

    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch (e) { return dateString; }
    };

    return (
        <div className="research-list-page">
            <h1>Research</h1>

            {currentPosts.length === 0 && <p>No research papers found.</p>}

            <ul className="research-post-list">
                {currentPosts.map((post) => (
                    <li key={post.slug} className="research-post-preview">
                        <Link to={`/research/${post.slug}`} className="research-post-preview-link">
                            {post.frontmatter.cardImage && (
                                <img
                                    src={getImageUrl(post.frontmatter.cardImage, 'Research')}
                                    alt={`${post.frontmatter.title} preview`}
                                    className="research-preview-image"
                                    loading="lazy"
                                />
                            )}
                            <div className="research-preview-content">
                                <h2>{post.frontmatter.title}</h2>
                                <p className="research-preview-date">{formatDate(post.frontmatter.date)}</p>
                                <p className="research-preview-text">{post.preview}</p>
                                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                                    <p className="research-preview-tags">
                                        Tags: {post.frontmatter.tags.join(', ')}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
};

export default ResearchListPage;
