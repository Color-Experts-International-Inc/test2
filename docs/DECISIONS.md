# DECISIONS — kidscolorit.com contracts

The binding record of every cross-cutting decision. `docs/PLAN.md` explains the reasoning; this file is the contract that code, tests and agents follow. Change it only through a PR that adds a dated entry to the changelog at the bottom.

## 1. Key decisions

| # | Decision | Choice | Why / what it resolves |
|---|---|---|---|
| 1 | Single contracts record | `docs/DECISIONS.md` is written first in M1 and copies the tables in this plan. `src/lib/routes.ts` is the only code that builds URLs, and a snapshot test covers every path it generates | Resolves: four conflicting URL, asset, schema and unit schemes |
| 2 | Repo shape | One pnpm package: `src/` (Astro), `generators/` (pure TS), `scripts/` (run with tsx), `worker/`. No workspaces | Resolves: the four-package monorepo and `../content` outside the Vite root |
| 3 | Output and hosting | `output: 'static'` on Cloudflare **Workers Static Assets, Paid plan** (100K files per version). Every binary is same-origin under `/files/`. No R2 and no `cdn.` subdomain in year 1; R2 is used later only as a private build cache | Resolves: R2 subdomain vs same-origin. Avoids CORS, cross-origin `download`, and a second GSC property |
| 4 | URL authority | The SEO pattern table (§ Information architecture) is final. Hub slugs are flat; designs sit at `/{primaryHub}/{slug}/`; printables at `/printables/{slug}/`; bundles at `/bundles/{slug}/`; people at `/team/{slug}/`; policy at `/about/islamic-content-guidelines/`. No year ever appears in a URL | Resolves: every URL contradiction |
| 5 | Online coloring route | One noindex app shell at `/color/#{hub}/{slug}`, plus one indexable landing page `/color-online/`. No per-design app URLs, no app prerender | Resolves: four app-route schemes and the crawl-budget waste |
| 6 | Indexability | Hubs need ≥20 designs to be indexable. Design pages are `noindex,follow` unless `seo.index: true`, which requires a named subject unique across the site, evidence of ≥50 searches a month or GSC impressions, editor-approved copy, and a cap of 30 promoted designs at launch, then +20 a week. Families can be force-noindexed in one deploy (`src/data/indexability.ts`) | Resolves: scaled-content-abuse risk on a new domain |
| 7 | Facets and format items | None at launch. Age and difficulty are anchored sections on the parent hub, filtered in JS. Color-by-number and other variants are tabs on the base design page, never separate URLs | Resolves: near-duplicate facets and format-item URLs |
| 8 | Hub tree | Each design has exactly one primary hub. Parent hubs (`/islamic-coloring-pages/`) are navigators: 12 featured cards plus tiles linking to child hubs. CI fails if two indexable hubs share more than 30% of their cards | Resolves: duplicate grids (lantern sub-hub, aggregators, no-faces hub) |
| 9 | Art master format | **KCI-SVG v1**: viewBox `0 0 720 940` (1 unit = 0.01 in), `data-layer` groups (`regions`, `ink`, `labels`, `guides`), `<path data-region="rN">`. All text is converted to paths and there are no `<text>` elements. Masters are regenerated deterministically and not committed; `art/.snapshots.json` (sha256 + dHash) is committed | Resolves: 720×940 vs 1000×1294 vs mm IR vs 2550px |
| 10 | Region extraction | One raster engine for all art. Render the ink at 4 px/unit with resvg, label 4-connected white components, grow labels to the ink centerline, trace with marching squares, simplify (RDP ε 0.25 u). The distance transform gives the inscribed radius and label point. Adjacency comes from the label map. clipper2-ts is used only for generator geometry (offsets, unions), behind `generators/core/clipper.ts` | Resolves: the prerelease-Clipper critical path. The same code will handle Wave 2 illustrated intake |
| 11 | Difficulty | One table in `generators/core/difficulty.ts` (see Content generation): `bold\|easy\|medium\|hard\|expert`, displayed as "Bold & Easy / Easy / Medium / Detailed / Expert" | Resolves: five scales and conflicting minimums |
| 12 | Imagery model | `imagery.tier`: **A** aniconic, **B** animals (featureless by default), **C** faceless people (studio-made only). Humans always have `facesDrawn: false`. One vanilla 3-state filter: Show all / No people / Objects & places only, stored in `kci:imagery` | Resolves: five encodings. Design's "L2 animals with faces" is deleted |
| 13 | Review tiers | **R0** general art: editor QA only. **R1** aniconic Islamic-hub art, allowlisted English greetings, "basic" facts: editor QA plus Islamic lint, and the Islamic Studies (IS) reviewer confirms in batches later. **R2** Arabic strings, referenced facts, people, sacred places, worship steps, sacred text: excluded from production until the IS reviewer (and the Arabic (AR) reviewer, for Arabic) signs | Resolves: lint rule L12 blocking the whole Ramadan launch. "Reviewed by" appears only after a real sign-off |
| 14 | Sacred text | Divine names (including Latin transliterations such as Allah or Bismillah), the basmalah, the shahada, Quran and du'a text are **never colorable and never on cut-outs**. They appear only as solid text on learning cards or posters, with a notice and R2 review. Calligraphy and 99 Names are not in 2026 scope | Resolves: SEO scheduling calligraphy and 99 Names in Nov 2026 |
| 15 | Text shaping | **harfbuzzjs** only, using `font.glyphToPath`, static Bold TTF instances, and pinned font sha256. fontkit and opentype.js are dropped | Resolves: the "HarfBuzz via fontkit" error |
| 16 | PDF | **pdf-lib** `drawSvgPath` produces vector Letter (612×792) and A4 (595.28×841.89) PDFs. The footer is converted to paths with harfbuzzjs (Nunito), so no PDF embeds a font and PDFs are byte-stable. No Playwright `page.pdf` | Resolves: two PDF engines. Phase-2 footers in Turkish, Arabic or Bengali will work |
| 17 | Rasters | WebP only: line art at 400/800/1200, colored example at 800, OG image 1200×630 JPG, pin 1000×1500 JPG (M2). About 10 files per design. No AVIF, no 300-DPI PNG | Resolves: four different image sets |
| 18 | PDF canonical | A 25-line Worker on `run_worker_first: ["/files/pdf/*"]` sends `Link: <…>; rel="canonical"` pointing to the design page when it is indexable, otherwise to the primary hub. The map is generated at build into `worker/generated/pdf-canonicals.json` | One rule covering noindex designs, printables and bundles |
| 19 | Sitemaps | Custom endpoints built from the route manifest, with `image:loc`; `lastmod` comes from `updatedAt`. `@astrojs/sitemap` is not installed | Resolves: arch vs SEO |
| 20 | robots.txt | The SEO version. `/search/` stays crawlable and carries noindex. Training-only bots (GPTBot, CCBot, Bytespider, meta-externalagent, Applebot-Extended, ClaudeBot) are disallowed from `/files/` and `/api/` only. Google-Extended is allowed. This is a business decision recorded in DECISIONS.md | Resolves: arch vs SEO |
| 21 | Titles | SEO formulas, at most 60 characters, **no brand suffix** | Resolves: arch and design suffixes |
| 22 | Season window | The year appears in title, H1 and OG from **16 weeks before an event until 7 days after it**. All dates live in one file, `src/data/events.ts`. Banner text is computed at build ("expected around 8 Feb 2027") and the day count is computed on the client | Resolves: 16 weeks vs 150 days, four date files, stale banners |
| 23 | React | Used only on `/color/` (`client:only="react"`). Filters, paper size, imagery toggle and banner are vanilla scripts. Search uses Pagefind's default UI, loaded when the box gets focus | Resolves: React placement conflicts |
| 24 | JS budgets | Content pages ≤10 KB gz (hubs) and ≤8 KB gz (designs). `/color/` ≤100 KB gz on first load including React. These live in one file, `budgets.json` | Resolves: three sets of budgets |
| 25 | Fonts (web) | Nunito Variable (Latin, used for display and body) plus Noto Naskh Arabic (Arabic subset via `unicode-range`, loaded only when Arabic renders). Self-hosted from Fontsource npm packages with plain `@font-face` and `size-adjust` fallbacks. At most 2 files and ≤60 KB on English pages. Baloo 2 is deferred | Resolves: font budget conflicts and Fonts-API network dependence |
| 26 | Theme | Light only in v1 (`color-scheme: light`). Tokens are structured as `:root` plus a future `@media (prefers-color-scheme: dark)` block, with no `light-dark()` | Resolves: `light-dark()` failing on Safari <17.5 |
| 27 | Removed content | Return 410 through the Worker's gone list (`src/data/gone.json`). Use 301 only to a genuinely equivalent page. Trailing-slash and lowercase redirects are 301 Cloudflare Redirect Rules | Resolves: 410 vs 301, and the 307 from auto-trailing-slash |
| 28 | hreflang | Emitted only when at least one published twin exists. No `x-default`-only tags | Resolves: SEO vs arch |
| 29 | Privacy | The site is **child-directed** (COPPA): no cookies, Cloudflare Web Analytics beacon only, no raw search-query logging, no PII forms in M1. The newsletter waits for a COPPA counsel opinion and uses a neutral birth-year age screen | Resolves: "for parents" framing, 18+ checkbox, Plausible, query logging |
| 30 | Monetization | `flags.ads=false`, `flags.membership=false`. `<AdSlot>` renders nothing. When ads are on later, slots get fixed `min-height` classes and are never rendered on: `/color/`, sacred-text or sacred-place pages, worship printables, the first screen of Islamic hubs, or whenever `data-imagery≠all` | Resolves: ads next to a "no faces" promise |
| 31 | Playwright | Install `@playwright/test@1.64.0`. If it can't find a browser, set `launchOptions.executablePath=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. If CDP protocol errors appear, pin 1.56.1 for the session and record that in DECISIONS.md | Mismatch with the preinstalled browser |
| 32 | Letter slugs (frozen) | `alif ba ta tha jeem haa khaa daal dhaal ra zay seen sheen saad daad taa dhaa ayn ghayn fa qaf kaf lam meem noon ha waw ya`, stored in `src/data/arabic/letters.json` | Resolves: daal vs dal |

---

## 2. URL rules

- Canonical host is `https://kidscolorit.com`, lowercase ASCII, always with a trailing slash. Configure `trailingSlash:'always'` and `build.format:'directory'`.
- Query strings never create content.
- Slug regex: `^[a-z0-9]+(-[a-z0-9]+)*$`, at most 60 characters, 2–5 words, subject first.
- Slugs never contain a year, "free", "printable" or an ID.
- Design slugs are **globally unique**.
- Reserved slugs: `easy medium hard detailed expert bold toddler preschool kindergarten adults bold-and-easy page color rss.xml files api search team about bundles printables color-online`, plus the locale codes.
- If a slug changes, add the old path to `redirectFrom: []` on the entry; this generates `_redirects` 301s.

| Page type | Pattern | Index |
|---|---|---|
| Home | `/` | yes |
| Navigator (silo parent) | `/islamic-coloring-pages/` | yes |
| Topic hub | `/{topic}-coloring-pages/` | yes if ≥20 designs |
| Design | `/{primaryHub}/{slug}/` | only if `seo.index` (decision 6) |
| Entity page (later) | `/mosque-coloring-pages/{mosque}/` | yes, studio art only |
| Event activities page | `/ramadan-activities-for-kids/` | yes |
| Printables index and item | `/printables/`, `/printables/{slug}/` | yes |
| Bundles | `/bundles/{slug}/` (`/bundles/` is noindex until ≥3 bundles exist) | yes |
| Arabic alphabet | `/arabic-alphabet/`, `/arabic-alphabet/{letter}/` | yes after AR sign-off |
| Online coloring | `/color-online/` (indexable landing), `/color/#{hub}/{slug}` (app, noindex) | landing only |
| Trust | `/about/`, `/about/how-we-make-coloring-pages/`, `/about/editorial-policy/`, `/about/islamic-content-guidelines/`, `/about/license/`, `/privacy/`, `/terms/`, `/contact/`, `/how-to-print/`, `/faq/` | yes |
| Team | `/team/{slug}/`, published only for real people with `consentOnFile: true` | yes |
| Search | `/search/?q=` | noindex (crawlable) |
| Feeds | `/rss.xml`, `/{hub}/rss.xml` | — |
| Sitemaps | `/sitemap-index.xml`, `/sitemaps/{pages\|hubs\|designs-1\|printables}.xml` | — |
| Preview image | `/files/img/{hub}/{slug}-coloring-page-{400\|800\|1200}.webp` | — |
| Colored example | `/files/img/{hub}/{slug}-colored-example-800.webp` | — |
| OG / pin | `/files/og/{hub}/{slug}.jpg`, `/files/pin/{hub}/{slug}-pin.jpg` | — |
| SVG master (app) | `/files/svg/{hub}/{slug}.svg` (served with `X-Robots-Tag: noindex`) | — |
| Design PDF | `/files/pdf/{hub}/{slug}-coloring-page-{letter\|a4}.pdf` | canonical header |
| Printable PDF | `/files/pdf/printables/{slug}/{slug}-{variant}-{letter\|a4}.pdf` | canonical header |
| Bundle PDF | `/files/pdf/bundles/{slug}-{letter\|a4}.pdf` | canonical header |
| Locales (later) | `/{locale}/…`; translated slugs for id, tr, fr, ms; English slugs for ar, bn, ur | — |

URLs are built only in `src/lib/routes.ts`; `tests/unit/routes.test.ts` snapshots every generated path.

## 3. Difficulty levels

The single source is `generators/core/difficulty.ts`:

| Level (label) | Ages | Ink width | Regions | Min region | Min inscribed radius | Ink coverage |
|---|---|---|---|---|---|---|
| bold (Bold & Easy) | 2–4 | 7 u = 1.78 mm | 6–25 | 150 mm² | ≥3.5 mm | ≤18% |
| easy (Easy) | 4–6 | 5 u = 1.27 mm | 15–60 | 60 mm² | ≥2.5 mm | ≤20% |
| medium (Medium) | 6–9 | 3.5 u = 0.89 mm | 50–160 | 20 mm² | ≥1.5 mm | ≤22% |
| hard (Detailed) | 9–12 | 2.8 u = 0.71 mm | 140–400 | 8 mm² | ≥1.0 mm | ≤25% |
| expert (Expert) | 13+ | 2.1 u = 0.53 mm (1.5 pt floor) | 350–1,200 | 3 mm² | ≥0.6 mm | ≤28% |

## 4. Imagery tiers

- **A, aniconic:** architecture, patterns, plants, objects, food, letters. This is the default, and all launch content is Tier A.
- **B, animals:** featureless by default. `animalFaces: simple` is allowed only outside Islamic hubs.
- **C, faceless people:** modest dress. Studio-made only, and always R2.
- **NEVER:** Allah, prophets, angels, the Buraq, halos, winged humans or winged horses, faces on people, object-faces in Islamic hubs, other-faith or occult symbols.
- Islamic hub heroes, OG and pin images, and the first 12 cards are always Tier A (L02).

## 5. Sacred-text placement (L04)

| Class | Allowed placement |
|---|---|
| `none`, `arabic-letters`, `arabic-words`, `greeting-en` | Coloring pages, puzzles, cards, the app |
| `greeting-ar` | Cards and posters after AR review |
| `divine-name`, `basmalah`, `shahada`, `quran`, `dua` (including Latin transliterations) | **Solid, non-colorable text only**, on learning cards, posters or reference sheets, with the notice "Contains the name of Allah — please keep or dispose of respectfully". Never on cut-outs, folds, crafts, word searches, mazes, stickers or app regions. Never in the bottom band. R2 with both IS and AR review |

## 6. Contracts settled during the M1.0 spike (2026-10-13)

### 6.1 Toolchain (spike verified)

| Item | Decision |
|---|---|
| Package manager | pnpm 10.28 with exact pins. `pnpm.onlyBuiltDependencies` allows esbuild, workerd, sharp and @resvg/resvg-js |
| TypeScript | **6.0.3**. `@astrojs/check` 0.9.10 peers on TypeScript ^5 or ^6, so TypeScript 7 is not used |
| Zod | 4.6.7, the same major as Astro 7's `astro/zod`. Shared schemas import from `zod` |
| clipper2-ts | **2.0.1 stable** (not the 2.0.1-18 prerelease). Accessed only through `generators/core/clipper.ts` |
| Fonts for outlines | Static TTFs derived from Fontsource woff2 by `scripts/spike/fonts.ts` into `assets/fonts/`, with sha256 values in `fonts.lock.json`: Nunito-Black, Nunito-ExtraBold (Latin) and NotoNaskhArabic-Bold (Arabic subset) |
| Arabic shaping | harfbuzzjs 1.6.3 (`hb.Blob → hb.Face → hb.Font`, `hb.shape(font, buf, [Feature('liga',0), Feature('dlig',0)])`, `font.glyphToPath(gid)`). **Noto Naskh shapes the dots as separate mark glyphs** (GDEF class 3, e.g. `dotbelowar`), so code must draw every glyph in the run and must not assume one glyph per letter. Output is in visual order. Glyph paths are in font units (y up, upem from `face.upem`), so flip y when placing them |
| Playwright | @playwright/test 1.64.0 works with the preinstalled `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` through `launchOptions.executablePath` (`playwright.config.ts`) |
| PDF | pdf-lib 1.17.1 `drawSvgPath` produces vector output. @cantoo/pdf-lib is the fallback |

### 6.2 Generator contract

The contract is `generators/core/types.ts`:
- A generator returns `Drawing { pages: Page[] }`.
- `pages[0]` is the master: it drives previews, the online app and region data.
- `Page.colorable` turns on region extraction.
- `InkPath.role` is one of `line | solid | guide | label`.
- All randomness comes from the injected `Rng`. A seed string maps to a `cyrb128 → sfc32` stream, and `fork(label)` creates sub-streams.

### 6.3 Content files

| Content | Location |
|---|---|
| Designs | `src/content/designs/{hub}.yaml`, a YAML list of `DesignEntry` (`src/lib/schema.ts`). Printables (calendars, trackers, puzzles) are designs whose `primaryHub` is `printables`, so they live at `/printables/{slug}/` |
| Variants | `variantOf: <slug>` (undated calendar, positional-forms worksheet, answer-key-only, etc.). A variant has **no URL**; it appears as an extra download on its base design page |
| Hubs, navigator, activities, letters index, prose | `src/content/hubs/{slug}.mdx`, frontmatter `HubEntry` |
| Bundles | `src/content/bundles/{slug}.yaml` (`BundleEntry`). The PDF is `/files/pdf/bundles/{slug}-{letter\|a4}.pdf` |
| Arabic letters | Designs in hub `arabic-alphabet` with slug = the frozen letter slug, so the URL is `/arabic-alphabet/{letter}/`. The forms worksheet is a variant of the letter |

### 6.4 Pipeline outputs

| Output | Location |
|---|---|
| Master SVGs (all layers, KCI-SVG v1) | `.kci/art/{hub}/{slug}.svg` (gitignored, deterministic). For multi-page products, extra pages are `{slug}.p2.svg`, … |
| Computed data | `.kci/computed/designs.json`, a `Record<slug, ComputedDesign>` (`src/lib/schema.ts`) |
| Public files | `public/files/**` (gitignored), with paths only from `src/lib/routes.ts`: `/files/svg/{hub}/{slug}.svg` (regions + ink layers for the app), `/files/img/{hub}/{slug}-{suffix}-{400\|800\|1200}.webp`, `/files/img/{hub}/{slug}-colored-example-800.webp`, `/files/og/{hub}/{slug}.jpg`, `/files/pdf/{hub}/{slug}-{suffix}-{letter\|a4}.pdf`. The suffix is set by kind: `coloring-page`, `calendar`, `tracker`, `word-search`, `maze`, `worksheet` or `card` |
| Snapshots | `art/.snapshots.json` (committed): `{slug: {sha256, dhash, generator, version}}` |

### 6.5 KCI-SVG v1 (master and app file)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 940" width="720" height="940" data-kci="1"
     data-generator="fanoos@1.0.0" data-seed="r27-0413" data-difficulty="medium" data-slug="hexagonal-lantern">
  <title>…</title>
  <g data-layer="regions" fill="#fff" stroke="none"><path data-region="r0" d="…"/>…</g>
  <g data-layer="ink" fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">…</g>
  <g data-layer="labels"/>
  <g data-layer="guides"/>
</svg>
```

- No `<text>` element ever appears.
- Region ids `r0…rN` are ordered by label point (y, then x), and `r0` is the background region touching the frame.
- The app file under `/files/svg/` is the master after svgo, with `data-*` attributes and ids kept.

## Changelog
- 2026-10-13: initial contracts (M1.0 spike).
