// Derive static TTFs (for harfbuzzjs glyph outlines) from Fontsource woff2 files and lock their hashes.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
// @ts-expect-error no types
import wawoff2 from 'wawoff2';

const SOURCES: Record<string, string> = {
  'Nunito-Black.ttf': 'node_modules/@fontsource/nunito/files/nunito-latin-900-normal.woff2',
  'Nunito-ExtraBold.ttf': 'node_modules/@fontsource/nunito/files/nunito-latin-800-normal.woff2',
  'NotoNaskhArabic-Bold.ttf': 'node_modules/@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-700-normal.woff2',
};
const lock: Record<string, { source: string; sha256: string; bytes: number }> = {};
for (const [out, src] of Object.entries(SOURCES)) {
  const ttf: Uint8Array = await wawoff2.decompress(readFileSync(src));
  writeFileSync(`assets/fonts/${out}`, ttf);
  lock[out] = {
    source: src.replace('node_modules/', ''),
    sha256: createHash('sha256').update(ttf).digest('hex'),
    bytes: ttf.length,
  };
}
writeFileSync('assets/fonts/fonts.lock.json', `${JSON.stringify(lock, null, 2)}\n`);
console.log(lock);
