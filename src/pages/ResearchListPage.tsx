// src/pages/ResearchListPage.tsx

import React, { useMemo } from 'react';
import { getAllResearchPosts, ResearchPost } from '../utils/researchHelper';
import PostCollectionPage from '../components/PostCollectionPage';

const ResearchListPage: React.FC = () => {
    const allPosts: ResearchPost[] = useMemo(() => getAllResearchPosts(), []);

    return (
        <PostCollectionPage
            kind="research"
            title="Research"
            posts={allPosts}
            emptyLabel="No research papers found."
        />
    );
};

export default ResearchListPage;
