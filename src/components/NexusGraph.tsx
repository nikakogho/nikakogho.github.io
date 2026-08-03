import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import {
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  ForceLink,
  ForceManyBody,
  SimulationLinkDatum,
} from 'd3-force';
import { FiMap, FiMaximize2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { GraphData, graphGroupStyles } from '../utils/graphHelper';

interface GraphVizNode extends NodeObject {
  id: string;
  name: string;
  val: number;
  color: string;
  group: string;
}

interface GraphVizLink extends SimulationLinkDatum<GraphVizNode> {
  source: string | number | GraphVizNode;
  target: string | number | GraphVizNode;
}

interface GraphSize {
  width: number;
  height: number;
}

function getNodeId(endpoint: GraphVizLink['source']): string {
  if (typeof endpoint === 'object') return endpoint.id;
  return String(endpoint);
}

const NexusGraph = ({ data }: { data: GraphData }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods<GraphVizNode, GraphVizLink> | undefined>(undefined);
  const [size, setSize] = useState<GraphSize>({ width: 0, height: 0 });
  const [layoutReady, setLayoutReady] = useState(false);
  const [showLegend, setShowLegend] = useState(() => (
    typeof window === 'undefined' || window.matchMedia('(min-width: 769px)').matches
  ));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<GraphVizLink>>(new Set());

  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    (data.links as GraphVizLink[]).forEach((link) => {
      ids.add(getNodeId(link.source));
      ids.add(getNodeId(link.target));
    });
    return ids;
  }, [data.links]);

  const legendItems = useMemo(() => {
    const groupCounts = new Map<string, number>();
    data.nodes.forEach((node) => {
      groupCounts.set(node.group, (groupCounts.get(node.group) ?? 0) + 1);
    });

    return graphGroupStyles
      .filter(({ id }) => groupCounts.has(id))
      .map((style) => ({ ...style, count: groupCounts.get(style.id) ?? 0 }));
  }, [data.nodes]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const nextSize = {
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height)),
      };
      setSize((current) => (
        current.width === nextSize.width && current.height === nextSize.height ? current : nextSize
      ));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const fitGraph = useCallback((duration = 350) => {
    const padding = size.width < 600 ? 18 : 24;
    fgRef.current?.zoomToFit(duration, padding, (node) => connectedNodeIds.has(node.id));
  }, [connectedNodeIds, size.width]);

  useEffect(() => {
    const graph = fgRef.current;
    if (!graph || size.width === 0 || size.height === 0) return;

    const linkForce = graph.d3Force('link') as ForceLink<GraphVizNode, GraphVizLink> | undefined;
    linkForce
      ?.id((node) => node.id)
      .distance(42)
      .strength(0.22);

    const chargeForce = graph.d3Force('charge') as ForceManyBody<GraphVizNode> | undefined;
    chargeForce
      ?.strength((node) => -16 - Math.min(node.val, 8) * 1.5)
      .distanceMax(220);

    graph.d3Force(
      'collide',
      forceCollide<GraphVizNode>()
        .radius((node) => Math.sqrt(node.val) * 2.5 + 0.25)
        .strength(0.2)
        .iterations(1),
    );
    graph.d3Force('center', forceCenter<GraphVizNode>(0, 0));
    graph.d3Force('x', forceX<GraphVizNode>(0).strength(0.032));
    graph.d3Force('y', forceY<GraphVizNode>(0).strength(0.032));

    setLayoutReady(false);
    graph.d3ReheatSimulation();

    const earlyFit = window.setTimeout(() => fitGraph(0), 250);
    const settledFit = window.setTimeout(() => {
      fitGraph(0);
      setLayoutReady(true);
    }, 2200);

    return () => {
      window.clearTimeout(earlyFit);
      window.clearTimeout(settledFit);
    };
  }, [data.links.length, data.nodes.length, fitGraph, size.height, size.width]);

  const nodeNeighbors = useMemo(() => {
    const neighbors = new Map<string, Set<string>>();
    (data.links as GraphVizLink[]).forEach((link) => {
      const sourceId = getNodeId(link.source);
      const targetId = getNodeId(link.target);

      if (!neighbors.has(sourceId)) neighbors.set(sourceId, new Set());
      if (!neighbors.has(targetId)) neighbors.set(targetId, new Set());

      neighbors.get(sourceId)?.add(targetId);
      neighbors.get(targetId)?.add(sourceId);
    });
    return neighbors;
  }, [data.links]);

  const handleNodeHover = (node: GraphVizNode | null) => {
    if (!node) {
      setHoveredNode(null);
      setHighlightedNodes(new Set());
      setHighlightedLinks(new Set());
      return;
    }

    const nextHighlightedNodes = new Set<string>([node.id]);
    nodeNeighbors.get(node.id)?.forEach((neighborId) => nextHighlightedNodes.add(neighborId));

    const nextHighlightedLinks = new Set<GraphVizLink>();
    (data.links as GraphVizLink[]).forEach((link) => {
      if (getNodeId(link.source) === node.id || getNodeId(link.target) === node.id) {
        nextHighlightedLinks.add(link);
      }
    });

    setHoveredNode(node.id);
    setHighlightedNodes(nextHighlightedNodes);
    setHighlightedLinks(nextHighlightedLinks);
  };

  const graphBackground = '#191919';
  const quietLinkColor = 'rgba(148, 148, 148, 0.23)';

  return (
    <section
      className="nexus-graph-panel"
      aria-label="Interactive Nexus knowledge graph"
      data-layout-ready={layoutReady}
    >
      <div className="nexus-graph-toolbar">
        <p>
          <strong>{data.nodes.length}</strong> notes
          <span aria-hidden="true">·</span>
          <strong>{data.links.length}</strong> connections
        </p>
        <div className="nexus-graph-toolbar__actions">
          <button
            type="button"
            aria-expanded={showLegend}
            aria-controls="nexus-graph-legend"
            onClick={() => setShowLegend((isVisible) => !isVisible)}
          >
            <FiMap aria-hidden="true" /> Legend
          </button>
          <button type="button" onClick={() => fitGraph()}>
            <FiMaximize2 aria-hidden="true" /> Fit graph
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="nexus-graph-canvas"
        role="application"
        aria-label="Drag to pan, scroll to zoom, and select a node to open its note"
      >
        {size.width > 0 && size.height > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.width}
            height={size.height}
            graphData={data}
            backgroundColor={graphBackground}
            nodeVal="val"
            nodeRelSize={1.65}
            nodeLabel={(node) => `${node.name} · ${node.group}`}
            minZoom={0.18}
            maxZoom={12}
            warmupTicks={160}
            cooldownTicks={360}
            cooldownTime={8000}
            d3AlphaDecay={0.018}
            d3VelocityDecay={0.34}
            onEngineStop={() => {
              fitGraph(0);
              setLayoutReady(true);
            }}
            onNodeClick={(node) => navigate(`/nexus/notes/${node.id}`)}
            onNodeHover={handleNodeHover}
            linkColor={(link) => highlightedLinks.has(link) ? 'rgba(248, 113, 113, 0.9)' : quietLinkColor}
            linkWidth={(link) => highlightedLinks.has(link) ? 1.8 : 0.65}
            nodeColor={(node) => {
              if (hoveredNode === node.id) return '#f87171';
              if (highlightedNodes.size > 0 && !highlightedNodes.has(node.id)) {
                return 'rgba(100, 100, 100, 0.2)';
              }
              return node.color;
            }}
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node, context, globalScale) => {
              const isFocused = hoveredNode === node.id || highlightedNodes.has(node.id);
              const isHub = node.val >= 8.5;
              const shouldShowLabel = isFocused || (isHub && globalScale > 1.6) || globalScale > 3;
              if (!shouldShowLabel) return;

              const fontSize = (isFocused ? 11 : 9) / globalScale;
              const label = node.name;
              const x = node.x ?? 0;
              const y = (node.y ?? 0) + Math.sqrt(node.val) * 1.65 + 4 / globalScale;
              context.font = `${isFocused ? 600 : 500} ${fontSize}px Sans-Serif`;
              context.textAlign = 'center';
              context.textBaseline = 'top';

              const textWidth = context.measureText(label).width;
              const padding = 2.5 / globalScale;
              context.fillStyle = 'rgba(25, 25, 25, 0.88)';
              context.fillRect(x - textWidth / 2 - padding, y - padding, textWidth + padding * 2, fontSize + padding * 2);
              context.fillStyle = '#f2f2f2';
              context.fillText(label, x, y);
            }}
          />
        )}

        {showLegend && (
          <aside
            id="nexus-graph-legend"
            className="nexus-graph-legend"
            aria-label="Graph color legend"
          >
            <div className="nexus-graph-legend__header">
              <div>
                <span>Color key</span>
                <h2>Domains</h2>
              </div>
              <button type="button" aria-label="Close graph legend" onClick={() => setShowLegend(false)}>
                <FiX aria-hidden="true" />
              </button>
            </div>
            <ul>
              {legendItems.map(({ id, label, color, count }) => (
                <li key={id}>
                  <span
                    className="nexus-graph-legend__swatch"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                  <small aria-label={`${count} ${count === 1 ? 'note' : 'notes'}`}>{count}</small>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <p className="nexus-graph-hint">Scroll to zoom · Drag to pan · Select a node to open it</p>
      </div>
    </section>
  );
};

export default NexusGraph;
