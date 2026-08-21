import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

const projectRoot = path.resolve(import.meta.dirname, '..');
const nexusIndex = JSON.parse(
  await fs.readFile(path.join(projectRoot, 'src/generated/nexus-index.json'), 'utf8')
);
const notes = nexusIndex.notes;
const noteByPath = new Map(notes.map((note) => [note.fullPath, note]));
const sectionLinkPattern = /(?<!!)\[\[([^\]\n|]*#[^\]\n|]+)(?:\|[^\]\n]*)?\]\]/g;

const vite = await createServer({
  appType: 'custom',
  configFile: false,
  define: {
    'import.meta.env.VITE_IMAGE_PROVIDER': JSON.stringify('cloudinary'),
    'import.meta.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify('test-cloud'),
  },
  optimizeDeps: { noDiscovery: true },
  plugins: [react()],
  resolve: {
    alias: {
      'react-router-dom': path.resolve('node_modules/react-router-dom/dist/index.mjs'),
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
  const { normalizeHeadingLookupKey, resolveWikiLinkTarget } = await vite.ssrLoadModule(
    '/src/utils/markdownHelper.tsx'
  );

  const contentByPath = new Map();
  const renderNote = async (notePath) => {
    if (!contentByPath.has(notePath)) {
      const note = noteByPath.get(notePath);
      assert(note, `Missing note metadata for ${notePath}`);
      const filePath = path.join(projectRoot, ...note.moduleKey.split('/').filter(Boolean));
      contentByPath.set(notePath, await fs.readFile(filePath, 'utf8'));
    }

    return renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: [`/nexus/notes/${notePath}`] },
        React.createElement(MarkdownRenderer, {
          allVaultNotes: notes,
          currentNotePath: notePath,
          markdown: contentByPath.get(notePath),
        })
      )
    );
  };

  let checkedLinks = 0;
  const failures = [];
  for (const sourceNote of notes) {
    const sourceContent = await fs.readFile(
      path.join(projectRoot, ...sourceNote.moduleKey.split('/').filter(Boolean)),
      'utf8'
    );
    const matches = [...sourceContent.matchAll(sectionLinkPattern)];
    if (matches.length === 0) continue;

    const sourceHtml = await renderNote(sourceNote.fullPath);
    for (const match of matches) {
      const target = resolveWikiLinkTarget(match[1], notes, sourceNote.fullPath);
      const expectedHref = `/nexus/notes/${target.notePath}#${target.anchorId}`;
      if (!sourceHtml.includes(`href="${expectedHref}"`)) {
        failures.push(
          `${sourceNote.moduleKey}: section link ${match[0]} did not preserve its fragment`
        );
      }

      const targetHtml = await renderNote(target.notePath);
      const renderedHeadingIds = [...targetHtml.matchAll(/<h[1-6][^>]*\sid="([^"]+)"/g)]
        .map((headingMatch) => headingMatch[1]);
      const requestedHeadingKey = normalizeHeadingLookupKey(target.anchorId);
      const matchingHeading = renderedHeadingIds.some(
        (headingId) => normalizeHeadingLookupKey(headingId) === requestedHeadingKey
      );
      if (!matchingHeading) {
        failures.push(
          `${sourceNote.moduleKey}: section link ${match[0]} points to a missing heading id in ${target.notePath}`
        );
      }
      checkedLinks += 1;
    }
  }

  assert(checkedLinks > 0, 'Expected at least one Nexus section link to verify');
  assert.deepEqual(failures, [], failures.join('\n'));
  console.log(`Wiki section-link verification passed (${checkedLinks} links).`);
} finally {
  await vite.close();
}
