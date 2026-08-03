import { parseWikiLinkTarget, VaultNote, resolveWikiLink } from './markdownHelper';

export interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  group: string;
  x: number;
  y: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const WIKI_LINK_REGEX = /\[\[([^|\]]+)(?:\|[^\]]*)?\]\]/g;

export type GraphGroup = 'root' | 'biology' | 'chemistry' | 'physics' | 'maths' | 'ai' | 'neuroscience' | 'neurotech' | 'bioengineering' | 'robots' | 'space-tech' | 'nanotech' | 'ui' | 'computer-science' | 'organizations' | 'people';

export interface GraphGroupStyle {
    id: GraphGroup;
    label: string;
    color: string;
    includeInLegend: boolean;
}

export const graphGroupStyles = [
    { id: 'biology', label: 'Biology', color: '#20f318', includeInLegend: true },
    { id: 'chemistry', label: 'Chemistry', color: '#56d9d4', includeInLegend: true },
    { id: 'physics', label: 'Physics', color: '#ff1717', includeInLegend: true },
    { id: 'maths', label: 'Mathematics', color: '#f4f4f4', includeInLegend: true },
    { id: 'ai', label: 'Artificial intelligence', color: '#1b2cff', includeInLegend: true },
    { id: 'neuroscience', label: 'Neuroscience', color: '#dc4eaa', includeInLegend: true },
    { id: 'neurotech', label: 'Neurotechnology', color: '#ad48d8', includeInLegend: true },
    { id: 'bioengineering', label: 'Bioengineering', color: '#527527', includeInLegend: true },
    { id: 'robots', label: 'Robotics', color: '#f58a0b', includeInLegend: true },
    { id: 'space-tech', label: 'Space technology', color: '#e95858', includeInLegend: true },
    { id: 'nanotech', label: 'Nanotechnology', color: '#ffd60a', includeInLegend: true },
    { id: 'ui', label: 'UI & design', color: '#a900ee', includeInLegend: false },
    { id: 'computer-science', label: 'Computer science', color: '#090909', includeInLegend: true },
    { id: 'organizations', label: 'Organizations', color: '#a8a8a8', includeInLegend: false },
    { id: 'people', label: 'People', color: '#d8d8d8', includeInLegend: true },
    { id: 'root', label: 'General notes', color: '#424242', includeInLegend: false },
] as const satisfies readonly GraphGroupStyle[];

const groupColors = Object.fromEntries(
    graphGroupStyles.map(({ id, color }) => [id, color]),
) as Record<GraphGroup, string>;

export function getGraphLegendItems(nodes: readonly Pick<GraphNode, 'group'>[]) {
    const groupCounts = new Map<string, number>();
    nodes.forEach((node) => {
        groupCounts.set(node.group, (groupCounts.get(node.group) ?? 0) + 1);
    });

    return graphGroupStyles
        .filter(({ id, includeInLegend }) => includeInLegend && groupCounts.has(id))
        .map((style) => ({ ...style, count: groupCounts.get(style.id) ?? 0 }))
        .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label));
}

function hashToUnitInterval(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
}

function getInitialPosition(notePath: string): { x: number; y: number } {
    const angle = hashToUnitInterval(`${notePath}:angle`) * Math.PI * 2;
    const radius = Math.sqrt(hashToUnitInterval(`${notePath}:radius`)) * 360;
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
    };
}

function getGroup(notePath: string): string {
    const parts = notePath.toLowerCase().split('/');

    if (parts.length <= 1) return 'root';

    if (parts[0] == 'core') return parts[1];
    if (parts[0] == 'horizon') return parts[1];
    if (parts[0] == 'organizations') return 'organizations';
    if (parts[0] == 'people') return 'people';

    return 'root';
}

function getGroupColor(group: GraphGroup): string {
    if (group in groupColors) {
        return groupColors[group];
    }

    return '#424242';
}

export function generateGraphData(
    notes: VaultNote[],
    contentMap: Record<string, string>
): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const linkCounts: Record<string, number> = {};
    const uniqueLinks = new Set<string>();

    notes.forEach(note => {
        linkCounts[note.fullPath] = 0;
    });

    notes.forEach(note => {
        const content = contentMap[note.moduleKey] || '';
        const matches = [...content.matchAll(WIKI_LINK_REGEX)];

        if (matches.length > 0) {
            matches.forEach(match => {
                const { noteName } = parseWikiLinkTarget(match[1]);
                if (!noteName) return;

                const resolvedPath = resolveWikiLink(noteName, notes, false);
                const targetNote = notes.find(n => n.fullPath === resolvedPath);

                if (targetNote && targetNote.fullPath !== note.fullPath) {
                    const linkKey = [note.fullPath, targetNote.fullPath].sort().join('\u0000');
                    if (uniqueLinks.has(linkKey)) return;

                    uniqueLinks.add(linkKey);
                    links.push({ source: note.fullPath, target: targetNote.fullPath });
                    linkCounts[note.fullPath]++;
                    linkCounts[targetNote.fullPath]++;
                }
            });
        }
    });

    const groups: Record<string, string> = {};
    notes.forEach(note => {
        const group = getGroup(note.fullPath).toLowerCase();
        
        if (!groups[group]) {
            groups[group] = getGroupColor(group as GraphGroup);
        }

        const connections = linkCounts[note.fullPath] || 0;
        const nodeSize = 1 + Math.log1p(connections) * 2;
        const initialPosition = getInitialPosition(note.fullPath);

        nodes.push({
            id: note.fullPath,
            name: note.displayName,
            val: nodeSize,
            color: groups[group],
            group: group,
            ...initialPosition,
        });
    });

    return { nodes, links };
}
