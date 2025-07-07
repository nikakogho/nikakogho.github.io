import { VaultNote, resolveWikiLink } from './markdownHelper';

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
    "biology": "green",
    "chemistry": "cyan",
    "physics": "red",
    "maths": "white",
    "ai": "blue",
    "neuroscience": "pink",
    "neurotech": "purple",
    "bioengineering": "00aa00",
    "robots": "orange",
    "space-tech": "#E05252",
    "ui": "purple",
    "root": "white",
    "organizations": "gray",
    "people": "yellow",
};

function getGroup(notePath: string): string {
    const parts = notePath.toLowerCase().split('/');

    console.log(parts);

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

    notes.forEach(note => {
        linkCounts[note.fullPath] = 0;
    });

    notes.forEach(note => {
        const content = contentMap[note.moduleKey] || '';
        const matches = [...content.matchAll(WIKI_LINK_REGEX)];

        if (matches.length > 0) {
            matches.forEach(match => {
                const linkName = match[1];
                const resolvedPath = resolveWikiLink(linkName, notes);
                const targetNote = notes.find(n => n.fullPath === resolvedPath);

                if (targetNote) {
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