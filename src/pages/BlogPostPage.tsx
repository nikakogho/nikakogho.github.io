// src/pages/BlogPostPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, BlogPost } from '../utils/blogHelper';
import MarkdownRenderer from '../components/MarkdownRenderer';
import NotFoundPage from './NotFoundPage'; // Import NotFoundPage for fallback

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined: loading, null: not found

    useEffect(() => {
        if (slug) {
            const foundPost = getBlogPostBySlug(slug);
            setPost(foundPost); // Will be the post object or undefined if not found
        } else {
            setPost(null); // No slug provided
        }
    }, [slug]);

    // Memoize allVaultNotes for MarkdownRenderer - IMPORTANT: Blog posts don't have vault notes context
    // We need to decide if blog posts can link to vault notes or vice-versa.
    // For now, let's pass an empty array, assuming blog posts only link internally or externally.
    // If you NEED cross-linking, this needs a more complex solution (e.g., loading vault notes here too).
    const dummyVaultNotes = useMemo(() => [], []);

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
            return dateString;
        }
    };

    if (post === undefined) {
        return <div>Loading blog post...</div>;
    }

    if (post === null) {
        return <NotFoundPage />;
    }

    return (
        <article className="blog-post-page">
            {/* Render Title and Metadata */}
            <h1>{post.frontmatter.title}</h1>
            <p className="blog-post-meta">
                Published on {formatDate(post.frontmatter.date)}
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <> | Tags: {post.frontmatter.tags.join(', ')}</>
                )}
            </p>

            {/* Render the actual markdown content */}
            {/* Pass 'Blog' as vaultId for image resolution if needed, and empty notes list */}
            <MarkdownRenderer
                markdown={post.content}
                vaultId={'Blog'} // Use 'Blog' so getImageUrl can construct paths if needed
                allVaultNotes={dummyVaultNotes} // Pass empty array - no vault context here
            />

             <hr style={{ margin: '30px 0' }}/>
            <Link to="/blog">← Back to Blog List</Link>
        </article>
    );
};

export default BlogPostPage;