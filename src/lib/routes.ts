/**
 * The ONLY place URLs and public file paths are built (docs/DECISIONS.md #1, #4).
 * Pure functions, safe to import from Astro pages, the pipeline (scripts/) and the Worker build.
 * Every page path is lowercase with a trailing slash; files live same-origin under /files/.
 */
export type PaperSize = 'letter' | 'a4';
export const SITE = 'https://kidscolorit.com';

const FILE_SUFFIX: Record<string, string> = {
  coloring: 'coloring-page',
  calendar: 'calendar',
  tracker: 'tracker',
  'word-search': 'word-search',
  maze: 'maze',
  worksheet: 'worksheet',
  card: 'card',
};
export const fileSuffix = (kind: string) => FILE_SUFFIX[kind] ?? 'coloring-page';

export const homePath = () => '/';
export const hubPath = (hub: string) => `/${hub}/`;
export const designPath = (hub: string, slug: string) => `/${hub}/${slug}/`;
export const bundlePath = (slug: string) => `/bundles/${slug}/`;
export const pagePath = (slug: string) => `/${slug}/`;
export const colorAppPath = (hub?: string, slug?: string) => (hub && slug ? `/color/#${hub}/${slug}` : '/color/');
export const absolute = (path: string) => new URL(path, SITE).href;

// ---- public files (written by the pipeline into public/files/, served from /files/) ----
export const svgFile = (hub: string, slug: string) => `/files/svg/${hub}/${slug}.svg`;
export const previewFile = (hub: string, slug: string, kind: string, w: 400 | 800 | 1200) =>
  `/files/img/${hub}/${slug}-${fileSuffix(kind)}-${w}.webp`;
export const coloredExampleFile = (hub: string, slug: string) => `/files/img/${hub}/${slug}-colored-example-800.webp`;
export const ogFile = (hub: string, slug: string) => `/files/og/${hub}/${slug}.jpg`;
export const pinFile = (hub: string, slug: string) => `/files/pin/${hub}/${slug}-pin.jpg`;
export const pdfFile = (hub: string, slug: string, kind: string, size: PaperSize) =>
  `/files/pdf/${hub}/${slug}-${fileSuffix(kind)}-${size}.pdf`;
export const bundlePdfFile = (slug: string, size: PaperSize) => `/files/pdf/bundles/${slug}-${size}.pdf`;
/** filesystem location of a public file path */
export const publicFsPath = (publicPath: string) => `public${publicPath}`;
