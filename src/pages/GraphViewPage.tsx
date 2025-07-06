import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import NexusGraph from '../components/NexusGraph';
import { generateGraphData } from '../utils/graphHelper';
import { useTheme } from '../context/ThemeContext';
import { VaultOutletContext } from './VaultLayout';

const markdownContentModules = import.meta.glob('/Nexus/**/*.md', { as: 'raw', eager: true });

const GraphViewPage: React.FC = () => {
    const { allVaultNotes } = useOutletContext<VaultOutletContext>();
    const { theme } = useTheme();

    const graphData = useMemo(() => {
        return generateGraphData(allVaultNotes, markdownContentModules, theme);
    }, [allVaultNotes, theme]);

    return (
        <div>
            <h1>Nexus Knowledge Graph</h1>
            <NexusGraph data={graphData} />
        </div>
    );
};

export default GraphViewPage;