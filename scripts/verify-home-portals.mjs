import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
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
  const { worldRealms, WORLD_BOUNDS } = await vite.ssrLoadModule('/src/data/worldRealms.ts');
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
  assert.deepEqual(
    worldRealms.map((realm) => realm.id),
    ['ai', 'robotics', 'biotech', 'neurotech', 'space', 'nanotech'],
  );
  assert.equal(new Set(worldRealms.map((realm) => realm.terrain)).size, 6, 'Every realm needs unique terrain');
  assert.equal(new Set(worldRealms.map((realm) => realm.vehicle.kind)).size, 6, 'Every realm needs unique transport');

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

  for (const realm of worldRealms) {
    assert.equal(realm.landmarks.length, 3, `${realm.id} should expose three explorable landmarks`);
    assert.ok(realm.vehicle.speed > 0 && realm.vehicle.handling > 0, `${realm.id} needs working movement physics`);
    assert.ok(existsSync(`public${realm.ambience.src}`), `Missing realm ambience: ${realm.ambience.src}`);
    for (const landmark of realm.landmarks) {
      assert.ok(landmark.x > 0 && landmark.x < WORLD_BOUNDS.width, `${landmark.id} x position is outside the world`);
      assert.ok(landmark.y > 0 && landmark.y < WORLD_BOUNDS.height, `${landmark.id} y position is outside the world`);
    }
  }

  for (const asset of [
    'public/backgrounds/lifelog-castle-courtyard.webp',
    'public/backgrounds/lifelog-cyber-lab.webp',
    'public/backgrounds/lifelog-lava-pit.webp',
    'public/audio/light_rain.wav',
    'public/audio/cyber-lab-hum.wav',
    'public/audio/lava-rumble.wav',
  ]) {
    assert.ok(existsSync(asset), `Missing landing asset: ${asset}`);
  }

  console.log('Homepage portal verification passed.');
} finally {
  await vite.close();
}
