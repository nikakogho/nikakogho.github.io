import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({
  appType: 'custom',
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { hmr: false, middlewareMode: true },
});

try {
  const { generateGraphData, graphGroupStyles } = await vite.ssrLoadModule('/src/utils/graphHelper.tsx');

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
  assert.equal(
    new Set(graphGroupStyles.map(({ id }) => id)).size,
    graphGroupStyles.length,
    'Legend domains should be unique',
  );
  graphGroupStyles.forEach(({ label, color }) => {
    assert.ok(label.length > 0, 'Every legend domain should have a readable label');
    assert.match(color, /^#[0-9a-f]{6}$/i, 'Every legend domain should have a valid hex color');
  });
  assert.equal(
    graph.nodes.find((node) => node.group === 'ai')?.color,
    graphGroupStyles.find(({ id }) => id === 'ai')?.color,
    'Legend colors and node colors should share one source of truth',
  );

  console.log('Nexus graph data verification passed.');
} finally {
  await vite.close();
}
