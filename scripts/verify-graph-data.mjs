import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({
  appType: 'custom',
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { hmr: false, middlewareMode: true },
});

try {
  const { generateGraphData } = await vite.ssrLoadModule('/src/utils/graphHelper.tsx');

  const notes = [
    {
      fullPath: 'horizon/ai/alpha',
      baseName: 'alpha',
      displayName: 'Alpha',
      moduleKey: '/Nexus/Horizon/AI/Alpha.md',
    },
    {
      fullPath: 'horizon/ai/beta',
      baseName: 'beta',
      displayName: 'Beta',
      moduleKey: '/Nexus/Horizon/AI/Beta.md',
    },
    {
      fullPath: 'people/gamma',
      baseName: 'gamma',
      displayName: 'Gamma',
      moduleKey: '/Nexus/People/Gamma.md',
    },
  ];

  const content = {
    '/Nexus/Horizon/AI/Alpha.md': '[[Beta]] appears twice: [[Beta#Details]]. Self-link: [[Alpha]].',
    '/Nexus/Horizon/AI/Beta.md': 'The reverse link [[Alpha]] should not create another edge.',
    '/Nexus/People/Gamma.md': 'An isolated note is still part of the global graph.',
  };

  const graph = generateGraphData(notes, content);

  assert.equal(graph.nodes.length, 3, 'Every note should appear in the graph');
  assert.equal(graph.links.length, 1, 'Repeated, reverse, and self-links should be collapsed');
  assert.deepEqual(graph.links[0], {
    source: 'horizon/ai/alpha',
    target: 'horizon/ai/beta',
  });
  assert.equal(graph.nodes.find((node) => node.id === 'horizon/ai/alpha')?.group, 'ai');
  assert.equal(graph.nodes.find((node) => node.id === 'people/gamma')?.group, 'people');
  assert.match(
    graph.nodes.find((node) => node.id === 'horizon/ai/alpha')?.color ?? '',
    /^#[0-9a-f]{6}$/i,
    'Graph colors should be valid hex colors',
  );

  console.log('Nexus graph data verification passed.');
} finally {
  await vite.close();
}
