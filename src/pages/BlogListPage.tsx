import React, { useMemo } from 'react';
import { getAllBlogPosts, BlogPost } from '../utils/blogHelper';
import PostCollectionPage from '../components/PostCollectionPage';

const BlogListPage: React.FC = () => {
    const allPosts: BlogPost[] = useMemo(() => getAllBlogPosts(), []);

    return (
        <PostCollectionPage
            kind="blog"
            title="Blog Posts"
            posts={allPosts}
            emptyLabel="No blog posts found."
        />
    );
};

export default BlogListPage;
