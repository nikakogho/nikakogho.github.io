import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({
  appType: 'custom',
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { hmr: false, middlewareMode: true },
});

try {
  const {
    DEFAULT_POST_FILTERS,
    filterAndSortPosts,
    generateMarkdownPreview,
    getAvailableTags,
    getPostDateKey,
  } = await vite.ssrLoadModule('/src/utils/postCollectionHelper.ts');

  const posts = [
    {
      slug: 'older-ai-note',
      content: 'A robot detective explores an old observatory.',
      preview: '**A robot detective** explores an old observatory.',
      frontmatter: {
        title: 'Clockwork Detective',
        date: '2025-05-01 11:50:00 +0400',
        tags: ['Robotics', 'AI'],
      },
    },
    {
      slug: 'june-neuro-note',
      content: 'A focused neurofeedback forest grows in real time.',
      preview: '*A focused forest* grows in real time.',
      frontmatter: {
        title: 'Dreaming Grove',
        date: '2025-06-01 00:00:00 +0400',
        tags: ['Neurotech'],
      },
    },
    {
      slug: 'newer-ai-note',
      content: 'Context fidelity changes under a steering intervention.',
      preview: 'Context fidelity changes under a steering intervention.',
      frontmatter: {
        title: 'Linear Steering',
        date: '2025-06-30 23:59:59 +0400',
        tags: ['AI', 'MechInterp'],
      },
    },
  ];

  const apply = (changes) => filterAndSortPosts(posts, {
    ...DEFAULT_POST_FILTERS,
    ...changes,
  });

  assert.deepEqual(apply({ title: 'steer' }).map((post) => post.slug), ['newer-ai-note']);
  assert.deepEqual(apply({ tag: 'interp' }).map((post) => post.slug), ['newer-ai-note']);
  assert.deepEqual(apply({ keyword: 'detective' }).map((post) => post.slug), ['older-ai-note']);
  assert.deepEqual(
    apply({ dateFrom: '2025-06-01', dateTo: '2025-06-30' }).map((post) => post.slug),
    ['newer-ai-note', 'june-neuro-note'],
  );
  assert.deepEqual(
    apply({ sortOrder: 'oldest' }).map((post) => post.slug),
    ['older-ai-note', 'june-neuro-note', 'newer-ai-note'],
  );
  assert.deepEqual(
    apply({ tag: 'ai', dateTo: '2025-05-31' }).map((post) => post.slug),
    ['older-ai-note'],
  );

  assert.equal(getPostDateKey('2025-06-30 23:59:59 +0400'), '2025-06-30');
  assert.deepEqual(getAvailableTags(posts), ['AI', 'MechInterp', 'Neurotech', 'Robotics']);
  assert.equal(
    generateMarkdownPreview('# Heading\n\nThis keeps **bold** and *emphasis*.'),
    'This keeps **bold** and *emphasis*.',
  );

  console.log('Post collection verification passed.');
} finally {
  await vite.close();
}
