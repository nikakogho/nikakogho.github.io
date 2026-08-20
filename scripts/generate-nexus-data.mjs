import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const nexusRoot = path.join(projectRoot, 'Nexus');
const outputDir = path.join(projectRoot, 'src', 'generated');

const WIKI_LINK_REGEX = /\[\[([^|\]]+)(?:\|[^\]]*)?\]\]/g;
const groupColors = {
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
  organizations: '#a8a8a8',
  people: '#d8d8d8',
  root: '#424242',
};

function normalizeNoteName(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9/-]+/g, '');
}

function hashToUnitInterval(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function getInitialPosition(notePath) {
  const angle = hashToUnitInterval(`${notePath}:angle`) * Math.PI * 2;
  const radius = Math.sqrt(hashToUnitInterval(`${notePath}:radius`)) * 360;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function getGroup(notePath) {
  const parts = notePath.toLowerCase().split('/');
  if (parts.length <= 1) return 'root';
  if (parts[0] === 'core' || parts[0] === 'horizon') return parts[1];
  if (parts[0] === 'organizations') return 'organizations';
  if (parts[0] === 'people') return 'people';
  return 'root';
}

function createFileTree(notes) {
  const root = { id: 'nexus', name: 'Nexus', type: 'folder', path: '', children: [] };
  const folderNodes = new Map([['', root]]);

  for (const note of [...notes].sort((a, b) => a.moduleKey.localeCompare(b.moduleKey))) {
    const relativeWithExtension = note.moduleKey.slice('/Nexus/'.length);
    const parts = relativeWithExtension.split('/');
    let parentKey = '';

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const parent = folderNodes.get(parentKey);
      if (!parent) return;

      if (isFile) {
        parent.children.push({
          id: note.fullPath,
          name: note.displayName,
          type: 'file',
          path: note.fullPath,
        });
        return;
      }

      const folderKey = parts.slice(0, index + 1).join('/');
      if (!folderNodes.has(folderKey)) {
        const folder = {
          id: normalizeNoteName(folderKey),
          name: part,
          type: 'folder',
          path: normalizeNoteName(folderKey),
          children: [],
        };
        parent.children.push(folder);
        folderNodes.set(folderKey, folder);
      }
      parentKey = folderKey;
    });
  }

  const sortChildren = (node) => {
    node.children?.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children?.forEach(sortChildren);
  };
  sortChildren(root);
  return root;
}

function resolveWikiLink(name, noteByPath, notesByBaseName) {
  const normalized = normalizeNoteName(name);
  const baseMatches = notesByBaseName.get(normalized) ?? [];
  if (baseMatches.length === 1) return baseMatches[0].fullPath;
  return noteByPath.has(normalized) ? normalized : null;
}

function generateGraph(notes, contentByModuleKey) {
  const noteByPath = new Map(notes.map((note) => [note.fullPath, note]));
  const notesByBaseName = new Map();
  for (const note of notes) {
    const matches = notesByBaseName.get(note.baseName) ?? [];
    matches.push(note);
    notesByBaseName.set(note.baseName, matches);
  }

  const linkCounts = new Map(notes.map((note) => [note.fullPath, 0]));
  const uniqueLinks = new Set();
  const links = [];

  for (const note of notes) {
    const content = contentByModuleKey.get(note.moduleKey) ?? '';
    for (const match of content.matchAll(WIKI_LINK_REGEX)) {
      const noteName = match[1].split('#', 1)[0].trim();
      if (!noteName) continue;
      const targetPath = resolveWikiLink(noteName, noteByPath, notesByBaseName);
      if (!targetPath || targetPath === note.fullPath) continue;

      const key = [note.fullPath, targetPath].sort().join('\u0000');
      if (uniqueLinks.has(key)) continue;
      uniqueLinks.add(key);
      links.push({ source: note.fullPath, target: targetPath });
      linkCounts.set(note.fullPath, (linkCounts.get(note.fullPath) ?? 0) + 1);
      linkCounts.set(targetPath, (linkCounts.get(targetPath) ?? 0) + 1);
    }
  }

  const nodes = notes.map((note) => {
    const group = getGroup(note.fullPath);
    const connections = linkCounts.get(note.fullPath) ?? 0;
    return {
      id: note.fullPath,
      name: note.displayName,
      val: 1 + Math.log1p(connections) * 2,
      color: groupColors[group] ?? groupColors.root,
      group,
      ...getInitialPosition(note.fullPath),
    };
  });

  return { nodes, links };
}

async function writeJson(fileName, value) {
  const target = path.join(outputDir, fileName);
  await fs.writeFile(target, `${JSON.stringify(value)}\n`, 'utf8');
  return path.relative(projectRoot, target);
}

async function main() {
  const files = await glob('**/*.md', { cwd: nexusRoot, nodir: true, posix: true });
  const contentByModuleKey = new Map();
  const notes = [];

  for (const relativePath of files) {
    const normalizedRelativePath = relativePath.replace(/\\/g, '/');
    const displayName = path.posix.basename(normalizedRelativePath, '.md');
    const pathWithoutExtension = normalizedRelativePath.slice(0, -3);
    const moduleKey = `/Nexus/${normalizedRelativePath}`;
    notes.push({
      fullPath: normalizeNoteName(pathWithoutExtension),
      baseName: normalizeNoteName(displayName),
      displayName,
      moduleKey,
    });
    contentByModuleKey.set(
      moduleKey,
      await fs.readFile(path.join(nexusRoot, ...normalizedRelativePath.split('/')), 'utf8'),
    );
  }

  notes.sort((a, b) => a.displayName.localeCompare(b.displayName));
  await fs.mkdir(outputDir, { recursive: true });
  const metadataPath = await writeJson('nexus-index.json', {
    notes,
    fileTree: createFileTree(notes),
  });
  const graph = generateGraph(notes, contentByModuleKey);
  const graphPath = await writeJson('nexus-graph.json', graph);
  console.log(`Generated ${metadataPath} and ${graphPath} (${notes.length} notes, ${graph.links.length} links).`);
}

await main();
