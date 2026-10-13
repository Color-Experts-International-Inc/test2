/**
 * Shared content schemas. Imported by src/content.config.ts (Astro), scripts/gen.ts (pipeline)
 * and the QA gates, so every consumer validates the same shape (docs/DECISIONS.md §Contracts).
 */
import { z } from 'zod';
import { DIFFICULTIES } from '../../generators/core/difficulty';

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const RESERVED_SLUGS = new Set([
  'easy',
  'medium',
  'hard',
  'detailed',
  'expert',
  'bold',
  'toddler',
  'preschool',
  'kindergarten',
  'adults',
  'bold-and-easy',
  'page',
  'color',
  'rss.xml',
  'files',
  'api',
  'search',
  'team',
  'about',
  'bundles',
  'printables',
  'color-online',
  'ar',
  'id',
  'bn',
  'ur',
  'tr',
  'ms',
  'fr',
]);
export const Slug = z.string().max(60).regex(SLUG_RE);

export const Difficulty = z.enum(DIFFICULTIES);
export const DesignKind = z.enum(['coloring', 'calendar', 'tracker', 'word-search', 'maze', 'worksheet', 'card']);
export const ImageryTier = z.enum(['A', 'B', 'C']);
export const Imagery = z.object({
  tier: ImageryTier,
  animalFaces: z.enum(['none', 'simple']).default('none'),
  facesDrawn: z.literal(false).default(false),
});
export const SacredText = z
  .enum([
    'none',
    'arabic-letters',
    'arabic-words',
    'greeting-en',
    'greeting-ar',
    'divine-name',
    'basmalah',
    'shahada',
    'quran',
    'dua',
  ])
  .default('none');
export const ReviewTier = z.enum(['R0', 'R1', 'R2']);
export const Review = z.object({
  editedBy: z.string().optional(),
  editedAt: z.coerce.date().optional(),
  islamicBy: z.string().optional(),
  arabicBy: z.string().optional(),
  checklist: z.string().optional(),
  reviewedAt: z.coerce.date().optional(),
});
export const Seo = z.object({
  primaryKeyword: z.string().optional(),
  secondary: z.array(z.string()).default([]),
  index: z.boolean().default(false),
});

export const GeneratedOrigin = z.object({
  kind: z.literal('generated'),
  generator: z.string(),
  version: z.string(),
  seed: z.string(),
  params: z.record(z.string(), z.unknown()).default({}),
});
export const IllustratedOrigin = z.object({
  kind: z.literal('illustrated'),
  artist: z.string(),
  aiAssisted: z.boolean(),
  briefId: z.string(),
  sourceSha256: z.string().length(64),
});

/** One entry in src/content/designs/{hub}.yaml (a YAML list). */
export const DesignEntry = z
  .object({
    slug: Slug.refine((s) => !RESERVED_SLUGS.has(s), 'reserved slug'),
    primaryHub: Slug,
    hubs: z.array(Slug).default([]),
    kind: DesignKind.default('coloring'),
    status: z.enum(['published', 'draft', 'rejected']).default('published'),
    rejectReason: z.string().optional(),
    /** a variant (e.g. undated calendar, positional-forms worksheet) renders as a tab/download on its base design; no own URL */
    variantOf: Slug.optional(),
    variantLabel: z.string().optional(),
    title: z.string().max(42),
    description: z.string().default(''),
    altDetail: z.string().max(70),
    difficulty: Difficulty,
    ages: z.tuple([z.number().int(), z.number().int()]),
    imagery: Imagery,
    sacredText: SacredText,
    sensitivity: z.enum(['standard', 'sacred-place']).default('standard'),
    reviewTier: ReviewTier,
    review: Review.default({}),
    origin: z.discriminatedUnion('kind', [GeneratedOrigin, IllustratedOrigin]),
    palette: z.string().default('kids-rainbow'),
    tags: z.array(z.string()).default([]),
    tips: z.array(z.string()).max(3).default([]),
    arabicWord: z.object({ ar: z.string(), translit: z.string(), meaning: z.string() }).optional(),
    factRef: z.string().optional(),
    seo: Seo.default({ secondary: [], index: false }),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    translationKey: z.string().optional(),
    redirectFrom: z.array(z.string()).default([]),
  })
  .superRefine((d, ctx) => {
    const needsR2 = !['none', 'greeting-en'].includes(d.sacredText) || d.imagery.tier === 'C' || d.sensitivity === 'sacred-place';
    if (needsR2 && d.reviewTier !== 'R2') ctx.addIssue({ code: 'custom', message: `${d.slug}: requires reviewTier R2` });
    if (['divine-name', 'basmalah', 'shahada', 'quran', 'dua'].includes(d.sacredText) && d.kind !== 'worksheet')
      ctx.addIssue({ code: 'custom', message: `${d.slug}: sacred text is never colorable (L04)` });
    if (d.variantOf && d.seo.index) ctx.addIssue({ code: 'custom', message: `${d.slug}: variants are never indexable` });
  });
export type DesignEntry = z.infer<typeof DesignEntry>;
export const DesignFile = z.array(DesignEntry);

/** Per-design data computed by the pipeline into .kci/computed/designs.json (keyed by slug). */
export interface ComputedDesign {
  slug: string;
  hub: string;
  kind: string;
  pages: number;
  /** sha256 of the master SVG */
  sha256: string;
  /** 64-bit perceptual hash as 16 hex chars */
  dhash: string;
  regions: number;
  minRegionMm2: number;
  minInscribedMm: number;
  coverage: number;
  width: number;
  height: number;
  generatorVersion?: string;
  bytes: { svg: number; pdfLetter: number; pdfA4: number; webp800: number };
}
export type ComputedDesigns = Record<string, ComputedDesign>;

export const HubKind = z.enum(['hub', 'navigator', 'activities', 'printables-index', 'letters', 'prose']);
/** Frontmatter of src/content/hubs/{slug}.mdx (body = the copy below the grid). */
export const HubEntry = z.object({
  kind: HubKind.default('hub'),
  name: z.string(),
  /** short topic word used in design titles, e.g. "Ramadan" */
  short: z.string(),
  h1: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  lede: z.string(),
  copyTier: z.enum(['A', 'B', 'C']).default('B'),
  parent: z.string().optional(),
  event: z.string().optional(),
  yearStamp: z.boolean().default(false),
  related: z.array(z.string()).default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  seo: Seo.default({ secondary: [], index: true }),
  reviewTier: ReviewTier.default('R1'),
  review: Review.default({}),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  order: z.number().default(100),
});
export type HubEntry = z.infer<typeof HubEntry>;

/** src/content/bundles/{slug}.yaml */
export const BundleEntry = z.object({
  slug: Slug,
  title: z.string(),
  description: z.string(),
  hub: Slug,
  items: z.array(Slug).min(1),
  cover: z.object({ heading: z.string(), subheading: z.string().optional() }),
  seo: Seo.default({ secondary: [], index: true }),
  reviewTier: ReviewTier.default('R1'),
  review: Review.default({}),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});
export type BundleEntry = z.infer<typeof BundleEntry>;
