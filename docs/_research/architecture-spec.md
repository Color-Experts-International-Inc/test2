<!-- Specialist draft (Technical architecture (Astro 7 + React islands)). Superseded by docs/PLAN.md where they disagree. -->

# kidscolorit.com: technical architecture (Astro 7 + React islands)

**Scope:** planning only. Each item below is a decision. Notes marked "verify at implementation" cover details I couldn't confirm against primary docs, because docs.astro.build and developers.cloudflare.com were unreachable from this sandbox.

---

## 0. Key decisions

1. **The repo is a pnpm workspace with four packages:** `site/` (Astro), `packages/core` (schemas, routes, Hijri dates, imagery rules), `packages/generators` (pure SVG generators) and `workers/edge` (tiny API Worker). Content (`/content`), docs, scripts and skills sit at the root.
2. **Output is static.** There is no adapter at launch. Adding `@astrojs/cloudflare` later is the only escape hatch. Pages stay prerendered, and only `/api/*`, `/account/*` and `/create/*` opt out with `prerender = false`.
3. **Hosting is Cloudflare Workers Static Assets for HTML, plus R2 at `cdn.kidscolorit.com` for every binary** (SVG, WebP, JPG, PDF). Cloudflare now steers new projects to Workers rather than Pages. Workers Paid ($5/mo) raises the cap from 20k to 100k files per version, which we need past about 8k designs. Each file is limited to 25 MiB.
4. **Generators emit an intermediate representation (IR), and separate serializers write SVG, PDF and raster from it.** Every artifact is content-addressed by `hash(generator@version, seed, params, serializerVersion)`. R2 acts as the remote build cache, so CI never regenerates an artifact that already exists.
5. **Routing uses one route manifest plus one catch-all page.** Localized slugs (`/id/mewarnai-ramadhan/`) and flat money-page URLs (`/ramadan-coloring-pages/`) make sibling dynamic routes collide, so a single `[...path].astro` dispatches to template components. The manifest also drives hreflang, sitemaps, redirects, IndexNow and the QA checks.
6. **React ships on exactly one route, `/color/`.** Every other interactive bit is a vanilla custom element of 1–4 KB. Hub and design pages ship no framework runtime.
7. **Online coloring is one app shell, `/color/#<slug>`.** The hash keeps it to one HTML file, creates no duplicate indexable URLs and gives the service worker a single page to precache.
8. **PDFs stay on stable URLs on R2, behind a small Worker.** It sets `Content-Disposition`, a `Link: rel=canonical` header pointing back to the HTML page, and a server-side download counter.
9. **Privacy defaults:** no cookies, no third-party trackers, Cloudflare Web Analytics, and first-party events written to Workers Analytics Engine. Ads, consent management and membership are present only as feature-flagged stubs.
10. **Builds are deterministic.** `KCI_BUILD_DATE` drives year stamps and seasonal rails, and a nightly cron rebuild flips them (for example "Ramadan Coloring Pages 2027" is live from now on).

---

## 1. Repo structure

```
kidscolorit/
├─ CLAUDE.md                         # agent memory: commands, invariants (no Math.random in generators, imagery rules, URL rules)
├─ package.json                      # root scripts: dev, kci, build, qa, test, e2e, deploy
├─ pnpm-workspace.yaml               # site, packages/*, workers/*
├─ site.config.ts                    # SINGLE source of truth: brand, domains, locales, flags (path alias "@config")
├─ tsconfig.base.json                # strict, moduleResolution bundler, paths: @config, @kci/core, @kci/generators
├─ biome.json                        # lint+format; noRestrictedGlobals [Math.random, Date] inside packages/generators
├─ wrangler.jsonc                    # kci-site Worker (static assets + /api/*)
├─ .nvmrc                            # 22 (Astro 7 requires Node 22+ — verify exact minor)
├─ .github/workflows/
│  ├─ ci.yml                         # PR: typecheck, unit, pipeline(staging R2), build, QA, e2e, LHCI, preview deploy
│  ├─ deploy.yml                     # main: same + prod deploy + purge + IndexNow
│  ├─ nightly.yml                    # 03:10 UTC rebuild (year stamps/seasonal rails), external links, popularity import
│  └─ visual.yml                     # generator visual regression on packages/generators/** changes
├─ .claude/skills/
│  ├─ add-design/SKILL.md            # YAML entry → pipeline --only → QA gates → preview
│  ├─ add-topic-hub/SKILL.md         # topic MDX + SEO fields + FAQs + internal links
│  ├─ build-seasonal-hub/SKILL.md    # event-linked hub + calendar/tracker/cards + bundle + RSS→Pinterest
│  ├─ new-generator/SKILL.md         # scaffold generator + params schema + tests + baselines
│  ├─ art-intake/SKILL.md            # illustrated art: vectorize → normalize → closure QA → imagery review
│  ├─ seo-audit/SKILL.md             # runs kci qa seo + GSC export checklist
│  ├─ translate-hub/SKILL.md         # locale twin: slugs, strings, hreflang, RTL check
│  ├─ year-rollover/SKILL.md         # compute Hijri occurrences, next-year calendar printables, supersededBy links
│  ├─ imagery-review/SKILL.md        # checklist against docs/ISLAMIC-IMAGERY.md
│  └─ release/SKILL.md               # deploy checklist, limits, rollback (wrangler rollback)
├─ docs/
│  ├─ DESIGN.md  UI-UX.md  SEO.md  ISLAMIC-IMAGERY.md  SKILLS.md      # required
│  ├─ ARCHITECTURE.md                # this section
│  ├─ CONTENT-MODEL.md               # schemas + editorial rules
│  ├─ PIPELINE.md                    # stages, cache keys, R2 layout, purge
│  ├─ ART-PIPELINE.md                # briefs → design team/AI → vectorize → QA → intake
│  ├─ PRIVACY.md                     # COPPA/GDPR-K/UK Children's Code DPIA notes
│  └─ RUNBOOK.md                     # incidents, rollback, flag flips
├─ content/                          # ALL editorial content (git); read by site loaders AND pipeline
│  ├─ topics/<slug>.mdx              # hubs (frontmatter = schema, body = long guide below grid)
│  ├─ designs/<topic>/<slug>.yaml    # illustrated + hand-tuned generated designs
│  ├─ recipes/<name>.yaml            # generator expansions (e.g. 28 letters × 3 formats)
│  ├─ printables/<slug>.yaml
│  ├─ bundles/<slug>.yaml            # "coloring books" / activity packs
│  ├─ events/events.yaml             # Islamic calendar events + per-year Gregorian occurrences
│  ├─ letters/arabic.yaml            # 28 letters: glyph, forms, example words (+beings flags)
│  ├─ authors/<slug>.yaml (+ avatars/*.png, illustrated, faceless)
│  ├─ faqs/<slug>.yaml
│  ├─ pages/<slug>.mdx               # about, license, privacy, imagery policy, editorial policy…
│  ├─ i18n/<locale>.json             # UI strings
│  ├─ stats/popular.json             # weekly export from Analytics Engine (sorting "popular")
│  └─ art-briefs/<slug>.md           # briefs for Color Experts team / AI tool
├─ packages/
│  ├─ core/src/
│  │  ├─ schemas/*.ts                # Zod schemas (imported by site/src/content.config.ts AND scripts)
│  │  ├─ content-io.ts               # readYamlTree(), expandRecipes() — shared by loader + pipeline
│  │  ├─ routes.ts                   # buildRouteManifest(), url(kind,id,locale), RESERVED_SLUGS
│  │  ├─ hijri.ts                    # Intl 'islamic-umalqura' conversions, occurrence finder
│  │  ├─ paper.ts                    # Letter/A4 specs (pt), safe areas, LETTER_REGIONS
│  │  ├─ imagery.ts                  # banned subject tags, beings/sacredText rules
│  │  └─ seo-format.ts               # title/description formulas + length fitting
│  └─ generators/
│     ├─ src/
│     │  ├─ index.ts                 # registry: name → Generator
│     │  ├─ ir.ts                    # IR types + validators
│     │  ├─ lib/ prng.ts (sfc32+cyrb128) geometry.ts polylabel.ts svgpath.ts text-to-path.ts (fontkit) units.ts
│     │  ├─ serialize/ svg.ts pdf.ts (pdf-lib drawSvgPath) metadata.ts (XMP/IPTC)
│     │  ├─ qa/ closure.ts min-area.ts stroke.ts safe-area.ts size.ts imagery.ts
│     │  ├─ geometric/ girih.ts zellige-star.ts rosette.ts khatam.ts tessellation.ts
│     │  ├─ mandala/ mandala.ts ramadan-mandala.ts
│     │  ├─ arabic/ letter-coloring.ts letter-tracing.ts letter-worksheet.ts forms.ts
│     │  ├─ numbers/ number-coloring.ts number-tracing.ts
│     │  ├─ objects/ lantern.ts crescent-star.ts mosque-silhouette.ts dallah.ts tasbih.ts prayer-mat.ts rehal.ts dates-bowl.ts
│     │  ├─ printables/ ramadan-calendar.ts good-deeds-tracker.ts fasting-tracker.ts eid-card.ts gift-tag.ts
│     │  │              word-search.ts maze.ts dot-to-dot.ts wudu-steps.ts salah-steps.ts five-pillars.ts
│     │  └─ color-by-number/ cbn.ts
│     ├─ fonts/                      # OFL fonts for text→path (Nunito, Baloo Bhaijaan 2, Noto Naskh Arabic) + LICENSES
│     └─ test/ *.test.ts  __snapshots__/  __visual__/ (PNG baselines)
├─ scripts/
│  ├─ kci.ts                         # CLI: plan|generate|optimize|raster|pdf|bundles|manifest|upload|purge|qa|indexnow|intake|events
│  ├─ pipeline/ plan.ts generate.ts optimize.ts raster.ts pdf.ts bundles.ts manifest.ts upload-r2.ts purge.ts cache.ts pool.ts (piscina)
│  ├─ art/ intake.ts vectorize.ts (vtracer CLI) normalize.ts report.ts
│  ├─ events/ compute-hijri.ts
│  ├─ seo/ indexnow.ts audit.ts
│  └─ qa/ html-validate.ts validate-jsonld.ts seo-lint.ts js-budget.ts deploy-limits.ts links.sh (lychee)
├─ site/
│  ├─ astro.config.ts
│  ├─ pagefind.yml
│  ├─ public/ favicon.svg  icons/  <indexnow-key>.txt  .assetsignore
│  ├─ src/
│  │  ├─ content.config.ts
│  │  ├─ loaders/ designs-loader.ts printables-loader.ts bundles-loader.ts
│  │  ├─ pages/ (see §4)
│  │  ├─ templates/ Home Parent Hub TopicHub ActivityHub Design LetterHub Letter PrintableType Printable
│  │  │             BookIndex Book Author Calendar Prose ColorApp  (.astro)
│  │  ├─ layouts/ BaseLayout.astro AppLayout.astro
│  │  ├─ components/
│  │  │  ├─ seo/ BaseHead.astro JsonLd.astro Breadcrumbs.astro SpeculationRules.astro
│  │  │  ├─ chrome/ Header.astro Footer.astro LocaleSwitcher.astro SkipLink.astro
│  │  │  ├─ cards/ DesignCard.astro DesignGrid.astro HubCard.astro PrintableCard.astro LetterTile.astro
│  │  │  ├─ actions/ DownloadButtons.astro ColorOnlineLink.astro PinterestLink.astro
│  │  │  ├─ content/ HubIntro.astro FaqList.astro EventDates.astro QuranRef.astro DesignFacts.astro
│  │  │  │           LicenseNote.astro AuthorByline.astro ReviewedBy.astro ImageryBadge.astro RelatedHubs.astro
│  │  │  └─ monetization/ AdSlot.astro AdBootstrap.astro
│  │  ├─ elements/ (vanilla TS custom elements) kci-favorite.ts kci-filter-bar.ts kci-print.ts
│  │  │            kci-paper.ts kci-strict.ts kci-search.ts kci-share.ts kci-fav-count.ts
│  │  ├─ islands/coloring/ CanvasColoring.tsx Toolbar.tsx Palette.tsx Gallery.tsx
│  │  │     engine/ region-engine.ts raster-engine.ts floodfill.worker.ts history.ts zoom-pan.ts export.ts storage.ts palettes.ts sanitize.ts
│  │  ├─ lib/ routes.ts (re-export core + Astro bindings) cdn.ts flags.ts i18n.ts events.ts counts.ts
│  │  │       inline-scripts.ts (constants + sha256 for CSP)
│  │  │       seo/ titles.ts jsonld.ts hreflang.ts sitemap.ts robots.ts
│  │  ├─ styles/ global.css (Tailwind 4 @import + @theme tokens) print.css
│  │  ├─ sw/sw.ts
│  │  └─ integrations/ seo-files.ts (_headers, _redirects, image sitemaps, route-manifest) service-worker.ts budgets.ts
│  └─ tests/ e2e/*.spec.ts  playwright.config.ts  lighthouserc.cjs  fixtures/
└─ workers/
   ├─ edge/src/index.ts              # /api/e (events), /api/request (page requests) → Analytics Engine; rate-limited
   │       migrations/0001_init.sql  # D1 membership schema — NOT applied (stub)
   └─ cdn-pdf/src/index.ts           # cdn.kidscolorit.com/pdf/* → R2 binding; headers + download counter
```

Root scripts: `pnpm dev` (pipeline `--local --only=changed`, then `astro dev`), `pnpm build` (pipeline, then `astro build`, then `pagefind`, then `kci qa`), `pnpm deploy` (`wrangler deploy`, then `kci purge`, then `kci indexnow`). Scripts run with `tsx`, so they don't depend on Node 22's type-stripping minor version.

---

## 2. Astro config, Astro 7 features and content model

### 2.1 Which Astro 7 features we use

| Feature | Decision |
|---|---|
| Rust compiler + Vite 8/Rolldown (the default in 7) | Use it; Astro reports builds 15–61% faster. Markdown/MDX now runs through a new Rust pipeline, so **we don't depend on custom remark/rehype plugins**, and MDX stays plain. |
| Content Layer (`glob`, `file`, custom loaders, digests) | Use for everything. A custom `designsLoader` merges authored YAML, recipe expansions and the asset manifest. |
| Live Content Collections (stable since 6) | Not at launch, because there's no server. `src/live.config.ts` is reserved for member data once an adapter exists. |
| Fonts API (`fonts` + `<Font>`, Astro 6+) | Use it: Fontsource downloads at build and the fonts are self-hosted with hashed names and automatic metric fallbacks. |
| Responsive images (`image.layout`) | Only for local images (logo, avatars, marketing art). Pipeline images skip `astro:assets`, since re-processing about 50k rasters per build is wasted work. |
| CSP (`security.csp`, stable since 6) | Use it: a hash-based meta CSP, plus header-only directives in `_headers` (see §7.9). |
| Actions / Sessions / server islands | Later, behind `flags.membership`: Actions for forms, Sessions on the KV driver, a server island for the account chip. |
| Route caching + Cloudflare CDN cache provider (new in 7) | Later, for on-demand `/api/*` and AI-generator results. Docs list it under experimental flags while the release summary calls it stable, so verify. |
| Advanced Routing `src/fetch.ts` (new in 7, Hono-compatible) | Later: compose `/api/*` there once the adapter is added, so the API isn't a second deployable. |
| `<ClientRouter />` | Not used. Native cross-document view transitions in CSS need no JS. |
| `prefetch` / `experimental.clientPrerender` | Not used. Inline Speculation Rules do the job with zero JS, and clientPrerender is still experimental. |
| Background dev server + JSON logging | Use them: Claude Code skills run `astro dev` in the background, and CI parses the JSON logs. |

### 2.2 `site/astro.config.ts`

```ts
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site, astroLocales } from '@config';
import { INLINE_SCRIPT_HASHES } from './src/lib/inline-scripts';
import { isIndexableUrl, sitemapSerialize, sitemapChunks } from './src/lib/seo/sitemap';
import { kciSeoFiles } from './src/integrations/seo-files';
import { kciServiceWorker } from './src/integrations/service-worker';
import { kciBudgets } from './src/integrations/budgets';

export default defineConfig({
  site: site.url,                                   // https://kidscolorit.com
  output: 'static',                                 // + @astrojs/cloudflare adapter only when flags.membership||aiGenerator
  trailingSlash: 'always',
  build: { format: 'directory', assets: '_astro', inlineStylesheets: 'auto', concurrency: 4 },
  compressHTML: true,
  i18n: {
    defaultLocale: 'en',
    locales: astroLocales(),                        // launch: ['en']; later [{path:'ar',codes:['ar']},{path:'id',codes:['id']},…]
    routing: { prefixDefaultLocale: false },
    // deliberately NO `fallback`: untranslated pages are not generated (no duplicate-content clones)
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    { provider: fontProviders.fontsource(), name: 'Nunito', cssVariable: '--font-sans',
      weights: ['400 900'], styles: ['normal'], subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-rounded', 'system-ui', 'sans-serif'], display: 'swap' },
    { provider: fontProviders.fontsource(), name: 'Baloo Bhaijaan 2', cssVariable: '--font-arabic',
      weights: ['400 800'], styles: ['normal'], subsets: ['arabic'],
      fallbacks: ['Noto Naskh Arabic', 'serif'], display: 'swap' },
  ],
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        `img-src 'self' ${site.cdn} data: blob:`,
        "font-src 'self'",
        `connect-src 'self' ${site.cdn} https://cloudflareinsights.com`,
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "frame-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com', "'wasm-unsafe-eval'", "'inline-speculation-rules'"],
        hashes: INLINE_SCRIPT_HASHES,               // head boot script, paper detect, SW register (computed at config time)
        strictDynamic: false,                       // flips to true with flags.ads (see §7.9)
      },
      styleDirective: { resources: ["'self'"] },
    },
  },
  integrations: [
    react({ include: ['**/islands/**/*.tsx'] }),
    mdx(),
    sitemap({ filter: isIndexableUrl, serialize: sitemapSerialize, chunks: sitemapChunks, entryLimit: 10_000 }),
    kciSeoFiles(),        // build:done → _headers, _redirects, sitemap-images-*.xml, route-manifest.json, ads.txt (if flag)
    kciServiceWorker(),   // build:done → dist/sw.js with precache list for /color/ + BUILD_ID
    kciBudgets(),         // build:done → per-template JS gzip budget check (fails CI)
  ],
  vite: { plugins: [tailwindcss()], build: { target: 'es2022' } },
});
```

Notes:
- `_headers` and `_redirects` come from an integration, not from `src/pages/`, because Astro ignores files in `src/pages` whose names start with `_`.
- Pagefind runs as a CLI step after `astro build` (`pagefind --site dist`), which keeps its config explicit.
- When the adapter arrives, the delta is: `adapter: cloudflare({ imageService: 'compile' })`, `export const prerender = false` on server routes, `session: { driver: 'cloudflare-kv-binding' }`, and the route-caching provider from the Cloudflare adapter. Verify the exact v7 keys at implementation.

### 2.3 `site.config.ts`

```ts
export const site = {
  name: 'KidsColorIt',
  domain: 'kidscolorit.com',
  url: 'https://kidscolorit.com',
  cdn: 'https://cdn.kidscolorit.com',
  publisher: { name: 'Color Experts International', url: 'https://www.colorexpertsbd.com', country: 'BD' },
  colors: { /* tokens owned by docs/DESIGN.md; mirrored into Tailwind @theme */ },
  locales: {
    en: { label: 'English',          hreflang: 'en', dir: 'ltr', enabled: true  },
    ar: { label: 'العربية',           hreflang: 'ar', dir: 'rtl', enabled: false },
    id: { label: 'Bahasa Indonesia', hreflang: 'id', dir: 'ltr', enabled: false },
    bn: { label: 'বাংলা',             hreflang: 'bn', dir: 'ltr', enabled: false },
    tr: { label: 'Türkçe',           hreflang: 'tr', dir: 'ltr', enabled: false },
    ms: { label: 'Bahasa Melayu',    hreflang: 'ms', dir: 'ltr', enabled: false },
    fr: { label: 'Français',         hreflang: 'fr', dir: 'ltr', enabled: false },
    ur: { label: 'اردو',              hreflang: 'ur', dir: 'rtl', enabled: false },
  },
  flags: {
    ads: false, consent: false, membership: false, aiGenerator: false, photoToColoring: false,
    requestForm: true, pwa: true, strictModeDefault: false, analytics: 'cloudflare',
  },
  ads: { provider: 'adsense', client: '', childDirected: true, manualUnitsOnly: true,
         slots: { hubInFeed: '', designBelowArt: '', railDesktop: '' } },
  robots: { blockAiTraining: true },
  seo: { titleMax: 60, descMax: 155, brandSuffix: ' | KidsColorIt' },
  analytics: { cfBeaconToken: '' },
} as const satisfies SiteConfig;
```

`src/lib/flags.ts` merges `site.flags` with `PUBLIC_KCI_FLAGS="ads=1,consent=1"`, so preview builds can flip flags without editing code. Flags take effect at build time. Once ads exist there's also a runtime kill switch (§8).

### 2.4 Content collections (`site/src/content.config.ts`)

The schemas live in `packages/core/schemas` and are re-exported here, so the pipeline validates the same shapes.

```ts
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { designsLoader, printablesLoader, bundlesLoader } from './loaders';

const LOCALES = ['en','ar','id','bn','tr','ms','fr','ur'] as const;
const Locale = z.enum(LOCALES);
const T = () => z.object({ en: z.string().min(1) })
  .extend(Object.fromEntries(LOCALES.slice(1).map(l => [l, z.string().optional()])));   // en required
const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Slugs = () => z.object({ en: Slug }).extend(Object.fromEntries(LOCALES.slice(1).map(l => [l, Slug.optional()])));
const Age = z.enum(['toddler','preschool','kindergarten','6-8','9-12','teens-adults']);
const Difficulty = z.enum(['easy','medium','hard','expert']);
const Beings = z.array(z.enum(['animals','people'])).default([]);           // [] = no animate beings
const SacredText = z.enum(['none','arabic-letters','bismillah','names-of-allah','quran-verse','dua']).default('none');
const Status = z.enum(['draft','review','published','retired']).default('draft');
const Gen = z.object({ name: z.string(), version: z.string(), seed: z.string(), params: z.record(z.string(), z.unknown()).default({}) });
const Review = z.object({
  qaBy: reference('authors'), qaDate: z.coerce.date(),
  islamicReviewBy: reference('authors').optional(), educatorReviewBy: reference('authors').optional(),
});
const Assets = z.object({                                   // merged from assets-manifest (never authored)
  svg: z.url(), w360: z.url(), w720: z.url(), w1200: z.url(), og: z.url(), pin: z.url(),
  pdf: z.object({ letter: z.url(), a4: z.url(), letterBytes: z.number(), a4Bytes: z.number() }),
  width: z.number(), height: z.number(), regions: z.number().int(),
  engine: z.enum(['region','raster']), hash: z.string(), renderedAt: z.coerce.date(),
});

const designs = defineCollection({
  loader: designsLoader({ authored: '../content/designs', recipes: '../content/recipes', manifest: process.env.KCI_MANIFEST! }),
  schema: z.object({
    title: T(), slugs: Slugs().optional(),                 // defaults to id
    summary: T(),                                          // card one-liner ≤ 120 chars
    description: T().optional(),                           // 60–200 words; REQUIRED for indexable
    alt: T(),
    primaryTopic: reference('topics'),
    topics: z.array(reference('topics')).default([]),
    events: z.array(reference('events')).default([]),
    ages: z.array(Age).min(1), difficulty: Difficulty,
    style: z.array(z.enum(['bold-easy','cozy','detailed','mandala','geometric','calligraphy',
                           'color-by-number','tracing','silhouette'])).default([]),
    beings: Beings,
    facesDrawn: z.literal(false).default(false),           // schema-level guarantee: no faces, ever
    sacredText: SacredText,
    quranRef: z.object({ surah: z.number().int().min(1).max(114), ayah: z.string(), note: T() }).optional(),
    origin: z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('generated'), generator: Gen }),
      z.object({ kind: z.literal('illustrated'), sourceSha256: z.string().length(64),
                 artist: reference('authors'), aiAssisted: z.boolean(),
                 vectorizer: z.enum(['manual','vtracer','potrace']) }),
    ]),
    review: Review,
    status: Status, publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
    featured: z.boolean().default(false), sort: z.number().default(0),
    keywords: z.array(z.string()).default([]),             // incl. aliases: "ramzan", "hijaiyah"
    pinterest: z.object({ title: z.string().max(100), description: z.string().max(500) }).optional(),
    previousPaths: z.array(z.string()).default([]),
    assets: Assets.optional(),
  }).superRefine((d, ctx) => {
    if (d.sacredText !== 'none' && !d.review.islamicReviewBy)
      ctx.addIssue({ code: 'custom', message: 'sacredText requires islamicReviewBy' });
    if (d.beings.includes('people') && !d.review.islamicReviewBy)
      ctx.addIssue({ code: 'custom', message: 'people (faceless) require islamic review' });
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: '../content/topics' }),
  schema: z.object({
    kind: z.enum(['parent','topic','series','activity-hub']),
    parent: reference('topics').optional(),
    name: T(), slugs: Slugs(),                             // en 'ramadan-coloring-pages', id 'mewarnai-ramadhan'
    h1: T().optional(), title: T().optional(),             // overrides of the formula
    metaDescription: T(), intro: T(),                      // intro ≤ 60 words above the grid; MDX body below
    event: reference('events').optional(), yearStamp: z.boolean().default(false),
    heroDesign: reference('designs').optional(),
    featured: z.array(reference('designs')).default([]),
    related: z.array(reference('topics')).default([]),
    printables: z.array(reference('printables')).default([]),
    books: z.array(reference('bundles')).default([]),
    faqs: z.array(reference('faqs')).default([]),
    seo: z.object({ primaryKeyword: z.string(), secondary: z.array(z.string()).default([]),
                    aliases: z.array(z.string()).default([]) }),
    authors: z.array(reference('authors')).min(1),
    reviewedBy: z.array(reference('authors')).default([]),
    locales: z.array(Locale).default(['en']),
    sort: z.number().default(0), publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
  }),
});

const printables = defineCollection({
  loader: printablesLoader({ dir: '../content/printables', manifest: process.env.KCI_MANIFEST! }),
  schema: z.object({
    type: z.enum(['calendar','tracker','worksheet','tracing','card','gift-tag','word-search','maze',
                  'dot-to-dot','color-by-number','poster','certificate','bookmark']),
    title: T(), slugs: Slugs().optional(), summary: T(), description: T(), alt: T(),
    generator: Gen,
    year: z.number().int().optional(), event: reference('events').optional(),
    supersededBy: reference('printables').optional(),      // ramadan-calendar-2027 → -2028
    topics: z.array(reference('topics')).min(1),
    ages: z.array(Age).min(1), difficulty: Difficulty.optional(),
    skills: z.array(z.enum(['fine-motor','letter-recognition','counting','vocabulary',
                            'islamic-studies','sequencing','problem-solving','art'])).default([]),
    contentLanguages: z.array(z.enum([...LOCALES, 'ar-script'])).default(['en']),
    beings: Beings, facesDrawn: z.literal(false).default(false), sacredText: SacredText,
    review: Review, status: Status, publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
    previousPaths: z.array(z.string()).default([]),
    assets: z.object({ pages: z.number().int(), previews: z.array(z.url()),
                       pdf: z.object({ letter: z.url(), a4: z.url() }), og: z.url(), pin: z.url() }).optional(),
  }),
});

const bundles = defineCollection({                       // public name: "coloring books"
  loader: bundlesLoader({ dir: '../content/bundles', manifest: process.env.KCI_MANIFEST! }),
  schema: z.object({
    title: T(), slugs: Slugs().optional(), summary: T(), description: T(),
    items: z.array(z.union([z.object({ design: reference('designs') }),
                            z.object({ printable: reference('printables') })])).min(2),
    cover: reference('designs'),
    event: reference('events').optional(), year: z.number().int().optional(),
    topics: z.array(reference('topics')).min(1), ages: z.array(Age).min(1),
    status: Status, publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
    assets: z.object({ pages: z.number(), pdf: z.object({ letter: z.url(), a4: z.url() }), og: z.url() }).optional(),
  }),
});

const events = defineCollection({
  loader: file('../content/events/events.yaml'),
  schema: z.object({
    name: T(),
    hijri: z.object({ month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(30),
                      lengthDays: z.number().int().min(1).max(30).default(1) }),
    observance: z.enum(['universal','varies']).default('universal'),     // mawlid = 'varies' (separate section)
    occurrences: z.array(z.object({
      hijriYear: z.number().int(), start: z.coerce.date(), end: z.coerce.date(),
      source: z.enum(['umalqura','announced','manual']), label: z.string().optional(),  // label overrides year text
    })).min(1),
    windows: z.object({ promoLeadDays: z.number().default(63), titleYearLeadDays: z.number().default(150),
                        peakLeadDays: z.number().default(10), lagDays: z.number().default(7) }),
    hubs: z.array(reference('topics')).default([]),
  }),
});

const letters = defineCollection({
  loader: file('../content/letters/arabic.yaml'),
  schema: z.object({
    order: z.number().int().min(1).max(28), char: z.string().length(1), slug: Slug, name: T(), translit: z.string(),
    forms: z.object({ isolated: z.string(), initial: z.string(), medial: z.string(), final: z.string() }),
    words: z.array(z.object({ ar: z.string(), translit: z.string(), meaning: T(), beings: Beings })).min(1),
    designs: z.array(reference('designs')).default([]), printables: z.array(reference('printables')).default([]),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '*.yaml', base: '../content/authors' }),
  schema: ({ image }) => z.object({
    name: z.string(), role: z.enum(['illustrator','editor','educator-advisor','islamic-reviewer','engineer']),
    bio: T(), avatar: image(), credentials: z.array(z.string()).default([]), sameAs: z.array(z.url()).default([]),
    organization: z.string().default('Color Experts International'),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '*.yaml', base: '../content/faqs' }),
  schema: z.object({ question: T(), answer: T(), topics: z.array(reference('topics')).default([]),
                     global: z.boolean().default(false), order: z.number().default(0) }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.mdx', base: '../content/pages' }),
  schema: z.object({ title: T(), description: T(), updatedAt: z.coerce.date(), noindex: z.boolean().default(false) }),
});

export const collections = { designs, topics, printables, bundles, events, letters, authors, faqs, pages };
```

`designsLoader` reads authored YAML and calls `expandRecipes()` (from `@kci/core`, the same function the pipeline uses), then merges `assets` from the manifest. Each entry is stored with `store.set({ id, data, digest: generateDigest(data) })`, so unchanged entries are skipped and Astro's data store (`.astro/data-store.json`) stays incremental. A published entry with no `assets` blocks the QA gate in CI; in dev it renders a placeholder.

A recipe looks like this:

```yaml
# content/recipes/arabic-letters.yaml
generator: arabic/letter-coloring
version: ^2
primaryTopic: arabic-alphabet-coloring-pages
review: { qaBy: rahim, qaDate: 2026-10-20, islamicReviewBy: ustadha-amina }
for_each: letters                     # 28 entries from the letters collection
id: "{letter.slug}-letter-coloring-page"
title: { en: "{letter.name.en} ({letter.char}) Letter Coloring Page" }
items:                                 # per-item overrides: unique copy is mandatory for indexable designs
  - match: alif
    seed: "alif-v1"
    summary: { en: "A big bold Alif with a geometric star border." }
    description: { en: "…unique 80-word description…" }
```

### 2.5 Route manifest (`packages/core/routes.ts`)

```ts
type RouteKind = 'home'|'parent'|'hub'|'activity-hub'|'design'|'letter-hub'|'letter'|'printables'
  |'printable-type'|'printable'|'books'|'book'|'author'|'calendar'|'page'|'color';
interface RouteEntry {
  kind: RouteKind; id: string; locale: Locale;
  path: string;                       // '/ramadan-coloring-pages/crescent-lantern-mandala/'
  alternates: Partial<Record<Locale, string>>;   // only locales whose translation exists AND is indexable
  indexable: boolean;                 // substance gate (see §7.1)
  lastmod: Date; breadcrumbs: { name: string; path: string }[];
}
```

The manifest is built once per build and memoized at module scope. It is used by `getStaticPaths`, the `url(kind, id, locale)` link helper, hreflang, sitemap `serialize`, `_redirects`, llms.txt, IndexNow diffing and the internal-link and orphan QA. It's written to `dist/route-manifest.json`, which `.assetsignore` keeps out of the deploy (the artifact is copied out first).

`RESERVED_SLUGS` (color, search, favorites, offline, about, license, privacy, terms, contact, authors, printables, coloring-books, arabic-alphabet, feeds, data, api, account, create, pagefind, _astro, and the locale codes) are asserted unused by topic slugs.

---

## 3. Build pipeline, caching and hosting limits

### 3.1 Generator contract and IR

```ts
export interface Generator<P> {
  name: string;                 // 'geometric/girih'
  version: string;              // semver; any visual change = bump → new cache keys
  kind: 'coloring'|'tracing'|'worksheet'|'printable';
  params: ZodType<P>;
  declares: { beings: []; facesDrawn: false; sacredText: SacredText };
  generate(i: { params: P; rng: Rng; page: PageSpec | 'neutral'; locale: Locale }): IR;
}
interface IR {
  viewBox: [number, number];    // mm units
  regions: { id: string; d: string; label?: string }[];        // closed fillable areas (+CBN numbers)
  strokes: { d: string; widthMm: number; dash?: number[] }[];  // line art, tracing guides
  meta: { title: string; minRegionMm2: number; minStrokeMm: number };
}
```

The rules:
- Seeded PRNG only (`sfc32` seeded via `cyrb128(seed)`). `Math.random` and `Date` are banned by Biome.
- Coordinates are fixed to 2 decimals and element order is stable.
- Text is converted to paths with fontkit, so rasterizing never depends on system fonts (deterministic output, no fontconfig in CI).
- Coloring art is generated at a neutral aspect ratio of 0.72 and fitted into both papers. Printables (calendars, worksheets) generate one IR per paper size.

### 3.2 Stage order

| # | Command | What it does |
|---|---|---|
| 1 | `kci plan` | Read content and expand recipes into jobs. Compute per-stage cache keys and fetch `_meta/assets-manifest.json` from R2. Jobs whose keys already exist are marked **skip**. Writes `.kci/plan.json`. |
| 2 | `kci generate` | Run the generator for each job, producing IR (worker pool via `piscina`, N = `os.availableParallelism()`). |
| 3 | `kci optimize` | Serialize IR to SVG and run SVGO (keep `viewBox`, keep `id`/`data-r`, precision 2). Embed `<metadata id="kci">{engine, regions, title, page}`. Then run the QA gates (§11.1); any failure stops the job. |
| 4 | `kci raster` | resvg/sharp produces `-360.webp`, `-720.webp`, `-1200.webp` (q80), a 1200×630 OG JPG (brand frame + pathified title) and a 1000×1500 Pinterest JPG. XMP/IPTC is embedded via sharp's XMP support: creator, credit line, copyright, Web Statement of Rights pointing to `/license/`, and DigitalSourceType (`algorithmicMedia` for generated art, `compositeWithTrainedAlgorithmicMedia` for AI-assisted art). `sharp.concurrency(1)` per worker. |
| 5 | `kci pdf` | pdf-lib `drawSvgPath` produces **vector** Letter (612×792 pt) and A4 (595.28×841.89 pt) PDFs with a 0.5 in / 12.7 mm safe margin. Footer: "kidscolorit.com · free for personal & classroom use". Fixed CreationDate/ID from `updatedAt` keeps output deterministic. Raster-only illustrated art is embedded as a 300-DPI PNG (2550×3300). |
| 6 | `kci bundles` | Build coloring books by merging PDFs (`copyPages`), adding a generated cover and table of contents, one per paper size. |
| 7 | `kci manifest` | Write `.kci/manifest/assets-manifest.json` (slug, URLs, dimensions, bytes, regions, hash, renderedAt). |
| 8 | `kci upload` | S3 API to R2 with concurrency 32, uploading only new or changed objects, with `httpMetadata` (content type, cache control, PDF disposition). The manifest is uploaded last. PRs go to the **staging** bucket. |
| 9 | `astro build` | The content layer reads the manifest, then pages, sitemaps, image sitemaps, `_headers`, `_redirects`, `sw.js`, llms.txt, RSS and route-manifest are written. |
| 10 | `pagefind --site dist` | Only `[data-pagefind-body]` is indexed. Filters: topic, age, difficulty, beings, type. |
| 11 | `kci qa` | html-validate, JSON-LD validation, SEO lint, lychee (internal, offline), JS budgets, deploy limits. |
| 12 | `wrangler deploy`, then `kci purge`, then `kci indexnow` | Deploy, purge changed stable CDN URLs, ping IndexNow. |

### 3.3 Cache keys

Keys are split per stage, so a template change re-renders only what it affects.

```
irKey     = H(generator.name, generator.version, seed, canonicalJSON(params), IR_SCHEMA_V)
           | H(sourceSha256, INTAKE_V)                              # illustrated art
svgKey    = H(irKey, SVG_SER_V, SVGO_CONFIG_HASH)
rasterKey = H(svgKey, RASTER_V, sharpVersion, size)
ogKey     = H(svgKey, OG_TEMPLATE_HASH, title.en)
pinKey    = H(svgKey, PIN_TEMPLATE_HASH, title.en)
pdfKey    = H(irKey, PDF_V, FOOTER_TEMPLATE_HASH, paper)
bundleKey = H(sorted(member pdfKeys), COVER_V, paper)
```

- **Local cache:** `.kci/cache/<key>` for dev, kept in the GitHub Actions cache keyed on `hashFiles('content/**','packages/generators/**')`.
- **Remote cache:** the R2 manifest is authoritative. CI never downloads images; it only needs manifest rows.
- **Prod deploy:** when a key is present in staging but missing in prod, the object is copied server-side (S3 CopyObject) instead of being regenerated.

### 3.4 Hosting topology and limits

```
Browser ─┬─ kidscolorit.com ─────► Worker "kci-site"  (Static Assets: HTML, _astro, pagefind, sw.js)
         │                            └ run_worker_first: ["/api/*"] → Analytics Engine events, page requests
         └─ cdn.kidscolorit.com ──► R2 "kci-cdn" (custom domain; Cache Rule: edge TTL 1y, purge-on-change)
                                      └ route /pdf/* → Worker "kci-cdn-pdf" (R2 binding)
CI ── pipeline → R2 (S3 API) ── astro build ── wrangler deploy ── purge ── IndexNow
```

**Verified limits:**
- **Workers Static Assets:** 20,000 files per version on Free and 100,000 on Paid (needs Wrangler ≥ 4.34). Each file is limited to 25 MiB.
- **Pages:** paid plans allow 100k files, `_headers` holds up to 100 rules, and `_redirects` up to 2,000 static plus 100 dynamic.
- Assume Workers `_headers`/`_redirects` follow the same rule limits (verify); `kci qa deploy-limits` enforces them.

**Plan:** use Workers Paid from day one ($5/mo). It covers the 100k file cap, Analytics Engine and Rate Limiting bindings, and 10M requests per month.

`wrangler.jsonc`:

```jsonc
{
  "name": "kci-site",
  "main": "workers/edge/src/index.ts",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./site/dist",
    "binding": "ASSETS",
    "html_handling": "force-trailing-slash",
    "not_found_handling": "404-page",
    "run_worker_first": ["/api/*"]
  },
  "analytics_engine_datasets": [{ "binding": "EVENTS", "dataset": "kci_events" }],
  "routes": [{ "pattern": "kidscolorit.com", "custom_domain": true }]
}
```

**R2 layout.** Paths are stable and slug-based, with no hashes in the filename. Image search equity and backlinks survive re-renders, and freshness comes from a purge by URL in batches.

```
cdn.kidscolorit.com/d/{slug}/{slug}-coloring-page.svg
cdn.kidscolorit.com/d/{slug}/{slug}-coloring-page-{360|720|1200}.webp
cdn.kidscolorit.com/d/{slug}/{slug}-coloring-page-og.jpg
cdn.kidscolorit.com/d/{slug}/{slug}-coloring-page-pin.jpg
cdn.kidscolorit.com/pdf/{slug}-coloring-page-{letter|a4}.pdf
cdn.kidscolorit.com/pdf/books/{book}-{letter|a4}.pdf
cdn.kidscolorit.com/p/{printable}/{printable}-{page}-{720|1200}.webp
cdn.kidscolorit.com/_meta/{assets-manifest.json, route-manifest.json}    (private prefix, blocked by cdn robots.txt)
```

- Images use `Cache-Control: public, max-age=86400, s-maxage=31536000`.
- The R2 CORS policy allows `GET` from `https://kidscolorit.com` and the preview origins. This is required so the coloring canvas isn't tainted and the client-side "make my book" merge can fetch PDFs.
- `cdn-staging.kidscolorit.com` uses robots `Disallow: /` and is used by PR builds.

### 3.5 Build time and output size

Assumptions: GitHub-hosted runner with 4 vCPU (use a 4-core larger runner for private repos), about 0.5 s of CPU per design cold, and about 9 R2 objects per design.

| | 500 designs | 10,000 designs |
|---|---|---|
| HTML pages (designs + hubs + printables + letters + static) | ~650 | ~10,900 |
| Pagefind files (one fragment per page + index/filter chunks) | ~700 | ~11,600 |
| **Deployed files** (+ `_astro`, fonts, icons) | **~1,450** (fits the Free tier) | **~22,700** (needs Paid) |
| Deploy size | ~30 MB | ~520 MB |
| R2 objects / size | ~4,600 / ~280 MB | ~91,000 / ~5.6 GB (within the 10 GB free tier) |
| Pipeline, cold | ~1.5 min | ~25 min |
| Pipeline, warm (≤1% changed) | ~15 s | ~1.5 min |
| `astro build` | ~25 s | ~3–4 min |
| Pagefind | ~5 s | ~50 s |
| QA (html-validate on all pages, lychee, JSON-LD, budgets) | ~30 s | ~3 min |
| Upload (Wrangler only sends changed hashes) | ~20 s | ~2–4 min |
| **CI total, cold / warm** | **~4 / ~2.5 min** | **~40 / ~12 min** |

**Phase-2 guardrail:** eight full locale twins at 10k designs would reach about 180k files. So:
- Only translated entities get localized pages (curated sets of about 1–2k designs per locale, not full twins).
- `kci qa deploy-limits` fails the build at 90,000 files.
- The escape valve is moving `pagefind/` to R2, which removes about half of all files.

---

## 4. Page routes

Physical files in `site/src/pages/`:

```
index.astro                 → /                 (en home; static file beats the catch-all)
[...path].astro             → every content route in every locale (dispatcher)
color/index.astro           → /color/           (app shell)
search/index.astro          → /search/          (noindex)
favorites/index.astro       → /favorites/       (noindex)
offline/index.astro         → /offline/         (noindex, SW fallback)
404.astro
rss.xml.ts                  → /rss.xml
feeds/[hub].xml.ts          → /feeds/ramadan-coloring-pages.xml   (Pinterest auto-publish per board)
robots.txt.ts  llms.txt.ts  manifest.webmanifest.ts
```

The dispatcher:

```astro
---
// src/pages/[...path].astro
import { getRouteManifest } from '~/lib/routes';
import * as T from '~/templates';
export async function getStaticPaths() {
  const routes = await getRouteManifest();
  return routes.filter(r => r.kind !== 'home' || r.locale !== 'en')
               .filter(r => !['color'].includes(r.kind) || r.locale !== 'en')
               .map(r => ({ params: { path: r.path.slice(1, -1) }, props: { route: r } }));
}
const { route } = Astro.props;
const Template = T.byKind[route.kind];
---
<Template route={route} />
```

Each template file in `src/templates/` also exports `paths(locale)`, a query on the collections. The manifest builder calls these functions, so every template keeps its own getStaticPaths logic.

| Kind | EN URL pattern (example) | Template's `paths()` source | Composes | Index | JSON-LD |
|---|---|---|---|---|---|
| home | `/` | — | Header, SeasonalHero (next event from `events`), FeaturedHubs (Islamic-first), NewDesigns(12), ParentGrid, PrintablesStrip, ImageryPromise, TrustBlock, Footer | yes | Organization, WebSite |
| parent | `/islamic-coloring-pages/`, `/animal-coloring-pages/` | topics `kind=parent` | Breadcrumbs, HubIntro, HubCard grid (child hubs + counts), FeaturedDesigns, FaqList, RelatedHubs, AdSlot×2 | yes | CollectionPage + ItemList(hubs), BreadcrumbList, FAQPage |
| hub | `/{topic}-coloring-pages/` (`/ramadan-coloring-pages/`, `/mosque-coloring-pages/`) | topics `kind∈{topic,series}` with ≥ 6 published designs | Breadcrumbs, H1 formula, HubIntro (≤ 60 words), QuickActions (book PDF, color online), **kci-filter-bar**, DesignGrid (DesignCard × all), EventDates (if event), long MDX guide, RelatedPrintables, FaqList, AuthorByline + ReviewedBy, AdSlot (after rows 2 and 6) | yes | CollectionPage + ItemList(designs), BreadcrumbList, FAQPage |
| activity-hub | `/ramadan-activities-for-kids/` | topics `kind=activity-hub` | as hub, with mixed PrintableCard + DesignCard and a calendar/tracker spotlight | yes | CollectionPage, BreadcrumbList, FAQPage |
| design | `/{primary-hub}/{design}/` (`/ramadan-coloring-pages/crescent-lantern-mandala/`) | designs `status=published` | Breadcrumbs, H1 "{Title} Coloring Page", hero `<figure class="print-art">` (1200w, `fetchpriority=high`), DownloadButtons + kci-paper, ColorOnlineLink, kci-print, kci-favorite, PinterestLink, DesignFacts, description, QuranRef (if any), MoreFromHub(8), AlsoIn, BooksContaining, LicenseNote, AdSlot (below the art, never adjacent to the buttons) | substance gate | WebPage(ItemPage) + ImageObject (licensable), BreadcrumbList |
| letter-hub | `/arabic-alphabet/` | — | LetterTile grid × 28 (glyph in `--font-arabic`), format tabs (coloring/tracing/worksheet as anchor sections), All-28 book CTA, FaqList | yes | CollectionPage, ItemList, BreadcrumbList |
| letter | `/arabic-alphabet/{letter}/` (`/arabic-alphabet/alif/`) | letters | FormsTable (isolated/initial/medial/final), Coloring (DesignCard), Tracing + Worksheet (PrintableCard), "Alif is for Ananas" words (animate words behind beings flags), Prev/Next | yes | LearningResource, BreadcrumbList |
| printables | `/printables/` | — | type tiles, seasonal spotlight | yes | CollectionPage |
| printable-type | `/printables/{type}/` (`/printables/calendars/`) | distinct printable types | PrintableCard grid, filter bar | yes | CollectionPage, ItemList |
| printable | `/printables/{type}/{slug}/` (`/printables/calendars/ramadan-calendar-2027/`) | printables published | page previews, DownloadButtons, WhatsInside, HowToUse (parents/teachers), SupersededBy banner, related | yes | LearningResource + DigitalDocument, BreadcrumbList |
| books | `/coloring-books/` | — | book grid | yes | CollectionPage |
| book | `/coloring-books/{slug}/` (`/coloring-books/ramadan-coloring-book/`) | bundles | cover, page thumbnails, page count, DownloadButtons (merged PDF), contents list linking each design | yes | CollectionPage + ItemList, BreadcrumbList |
| author | `/authors/{slug}/` | authors | bio, role, credentials, designs by / reviewed by | yes | ProfilePage + Person |
| calendar | `/islamic-calendar-for-kids/` | events | per-year table (expected dates + moon-sighting note), links to hubs | yes | WebPage, BreadcrumbList |
| page | `/about/ /license/ /privacy/ /terms/ /islamic-imagery-policy/ /editorial-policy/ /parents-and-teachers/ /request-a-page/ /contact/ /accessibility/` | pages | ProseLayout (MDX) | per `noindex` | WebPage (AboutPage / ContactPage) |
| color | `/color/` | — | AppLayout, SSR'd intro + Gallery (popular, favorites, saved), `<CanvasColoring client:only="react">` | yes (one page) | WebApplication |
| locales | `/{loc}/{localized-slug}/…` (`/id/mewarnai-ramadhan/lentera-bulan-sabit/`) | same queries filtered by `slugs[loc]` + translation present | same templates; `dir` from locale | yes | same + inLanguage |

**URL rules:**
- Everything is lowercase ASCII kebab-case with a trailing slash.
- The design slug is globally unique, and its primary hub is part of the path.
- Changing the primary hub requires a `previousPaths` entry, which generates a 301.
- Retired designs 301 to their primary hub.

---

## 5. Islands and JS budgets

### 5.1 CanvasColoring

`/color/` is a dedicated route that mounts the island with `client:only="react"`. The design comes from `location.hash` (`/color/#crescent-lantern-mandala`).

I didn't choose either `client:idle` or `client:visible`, for these reasons:
- **Not `client:idle`.** On a dedicated route the canvas *is* the page. `idle` waits for `requestIdleCallback`, which on the low-end Android devices that dominate in Bangladesh and Indonesia adds 1–3 s of dead UI.
- **Not `client:visible`.** The canvas is above the fold, so `visible` fires immediately and is just `load` with an IntersectionObserver added.
- **Why `client:only`.** Server-rendering a canvas produces nothing useful, and it skips the SSR and hydration mismatch cost.
- **Perceived speed.** The SSR'd shell shows the line-art preview as a plain `<img>` at once, which is the LCP element, and the island replaces it in place.

How the engine works:
- **Two engines.**
  - The **region engine** is used for generated art, where every region is guaranteed closed by QA. It inserts the sanitized SVG (DOMParser, then strips script, foreignObject and `on*` attributes) and fills `path[data-r]`. The fill is vector-perfect and stays crisp at any zoom.
  - The **raster engine** is used for illustrated art. It rasterizes the line art to 2048 px and runs a scanline flood fill in `floodfill.worker.ts` on a `Uint32Array`, with tolerance and a 1 px dilation to close gaps.
- **Layers, bottom to top:** fills, then the brush canvas, then line art (`pointer-events: none`, multiply).
- **Tools:** bucket and gradient fill, brush, eraser, eyedropper, undo/redo (command stack: fills as `{r, from, to}`, strokes as point arrays, raster undo as 64×64 tile diffs), more than 25 palettes (including Iznik, Zellige, Ramadan Night and Desert), pinch-zoom/pan via pointer events and CSS transforms, and color-by-number mode (labels from `region.label`, with a hint for the wrong color).
- **Autosave** to IndexedDB (`idb-keyval`), key `art:{slug}`, debounced at 1 s. The gallery shows saved works.
- **Export:** composite at 2400 px, `canvas.toBlob('image/png')`, then `a[download]` from a blob URL (same-origin, so the `download` attribute works), with a small "kidscolorit.com" corner mark. On mobile it shares through Web Share Level 2 (files).
- **Cross-origin:** SVG is fetched with `credentials: 'omit'` from the CORS-enabled CDN.

### 5.2 Other interactive elements (vanilla custom elements, no React)

| Element | Behaviour | gz |
|---|---|---|
| `kci-search` (header) | Dynamic `import('@pagefind/component-ui')` on click or the `/` key, then injects `<pagefind-modal>` with filters (topic, age, difficulty, beings, type). Pagefind 1.5's Component UI is web components, so no React. | ~1 KB, plus ~30 KB UI + wasm on demand |
| `kci-favorite` | Toggles `localStorage['kci:favs:v1']` (max 500). Stores a card snapshot (slug, title, thumb, url, pdf urls), so `/favorites/` needs no index fetch. `aria-pressed`, event goes to `kci-fav-count`. | ~1.2 KB |
| `kci-filter-bar` | Filters cards already in the DOM by `data-age`, `data-difficulty`, `data-beings` and `data-style`. State lives in `location.hash` (`#age=preschool&level=easy`), which never creates an indexable URL. Live region: "Showing 18 of 42". The "prebuilt index" here is the server-rendered `data-*` attributes, so there's zero fetch. `/browse/`-style cross-site filtering uses Pagefind's filter-only search, not a separate 1 MB JSON. | ~3 KB |
| `kci-strict` (header toggle) | "Hide animals & people". The value is persisted, and a 200-byte head script sets `<html data-strict>` before first paint, so there's no CLS. CSS: `[data-strict] [data-beings]:not([data-beings=""]){display:none}`. | ~0.6 KB |
| `kci-paper` | Letter/A4 preference (§6). | ~0.5 KB |
| `kci-print` | Swaps the hero `src` to the SVG, `await img.decode()`, then `window.print()`. | ~0.5 KB |
| `kci-share` | Web Share API with a fallback to copying the link. | ~0.5 KB |

Pinterest uses a plain link (`https://www.pinterest.com/pin/create/button/?url=…&media=…&description=…`). pinit.js is not loaded because it's a tracker.

### 5.3 JS budgets (gzip, enforced by `kciBudgets` and LHCI)

| Template | Budget | Contents |
|---|---|---|
| All pages (inline head) | ≤ 1.5 KB | strict/paper boot, SW register, speculation rules JSON |
| Home | ≤ 6 KB | search launcher, favorites count |
| Hub / parent / printables / books | ≤ 10 KB | plus filter bar and favorites |
| Design / printable / letter | ≤ 8 KB | plus print, paper, favorite, share |
| `/favorites/` | ≤ 8 KB, then pdf-lib (~75 KB) lazily on "Make my coloring book" | client-side merge of favorite PDFs |
| `/color/` | ≤ 130 KB | React 19 + react-dom (~58 KB), app ≤ 60 KB, flood-fill worker ~6 KB (lazy) |

No page except `/color/` loads React.

---

## 6. Print and download

**DownloadButtons.astro.** Both links are server-rendered, so they work without JS and both are visible to crawlers:

```astro
<div class="dl">
  <a class="btn" data-paper="letter" href={a.pdf.letter} download={`${slug}-coloring-page-letter.pdf`} rel="nofollow">
    Download PDF · US Letter <small>{kb(a.pdf.letterBytes)}</small></a>
  <a class="btn" data-paper="a4" href={a.pdf.a4} download={`${slug}-coloring-page-a4.pdf`} rel="nofollow">
    Download PDF · A4 <small>{kb(a.pdf.a4Bytes)}</small></a>
  <kci-paper><button type="button">Letter</button><button type="button">A4</button></kci-paper>
</div>
```

**Paper detection.** An inline, CSP-hashed script in the head runs before paint:

```js
(()=>{let p;try{p=localStorage.getItem('kci:paper')}catch{}if(!p){const r=(navigator.languages||[navigator.language])
.map(l=>{try{return new Intl.Locale(l).maximize().region}catch{return''}}).find(Boolean)||'';
p=/^(US|CA|MX|PH|CL|CO|CR|DO|GT|PA|PR|SV|VE)$/.test(r)?'letter':'a4'}document.documentElement.dataset.paper=p})()
```

- `Intl.Locale.maximize()` turns `en` into `en-Latn-US` (Letter), `id` into Indonesia (A4) and `bn` into Bangladesh (A4).
- CSS makes the matching button primary and orders it first with `order`. The two buttons are the same size, so there's no layout shift.
- The toggle writes `kci:paper`.

**Headers.** The `download` attribute is ignored on cross-origin links, so the `kci-cdn-pdf` Worker on `cdn.kidscolorit.com/pdf/*` returns:

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="crescent-lantern-mandala-coloring-page-letter.pdf"   (?view=1 → inline)
Link: <https://kidscolorit.com/ramadan-coloring-pages/crescent-lantern-mandala/>; rel="canonical"
Cache-Control: public, max-age=86400, s-maxage=2592000
Access-Control-Allow-Origin: https://kidscolorit.com
```

- The Worker also calls `EVENTS.writeDataPoint({ blobs: ['pdf', slug, paper, cf.country], indexes: [slug] })`. That gives accurate server-side download counts, including ad-blocked and hot-linked downloads, without storing any IP.
- The canonical header folds backlinks to a PDF into the page's ranking.

**Print stylesheet** (`print.css`, loaded with `media="print"`):

```css
@page { margin: 0.4in; }
@media print {
  html, body { background: #fff !important; }
  body * { visibility: hidden !important; }
  .print-art, .print-art * { visibility: visible !important; }
  .print-art { position: fixed; inset: 0; display: grid; place-items: center; }
  .print-art img { width: 100%; height: 100%; object-fit: contain; }
  .print-credit { visibility: visible !important; position: fixed; bottom: 0; inset-inline: 0; text-align: center; font: 8pt var(--font-sans); }
  .ad-slot, header, footer, nav { display: none !important; }
}
```

- `kci-print` swaps in the vector SVG first, for crisp output.
- Ctrl+P prints the 1200w WebP; a `beforeprint` handler swaps it if time allows, and the WebP is acceptable either way.
- `@page { size: auto }` respects the printer default. The exact Letter or A4 fit comes from the PDF.

---

## 7. SEO plumbing

### 7.1 Formulas (`packages/core/seo-format.ts`)

| Page | `<title>` (≤ 60 chars; drop "Free" before dropping the count) | Meta description (≤ 155) |
|---|---|---|
| Topic hub | `{count} {Name} Coloring Pages{ year} (Free Printable PDFs)`, e.g. "42 Ramadan Coloring Pages 2027 (Free Printable PDFs)" | `Download {count} free {name} coloring pages for kids: {hook}. Print US Letter or A4 PDFs or color online. No sign-up.` |
| Parent | `{Name} Coloring Pages: {total}+ Free Printables in {k} Themes` | `Explore {k} {name} themes…` |
| Design | `{Title} Coloring Page (Free PDF)`, plus `" | KidsColorIt"` if it fits | `{summary} Free printable {hub} coloring page for {ageLabel}: download a Letter/A4 PDF or color it online.` |
| Printable | `{Title}{ year}: Free Printable for Kids (PDF)` | `{summary} {pages} pages · Letter & A4 · ages {ages}.` |
| Letter | `{Name} ({char}) Coloring Page, Tracing & Worksheet (Free PDF)` | `Learn the Arabic letter {Name} ({char}): coloring page, tracing sheet and worksheet with all four letter forms.` |
| Book | `{Title}: {pages}-Page Free Printable Coloring Book (PDF)` | |
| Home | `KidsColorIt: Free Islamic & Kids Coloring Pages, Printables & Online Coloring` | |

- Counts are computed from the collection at build time, so they're always consistent; inconsistent counts are a known SketchJoy weakness.
- **Year stamp** (for `yearStamp: true` hubs): `o` is the next occurrence with `buildDate ≤ o.end + lagDays`. If `buildDate ≥ o.start − titleYearLeadDays` (150), append the year of the majority of `o`'s days (`label` overrides this, e.g. for Ramadan 1452, which starts Dec 26 2030). H1, title and intro use the same year. The URL never changes.
- **Indexability gate for designs.** A design is `indexable` only if it is `published` with assets, its description is ≥ 60 words, its alt text and summary are unique site-wide (cosine similarity < 0.8 against siblings), and its primary hub is indexable. Everything else gets `noindex,follow` and is left out of sitemaps. This protects against scaled thin content at 10k pages.
- **Alt text formula:** `{Title} coloring page: {visual description}`. Image filenames are `{slug}-coloring-page-{w}.webp`.

### 7.2 `BaseHead.astro`

```ts
interface Props {
  title: string; description: string; route: RouteEntry; robots?: 'index,follow'|'noindex,follow';
  og: { type: 'website'|'article'; image: string; width: number; height: number; alt: string };
  pinterest?: { media: string; description: string };
  lcp?: { srcset: string; sizes: string; href: string };
  jsonLd: Graph; rssHref?: string;
}
```

It emits, in this order:
1. charset and viewport
2. `<title>`
3. `preconnect` to the CDN
4. LCP `preload` (`imagesrcset`/`imagesizes`, `fetchpriority=high`)
5. `<Font cssVariable="--font-sans" preload />` (Latin variable font only)
6. the hashed boot scripts (strict, paper, SW)
7. description
8. canonical (absolute, self)
9. `hreflang` for each `route.alternates`, plus `x-default` pointing to `en`, emitted only when there are at least two alternates
10. robots
11. OG: `og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, width, height, alt, `og:locale` and `og:locale:alternate`
12. `twitter:card=summary_large_image` plus title, description and image
13. `p:domain_verify`
14. `theme-color`, manifest, icons
15. RSS alternate (hubs)
16. `<SpeculationRules/>`
17. `<JsonLd/>`

The hero image carries `data-pin-media={pin}` and `data-pin-description`. UI images get `nopin`.

### 7.3 JSON-LD library (`src/lib/seo/jsonld.ts`, typed with `schema-dts`)

```ts
export const id = { org: `${SITE}/#org`, site: `${SITE}/#website`,
  page: (u: string) => `${u}#webpage`, img: (u: string) => `${u}#primaryimage`, crumbs: (u: string) => `${u}#breadcrumb` };
export function orgNode(): Organization;                 // name, url, logo, sameAs, parentOrganization: Color Experts International
export function websiteNode(l: Locale): WebSite;         // no SearchAction (sitelinks search box retired)
export function breadcrumbNode(url: string, c: Crumb[]): BreadcrumbList;
export function imageNode(d: Design, pageUrl: string, l: Locale): ImageObject;
  // contentUrl(1200w), thumbnailUrl(360w), width, height, caption, encodingFormat, creator, creditText,
  // copyrightNotice, license: `${SITE}/license/`, acquireLicensePage: `${SITE}/license/` → "Licensable" badge
export function designPageNode(d: Design, url: string, l: Locale): WebPage;  // @type ItemPage, primaryImageOfPage, isPartOf hub
export function hubNode(t: Topic, items: Design[], url: string, l: Locale): CollectionPage; // mainEntity ItemList, numberOfItems
export function printableNode(p: Printable, url: string): LearningResource;  // + DigitalDocument, educationalLevel, learningResourceType, teaches
export function bookNode(b: Bundle, url: string): CollectionPage;
export function faqNode(f: Faq[], l: Locale): FAQPage;   // rendered visibly; rich result not expected (restricted), useful for AI/Bing
export function authorNode(a: Author): ProfilePage;      // mainEntity Person
export function graph(...nodes: Thing[]): Graph;         // { "@context": "https://schema.org", "@graph": [...] }
```

`<JsonLd graph>` serializes with `<` escaped as `\u003c`. JSON-LD is a non-executable script type, so CSP doesn't apply to it.

**Breadcrumbs.astro:** `<nav aria-label="Breadcrumb"><ol>`. The separator is drawn in CSS, so RTL mirrors it automatically. Data comes from `route.breadcrumbs`: Home › Islamic Coloring Pages › Ramadan Coloring Pages › Crescent Lantern Mandala.

### 7.4 Sitemaps

- `@astrojs/sitemap` 3.7 `chunks` (added in 3.7.0) produces `sitemap-hubs-*.xml`, `sitemap-designs-*.xml`, `sitemap-printables-*.xml` and `sitemap-pages-*.xml`, and later per-locale `designs-id` and so on, with `entryLimit: 10000`.
- `serialize()` adds `lastmod` from `updatedAt`, falling back to `assets.renderedAt`. It also adds `links` (hreflang) from the route manifest, because localized slugs defeat the integration's same-path i18n pairing.
- `filter` drops non-indexable URLs.
- `kciSeoFiles` writes `sitemap-images-{n}.xml` (≤ 5,000 URLs each, `<image:image><image:loc>` for the 1200w hero) and appends them to `sitemap-index.xml` (or uses `customSitemaps` if 3.7.x supports it; verify).
- Verify `cdn.kidscolorit.com` as its own Search Console property for image reports.

### 7.5 `robots.txt` (`robots.txt.ts`, from config)

```
User-agent: *
Allow: /
Disallow: /search/
Disallow: /favorites/
Disallow: /offline/
Disallow: /api/

# Training-only crawlers (site.robots.blockAiTraining) — answer/search bots stay allowed
User-agent: GPTBot
User-agent: CCBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Bytespider
User-agent: meta-externalagent
User-agent: ClaudeBot
Disallow: /

Sitemap: https://kidscolorit.com/sitemap-index.xml
```

OAI-SearchBot, ChatGPT-User, PerplexityBot and Claude-SearchBot are allowed because ChatGPT referrals are real traffic. Blocking Google-Extended doesn't affect Search or AI Overviews. Cloudflare's managed robots.txt must be **disabled**, so ours is the one served. The CDN gets its own robots.txt that allows `/d/` and `/pdf/` and disallows `/_meta/`.

### 7.6 llms.txt, RSS and IndexNow

- **`llms.txt`** is generated from the manifest:
  - an H1 and a summary blockquote (what the site is; PDF formats; no sign-up; imagery promise)
  - sections "Islamic & seasonal hubs", "Evergreen hubs", "Printables", "Coloring books" and "Policies" (imagery policy, license, editorial policy)
  - each entry is `- [Title](url): one-liner with count`
  - hubs and printables only, not 10k designs
- **RSS:**
  - `/rss.xml` lists the latest 50 designs.
  - `/feeds/{hub}.xml` exists per hub, with `<enclosure>` set to the 1000×1500 pin JPG and the image also in the description. Each feed connects to a Pinterest board's RSS auto-publish, which matters for seasonal reach.
- **IndexNow** (`scripts/seo/indexnow.ts`):
  - Diff `dist/route-manifest.json` against the last deployed `_meta/route-manifest.json`, collecting new URLs and URLs whose `lastmod` changed (indexable only), plus 301s.
  - POST `https://api.indexnow.org/indexnow` with `{host, key, keyLocation, urlList}`, in batches of 10k.
  - Upload the new manifest.
  - Google relies on sitemaps and accurate `lastmod`.

### 7.7 `_headers` (generated; ≤ 100 rules)

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: SAMEORIGIN
  Content-Security-Policy: frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/pagefind/*
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400
/sw.js
  Cache-Control: no-cache
/manifest.webmanifest
  Cache-Control: public, max-age=86400
/search/*
  X-Robots-Tag: noindex
/favorites/*
  X-Robots-Tag: noindex
/offline/*
  X-Robots-Tag: noindex
```

- HTML keeps the Workers default (revalidate with ETag).
- Preview builds add `/*  X-Robots-Tag: noindex`.
- `camera=(self)` is enabled only when photo-to-coloring ships.

### 7.8 `_redirects` (generated)

- Rules come from `previousPaths` and retired entries, as `/old/ /new/ 301`.
- QA fails above 1,900 static or 90 dynamic rules; the escape path is Cloudflare Bulk Redirects.
- www→apex and http→https are zone Redirect Rules, not in the file.
- `html_handling: force-trailing-slash` canonicalizes `/foo` to `/foo/`.

### 7.9 CSP strategy

There are two policies, and both are enforced:
1. **The header policy** carries the directives a meta tag can't (`frame-ancestors`, `base-uri`, `object-src`, `form-action`).
2. **Astro's meta policy** carries hashed `script-src`/`style-src`. Inline boot scripts are constants in `inline-scripts.ts`, so their SHA-256 hashes are computed in `astro.config.ts`. `'wasm-unsafe-eval'` is there for Pagefind and `'inline-speculation-rules'` for speculation rules.

Template rule: avoid inline `style=""` attributes, because hashes disable `'unsafe-inline'`. Use classes or CSSOM from JS.

**When ads are enabled later:**
- Google documents only a strict, nonce-based CSP with `'strict-dynamic'` for AdSense and GPT, not host allowlists. Our static equivalent is `strictDynamic: true` plus a **hashed inline `AdBootstrap`** that injects the CMP, `adsbygoogle.js` and the Cloudflare beacon. Host allowlists are ignored under strict-dynamic, so the beacon must also be bootstrapped.
- Run it as `Content-Security-Policy-Report-Only` for 2 weeks, with reports going to `/api/csp`.
- Fallback if AdSense rejects hash-based policies: the `kci-site` Worker runs first on HTML and injects a per-request nonce with `HTMLRewriter`. That costs one invocation per page view, which is fine on Paid.

Cloudflare zone hygiene: disable Rocket Loader and Email Obfuscation, because they inject scripts that break the CSP.

---

## 8. Feature flags and monetization scaffolding

**`AdSlot.astro`**

```astro
---
interface Props { id: 'hub-row-2'|'hub-row-6'|'design-below-art'|'rail-desktop'; format: 'in-feed'|'rectangle'|'leaderboard' }
const { id, format } = Astro.props;
if (!flags.ads) return null;                       // launch: renders NOTHING (no empty gaps)
const h = { 'in-feed': [280, 280], rectangle: [280, 280], leaderboard: [0, 120] }[format]; // [mobile, desktop] px
---
<div class={`ad-slot ad-${format}`} data-slot={id} style-class-min-h aria-hidden="true"><!-- min-height via class --></div>
```

- Every template places `<AdSlot>` at fixed positions from day one. DESIGN.md designs the layout with and without them, so enabling ads changes initial layout but causes no post-render shift: the min-heights are reserved in CSS classes, not inline styles.
- Placement rules:
  - never inside `.print-art`
  - never within 150 px of the download or print buttons (accidental-click policy)
  - none on `/color/` above the canvas
  - none in print
  - manual units only, Auto ads off
- **Ad-free membership hint:** the head boot script reads a non-HttpOnly `kci_adfree=1` cookie and sets `<html data-ads="off">` before paint. `AdBootstrap` then exits early and CSS hides the slots. Spoofing it only costs us that user's ad revenue, and the real entitlement check stays server-side.
- **Runtime kill switch:** `AdBootstrap` fetches `/flags.json` (cached 5 min) before loading anything, so ads can be turned off without a rebuild.
- **`ads.txt`** is generated only when `flags.ads` is on.

**Consent (stub, `flags.consent`):**
- Google Privacy & Messaging, a certified TCF v2.2 CMP, loads from `AdBootstrap` ahead of ads. It handles the EEA/UK/CH (and US-state) messages.
- Consent Mode v2 defaults to denied for `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage`.
- Because the audience is children, ad requests are tagged child-directed (`childDirected: true`, giving non-personalized or limited ads only). The site is also designated child-directed in Google's COPPA settings. Expect a lower RPM, and check Mediavine's and Raptive's child-directed policies before applying.

**Membership (stub only, `flags.membership`):**
- **Stack:** Astro Cloudflare adapter; `src/fetch.ts` composes `/api/*`; Sessions on the KV driver; D1 for `users`, `subscriptions`, `entitlements` and `artworks`; R2 for saved artworks.
- **Payments:** Lemon Squeezy or Paddle as merchant of record, because Stripe doesn't onboard Bangladesh-registered entities directly and an MoR handles VAT/GST globally. Stripe only if a US or UK entity exists.
- **Accounts** are adults only (parents and teachers), with a magic-link login.
- **Entitlements:** ad-free, one-click book ZIPs, cloud-synced artworks.
- **Stub files:**
  - `src/lib/membership/index.ts`, where `getEntitlements()` returns `{ tier: 'free', adFree: false }`
  - `workers/edge/migrations/0001_init.sql` (not applied)
  - `/api/billing/webhook` (returns 501)
- **AI generator** (`flags.aiGenerator`): a server route `/create/` with `prerender=false`, a prompt filter enforcing the imagery policy, vectorize, then QA, rate limiting through the Workers Rate Limiting binding, and gated to adults because free text may contain personal information.

---

## 9. PWA and offline

**`manifest.webmanifest`** (endpoint, per locale later):

```json
{"id":"/","name":"KidsColorIt – Coloring Pages & Islamic Printables","short_name":"KidsColorIt","start_url":"/",
 "display":"standalone","background_color":"#FFFDF7","theme_color":"<brand>","lang":"en","dir":"ltr",
 "categories":["education","kids","entertainment"],
 "icons":[{"src":"/icons/192.png","sizes":"192x192","type":"image/png"},{"src":"/icons/512.png","sizes":"512x512","type":"image/png"},
          {"src":"/icons/maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}],
 "shortcuts":[{"name":"Color online","url":"/color/"},{"name":"My favorites","url":"/favorites/"}]}
```

**Service worker.** It's hand-rolled (`src/sw/sw.ts`, about 3 KB, built by the `kciServiceWorker` integration). Workbox isn't needed for four strategies. Registration happens on `requestIdleCallback` after load.

| Request | Strategy | Cap |
|---|---|---|
| Precache (install) | `/color/` shell and its `_astro` chunks (read from `dist/color/index.html`), `/offline/`, Latin font, logo | ~160 KB |
| Navigations | network-first with a 3 s timeout, then the cached page, then `/offline/` (lists cached designs) | 40 pages, LRU |
| `cdn…/d/*.webp` | stale-while-revalidate | 300 entries / 40 MB |
| `cdn…/d/*.svg` | cache-first after the first open in `/color/` (offline coloring of recent designs) | 100 entries |
| `/pagefind/*` | stale-while-revalidate | — |
| Favorites "Available offline" toggle | explicit `cache.addAll([svg, pdfLetter, pdfA4])` | user-controlled |

The cache names include `BUILD_ID`, and old caches are deleted on activate. Precaching is skipped when `navigator.connection?.saveData` is set.

---

## 10. Privacy and child safety

- **No cookies at launch, and no third-party scripts except the Cloudflare Web Analytics beacon** (cookieless, no fingerprinting). Excluded: Google Fonts CDN, Pinterest JS, YouTube embeds and reCAPTCHA.
- **First-party events** (`/api/e`: color-start, png-save, print, filter-use) go through `navigator.sendBeacon` to the Worker and into Analytics Engine with `{event, slug, country}` only. No IP, no ID and no user agent are stored. PDF downloads are counted server-side (§6).
- **Request a page:** a topic field of at most 80 characters plus an age band. There are no name or email fields. The server strips anything that looks like an email, URL or phone number and writes the request to Analytics Engine; a weekly review uses the SQL API. Abuse protection is a Workers rate-limit binding plus a honeypot field. No D1 is needed at launch.
- **COPPA:** the amended rule's compliance date was April 22 2026, and the FTC is enforcing it. We collect no personal information from children: no accounts, uploads, comments or chat, and no persistent identifiers for behavioral ads (ads later are child-directed tagged). localStorage and IndexedDB hold only data the user explicitly asked to keep (favorites, artworks), and it stays on the device.
- **GDPR-K / UK Children's Code:** high-privacy defaults, no nudges, no geolocation, and a DPIA in `docs/PRIVACY.md`. Strictly-necessary local storage needs no consent banner. The banner arrives only with ads.
- **Pages:** `/privacy/`, and a `/parents-and-teachers/` page that explains in plain language what is and isn't stored.
- **Future features:** photo-to-coloring runs entirely on the device (edge detection in a Web Worker) with no upload. Any AI or membership feature is adult-gated.

---

## 11. Testing and CI

### 11.1 Unit tests (Vitest 5, `test.projects`: generators, core, site-lib)

- **Determinism:** for each generator, run 5 fixed seeds and match `sha256(svg)` against an inline snapshot. Changing output without bumping `version` fails the run. The SVG files themselves are stored with `toMatchFileSnapshot`, so PR diffs are reviewable.
- **Property tests** (`fast-check`, 100 random seeds per generator):
  - every region path is closed (`Z`) and not self-intersecting
  - the region count is within bounds for the difficulty (easy ≤ 30, medium ≤ 80, hard ≤ 200)
  - minimum region area at Letter size is ≥ 400 mm² for toddler, 150 for preschool, 40 for ages 6–12 and 6 for adults
  - minimum stroke is ≥ 1.2 mm for bold-easy, 0.6 mm for medium and 0.35 mm for detailed
  - everything sits inside the 6.35 mm safe area
  - the SVG is ≤ 300 KB
  - `declares.beings` is empty and no banned subject tags appear
- **Leak and closure gate** (`qa/closure.ts`): render the line layer at 1600 px with resvg. For each region, flood-fill from its pole of inaccessibility (polylabel). The fill must stay inside the region mask dilated by the stroke width (no leak) and cover at least 90% of it (no blocked pockets). Illustrated intake requires at least 98% closed regions, otherwise the art goes back to vectorizing.
- **Arabic:** the forms table is correct for all 28 letters, tracing sheets read right-to-left, and the text-to-path glyphs match font shaping (HarfBuzz via fontkit).
- **Core:**
  - the Hijri converter matches a known table for 1447–1452 AH
  - the year-stamp function handles the Ramadan 2030 double case
  - the route manifest has no duplicate paths and no reserved slugs
  - title and description fitting stay within limits for every real entry
- **Pipeline:** running twice in a row results in zero uploads (idempotency).

### 11.2 Visual regression

`visual.yml` covers 60 curated samples (each generator at 3 seeds). They're rendered with resvg to PNG and compared with `pixelmatch` (threshold 0.1, ≤ 0.1% of pixels may differ) against baselines in `packages/generators/test/__visual__/`. A contact-sheet HTML of changed outputs is uploaded as a CI artifact for the design team to review. Template-level screenshots (home, hub, design, `/color/`, an RTL fixture) use Playwright `toHaveScreenshot` in a pinned Docker image.

### 11.3 End-to-end (Playwright 1.64, against `wrangler dev` on `dist` + a local CDN server with identical headers)

- `journey.spec.ts`:
  1. Home, then the Ramadan hub, then a design card.
  2. Assert the PDF href is on the CDN, and that a `request.get` returns 200 `application/pdf` with `attachment`.
  3. Click "Color online" and land on `/color/#slug`.
  4. Click a region and assert its fill; undo, then redo.
  5. Click "Save PNG", wait for `download`, and check that the filename ends in `.png` and the file is larger than 10 KB.
  6. Reload and confirm the autosave was restored.
- `filters.spec.ts`: the strict toggle hides cards with animals and persists across pages; the hash state round-trips.
- `print.spec.ts`: `emulateMedia({ media: 'print' })`, then a screenshot showing only `.print-art` is visible.
- `offline.spec.ts`: visit, then `context.setOffline(true)`; `/color/` and recently viewed pages still load.
- `seo.spec.ts`: every template has one H1, canonical, OG and valid JSON-LD.
- `a11y.spec.ts`: `@axe-core/playwright` reports zero serious violations.
- `rtl.spec.ts`: a fixture `ar` locale built with `PUBLIC_KCI_TEST_LOCALES=ar`.

### 11.4 Post-build QA (`kci qa`)

- `html-validate` on every page
- `validate-jsonld.ts`: parse every block and check required properties per type (BreadcrumbList, ImageObject license fields, Organization, ProfilePage, LearningResource), using our own rules because the Rich Results Test has no API. One URL per template is checked manually in the Rich Results Test before each release.
- `seo-lint.ts`:
  - unique titles and descriptions
  - title 30–60 characters, description 70–160
  - self-referencing canonical
  - reciprocal hreflang
  - nothing noindexed appears in a sitemap
  - every image has alt text
  - no orphans (each page reachable from at least one hub)
  - at least 3 internal links per page
- `lychee --offline` for internal links; external links are checked nightly.
- `js-budget.ts` and `deploy-limits.ts` (file count, 25 MiB per file, `_headers` and `_redirects` caps).

### 11.5 Lighthouse CI

Run on 6 URLs, mobile, simulated slow 4G:
- **Category scores:** Performance ≥ 0.95, Accessibility = 1, SEO = 1, Best Practices ≥ 0.95.
- **Metrics:** LCP ≤ 2.0 s, CLS ≤ 0.02, TBT ≤ 150 ms (≤ 250 ms on `/color/`).
- **Resource budgets:** script sizes as in §5.3.

### 11.6 GitHub Actions (`ci.yml` sketch)

```yaml
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest-4-cores
    env: { KCI_BUILD_DATE: ${{ github.event.pull_request.updated_at }}, KCI_BUCKET: kci-cdn-staging }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - uses: actions/cache@v4
        with: { path: "site/.astro\nsite/node_modules/.astro\n.kci/cache", key: kci-${{ hashFiles('content/**','packages/**','pnpm-lock.yaml') }}, restore-keys: kci- }
      - run: pnpm biome ci && pnpm -r typecheck && pnpm --filter site astro check
      - run: pnpm vitest run
      - run: pnpm kci pipeline --bucket $KCI_BUCKET
        env: { R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}, R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }} }
      - run: pnpm --filter site build && pnpm --filter site pagefind && pnpm kci qa
      - run: npx playwright install --with-deps chromium && pnpm e2e
      - run: pnpm lhci autorun
      - run: npx wrangler versions upload --preview-alias pr-${{ github.event.number }}
        env: { CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}, CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }} }
```

- `deploy.yml` (on main): the same steps against the prod bucket, then `wrangler deploy`, `kci purge`, `kci indexnow`, and copying the manifests to `_meta/`. Rollback is `wrangler rollback`.
- `nightly.yml`: rebuild and deploy (year stamps, seasonal rails), external link check, and an export from Analytics Engine to `content/stats/popular.json` committed by a bot PR.

---

## 12. Performance

- **Fonts:**
  - The Astro Fonts API self-hosts from Fontsource with hashed, immutable files and generates metric-matched fallbacks, so `swap` causes about zero CLS.
  - Nunito is a variable font (latin and latin-ext); **only its Latin file is preloaded** (about 38 KB).
  - Baloo Bhaijaan 2 (Arabic subset) loads through `unicode-range` only when Arabic glyphs render, which on English pages means the alphabet pages only.
  - First view is at most 2 font files and at most 100 KB.
  - Phase 2: Baloo Da 2 for Bengali. Urdu Nastaliq is heavy, so use Naskh for UI and Nastaliq only for headings on `ur` pages.
  - Worksheet and OG text is pathified at generation time, so it needs no runtime fonts.
- **Images:**
  - Pipeline WebP only (line art on white compresses well, and AVIF would make encoding about 10× slower across 50k files).
  - Explicit `width`/`height`, with `srcset` (360w, 720w; hero 720w/1200w) and `sizes`.
  - The first row of cards uses `eager`, and the first card or the hero gets `fetchpriority="high"` plus a preload. Everything else is `lazy` with `decoding="async"`.
  - Grids below the fold use `content-visibility: auto; contain-intrinsic-size: 0 420px`.
  - `astro:assets` is used only for local images.
  - The CDN is preconnected. The apex and `cdn.` hosts share Cloudflare anycast IPs and the zone's universal certificate, which lets browsers coalesce HTTP/2 connections.
- **View Transitions:**
  - Native cross-document transitions via `@view-transition { navigation: auto; }` inside `@media (prefers-reduced-motion: no-preference)`. No ClientRouter.
  - A `pageswap`/`pagereveal` handler of about 300 bytes assigns `view-transition-name: hero` through CSSOM to the clicked card thumbnail and the design hero, giving a morph in Chromium and Safari 18.2+. Firefox navigates normally.
- **Prefetch:** inline Speculation Rules with zero runtime JS:
  ```json
  {"prefetch":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/color/*"}},{"not":{"href_matches":"/search/*"}}]},"eagerness":"moderate"}],
   "prerender":[{"where":{"selector_matches":".design-card a, .hub-card a"},"eagerness":"conservative"}]}
  ```
  Prerender is conservative (pointerdown) to avoid inflating analytics. Chromium disables speculation under Save-Data or battery saver.
- **CSS:** one Tailwind 4 file (about 6 KB compressed), immutable. `inlineStylesheets: 'auto'`. Tokens come from `@theme`. Logical properties (`ms-*`, `ps-*`, `start-*`) are used throughout, so RTL is the same CSS with `dir="rtl"`.
- **HTML:** a 120-card hub is about 70 KB raw and about 11 KB with Brotli. A design page is about 25 KB raw.
- **Targets:** LCP ≤ 1.8 s on 4G mobile for hub and design pages, CLS ≤ 0.02, INP ≤ 150 ms (the canvas fill is ≤ 50 ms in region mode).

---

## 13. Verify at implementation (couldn't confirm against primary docs here)

- Astro 7 Node minimum. Assumed 22.x; a third-party source says Node 22.
- Whether route caching is stable or experimental in 7.x, and the config syntax for the Cloudflare CDN cache provider.
- The exact `src/fetch.ts` API.
- Whether the Fonts API is still beta, and whether `<Font preload>` supports subset filters.
- The `security.csp` key names in v7, and whether `is:inline` scripts are auto-hashed (we hash them ourselves anyway).
- Whether `@astrojs/sitemap` 3.7.x has `customSitemaps` (otherwise post-process the index).
- Whether Workers Static Assets `_headers`/`_redirects` rule limits match Pages (100 header rules; 2,000 static + 100 dynamic redirects).
- Whether AdSense accepts a hash-based `strict-dynamic` policy. If not, use the HTMLRewriter nonce fallback (§7.9).

---

### Sources
- [Astro 7 release post](https://astro.build/blog/astro-7/) · [Astro v7 upgrade guide](https://v7.docs.astro.build/en/guides/upgrade-to/v7/) · [Astro June 2026 roundup](https://astro.build/blog/whats-new-june-2026/) · [InfoQ: Astro 7 release](https://infoq.com/news/2026/08/astro-7-release-speed)
- [Astro route caching reference](https://docs.astro.build/en/reference/experimental-flags/route-caching/) · [Astro 6 release](https://a457ba07.previews.astro.build/blog/astro-6/) · [Heise: Astro 6.0](https://www.heise.de/en/news/Web-framework-Astro-6-0-experiments-with-new-Rust-compiler-11207142.html?view=print) · [Astro Font Provider API (v6)](https://v6.docs.astro.build/en/reference/font-provider-reference)
- [Astro CSP (experimental, v5 docs)](https://v5.docs.astro.build/en/reference/experimental-flags/csp/) · [Report URI: Astro CSP](https://docs.report-uri.com/frameworks/astro/) · [Astro clientPrerender](https://docs.astro.build/en/reference/experimental-flags/client-prerender)
- [@astrojs/sitemap (chunks)](https://docs.astro.build/en/guides/integrations-guide/sitemap/) · [Pagefind Component UI (1.5)](https://pagefind.app/docs/search-ui/)
- [Cloudflare: increased static asset limits](https://developers.cloudflare.com/changelog/2025-09-02-increased-static-asset-limits/) · [Workers limits](https://developers.cloudflare.com/workers/platform/limits) · [Pages limits](https://developers.cloudflare.com/pages/platform/limits) · [Pages redirects](https://developers.cloudflare.com/pages/platform/redirects/) · [Workers static assets routing](https://developers.cloudflare.com:8443/workers/static-assets/routing)
- [AdSense CSP help](https://support.google.com/adsense/answer/16283098) · [GPT CSP guide](https://developers.google.com/publisher-tag/guides/content-security-policy)
- [Federal Register: COPPA rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule) · [Davis Polk: COPPA obligations take effect](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect)