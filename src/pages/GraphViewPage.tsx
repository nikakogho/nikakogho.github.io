import React, { useMemo } from 'react';
import NexusGraph from '../components/NexusGraph';
import { GraphData } from '../utils/graphHelper';
import generatedGraph from '../generated/nexus-graph.json';

const GraphViewPage: React.FC = () => {
    const graphData = useMemo(() => generatedGraph as GraphData, []);

    return (
        <div className="graph-view-page">
            <NexusGraph data={graphData} />
        </div>
    );
};

export default GraphViewPage;
