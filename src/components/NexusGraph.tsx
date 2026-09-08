import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { FiArrowUpRight, FiMaximize2, FiMinus, FiPlus, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getGraphLegendItems, GraphData, graphGroupStyles } from '../utils/graphHelper';
import './NexusGraph.css';

interface MapNode extends NodeObject {
  id: string; name: string; val: number; group: string; color: string; x: number; y: number;
}
interface MapLink { source: string | MapNode; target: string | MapNode }
const endpoint = (value: string | MapNode) => typeof value === 'string' ? value : value.id;
const palette: Record<string, string> = {
  neuroscience: '#dba1cb', biology: '#a8c88b', chemistry: '#82c9bc', ai: '#a3b3ed',
  physics: '#e89b86', maths: '#ddd6c5', neurotech: '#b7a1da', bioengineering: '#c0c78d',
  robots: '#e3ba7f', 'space-tech': '#d994a3', nanotech: '#e0d483', 'computer-science': '#88b3c2',
  people: '#c2c4cd', ui: '#b6a3b8', organizations: '#93969f', root: '#787e89',
};
const domainName = (group: string) => graphGroupStyles.find(item => item.id === group)?.label ?? group;

export default function NexusGraph({ data }: { data: GraphData }) {
  const container = useRef<HTMLDivElement>(null);
  const graph = useRef<ForceGraphMethods<MapNode, MapLink> | undefined>(undefined);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [localOnly, setLocalOnly] = useState(false);
  const [showPanel, setShowPanel] = useState(() => window.innerWidth > 760);
  const [ready, setReady] = useState(false);
  const labelBoxes = useRef<{ x: number; y: number; w: number; h: number }[]>([]);
  // The canvas library mutates input; preserve the cached JSON for return visits.
  const map = useMemo(() => ({
    nodes: data.nodes.map(node => ({ ...node, color: palette[node.group] ?? palette.root })),
    links: data.links.map(link => ({ ...link })) as MapLink[],
  }), [data]);
  const byId = useMemo(() => new Map(map.nodes.map(node => [node.id, node])), [map]);
  const neighbors = useMemo(() => {
    const result = new Map<string, Set<string>>();
    for (const link of data.links) {
      if (!result.has(link.source)) result.set(link.source, new Set());
      if (!result.has(link.target)) result.set(link.target, new Set());
      result.get(link.source)!.add(link.target); result.get(link.target)!.add(link.source);
    }
    return result;
  }, [data]);
  const legend = useMemo(() => getGraphLegendItems(data.nodes), [data]);
  const selectedNode = selected ? byId.get(selected) : undefined;
  const active = hovered ?? selected;
  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return map.nodes.filter(node => (!domain || node.group === domain) && (!term || node.name.toLocaleLowerCase().includes(term)))
      .sort((a, b) => (neighbors.get(b.id)?.size ?? 0) - (neighbors.get(a.id)?.size ?? 0));
  }, [map, query, domain, neighbors]);
  const matchIds = useMemo(() => new Set(matches.map(node => node.id)), [matches]);
  const related = useMemo(() => selected ? [...(neighbors.get(selected) ?? [])]
    .map(id => byId.get(id)!).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)) : [], [selected, neighbors, byId]);
  const visible = useCallback((node: MapNode) => !localOnly || !selected || node.id === selected || !!neighbors.get(selected)?.has(node.id), [localOnly, selected, neighbors]);
  const bright = (node: MapNode) => matchIds.has(node.id) && (!active || node.id === active || !!neighbors.get(active)?.has(node.id));

  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.floor(entry.contentRect.width), height: Math.floor(entry.contentRect.height) }));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const fit = useCallback((duration = 350) => {
    graph.current?.zoomToFit(duration, 35, node => visible(node) && (!domain || node.group === domain) && (!query.trim() || matchIds.has(node.id)));
  }, [visible, domain, query, matchIds]);
  useEffect(() => {
    if (!size.width || !graph.current) return;
    const frame = requestAnimationFrame(() => {
      if (selectedNode) {
        graph.current?.centerAt(selectedNode.x, selectedNode.y, 350);
        graph.current?.zoom(Math.max(graph.current.zoom(), 1.15), 350);
      } else graph.current?.zoomToFit(0, 35);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [size, selectedNode]);
  const selectNote = (node: MapNode) => {
    setSelected(node.id); setHovered(null); setShowPanel(true); setQuery(''); setDomain(null);
  };
  const reset = () => {
    setQuery(''); setDomain(null); setSelected(null); setHovered(null); setLocalOnly(false);
    graph.current?.zoomToFit(450, 35);
  };

  return <section className="knowledge-map" aria-label="Nexus knowledge graph" data-layout-ready={ready}>
    <header className="knowledge-map__bar">
      <div className="knowledge-map__identity"><span className="knowledge-map__mark" aria-hidden="true">✳</span><h1>Nexus</h1><span>A web of knowledge</span></div>
      <button onClick={() => setShowPanel(value => !value)} aria-expanded={showPanel} aria-controls="map-explorer"><FiSliders /> Explore</button>
    </header>
    <div className={`knowledge-map__workspace${showPanel ? ' has-explorer' : ''}`}>
      <div className="knowledge-map__stage" ref={container}>
        {size.width > 0 && size.height > 0 && <ForceGraph2D<MapNode, MapLink>
          ref={graph} width={size.width} height={size.height} graphData={map}
          backgroundColor="#191c22" warmupTicks={0} cooldownTicks={0} minZoom={0.12} maxZoom={8}
          nodeLabel={() => ''} nodeVisibility={visible}
          linkVisibility={link => visible(byId.get(endpoint(link.source))!) && visible(byId.get(endpoint(link.target))!)}
          onNodeHover={node => { setHovered(node?.id ?? null); if (container.current) container.current.style.cursor = node ? 'pointer' : 'grab'; }}
          onNodeClick={selectNote} onBackgroundClick={() => { setSelected(null); setLocalOnly(false); }}
          onNodeDragEnd={node => { node.fx = node.x; node.fy = node.y; }}
          linkColor={link => {
            const a = endpoint(link.source), b = endpoint(link.target);
            if (active) return (a === active || b === active) ? '#a8b5d1aa' : '#727e9114';
            return matchIds.has(a) && matchIds.has(b) ? '#8390a139' : '#727e9110';
          }}
          linkWidth={link => active && (endpoint(link.source) === active || endpoint(link.target) === active) ? 1.25 : 0.55}
          onRenderFramePre={() => { labelBoxes.current = []; }}
          nodeCanvasObject={(node, ctx, scale) => {
            const isActive = node.id === active, isBright = bright(node);
            const radius = Math.max(1.35 / scale, 2 + Math.sqrt(node.val) * 1.15);
            ctx.globalAlpha = isBright ? 1 : 0.17;
            if (isActive) { ctx.beginPath(); ctx.arc(node.x, node.y, radius + 4 / scale, 0, Math.PI * 2); ctx.strokeStyle = node.color; ctx.lineWidth = 1 / scale; ctx.stroke(); }
            ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, Math.PI * 2); ctx.fillStyle = node.color; ctx.fill(); ctx.globalAlpha = 1;
            const showLabel = isBright && (isActive || (active && neighbors.get(active)?.has(node.id)) || (query.trim() && matchIds.has(node.id)) || scale > 2.4 || (node.val > 8 && scale > 0.45));
            if (!showLabel) return;
            const fontSize = (isActive ? 13 : 11) / scale;
            const text = node.name.length > 42 ? node.name.slice(0, 40) + '…' : node.name;
            ctx.font = `${isActive ? 600 : 400} ${fontSize}px system-ui, sans-serif`;
            const width = ctx.measureText(text).width;
            const x = node.x + radius + 5 / scale, y = node.y - fontSize / 2;
            const box = { x, y, w: width + 6 / scale, h: fontSize + 5 / scale };
            if (!isActive && labelBoxes.current.some(b => box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y)) return;
            labelBoxes.current.push(box); ctx.fillStyle = '#191c22e8'; ctx.fillRect(x - 2 / scale, y - 2 / scale, box.w, box.h);
            ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = isActive ? '#fff' : '#c6cbd4'; ctx.fillText(text, x, y);
          }}
          nodePointerAreaPaint={(node, color, ctx) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI); ctx.fill(); }}
        />}
        <div className="knowledge-map__caption"><span>{localOnly && selectedNode ? selectedNode.name : domain ? domainName(domain) : 'Explore the connections.'}</span><small>{data.nodes.length.toLocaleString()} notes · {data.links.length.toLocaleString()} connections</small></div>
        <div className="knowledge-map__navigation">
          <button aria-label="Zoom in" onClick={() => graph.current?.zoom((graph.current?.zoom() ?? 1) * 1.4, 250)}><FiPlus /></button>
          <button aria-label="Zoom out" onClick={() => graph.current?.zoom((graph.current?.zoom() ?? 1) / 1.4, 250)}><FiMinus /></button>
          <button aria-label="Fit graph" onClick={() => fit()}><FiMaximize2 /></button>
        </div>
        <p className="knowledge-map__hint">Drag to move · Scroll to zoom · Click a note to explore</p>
      </div>
      {showPanel && <aside className="knowledge-map__explorer" id="map-explorer">
        <label className="knowledge-map__search"><FiSearch /><input aria-label="Find a note" placeholder="Find a note…" value={query} onChange={event => { setQuery(event.target.value); setSelected(null); setLocalOnly(false); }} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><FiX /></button>}</label>
        {selectedNode && !query ? <>
          <div className="knowledge-map__section-label"><span>{domainName(selectedNode.group)}</span><button aria-label="Clear selected note" onClick={() => { setSelected(null); setLocalOnly(false); }}><FiX /></button></div>
          <h2>{selectedNode.name}</h2>
          <Link className="knowledge-map__open" to={`/nexus/notes/${selectedNode.id}`}>Read note <FiArrowUpRight /></Link>
          <label className="knowledge-map__toggle"><input type="checkbox" checked={localOnly} onChange={event => setLocalOnly(event.target.checked)} /> Only this neighborhood</label>
          <div className="knowledge-map__section-label">Connected notes <span>{related.length}</span></div>
          <div className="knowledge-map__results">{related.map(node => <button key={node.id} onClick={() => selectNote(node)}><i style={{ background: node.color }} />{node.name}<FiArrowUpRight /></button>)}{!related.length && <p>This note has no links yet. Its next connection starts a new path.</p>}</div>
        </> : query.trim() ? <>
          <div className="knowledge-map__section-label">Matching notes <span>{matches.length}</span></div>
          <div className="knowledge-map__results">{matches.slice(0, 50).map(node => <button key={node.id} onClick={() => selectNote(node)}><i style={{ background: node.color }} /><span>{node.name}<small>{domainName(node.group)}</small></span><FiArrowUpRight /></button>)}{!matches.length && <p>No notes found. Try a shorter name or clear the domain filter.</p>}</div>
        </> : <>
          <div className="knowledge-map__intro"><h2>Follow your curiosity.</h2><p>Pick a note to see what it connects to. Each color is a different field of study.</p></div>
          <div className="knowledge-map__section-label">Domains {domain && <button onClick={() => setDomain(null)}>Show all</button>}</div>
          <div className="knowledge-map__domains">{legend.map(item => <button key={item.id} aria-pressed={domain === item.id} onClick={() => setDomain(domain === item.id ? null : item.id)}><i style={{ background: palette[item.id] }} /><span>{item.label}</span><small>{item.count}</small></button>)}</div>
          {domain && <button className="knowledge-map__domain-fit" onClick={() => fit()}>Bring {domainName(domain).toLowerCase()} into view <FiMaximize2 /></button>}
        </>}
        <button className="knowledge-map__reset" onClick={reset}>Back to the whole map</button>
      </aside>}
    </div>
  </section>;
}
