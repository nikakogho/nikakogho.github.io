import React, { useMemo } from 'react';
import NexusGraph from '../components/NexusGraph';
import { GraphData } from '../utils/graphHelper';
import generatedGraph from '../generated/nexus-graph.json';

const GraphViewPage: React.FC = () => {
    const graphData = useMemo(() => generatedGraph as GraphData, []);

    return (
        <div className="graph-view-page">
            <div className="graph-view-heading">
                <p>Nexus</p>
                <h1>Nexus Knowledge Graph</h1>
                <span>Every note and the paths that connect them, arranged as one explorable map.</span>
            </div>
            <NexusGraph data={graphData} />
        </div>
    );
};

export default GraphViewPage;
