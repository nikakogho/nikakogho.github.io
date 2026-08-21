import assert from 'node:assert/strict';
import {
  collectLocalImageReferences,
  getCloudinaryPublicId,
  normalizeLocalImageReference,
} from './sync-vault.js';

const references = collectLocalImageReferences(String.raw`
![Standard](<standard image.png>)
![[Obsidian Image.PNG]]
![[Sized Diagram.webp|600]]
<img src="html-image.jpeg" alt="">
cardImage: frontmatter-image.avif
`);

assert.deepEqual(
  [...references].sort(),
  [
    'Obsidian Image.PNG',
    'Sized Diagram.webp',
    'frontmatter-image.avif',
    'html-image.jpeg',
    'standard image.png',
  ].sort(),
  'Sync should discover every supported local image reference syntax',
);
assert.equal(normalizeLocalImageReference('https://example.com/remote.png'), null);
assert.equal(normalizeLocalImageReference('diagram.png?raw=1#section'), 'diagram.png');
assert.equal(
  getCloudinaryPublicId('Nexus', 'Jacob Pfau.PNG'),
  'nexus/images/jacob pfau',
  'Cloudinary inventory lookup should match the uploader public ID',
);

console.log('Vault sync image verification passed.');
