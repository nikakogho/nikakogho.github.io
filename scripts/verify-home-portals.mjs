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
  const { profileLinks, cvUrl } = await vite.ssrLoadModule('/src/data/profileLinks.ts');
  const { aboutTimeline } = await vite.ssrLoadModule('/src/data/aboutTimeline.ts');
  const { normalizeNoteName } = await vite.ssrLoadModule('/src/utils/markdownHelper.tsx');

  const nexusFiles = await glob('Nexus/**/*.md', { nodir: true });
  const nexusPaths = new Set(nexusFiles.map((file) => {
    const relativePath = file.replace(/^Nexus[\\/]/, '').replace(/\.md$/i, '');
    return normalizeNoteName(relativePath.replace(/\\/g, '/'));
  }));
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

  console.log('Homepage verification passed.');
} finally {
  await vite.close();
}
