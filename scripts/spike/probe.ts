// M1.0 spike: prove every native/wasm dependency works before building on it.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { EndType, FillRule, inflatePathsD, JoinType, unionD } from 'clipper2-ts';
import * as hb from 'harfbuzzjs';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

mkdirSync('.kci/spike', { recursive: true });
const results: Record<string, unknown> = {};

// 1. harfbuzz: Arabic joining forms of ب must give 4 distinct glyph ids
const font = new hb.Font(new hb.Face(new hb.Blob(readFileSync('assets/fonts/NotoNaskhArabic-Bold.ttf'))));
const shapeGids = (text: string) => {
  const buf = new hb.Buffer();
  buf.addText(text);
  buf.guessSegmentProperties();
  hb.shape(font, buf, [new hb.Feature('liga', 0), new hb.Feature('dlig', 0)]);
  // drop mark glyphs (GDEF class 3, e.g. the separate dot of ب) and keep base glyphs in visual order
  return buf
    .getGlyphInfos()
    .map((g) => g.codepoint)
    .filter((gid) => font.face.getGlyphClass(gid) !== hb.GlyphClass.MARK);
};
// buffer output is in visual order (RTL reversed): index 0 is the leftmost glyph = last logical char
const iso = shapeGids('ب')[0]!;
const two = shapeGids('بب'); // visual: [final, initial]
const three = shapeGids('ببب'); // visual: [final, medial, initial]
const forms = { isolated: iso, initial: two[1], medial: three[1], final: two[0] };
results.harfbuzz = {
  forms,
  distinct: new Set(Object.values(forms)).size,
  samplePath: font.glyphToPath(forms.medial).slice(0, 60),
};

// 2. clipper2-ts: inflate a square and union two squares
const sq = [
  [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ],
];
const inflated = inflatePathsD(sq, 10, JoinType.Round, EndType.Polygon);
const sq2 = [
  [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 50, y: 150 },
  ],
];
const uni = unionD(sq, sq2, FillRule.NonZero);
results.clipper = { inflatedPts: inflated[0]?.length, unionPaths: uni.length, unionPts: uni[0]?.length };

// 3. resvg + sharp
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 940"><rect width="720" height="940" fill="#fff"/><circle cx="360" cy="470" r="200" fill="none" stroke="#000" stroke-width="5"/><path d="${font.glyphToPath(iso)}" transform="translate(300 600) scale(0.2 -0.2)" fill="#000"/></svg>`;
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1440 } }).render().asPng();
const webp = await sharp(png).resize(800).webp({ nearLossless: true }).toBuffer();
writeFileSync('.kci/spike/probe.webp', webp);
results.raster = { pngBytes: png.length, webpBytes: webp.length };

// 4. pdf-lib vector page
const pdf = await PDFDocument.create();
const page = pdf.addPage([612, 792]);
page.drawSvgPath('M 0 0 L 100 0 L 100 100 Z', { x: 100, y: 700, borderWidth: 2 });
const bytes = await pdf.save({ useObjectStreams: true });
writeFileSync('.kci/spike/probe.pdf', bytes);
results.pdf = { bytes: bytes.length };

console.log(JSON.stringify(results, null, 2));
if ((results.harfbuzz as { distinct: number }).distinct !== 4) throw new Error('harfbuzz forms not distinct');
