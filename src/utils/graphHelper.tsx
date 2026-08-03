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

type Group = 'root' | 'biology' | 'chemistry' | 'physics' | 'maths' | 'ai' | 'neuroscience' | 'neurotech' | 'bioengineering' | 'robots' | 'space-tech' | 'nanotech' | 'ui' | 'computer-science' | 'organizations' | 'people';

const groupColors: Record<Group, string> = {
    biology: '#20f318',
    chemistry: '#56d9d4',
    physics: '#ff1717',
    maths: '#f4f4f4',
    ai: '#1b2cff',
    neuroscience: '#dc4eaa',
    neurotech: '#ad48d8',
    bioengineering: '#527527',
    robots: '#f58a0b',
    'space-tech': '#e95858',
    nanotech: '#ffd60a',
    ui: '#a900ee',
    'computer-science': '#090909',
    root: '#424242',
    organizations: '#a8a8a8',
    people: '#d8d8d8',
};

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

function getGroupColor(group: Group): string {
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
            groups[group] = getGroupColor(group as Group);
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
