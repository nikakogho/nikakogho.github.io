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
}

export const graphGroupStyles = [
    { id: 'biology', label: 'Biology', color: '#20f318' },
    { id: 'chemistry', label: 'Chemistry', color: '#56d9d4' },
    { id: 'physics', label: 'Physics', color: '#ff1717' },
    { id: 'maths', label: 'Mathematics', color: '#f4f4f4' },
    { id: 'ai', label: 'Artificial intelligence', color: '#1b2cff' },
    { id: 'neuroscience', label: 'Neuroscience', color: '#dc4eaa' },
    { id: 'neurotech', label: 'Neurotechnology', color: '#ad48d8' },
    { id: 'bioengineering', label: 'Bioengineering', color: '#527527' },
    { id: 'robots', label: 'Robotics', color: '#f58a0b' },
    { id: 'space-tech', label: 'Space technology', color: '#e95858' },
    { id: 'nanotech', label: 'Nanotechnology', color: '#ffd60a' },
    { id: 'ui', label: 'UI & design', color: '#a900ee' },
    { id: 'computer-science', label: 'Computer science', color: '#090909' },
    { id: 'organizations', label: 'Organizations', color: '#a8a8a8' },
    { id: 'people', label: 'People', color: '#d8d8d8' },
    { id: 'root', label: 'General notes', color: '#424242' },
] as const satisfies readonly GraphGroupStyle[];

const groupColors = Object.fromEntries(
    graphGroupStyles.map(({ id, color }) => [id, color]),
) as Record<GraphGroup, string>;

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
