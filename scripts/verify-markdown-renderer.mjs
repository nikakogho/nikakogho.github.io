import assert from 'node:assert/strict';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

const vite = await createServer({
  appType: 'custom',
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  plugins: [react()],
  resolve: {
    alias: {
      'react-router-dom': path.resolve(
        'node_modules/react-router-dom/dist/index.mjs'
      ),
      'react-router': path.resolve('node_modules/react-router/dist/development/index.mjs'),
    },
  },
  server: { hmr: false, middlewareMode: true },
});

try {
  const { MemoryRouter } = await vite.ssrLoadModule(
    '/node_modules/react-router-dom/dist/index.mjs'
  );
  const { default: MarkdownRenderer } = await vite.ssrLoadModule(
    '/src/components/MarkdownRenderer.tsx'
  );

  const notes = [
    {
      fullPath: 'core/biology/cell-biology/sugar/sugar',
      baseName: 'sugar',
      displayName: 'Sugar',
      moduleKey: '/Nexus/Core/Biology/Cell Biology/sugar/Sugar.md',
    },
    {
      fullPath: 'core/biology/life/archaea',
      baseName: 'archaea',
      displayName: 'Archaea',
      moduleKey: '/Nexus/Core/Biology/Life/Archaea.md',
    },
    {
      fullPath: 'horizon/ai/neural-network/residual-network',
      baseName: 'residual-network',
      displayName: 'Residual Network',
      moduleKey: '/Nexus/Horizon/AI/Neural Network/Residual Network.md',
    },
  ];

  const markdown = String.raw`
## Polysaccharides

See [[Sugar|the sugar note]], [[Sugar#Polysaccharides|the relevant section]],
and [[#Polysaccharides|this section]]. [[Missing Note]] should remain disabled.
Spacing-tolerant section: [[Residual Network#ResidualBlock|residual blocks]].

Inline math: $S_tA_tR_{t+1}$.

![[jacob pfau.png]]
![[sensor_fusion_types.png|600]]
![[diagram.jpeg|Readable diagram]]

$$
G_t = \sum_{k=0}^{T-t-1} \gamma^k r_{t+k}
$$
`;

  const html = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/nexus/notes/core/biology/life/archaea'] },
      React.createElement(MarkdownRenderer, {
        allVaultNotes: notes,
        currentNotePath: 'core/biology/life/archaea',
        markdown,
      })
    )
  );

  assert.match(html, /id="polysaccharides"/);
  assert.match(html, /tabindex="-1"/);
  assert.match(html, /class="section-anchor"/);
  assert.match(
    html,
    /href="\/nexus\/notes\/core\/biology\/cell-biology\/sugar\/sugar"[^>]*>the sugar note<\/a>/
  );
  assert.match(
    html,
    /href="\/nexus\/notes\/core\/biology\/cell-biology\/sugar\/sugar#polysaccharides"[^>]*>the relevant section<\/a>/
  );
  assert.match(
    html,
    /href="\/nexus\/notes\/core\/biology\/life\/archaea#polysaccharides"[^>]*>this section<\/a>/
  );
  assert.match(
    html,
    /href="\/nexus\/notes\/horizon\/ai\/neural-network\/residual-network#residualblock"[^>]*>residual blocks<\/a>/
  );
  assert.match(html, /<span class="internal-link new-link">Missing Note<\/span>/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /<img src="jacob%20pfau\.png" alt="jacob pfau" loading="lazy"\/>/);
  assert.match(html, /<img src="sensor_fusion_types\.png" alt="sensor_fusion_types" loading="lazy"\/>/);
  assert.match(html, /<img src="diagram\.jpeg" alt="Readable diagram" loading="lazy"\/>/);
  assert.doesNotMatch(html, /!\[\[/, 'Obsidian image embeds should never remain visible as source text');

  console.log('Markdown renderer verification passed.');
} finally {
  await vite.close();
}
