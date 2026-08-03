import { parseWikiLinkTarget, VaultNote, resolveWikiLink } from './markdownHelper';

export interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  group: string;
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

type Group = 'root' | 'biology' | 'chemistry' | 'physics' | 'maths' | 'ai' | 'neuroscience' | 'neurotech' | 'bioengineering' | 'robots' | 'space-tech' | 'ui' | 'organizations' | 'people';

const groupColors: Record<Group, string> = {
    biology: '#4ade80',
    chemistry: '#22d3ee',
    physics: '#fb7185',
    maths: '#e2e8f0',
    ai: '#60a5fa',
    neuroscience: '#f472b6',
    neurotech: '#c084fc',
    bioengineering: '#34d399',
    robots: '#fb923c',
    'space-tech': '#f87171',
    ui: '#a78bfa',
    root: '#cbd5e1',
    organizations: '#94a3b8',
    people: '#facc15',
};

function getGroup(notePath: string): string {
    const parts = notePath.toLowerCase().split('/');

    if (parts.length <= 1) return 'root';

    if (parts[0] == 'core') return parts[1];
    if (parts[0] == 'horizon') return parts[1];
    if (parts[0] == 'organizations') return 'organizations';
    if (parts[0] == 'people') return 'people';

    return 'root';
}

function getGroupColor(group: Group, theme: 'light' | 'dark'): string {
    if (group in groupColors) {
        return groupColors[group];
    }

    return theme === 'light' ? '#ccc' : '#333'; // Default color based on theme
}

export function generateGraphData(
    notes: VaultNote[],
    contentMap: Record<string, string>,
    theme: 'light' | 'dark'
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
            groups[group] = getGroupColor(group as Group, theme);
        }

        const connections = linkCounts[note.fullPath] || 0;
        const nodeSize = 1 + Math.log1p(connections) * 2;

        nodes.push({
            id: note.fullPath,
            name: note.displayName,
            val: nodeSize,
            color: groups[group],
            group: group,
        });
    });

    return { nodes, links };
}
