// src/pages/ResearchPostPage.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResearchPostBySlug, ResearchPost } from '../utils/researchHelper';
import MarkdownRenderer from '../components/MarkdownRenderer';
import NotFoundPage from './NotFoundPage';

const ResearchPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<ResearchPost | null | undefined>(undefined);

    useEffect(() => {
        if (slug) {
            const foundPost = getResearchPostBySlug(slug);
            setPost(foundPost);
        } else {
            setPost(null);
        }
    }, [slug]);

    const dummyVaultNotes = useMemo(() => [], []);

    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch (e) { return dateString; }
    };

    if (post === undefined) return <div>Loading research...</div>;
    if (post === null) return <NotFoundPage />;

    return (
        <article className="research-post-page">
            <h1>{post.frontmatter.title}</h1>
            <p className="research-post-meta">
                Published on {formatDate(post.frontmatter.date)}
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <> | Tags: {post.frontmatter.tags.join(', ')}</>
                )}
            </p>

            <MarkdownRenderer
                markdown={post.content}
                allVaultNotes={dummyVaultNotes}
            />

             <hr style={{ margin: '30px 0' }}/>
            <Link to="/research">← Back to Research List</Link>
        </article>
    );
};

export default ResearchPostPage;
