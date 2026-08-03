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
  const { profileLinks, cvUrl } = await vite.ssrLoadModule('/src/data/profileLinks.ts');
  const { aboutTimeline } = await vite.ssrLoadModule('/src/data/aboutTimeline.ts');
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

  assert.deepEqual(
    profileLinks.map((profile) => profile.id),
    ['github', 'linkedin', 'email', 'youtube', 'x'],
    'Homepage profile links should remain complete and intentionally ordered',
  );
  assert.equal(new Set(profileLinks.map((profile) => profile.href)).size, profileLinks.length, 'Profile URLs should be unique');
  for (const profile of profileLinks) {
    const expectedProtocol = profile.id === 'email' ? /^mailto:/ : /^https:\/\//;
    assert.match(profile.href, expectedProtocol, `${profile.label} has an invalid destination`);
  }
  assert.match(cvUrl, /^https:\/\/drive\.google\.com\//, 'CV should use the configured Google Drive URL');
  assert.ok(aboutTimeline.length >= 6, 'About timeline should tell a multi-stage story');
  assert.deepEqual(
    aboutTimeline.map((milestone) => milestone.id),
    [
      'playable-worlds',
      'liberty-bank',
      'university',
      'reflection',
      'larger-systems',
      'biotech',
      'aerospace',
      'neurotech',
      'robotics',
      'ai',
      'alignment',
      'lasr-labs',
    ],
    'Timeline should preserve the intended split-and-merge story',
  );
  assert.equal(new Set(aboutTimeline.map((milestone) => milestone.id)).size, aboutTimeline.length, 'Timeline milestone IDs should be unique');
  for (const milestone of aboutTimeline) {
    assert.ok(milestone.period && milestone.kind && milestone.track && milestone.title, 'Every timeline milestone needs date, track, and narrative labels');
    assert.ok(milestone.summary.length > 70, `${milestone.id} needs enough context to stand on its own`);

    if (!milestone.link) continue;
    if (milestone.link.to.startsWith('/nexus/notes/')) {
      const notePath = milestone.link.to.slice('/nexus/notes/'.length);
      assert.ok(nexusPaths.has(notePath), `Missing timeline Nexus destination: ${milestone.link.to}`);
    } else {
      assert.equal(milestone.link.to, '/research', `Unsupported timeline destination: ${milestone.link.to}`);
    }
  }
  assert.deepEqual(
    aboutTimeline.flatMap((milestone) => (
      milestone.videos?.map((video) => [milestone.id, video.href]) ?? []
    )),
    [
      ['neurotech', 'https://www.youtube.com/watch?v=EU_obsIUCwc'],
      ['ai', 'https://www.youtube.com/watch?v=wJSxviBw5n4'],
      ['ai', 'https://www.youtube.com/watch?v=1cJKEKF63jg'],
    ],
    'Timeline should place all three channel videos under their intended domains',
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
