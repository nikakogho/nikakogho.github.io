import React, { useRef, useState, useMemo, useEffect } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { forceCenter, forceCollide, ForceLink, ForceManyBody } from 'd3-force';
import { useNavigate } from 'react-router-dom';
import { GraphData } from '../utils/graphHelper';

// Extend the GraphNode type for use with the library
interface GraphVizNode extends NodeObject {
    id: string;
    name: string;
    val: number;
    color: string;
    group: string;
}

const NexusGraph: React.FC<{ data: GraphData, theme: 'light' | 'dark' }> = ({ data, theme }) => {
    const navigate = useNavigate();
    const fgRef = useRef<ForceGraphMethods<NodeObject, LinkObject> | undefined>(undefined);

    // State for hover effects
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
    const [highlightedLinks, setHighlightedLinks] = useState<Set<LinkObject>>(new Set());

    // Effect to adjust graph forces for better clustering
    useEffect(() => {
        const fg = fgRef.current;
        if (fg) {
            // **CORRECTED PHYSICS LOGIC**
            // Get the existing forces and re-configure them
            
            // 1. Configure the Link force
            const linkForce = fg.d3Force('link') as any;
            linkForce
                .id((node: any) => node.id)
                .distance(60) // Increased distance slightly
                .strength(0.15); // Reduced strength slightly

            // 2. Configure the Charge force (repulsion)
            const chargeForce = fg.d3Force('charge') as ForceManyBody<NodeObject>;
            chargeForce.strength(-250); // Increased repulsion

            // 3. Add or configure the Collision force
            const collideForce = forceCollide()
                .radius((node: any) => Math.sqrt(node.val as number) * 3)
                .strength(1);
            fg.d3Force('collide', collideForce);

            // 4. Ensure the graph is centered
            fg.d3Force('center', forceCenter());
        }
    }, []); // Run this effect only once on mount

    // Memoize neighbor data for performance
    const nodeNeighbors = useMemo(() => {
        const neighbors = new Map<string, Set<string>>();
        data.links.forEach(link => {
            const sourceId = link.source;
            const targetId = link.target;

            if (!neighbors.has(sourceId)) neighbors.set(sourceId, new Set());
            if (!neighbors.has(targetId)) neighbors.set(targetId, new Set());

            neighbors.get(sourceId)?.add(targetId);
            neighbors.get(targetId)?.add(sourceId);
        });
        return neighbors;
    }, [data.links]);

    // Handle node hover
    const handleNodeHover = (node: NodeObject | null) => {
        if (node) {
            const newHighlightedNodes = new Set<string>();
            newHighlightedNodes.add(node.id as string);
            nodeNeighbors.get(node.id as string)?.forEach(neighborId => {
                newHighlightedNodes.add(neighborId);
            });

            const newHighlightedLinks = new Set<LinkObject>();
            data.links.forEach(link => {
                const sourceId = link.source;
                const targetId = link.target;

                if (node.id === sourceId || node.id === targetId) {
                    newHighlightedLinks.add(link);
                }
            });
            setHoveredNode(node.id as string);
            setHighlightedNodes(newHighlightedNodes);
            setHighlightedLinks(newHighlightedLinks);
        } else {
            setHoveredNode(null);
            setHighlightedNodes(new Set());
            setHighlightedLinks(new Set());
        }
    };

    const handleNodeClick = (node: NodeObject) => {
        if (node.id) {
            navigate(`/nexus/notes/${node.id}`);
        }
    };

    return (
        fgRef &&
        <ForceGraph2D
            ref={fgRef}
            graphData={data}
            nodeVal="val"
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            // Dynamic link styling
            linkColor={(link) => highlightedLinks.has(link) ? 'rgba(255, 100, 100, 0.8)' : 'rgba(150, 150, 150, 0.2)'}
            linkWidth={(link) => highlightedLinks.has(link) ? 1.5 : 0.5}
            // Dynamic node styling
            nodeColor={(node) => {
                if (hoveredNode === node.id) return 'rgba(255, 100, 100, 1)'; // Main hovered node
                if (highlightedNodes.size > 0 && !highlightedNodes.has(node.id as string)) return 'rgba(100, 100, 100, 0.3)'; // Dimmed nodes
                return node.color as string; // Default or neighbor color
            }}
            // Control label rendering
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node, ctx, globalScale) => {
                const typedNode = node as GraphVizNode;
                const labelVisibilityThreshold = 0.7;

                // Show label only when zoomed in
                if (globalScale > labelVisibilityThreshold) {
                    const label = typedNode.name;
                    const fontSize = 10 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = theme === 'light' ? 'black' : 'rgba(255, 255, 255, 0.9)';
                    const yOffset = Math.sqrt(typedNode.val as number) * 3 + 3;
                    ctx.fillText(label, typedNode.x || 0, (typedNode.y || 0) + yOffset);
                }
            }}
        />
    );
};

export default NexusGraph;