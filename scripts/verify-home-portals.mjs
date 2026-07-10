import assert from 'node:assert/strict';
import { glob } from 'glob';
import { createServer } from 'vite';

const vite = await createServer({
  appType: 'custom',
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { hmr: false, middlewareMode: true },
});

try {
  const { homePortals } = await vite.ssrLoadModule('/src/data/homePortals.ts');
  const { getAllBlogPosts } = await vite.ssrLoadModule('/src/utils/blogHelper.tsx');
  const { getAllResearchPosts } = await vite.ssrLoadModule('/src/utils/researchHelper.tsx');
  const { normalizeNoteName } = await vite.ssrLoadModule('/src/utils/markdownHelper.tsx');

  const nexusFiles = await glob('Nexus/**/*.md', { nodir: true });
  const nexusPaths = new Set(nexusFiles.map((file) => {
    const relativePath = file.replace(/^Nexus[\\/]/, '').replace(/\.md$/i, '');
    return normalizeNoteName(relativePath.replace(/\\/g, '/'));
  }));
  const blogSlugs = new Set(getAllBlogPosts().map((post) => post.slug));
  const researchSlugs = new Set(getAllResearchPosts().map((post) => post.slug));

  assert.equal(homePortals.length, 6);
  assert.deepEqual(
    homePortals.map((portal) => portal.id),
    ['ai', 'robotics', 'biotech', 'neurotech', 'space', 'nanotech'],
  );

  for (const portal of homePortals) {
    assert.equal(portal.links.length, 3, `${portal.id} should expose three doorways`);
    assert.ok(portal.summary.length > 30, `${portal.id} needs a useful realm summary`);

    for (const link of portal.links) {
      if (link.external) {
        assert.match(link.href, /^https:\/\//, `${link.title} should be an HTTPS destination`);
        continue;
      }

      if (link.href.startsWith('/nexus/notes/')) {
        const notePath = link.href.slice('/nexus/notes/'.length);
        assert.ok(nexusPaths.has(notePath), `Missing Nexus destination: ${link.href}`);
      } else if (link.href.startsWith('/blog/')) {
        assert.ok(blogSlugs.has(link.href.slice('/blog/'.length)), `Missing Blog destination: ${link.href}`);
      } else if (link.href.startsWith('/research/')) {
        assert.ok(researchSlugs.has(link.href.slice('/research/'.length)), `Missing Research destination: ${link.href}`);
      } else {
        assert.fail(`Unsupported internal homepage destination: ${link.href}`);
      }
    }
  }

  console.log('Homepage portal verification passed.');
} finally {
  await vite.close();
}
