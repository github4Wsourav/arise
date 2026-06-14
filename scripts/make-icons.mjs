/**
 * Reproducible icon pipeline (dev-only): renders public/icons/icon-source.png to the
 * PNG set the PWA manifest references. Run `npm run icons` after changing the source.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(here, '..', 'public', 'icons');
const source = await readFile(path.join(iconsDir, 'icon-source.png'));

const targets = [
  { file: 'favicon.png', size: 64, pad: 0 }, // browser tab
  { file: 'icon-192.png', size: 192, pad: 0 },
  { file: 'icon-512.png', size: 512, pad: 0 },
  // maskable: content within the inner safe zone (OS crops corners to a circle/squircle)
  { file: 'icon-maskable.png', size: 512, pad: 72 },
  { file: 'apple-touch-icon.png', size: 180, pad: 0 },
];

for (const { file, size, pad } of targets) {
  const inner = size - pad * 2;
  const content = await sharp(source).resize(inner, inner).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: '#07090E' },
  })
    .composite([{ input: content, top: pad, left: pad }])
    .png()
    .toFile(path.join(iconsDir, file));
  console.log(`✓ ${file} (${size}×${size})`);
}
