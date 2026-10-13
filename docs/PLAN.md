# kidscolorit.com — Build Plan

Version 1.0 · 2026-10-13 · Repo `/home/user/test2`, branch `claude/pensive-fermi-qaxfnq`

## Summary

**What we're building.** kidscolorit.com: an Islamic-first coloring and activity site for Muslim families, in the spirit of sketchjoy.com, thecolor.com and allkidsnetwork.com.
- Stack: Astro 7.3 static site with one React 19 island (the coloring app), Tailwind 4, on Cloudflare Workers Static Assets.
- Content in the first build is all code-generated vector art: Ramadan lanterns, crescents, mosque styles, geometric rosettes and tilings, mandalas, Arabic letters, calendars, trackers, word searches and mazes.
- Every design ships as a Letter PDF, an A4 PDF, WebP previews, and an online fill-coloring page.

**SEO strategy.**
1. Win the uncontested Islamic niche first, especially the spam-flooded Islamic-education searches and the Ramadan 2027 cluster. That cluster must be indexed by mid-December 2026.
2. Expand into low-difficulty evergreen topics proven by the SketchJoy Semrush export.
3. Add multilingual twins (Indonesian first).

Indexable URL count is kept deliberately small, which protects the new domain from Google's scaled-content-abuse policy.

**This session (M1)** builds:
- the generator engine and art pipeline;
- every SEO template and all the plumbing (schema, sitemaps, canonicals, Worker headers, QA gates);
- about 175 designs across 5 hubs, plus the Ramadan printables and two bundles;
- the fill-only coloring app;
- 9 docs (DESIGN, UI-UX, SEO, ISLAMIC-IMAGERY, SKILLS and others) and 7 Claude Code skills;
- CI.

It is verified with `pnpm verify`, Playwright, Lighthouse and `wrangler deploy --dry-run`. **Deploying** needs human steps: a Cloudflare account, DNS, GSC, and hiring the reviewers (see RUNBOOK).

---

This document is the only plan to build from. If a specialist section or critique disagrees with it, this document wins. Anything that changes an earlier specialist decision is marked **(Resolves: …)**.

---

## Context

**Why we are building this.** Searches for Ramadan, Eid, Arabic-alphabet and Islamic-worksheet pages are poorly served today:
- Generic coloring sites publish one post of 20–40 pages.
- Paid packs (Twinkl, MUHSEN, Payhip) sit behind a paywall.
- Islamic-education results are full of parasite spam on hijacked domains.
- None of SketchJoy, TheColor or AllKidsNetwork has Eid hubs, a 30-day Ramadan calendar, Arabic letter worksheets, Islamic geometric patterns, or a filter for "no faces / no animate beings".

**Positioning.** KidsColorIt is a coloring and activity brand for Muslim families, Islamic-first, on a general-sounding domain. We make free vector PDFs in Letter and A4, plus online coloring. Artwork is code-generated where code does it better: geometry, Arabic typeset from fonts, calendars, puzzles. Studio illustration follows later. Imagery is faith-aware: aniconic by default, people never have faces, and nothing depicts prophets, angels or Allah. There are no licensed characters and no Christmas, Halloween or Easter hubs.

**Strategic posture (Resolves: the SEO critic's "indexation vs authority" point).** The plan builds topical authority on a small, high-quality index:
- About 50 indexable URLs at the first deploy, growing to about 150 by mid-December.
- Single-design pages from parametric generators default to `noindex,follow`. A design page becomes indexable only when its named subject is unique and has demonstrated demand.
- Most effort goes into products an AI-generated image cannot replace: bundles, calendars, trackers, Arabic worksheets, and vector PDFs.

**Hard deadline.** The Ramadan 2027 cluster must be live and indexed well before mid-December 2026. Ramadan is expected to begin around 8 February 2027.

**Hard data: SketchJoy's US organic keywords** (user-supplied Semrush export; 2,615 unique keywords after deduping, about 87.6K estimated visits a month).

Where SketchJoy's traffic comes from:

| Page type | Share of traffic |
|---|---|
| Licensed characters, celebrities, trends | 72.9% |
| Homepage, ranking for generic head terms | 19.5% |
| Safe evergreen topics | 6.2% |
| Western holidays | 1.4% |

SketchJoy ranks for **zero** Islamic keywords. **Implication:** cloning SketchJoy's traffic engine is impossible without licensed characters. Our engine is:
1. the uncontested Islamic niche;
2. utility printables, which AI images can't replace;
3. low-KD evergreen topics;
4. language twins.

Evidence for low-KD evergreen topics (US volume / KD) that fit the imagery tiers:
- autumn 12.1K / 17
- horse 9.9K / 14 (SketchJoy only at position 69)
- axolotl 9.9K / 12
- capybara 5.4K / 18
- bear 4.4K / 20
- monkey 3.6K / 16
- cow / cattle 3.6K / 17–19 (Eid al-Adha bridge)
- chicks 2.9K / 7
- solar system 2.9K / 19
- nature 2.9K / 15–20
- bunny 2.9K / 20
- sea turtle 2.4K / 19
- duck 2.4K / 12
- panda 2.4K / 14
- bird 2.4K / 17
- pizza 2.4K / 16
- motorcycle 2.4K / 11
- rocket ship 1.9K / 18

Generic head terms (US volume / KD):
- coloring pages 368K / 73
- coloring sheets 74K / 66
- coloring pages for kids 60.5K / 29
- cute coloring pages 33.1K / 45
- free printable coloring pages 22.2K / 60
- easy coloring pages 18.1K / 41
- free coloring pages for adults 9.9K / 46
- preschool coloring pages 4.4K / 24
- coloring book online 3.6K / 27

Phrasing variants (median KD):
- "colouring" (UK spelling): 295 keywords, 528K total volume, KD 20. Matters for UK, Pakistan, Bangladesh and Malaysia.
- "coloring sheet(s)": 541K, KD 22.
- "pictures to color": KD 22.
- "coloring page of a X": KD 16, the cheapest pattern.

Head-level modifiers cost a lot: "for kids" KD 61, "online" KD 55, "pdf" KD 46, "easy/simple" KD 44.

Ahrefs MCP returned "Insufficient plan" for every endpoint, so the Islamic volumes in this plan are web-research estimates. Validate them in Google Keyword Planner and Google Trends during M2.

**Success (re-baselined; Resolves: KPIs 5–10× too high).** Each cell is floor / target.

| KPI | 3 mo (mid-Jan 2027) | 6 mo (mid-Apr 2027) | 12 mo (mid-Oct 2027) |
|---|---|---|---|
| Indexable URLs (English) | 120 / 160 | 250 / 350 | 600 / 900 |
| Indexed ÷ submitted | ≥75% | ≥85% | ≥90% |
| Organic clicks, peak month | 1K / 4K (Jan) | 3K / 15K (Feb) | 2K / 6K (Sep) |
| GSC impressions, peak month | 50K / 150K | 300K / 800K (Feb) | 200K / 500K |
| Share of indexable URLs with ≥1 click in 28 days | — | ≥40% | ≥50% |
| Referring domains | 10 / 20 | 40 / 60 | 100 / 150 |
| Top-10 on spam-flooded long-tail terms (ramadan calendar printable for kids, ramadan good deeds tracker, arabic alphabet worksheets, islamic geometric pattern coloring, wudu steps for kids) | 1 / 2 | 3 / 5 | 5 / 8 |
| "ramadan coloring pages" (US) | top 50 | top 30 | top 20 (top 10 at the Ramadan 2028 peak) |
| Pinterest monthly impressions | 200K / 500K | 1M / 3M (Feb) | 1M / 2M |
| Mobile CWV pass (CF RUM + LHCI) | 100% | 100% | 100% |

---

## Key decisions

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

## Execution strategy for this session

Ultracode is on, so implementation runs as a series of workflows. I read the result of each one before starting the next.

1. **Spike, inline.** M1.0 runs sequentially: pnpm init, pin versions, hello build, Playwright with `executablePath=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and the resvg/sharp/harfbuzzjs/clipper golden tests. Then write `docs/DECISIONS.md` and `CLAUDE.md`. These are the contracts every later agent builds against.
2. **Workflow "build-core".** Agents run in parallel, each owning disjoint directories, with worktree isolation and merges back in a fixed order:
   - (a) `generators/core` and the pipeline scripts;
   - (b) site skeleton, SEO lib, routes, templates and endpoints;
   - (c) Worker, `_headers` and the post-build integration;
   - (d) docs drafts, written from the specialist material listed below.

   After merging: run `pnpm verify` and fix.
3. **Workflow "generators".** One agent per generator (fanoos, crescent-sky, mandala, geometric, mosque, objects, lettering-en, calendar-tracker, word-search, maze, arabic-letters). Each comes with tests and a contact sheet. An adversarial reviewer per generator checks the QA gates and the Islamic lint (L16 symbols, sacred text). Claude views every contact sheet before curating seeds into the hub YAML.
4. **Workflow "content and app".** Hub copy and design descriptions, written by agents with editor-gate placeholders; printables and bundles; the fill-only coloring app; the skills and CI.
5. **Workflow "verify".** Multi-lens adversarial review:
   - SEO lint plus a manual SERP-intent check;
   - accessibility;
   - Islamic content review against ISLAMIC-IMAGERY.md;
   - performance budgets;
   - the full e2e run.

   Fix everything found, then commit and push to `claude/pensive-fermi-qaxfnq`.

Commits happen at each milestone checkpoint, with `git push -u origin claude/pensive-fermi-qaxfnq`.

**Source material for the docs.** The six specialist drafts (SEO about 100K characters, content generation, architecture, design system including the Najma mark SVG and palettes, Islamic imagery standard, coloring-app spec) and the four critiques are stored in the workflow journal at `/root/.claude/projects/-home-user/485ea7a8-3653-517a-9a0d-86a1b59330f1/subagents/workflows/wf_73427260-dab/journal.jsonl`, also mirrored in `/tmp/claude-0/-home-user/485ea7a8-3653-517a-9a0d-86a1b59330f1/tasks/wkvikvkdq.output` under `result.designs` and `result.critiques`. The SketchJoy Semrush CSV is at `/root/.claude/uploads/485ea7a8-3653-517a-9a0d-86a1b59330f1/6f5a6bd3-semrush-export-5000.csv`. M1.0 copies the drafts into `docs/_research/` (committed) so the docs can be written from them. A `scripts/seo/import-semrush.ts` script turns the CSV into `docs/keyword-research/sketchjoy-us.csv` plus a summary.

---

## Information architecture & URL map

**Global rules**
- Canonical host is `https://kidscolorit.com`, lowercase ASCII, always with a trailing slash. Configure `trailingSlash:'always'` and `build.format:'directory'`.
- Query strings never create content.
- Slug regex: `^[a-z0-9]+(-[a-z0-9]+)*$`, at most 60 characters, 2–5 words, subject first.
- Slugs never contain a year, "free", "printable" or an ID.
- Design slugs are **globally unique**.
- Reserved slugs: `easy medium hard detailed expert bold toddler preschool kindergarten adults bold-and-easy page color rss.xml files api search team about bundles printables color-online`, plus the locale codes.
- If a slug changes, add the old path to `redirectFrom: []` on the entry; this generates `_redirects` 301s.

**Patterns**

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

The file suffix depends on the kind: `-coloring-page`, `-calendar`, `-tracker`, `-word-search`, `-maze`, `-worksheet`.

**Keyword ownership rules.**
- Each indexable URL owns exactly one primary keyword plus its own secondaries.
- `scripts/qa/cannibalization.ts` normalizes keywords (lowercase, singular, colouring→coloring) and fails CI on any duplicate **primary or secondary** across indexable URLs.
- From M2, monthly SERP-overlap clustering merges keywords whose top-10 results share at least 4 URLs.

### Launch hub list

The hubs ship in two stages:
- **L0** is the first deploy, targeted for 2026-10-27.
- **M2** pages ship by 2026-12-14.

**TOP tier (umbrella terms; tracked, not expected to rank in 2027)**

| URL | Primary | Secondaries | Ships |
|---|---|---|---|
| `/` | coloring pages for kids (umbrella) | free printable coloring pages | L0 |
| `/islamic-coloring-pages/` | islamic coloring pages | muslim coloring pages, islamic coloring sheets | L0 |
| `/color-online/` | online coloring pages | color online for kids | L0 |
| `/printables/` | islamic activity sheets | islamic worksheets for kids, islamic printables | L0 |

**MID tier (money pages)**

| URL | Primary (est. vol.) | Secondaries (owned here only) | Ships |
|---|---|---|---|
| `/ramadan-coloring-pages/` | ramadan coloring pages (8–15K; peak 50–90K) | ramadan coloring pages 2027, ramadan coloring sheets, ramzan coloring pages, ramadan colouring pages, ramadan coloring pages for preschool (anchor `#preschool`), ramadan lantern coloring page (until a lantern child hub exists) | L0 |
| `/ramadan-activities-for-kids/` | ramadan activities for kids (5–10K) | ramadan activity sheets, ramadan word search, ramadan maze, ramadan printables for toddlers | L0 |
| `/printables/ramadan-calendar-for-kids/` | ramadan calendar printable for kids (1–3K) | 30 day ramadan calendar, ramadan countdown calendar | L0 |
| `/printables/ramadan-good-deeds-tracker/` | ramadan good deeds tracker | good deeds chart for kids, ramadan fasting tracker for kids | L0 |
| `/bundles/ramadan-activity-pack/` | ramadan activity book pdf | ramadan coloring book pdf, ramadan activity pack | L0 |
| `/islamic-geometric-coloring-pages/` | islamic geometric pattern coloring (200–500) | islamic pattern coloring pages, 8 point star pattern, zellige coloring | L0 |
| `/mandala-coloring-pages/` | mandala coloring pages (T1) | easy mandala for kids, printable mandala | L0 |
| `/mosque-coloring-pages/` | mosque coloring page (1–2.5K) | masjid coloring page, mosque drawing (bridge only) | L0 (generic styles) |
| `/arabic-alphabet/` | arabic alphabet worksheets (2–5K) | arabic alphabet for kids, arabic alphabet chart printable, hijaiyah letters, alif ba ta | M2, gated on AR |
| `/eid-coloring-pages/` (Eid al-Fitr page) | eid coloring pages (3–6K) | eid mubarak coloring pages, eid al fitr coloring pages | M2 (Dec 8) |
| `/printables/eid-cards/` | eid card printable (1–3K) | eid gift tags printable, eidi envelope printable | M2 (Dec 8) |
| `/printables/islamic-calendar/` | islamic calendar 2027 printable | hijri calendar for kids | M2 (Dec 1, R2) |

**LOW tier**
- `/arabic-alphabet/{letter}/` (28 pages): primary "{letter} arabic letter worksheet", for example "alif arabic letter worksheet". M2.
- Promoted design pages (at most 30 at L0). Named subjects only: hexagonal/fanoos lantern, dallah, prayer mat, tasbih, dates bowl, crescent with stars, Ottoman-style mosque, 8-point star tile.

**Removed from 2026 targets** (Resolves: SEO critic and Islamic critic):
- Calligraphy, 99 Names, bismillah: deferred to a reviewed learning-card format.
- Fall 2026.
- Generic evergreen hubs without a Muslim angle (A–Z, numbers, shapes, space, rainbow): deferred to July 2027.
- `/no-faces-coloring-pages/`: its content lives on the guidelines page until Tier B/C art exists.
- `/ramadan-lantern-coloring-pages/`: only once Ramadan exceeds 60 designs, then it becomes the lanterns' primary hub.
- The "when is Ramadan 2027" guide: a dates box on the hub covers it.
- The fasting-hours study: dropped.
- "ramadan mandala" as a keyword: rosettes in Islamic hubs are titled "Rosette (Shamsa)".

**Bridges** (`src/data/bridges.ts`, launch set):
- ramadan ↔ geometric
- ramadan ↔ mosque
- ramadan ↔ calendar/tracker
- mosque ↔ geometric
- geometric ↔ mandala
- dates bowl → (later) foods/dates

**Not bridged** (Resolves: Islamic critic): the spider↔Hijrah link, and camel↔Hajj.

**Internal-link rules** (checked by `scripts/qa/link-graph.ts` over `dist/`):
- Every indexable page has at least 2 inbound links from indexable pages.
- Every page is within 3 clicks of `/`.
- No internal link resolves to a 3xx or 404.
- Every internal href ends in a slash.

---

## Page templates & on-page SEO formulas

All formulas live in `src/lib/seo/meta.ts`. `seo-lint` enforces titles of 30–60 characters, meta descriptions of 70–155, one H1, a self canonical on indexable pages, and unique titles and descriptions.

| Template | `<title>` | H1 | Meta description |
|---|---|---|---|
| Home | `KidsColorIt: Free Coloring Pages & Muslim Kids Activities` | Free Printable Coloring Pages & Islamic Activities for Kids | static, 150 chars |
| Topic hub (N≥12) | `{N} {Topic} Coloring Pages{ Year} (Free Printable PDFs)`; if over 60 characters, end with `(Free PDFs)` instead | `{Topic} Coloring Pages{ Year}` | `{N} free {topic} coloring pages for kids: {top-3 subjects}. Print vector PDFs (Letter & A4) or color online. No signup.` |
| Mosque hub | `Mosque Coloring Pages: Ottoman, Mughal & Moroccan Styles`; becomes "Famous Masjids" only when ≥6 landmark entity pages exist | Mosque Coloring Pages | style-based |
| Navigator | `Islamic Coloring Pages for Muslim Kids ({N} Free PDFs)` | Islamic Coloring Pages for Kids | |
| Activities | `Ramadan Activities for Kids{ Year}: {N} Free Printables` | Ramadan Activities for Kids{ (Year)} | |
| Printable item | `{Title}{ Year} (Free PDF)`, e.g. `Printable Ramadan Calendar for Kids 2027 (Free PDF)` | `{Title}{ (Year)}` | `{summary} {pages} pages · Letter & A4 · ages {a}–{b}.` |
| Bundle | `{Title}{ Year}: {pages}-Page Free PDF` | | |
| Design | `{titleName} Coloring Page (Free PDF)`, where `titleName = name.includes(hub.short) ? name : hub.short+' '+name`. Use `(Free Printable PDF)` if it fits | `{titleName} Coloring Page` | `Free {titleName} coloring page: {visualSummary}. {Difficulty}, ages {a}–{b}. Download a vector PDF (Letter or A4) or color it online.` |
| Letter | `{Name} ({char}) – Arabic Letter Coloring & Worksheet (Free PDF)` | Arabic Letter {Name} ({char}) | |
| /color-online/ | `Online Coloring Pages – Color Online Free (No Download)` | Color Online | |

**Supporting formulas**
- **Year** comes from `seasonYear(event, KCI_BUILD_DATE)` in `src/lib/season.ts`. It returns the year during the window (from event start minus 112 days until event end plus 7 days) and `null` otherwise. Unit tests cover 2026-10-19, 2027-03-17 and the Ramadan 2030 case where Ramadan falls twice in one Gregorian year.
- **Phrasing variants** (from the Semrush data): every hub and indexable design page naturally works in "colouring", "coloring sheet(s)", "pictures to color" and "coloring page of a X". Place them in one H2, the alt text or the lede. Variants never get their own URLs, and the cannibalization normalizer folds them together.
- **Alt text**: `{titleName} coloring page: {altDetail}`, 60–125 characters. `altDetail` is human-written, at most 70 characters, and never describes faces. The colored example's alt is `Colored example of the {titleName} coloring page`.
- **Filenames**: as in the URL table. `data-pin-media` points at the pin JPG (M2). Decorative images get `nopin`.
- **Byline**:
  - Generated art: `Made with the KidsColorIt pattern engine · Curated by {editor} · Updated {Mon YYYY}`. The JSON-LD `creator` is the Organization. (Resolves: false "Illustrated by" credits.)
  - The `Reviewed by {name}, {role}` line appears only when the review record names a real reviewer.

**Hub template** (`src/templates/Hub.astro`), in order:
1. `<Breadcrumbs>`.
2. H1, lede (50–70 words) and byline.
3. Hero CTA "Download all {N} as one PDF" when a bundle exists, placed above the grid. (Resolves: products that resist AI replacement go first.)
4. `<FilterBar>`: age and difficulty chips, vanilla JS, state kept in `#age=…`.
5. `<HubGrid>`: at most 60 cards, every one a plain `<a>`. The first 2 images are eager and the first has `fetchpriority=high`.
6. Anchored sections by age and difficulty (`#bold-and-easy`, `#preschool`), each with 60–120 words of real tips.
7. "About {topic} for kids", answer-first.
8. Hub-specific FAQ, 3–5 questions.
9. `<RelatedHubs>` and `<BridgeLinks>`.

**Copy length at launch**:
- Tier A hubs (Ramadan, activities, navigator, Arabic): 400–600 words below the grid.
- Tier B (geometric, mosque, Eid): 300–450 words.
- Tier C (mandala): 250–350 words.

Printing and licence help lives once on `/how-to-print/`, and generic FAQs on `/faq/`. CI fails when two hubs share more than 15% of word 5-gram shingles.

**Ramadan hub specifics**:
- A quick-facts box: "Ramadan 2027 is expected to begin around 8 February 2027 (±1 day depending on moon sighting)".
- "What is Ramadan?", using only `basic` facts from `src/data/islamic/facts/ramadan.json`.
- A strip linking to the calendar, tracker, word search, maze and bundle.
- FAQ "Ramadan or Ramzan?", answered as "Both name the same month; Ramzan reflects the Urdu and Persian pronunciation."

**Activities page.** A numbered list of 12–15 activities, each with a short how-to and its embedded printable or download. Word searches and mazes are sections here (each set has 3 difficulties) until a set reaches at least 12 items.

**Design template** (`src/templates/Design.astro`):
- Layout: breadcrumbs → H1 → preview `<img>` (the LCP element, 800w with srcset 400/800/1200, `fetchpriority=high`, explicit width and height) → buttons [PDF Letter] [PDF A4] [Color online] [Print].
- Below that: a fact chip row (`{Difficulty} · Ages {a}–{b} · {regions} areas · about {min} minutes`), the description, an optional Arabic word card (R2 only), a palette with swatches, 1–3 tips, an "Other versions" tab row, More like this (8, deterministic), and a link back to the hub.
- Boilerplate is wrapped in `data-boilerplate` and must stay under 40% of main text.

**Description rules.**
- An indexable design needs a 40–80 word `description` with `editedBy` set, word-trigram Jaccard below 0.5 against its siblings, and at least 80 unique words of main content.
- A noindex design needs one `describe()` sentence.

**Paper default.**
- An inline head script picks Letter when `Intl.Locale(navigator.language).maximize().region` is in {US, CA, MX, PH, CL, CO, CR, DO, GT, PA, PR, SV, VE}, and A4 everywhere else.
- It sets `html[data-paper]`. Both buttons are the same size, and CSS orders the primary one first, so there is no layout shift.

**JSON-LD** (`src/lib/seo/jsonld.ts`, typed with `schema-dts`, one `@graph` emitted by `<JsonLd>`):

| Template | Nodes |
|---|---|
| Home | Organization (`@id /#org`, logo, parentOrganization "Color Experts International"), WebSite (no SearchAction), WebPage |
| Hub, navigator, activities | CollectionPage (mainEntity ItemList with `numberOfItems` equal to the rendered cards; `about` a Thing with Wikipedia `sameAs`), BreadcrumbList, ImageObject (hero), FAQPage only when a FAQ is visible |
| Design | ItemPage, VisualArtwork (`encoding`: 2 PDF MediaObjects with `contentSize`; `creator` → `#org`), ImageObject (`license`, `acquireLicensePage` → `/about/license/#commercial-use`, `creditText`, `copyrightNotice`), BreadcrumbList |
| Printable, letter | WebPage, LearningResource (`learningResourceType`, `educationalLevel`, `typicalAgeRange`, PDF `encoding`), ImageObject, BreadcrumbList |
| Bundle | WebPage, DigitalDocument (`hasPart` → items) |
| /color-online/ | WebApplication (`isAccessibleForFree`, `applicationCategory` "EducationalApplication") |
| Team (later) | ProfilePage + Person |

`reviewedBy` and `lastReviewed` are emitted only alongside a real review record. HowTo, Practice Problems and SearchAction are not emitted.

**Other head output.**
- OG: `og:type=article` with published and modified time, `og:image` 1200×630 JPG under 300 KB, and `twitter:card=summary_large_image`.
- RSS: `/rss.xml` and `/ramadan-coloring-pages/rss.xml` in M1, each item with `media:content` (the pin from M2).

---

## Content generation

### Generator contract (`generators/core/types.ts`)

```ts
export interface Generator<P> {
  id: string; version: string;                 // semver; any visual change ⇒ bump ⇒ re-approve
  kind: 'coloring'|'calendar'|'tracker'|'word-search'|'maze'|'worksheet';
  artboard: 'portrait'|'landscape';            // 720×940 | 940×720
  paramsSchema: z.ZodType<P>;
  sample(rng: Rng, d: Difficulty): P;          // exploration
  draw(p: P, rng: Rng): Drawing;               // pure: ink paths only (+ guides, labels)
  describe(p: P, d: Difficulty): { titleParts: string[]; altDetail: string; blurb: string; tags: string[] };
}
export type InkPath = { d: string; width: number; role: 'line'|'solid'|'guide'|'label' };
```

**Determinism.**
- `core/rng.ts` provides `cyrb128` feeding `sfc32`, with `fork(label)` for independent streams.
- A Vitest setup file replaces `Math.random`, `Date.now` and `new Date()` with throwing stubs while generators run. A CI grep backs this up.
- Coordinates are rounded to 0.01 u.
- `art/.snapshots.json` stores the sha256 of each master. CI fails on any change that is not accompanied by a version bump.

### Closed-region data model (KCI-SVG v1)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 940" data-kci="1"
     data-generator="fanoos@1.0.0" data-seed="r27-0413" data-difficulty="medium">
  <title>Hexagonal Ramadan lantern coloring page</title>
  <g data-layer="regions" fill="#fff" stroke="none"><path data-region="r0" d="…"/>…</g>
  <g data-layer="ink" fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">…</g>
  <g data-layer="labels"/><g data-layer="guides"/>
</svg>
```

**`generators/core/regions.ts` steps**
1. Render the `line` and `solid` ink with resvg at 4 px/unit (2880×3760).
2. Binarize at 50%.
3. Label 4-connected white components (two-pass union-find on an `Int32Array`).
4. Merge components under 1 mm² (248 px²) into solid ink, up to 0.5% of regions.
5. Grow labels into ink pixels by BFS to the centerline.
6. Trace each label with marching squares, simplify (RDP 0.25 u) and emit absolute M/L/Z paths.
7. Compute per-region area, the inscribed radius (maximum of the distance transform) and its location (the label point).
8. Build adjacency by checking label pairs across 1-pixel-dilated ink.
9. `r0` is the component touching the frame. Regions are numbered by label point in (y, x) order.

Dangling strokes stay inside their region. The same code vectorizes illustrated art in Wave 2.

### Difficulty table (`generators/core/difficulty.ts`, the only source)

| Level (label) | Ages | Ink width | Regions | Min region | Min inscribed radius | Ink coverage |
|---|---|---|---|---|---|---|
| bold (Bold & Easy) | 2–4 | 7 u = 1.78 mm | 6–25 | 150 mm² | ≥3.5 mm | ≤18% |
| easy (Easy) | 4–6 | 5 u = 1.27 mm | 15–60 | 60 mm² | ≥2.5 mm | ≤20% |
| medium (Medium) | 6–9 | 3.5 u = 0.89 mm | 50–160 | 20 mm² | ≥1.5 mm | ≤22% |
| hard (Detailed) | 9–12 | 2.8 u = 0.71 mm | 140–400 | 8 mm² | ≥1.0 mm | ≤25% |
| expert (Expert) | 13+ | 2.1 u = 0.53 mm (1.5 pt floor) | 350–1,200 | 3 mm² | ≥0.6 mm | ≤28% |

### M1 generators (priority order)

| Gen | Scope in M1 | Notes |
|---|---|---|
| `fanoos` | Lanterns (body 4/6/8-sided prism; caps: onion, dome, pyramid; window arches: pointed, ogee, keyhole; window fill: bars, star cut-outs, mini-tiling) and scenes (hanging trio, lantern on crescent) | high quality |
| `crescent-sky` | Crescent (difference of two circles), **5- and 8-point stars only**, clouds, arched-window night sky | 6-point stars removed (L16) |
| `mandala` | Ring stack with motif library (petal, lotus, ogee, scallop, leaf, 8-point star, chevron) | Inside Islamic hubs the output is titled "Rosette (Shamsa)" |
| `geometric` | Rosette mode (n ∈ {8, 10, 12, 16}; n=6 allowed only in tessellation mode) and Hankin tiling mode (4.8.8, 6.6.6, 3.6.3.6, 4.6.12, 3.12.12; frames: rectangle, circle, mihrab arch) | |
| `mosque` | Generic composer in Ottoman, Mughal, Maghrebi and simple-bold styles | Captions read "An Ottoman-style mosque". A generated mosque is never given a landmark name |
| `objects` | Dates bowl, dallah, prayer mat (mihrab arch plus tiling band, no Kaaba, no text), tasbih (33 beads) | |
| `lettering-en` | Bubble lettering from Nunito Black outlines (Clipper inflate): "Ramadan Mubarak", "Ramadan Kareem" and, in M2, "Eid Mubarak" | Strings only from `src/data/strings/en-greetings.json` |
| `calendar-tracker` | 30-lantern grid, Path-to-Eid board (landscape), good-deeds 30-day grid, practice-fasting tracker | Headers like "Ramadan 1448 AH · 2027" come from `seasonYear`. Day 30 reads "if the month has 30 days". An undated variant is included |
| `word-search` | Easy 8×8 (east and south only), medium 10×10 (adds the diagonals), hard 13×13 (all 8 directions). Answer key on page 2 | The filler scan blocks profanity and ALLAH, GOD and الله in all 8 directions. Lists exclude divine names |
| `maze` | Recursive backtracker for easy, growing tree for medium and hard. Corridors ≥6/4/3 mm. Solution path ≥1.5× the Manhattan distance. Solution on page 2 | Masks: crescent, lantern, 8-point star only, never a mosque |
| `arabic-letters` | Bubble-letter coloring (glyph outline inflated +14 u; dots inflated separately) and a positional-forms worksheet (4-column table, right to left, dashed outline plus 15% gray ghost fill; the 6 non-connectors get 2 forms and a caption). Letter chart | harfbuzzjs features `liga=0,dlig=0` with only `rlig` kept. Static Noto Naskh Arabic Bold. **R2: gated on AR** |

**Deferred generators:**
- M2: `paper-goods` (Eid cards, gift tags without 6-point shapes), `color-by-code` transform, Islamic 12-month calendar.
- M3: `dot-to-dot`, `zellige`, `decagonal`, `interlace` (rejects chiral hooked-cross motifs), `snowflake`, `numerals`, `latin-abc` ("K is for Kite"), `how-to-draw`, Arabic tracing with stroke data corrected by AR.

### Output pipeline (`scripts/gen.ts`)

| Stage | Command | Output |
|---|---|---|
| Explore | `pnpm gen explore fanoos --difficulty easy --n 48` | `.kci/explore/fanoos-easy-{1,2}.png`: contact sheets of 24 thumbnails each, ranked by a score (region-area variance, coverage, balance). The curator copies seeds into the hub YAML |
| Build | `pnpm gen build [--hub ramadan-coloring-pages]` | `.kci/art/{hub}/{slug}.svg` (all layers) and `.kci/computed/designs.json` (regions, min area, coverage, dHash, sha) |
| QA | `pnpm qa:art` | `qa-report.json`; any failure exits non-zero |
| Derive | `pnpm gen derive` | svgo 4.1 (multipass, precision 2, with `mergePaths`, `cleanupIds` and `removeTitle` off, `data-*` kept) → `public/files/svg/…`. resvg at 2400w → sharp WebP at 400/800/1200 (near-lossless line art). Colored example: palette fills via DSatur on the symmetry-class adjacency graph. OG 1200×630 JPG. pdf-lib Letter and A4. PDF metadata (title, author, subject, keywords, fixed dates) |
| Bundles | `pnpm gen bundles` | Merge per-design PDFs with `copyPages`; generated cover, contents and answer-key pages; "Page i of N" |
| Cache | content-hash key = sha256(master + pipelineVersion + stage config) | `.kci/cache/`, persisted with actions/cache. A warm rebuild takes seconds |

**PDF layout.**
- The art box is 7.20×9.40 in (518.4×676.8 pt), with its top 0.5 in from the paper top, centered horizontally.
- The footer is converted to paths, set in Nunito at 7 pt, 0.45 in from the bottom: `kidscolorit.com · {title} · Free for home & classroom use`.
- Call `drawSvgPath(d, {x: artLeft, y: pageH - artTop, scale: 0.72})` with no manual y-flip, wrapped in round line join through `pushOperators`.
- Typical file size is 30–150 KB, capped at 400 KB.

### QA gates (`scripts/qa/art-qa.ts`, `scripts/qa/content-gates.ts`, `scripts/qa/islamic-lint.ts`)

| Gate | Rule |
|---|---|
| Stroke | Line ink ≥ the level width and ≥1.5 pt; guides ≥0.75 pt |
| Regions | Count within level bounds. Every region ≥ the level's minimum area and minimum inscribed radius. Absorbed specks ≤0.5% |
| Near-miss leaks | Ink endpoints within 0.6 mm of other ink but not touching → fail |
| Coverage, margins | Ink coverage ≤ level cap. All ink inside the artboard minus 2 mm |
| Text | No `<text>`. Arabic only from allowlisted, AR-signed strings. No divine-name or sacred classes on colorable kinds (L04). Latin transliterations (Allah, Bismillah, Alhamdulillah, insha'Allah, masha'Allah) detected (L05) |
| Symbols (L16, motif-level) | Fail on an isolated {6/2} hexagram or 6-point star polygon not inside a tessellation of ≥7 stars; on a {5/2} pentagram crossing; on a chiral 4-arm hooked cross. Golden tests: snowflake passes, centered hexagram fails, khatam tessellation passes |
| Distinctness | dHash (64-bit, from a 256 px render) Hamming distance ≥12 within a generator and ≥8 site-wide, for `kind: coloring` only. Puzzles and printables use parameter, text or solution-hash uniqueness. Exact-duplicate SVG sha check on everything |
| Copy | Indexable designs: description 40–80 words, Jaccard <0.5, `editedBy` present. Hubs: at least the tier minimum word count, cross-hub shingle overlap ≤15% |
| File size | Master SVG by level: bold/easy ≤150 KB, medium ≤250 KB, hard ≤400 KB, expert ≤700 KB. PDF ≤400 KB. 800w WebP ≤90 KB. LCP image ≤60 KB. Bundle ≤15 MB |
| PDF | Exact media boxes; re-parses with pdf-lib; page count matches |
| Review (L12) | R2 entries without the required signatures are excluded from production builds, and preview builds render them with noindex and a "DRAFT – not reviewed" ribbon. With `PUBLIC_REQUIRE_EDITOR=1`, entries without `editedBy` render noindex |

**Human visual pass.**
- Claude reviews contact sheets in-session. Reject criteria: slivers, clutter, lopsided symmetry, muddy coverage, and accidental symbols (cross, hexagram, hooked cross, anything face-like).
- The design team does the final pass with `pnpm review sheet --hub X`, which writes `.kci/review/{hub}.html`, and records approval with `pnpm review approve --hub X --by "<Name>" [--slugs …]`, which writes `review.editedBy` and `review.editedAt` into the YAML.
- One physical test print per generator per level, on inkjet and laser, in Letter and A4.

### Launch inventory

| Hub | Designs | Composition | Difficulty mix B/E/M/H/X | Review | Ships |
|---|---|---|---|---|---|
| `/ramadan-coloring-pages/` | **48** | lanterns 12 · lantern scenes 4 · crescent & stars 8 · mosque-and-crescent scenes 8 · EN lettering 4 · rosettes (shamsa) 6 · iftar objects 6 (dates bowl 2, dallah 2, tasbih 1, prayer mat 1) | 8/14/14/8/4 | R1 | L0 |
| `/ramadan-activities-for-kids/` + printables | **10** | calendars 2 (+ undated variants) · good-deeds tracker 1 · practice-fasting tracker 1 (ages 8+) · word search 3 · maze 3 | — | R1 | L0 |
| `/bundles/ramadan-activity-pack/` | 1 bundle (~36 pages) | cover · contents · 20 coloring · 2 calendars · 2 trackers · 3 word search · 3 maze · 3 answer keys · 1 kindness certificate (never tied to fasting) | — | R1 | L0 |
| `/islamic-geometric-coloring-pages/` | **20** | rosettes 8 · Hankin tilings 12 | 0/4/6/6/4 | R1 | L0 |
| `/mandala-coloring-pages/` | **20** | general mandalas | 3/5/5/4/3 | R0 | L0 |
| `/mosque-coloring-pages/` | **20** | Ottoman 5 · Mughal 5 · Maghrebi 5 · simple-bold 5 | 5/6/5/4/0 | R1 | L0 |
| `/islamic-coloring-pages/` | 0 own | navigator: 12 featured cards plus tiles | — | R1 copy | L0 |
| `/arabic-alphabet/` + 28 letters | **57** | 28 bubble-letter coloring · 28 positional-forms worksheets · 1 chart | — | R2 (AR) | M2, ~Nov 24 |
| `/bundles/arabic-alphabet-workbook/` | 1 bundle (58 pages) | cover · chart · 28 × (coloring + forms) | — | R2 | M2 |
| **M1 total** | **175 designs, 2 bundles** | 350 single PDFs, about 1,800 files | | | |
| M2 adds by Dec 14 | ~70 | Ramadan +12 (cap 60), Eid al-Fitr 24, Eid cards 8 + tag sheets 4, Eid word search/maze 4, Islamic calendar 2027 (12 pages), color-by-code versions as tabs on 12 Ramadan designs | | | |

If M1 slips, the hard minimum for L0 is the Ramadan hub, the activities page, the calendar, the tracker and the bundle.

### Art-brief backlog (later; `art/briefs/{id}.yaml` with `tier`, `mustInclude`, `mustAvoid`, `references`)

| P | Set | Pieces | Tier | Method | Live by |
|---|---|---|---|---|---|
| P0-1 | Wudu steps (hands, feet and water only; mouth, nose and face shown as a water-drop icon plus label). Madhab note covers neck-wiping and ear practice | 16 | A, C variant | Designer + IS + madhab consultant pool | 2027-01-12 |
| P0-2 | Salah positions drawn from behind or three-quarter back, robed; a "Girls (Hanafi)" variant; salawat step included; Fatiha referenced, not printed | 18 | C | Designer + IS + pool | 2027-01-12 |
| P0-3 | Landmark mosques W1: masjid-al-haram, masjid-an-nabawi (facade first; green dome as a variant), dome-of-the-rock, qibli-mosque, al-aqsa-compound map, blue-mosque, sheikh-zayed-grand-mosque, hassan-ii-mosque, faisal-mosque, badshahi-mosque, istiqlal-mosque, baitul-mukarram, sixty-dome-mosque, star-mosque-dhaka | 14 | A | Studio only, ≥3 references with licences logged | from 2026-12-10, rolling |
| P0-4 | Foods of the Quran and Sunnah (dates, pomegranate, fig, olive, grapes, honey, milk, gourd, ginger) | 10 | A | AI draft → studio redraw | 2027-01-04 |
| P0-5 | Ramadan family scenes (from behind, modest dress) | 12 | C | AI draft → studio + IS | 2027-01-11 |
| P1-6 | Eid al-Adha animals (sheep, goat, cow, camel): calm, healthy, no knives or blood | 10 | B | AI + studio | 2027-03-12 |
| P1-7 | Hajj places and maps (Kaaba studio-drawn; Jamarat as modern walls; schematic route) | 8 | A | Studio | 2027-03-12 |
| P1-8 | Animals of the Quran, canonical list: elephant, ababil birds, ant, hoopoe, bee, spider, cow, camel, horses, sheep/goat, whale (whale only); **no crow, frog or locust**. Captions give the reference only | 11 | B | AI + studio + IS | 2027-05-01 |
| P2 | Mosques W2 (18), Arabic "X is for Y" (28, AR-chosen nouns), adab scenes (12), silhouettes for pattern-in-silhouette | — | mixed | — | 2027 H2 |

**Evergreen animal wave (Semrush-backed; brought forward from July 2027 to M3).**
- Tier B studio or AI-plus-studio art, with simple features allowed outside Islamic hubs.
- Each hub launches with ≥20 designs. Titles and alt text use the "coloring page of a X" phrasing.
- **Wave 1 (by 2027-03-31):** horse, cow/cattle, camel, sheep, goat. These bridge to Eid al-Adha.
- **Wave 2 (Q2 2027):** axolotl, capybara, bear, panda, monkey, duck/chicks, sea turtle, birds/owl.
- **Later:** solar system and space (astronomy only, with Arabic star names), plus the autumn harvest hub (Aug 2027).
- **Deprioritized:** dinosaurs and vehicles. AI is never used for: sacred sites, named landmarks, geometric patterns, Arabic or any text, maps, or salah figures.

---

## Technical architecture

**Folder tree**

```
/home/user/test2
├─ CLAUDE.md                     # commands, invariants (no Math.random in generators, no <text>, URL rules, review tiers)
├─ package.json  pnpm-lock.yaml  .nvmrc(22)  tsconfig.json  biome.json
├─ astro.config.ts  site.config.ts  wrangler.jsonc  vitest.config.ts  playwright.config.ts  lighthouserc.json  budgets.json
├─ .github/workflows/{ci.yml,deploy.yml,nightly.yml}
├─ .claude/skills/{add-generated-design,new-generator,add-hub,seasonal-hub,seo-audit,islamic-review,release}/SKILL.md
├─ docs/{DECISIONS,DESIGN,UI-UX,SEO,ISLAMIC-IMAGERY,SKILLS,ARCHITECTURE,PRIVACY,RUNBOOK}.md  docs/keyword-map.csv
├─ assets/fonts/{Nunito-Black.ttf,Nunito-Bold.ttf,NotoNaskhArabic-Bold.ttf,OFL/}  assets/fonts/fonts.lock.json
├─ generators/core/{rng,geom,bezier,clipper,text,regions,svg,difficulty,palette,colorize,layout,qa,dhash,types}.ts
├─ generators/{islamic/{fanoos,crescent-sky,mosque,objects},pattern/{mandala,geometric},
│              lettering/{lettering-en,arabic-letters},printables/{calendar-tracker,word-search,maze}}.ts
├─ generators/registry.ts  generators/test/
├─ art/.snapshots.json  art/briefs/
├─ scripts/gen.ts  scripts/pipeline/{render,encode,pdf,bundle,cache}.ts
├─ scripts/qa/{art-qa,content-gates,cannibalization,islamic-lint,seo-lint,jsonld-validate,sitemap-check,
│              link-graph,html-validate,js-budget,deploy-limits,lint-logical,headers-check}.ts
├─ scripts/review/{sheet,approve}.ts  scripts/seo/{export-keyword-map,indexnow}.ts  scripts/brand/favicons.ts
├─ src/content.config.ts  src/loaders/designs.ts
├─ src/content/{designs/{hub}.yaml, hubs/{slug}.mdx, printables/{slug}.yaml, bundles/{slug}.yaml,
│               pages/{slug}.mdx, team/{slug}.yaml, faqs/{hub}.yaml}
├─ src/data/{events.ts,indexability.ts,bridges.ts,transliteration.ts,palettes.ts,gone.json,
│            islamic/{facts/ramadan.json,good-deeds.json,house-style.json,blocked-terms.json,observances.ts},
│            arabic/letters.json, strings/en-greetings.json, wordlists/{ramadan,eid}.json}
├─ src/lib/{routes.ts,season.ts,flags.ts,assets.ts,i18n.ts,seo/{meta,jsonld,canonical,hreflang,alt,sitemap}.ts}
├─ src/pages/{index.astro,[...path].astro,color/index.astro,search/index.astro,404.astro,
│             robots.txt.ts,llms.txt.ts,rss.xml.ts,[hub]/rss.xml.ts,sitemap-index.xml.ts,sitemaps/[name].xml.ts}
├─ src/templates/{Home,Hub,Navigator,Design,Activities,PrintablesIndex,Printable,Bundle,LetterHub,Letter,ColorOnline,Prose}.astro
├─ src/layouts/{BaseLayout,AppLayout}.astro
├─ src/components/{seo/{SeoHead,JsonLd,Breadcrumbs},site/{Header,Footer,ComingUpBanner,ImageryToggle,AdSlot},
│                  content/{HubGrid,DesignCard,FilterBar,DownloadButtons,FactChips,PaletteSwatches,FaqList,
│                  RelatedHubs,BridgeLinks,BundleCTA,Byline,QuickFacts,LetterFormsTable}}.astro
├─ src/scripts/{prefs-inline,filters,paper,imagery,banner,search-launch}.ts
├─ src/islands/coloring/{ColoringApp.tsx,ui/*,core/{engine,DocStore,history,hitTest,viewport,gestures,storage,export}.ts}
├─ src/styles/{global.css,print.css}  src/integrations/kci-postbuild.ts
├─ worker/index.ts  worker/generated/ (gitignored)
├─ public/{favicon.svg,apple-touch-icon.png,brand/}  public/files/ (gitignored, generated)
└─ tests/{e2e,seo}/*.spec.ts
```

**`astro.config.ts`**

```ts
export default defineConfig({
  site: 'https://kidscolorit.com', output: 'static', trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' }, compressHTML: true, prefetch: false,
  i18n: { defaultLocale: 'en', locales: enabledLocales(), routing: { prefixDefaultLocale: false } }, // no fallback
  integrations: [react({ include: ['**/islands/**'] }), mdx(), kciPostBuild()],
  vite: { plugins: [tailwindcss()], build: { target: 'es2022' } },
});
```

`kciPostBuild` writes:
- `dist/_headers`
- `dist/_redirects` (from `redirectFrom`)
- `worker/generated/{pdf-canonicals.json,gone.json}`
- `dist/route-manifest.json`, which `.assetsignore` excludes from deploy

**Pinned dependencies:**
- Site: astro 7.3.8, @astrojs/react 7.0.1, @astrojs/mdx 8.0.3, react/react-dom 19.3.0, tailwindcss and @tailwindcss/vite 4.3.3.
- Pipeline: sharp 0.35.5, @resvg/resvg-js 2.6.2, pdf-lib 1.17.1, harfbuzzjs 1.6.3, clipper2-ts 2.0.1 (now stable; fallback clipper2-wasm 0.4.0), svgo 4.1.0, pagefind 1.5.2, yaml, schema-dts.
- Tooling: vitest 5.0.4, @playwright/test 1.64.0, @lhci/cli, html-validate, @biomejs/biome, tsx, wrangler (dev, for dry-run), pdfjs-dist (for the PDF golden test).
- Fonts: @fontsource-variable/nunito, @fontsource/noto-naskh-arabic, and wawoff2 if TTFs have to be derived from woff2.

**Content schema** (`src/content.config.ts`, one schema imported by the loader, the gates and the lints):

```ts
const Difficulty = z.enum(['bold','easy','medium','hard','expert']);
const Imagery = z.object({ tier: z.enum(['A','B','C']), animalFaces: z.enum(['none','simple']).default('none'),
                           facesDrawn: z.literal(false).default(false) });
const SacredText = z.enum(['none','arabic-letters','arabic-words','greeting-en','greeting-ar',
                           'divine-name','basmalah','shahada','quran','dua']).default('none');
const Review = z.object({ editedBy: z.string().optional(), editedAt: z.coerce.date().optional(),
  islamicBy: z.string().optional(), arabicBy: z.string().optional(), checklist: z.string().optional(),
  reviewedAt: z.coerce.date().optional() });
const Design = z.object({
  slug: Slug.refine(s => !RESERVED.has(s)), primaryHub: z.string(), hubs: z.array(z.string()).default([]),
  kind: z.enum(['coloring','calendar','tracker','word-search','maze','worksheet','card']),
  title: z.string().max(42), description: z.string(), altDetail: z.string().max(70),
  difficulty: Difficulty, ages: z.tuple([z.number(), z.number()]), imagery: Imagery,
  sacredText: SacredText, sensitivity: z.enum(['standard','sacred-place']).default('standard'),
  reviewTier: z.enum(['R0','R1','R2']), review: Review.default({}),
  origin: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('generated'), generator: z.string(), version: z.string(), seed: z.string(),
               params: z.record(z.string(), z.unknown()).default({}) }),
    z.object({ kind: z.literal('illustrated'), artist: z.string(), aiAssisted: z.boolean(), briefId: z.string(),
               sourceSha256: z.string().length(64) })]),
  palette: z.string(), tags: z.array(z.string()).default([]), tips: z.array(z.string()).max(3).default([]),
  arabicWord: z.object({ ar: z.string(), translit: z.string(), meaning: z.string() }).optional(),
  factRef: z.string().optional(),                         // id into src/data/islamic/facts/*.json, never free-form
  seo: z.object({ primaryKeyword: z.string().optional(), secondary: z.array(z.string()).default([]),
                  index: z.boolean().default(false) }).default({}),
  publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
  translationKey: z.string(), redirectFrom: z.array(z.string()).default([]),
}).superRefine(reviewTierRules);                          // R2 triggers: sacredText∉{none,greeting-en}, tier C, sacred-place, factRef level≠basic
```

Other collections:
- `hubs`: MDX frontmatter `kind`, `name`, `short`, `h1?`, `title?`, `lede`, `copyTier`, `parent?`, `event?`, `yearStamp`, `related[]`, `faqs?`, `seo`, `reviewTier`, `review`, `publishedAt`, `updatedAt`.
- `printables`.
- `bundles`, with `items[]` and `editions[]`. Year-specific products keep evergreen URLs.
- `pages`.
- `team`, with `consentOnFile: z.literal(true)`.
- `faqs`.

The custom `designsLoader` reads `src/content/designs/*.yaml`, merges `.kci/computed/designs.json` (regions, coverage, dHash, byte sizes, dimensions), calls `parseData` and then `store.set` with a digest. A published entry without computed data fails the build in CI and renders a placeholder in dev.

**Routes.**
- `src/lib/routes.ts` builds `RouteEntry {kind, id, locale, path, indexable, lastmod, breadcrumbs, alternates}` once per build.
- `[...path].astro` dispatches to `templates/*` by kind. Physical pages (`/`, `/color/`, `/search/`, `/404`, endpoints) take precedence over the catch-all.
- The manifest also feeds sitemaps, `_redirects`, the PDF canonical map, llms.txt and the link-graph QA.

**Hosting** (`wrangler.jsonc`):

```jsonc
{ "name": "kci-site", "main": "worker/index.ts", "compatibility_date": "2026-10-01",
  "assets": { "directory": "./dist", "binding": "ASSETS", "html_handling": "force-trailing-slash",
              "not_found_handling": "404-page", "run_worker_first": ["/files/pdf/*"] },
  "routes": [{ "pattern": "kidscolorit.com", "custom_domain": true }], "workers_dev": false }
```

- The Worker (`worker/index.ts`, about 40 lines) handles PDF canonical `Link` headers and 410s from the gone list. Its fetch handler is tested in Vitest against a mocked `ASSETS`.
- Zone Redirect Rules, a runbook item, handle three things with 301s: www→apex, http→https, and lowercasing paths that contain uppercase. Paths without a trailing slash and without an extension also get a 301 to the slash version.

**`_headers`:**

| Path | Header |
|---|---|
| `/*` | HSTS, nosniff, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, mic and geolocation all off), and `Content-Security-Policy: frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'` |
| `/files/svg/*`, `/pagefind/*` | `X-Robots-Tag: noindex` |
| `/files/*` | `Cache-Control: public, max-age=604800, stale-while-revalidate=86400` |
| `/_astro/*` | immutable |
| `/search/*` | `X-Robots-Tag: noindex` |

The full hashed script CSP is M3.

**Flags** (`src/lib/flags.ts`, merged with `PUBLIC_KCI_FLAGS`):
- On: `colorOnline: true`.
- Off: `ads`, `membership`, `requestForm`, `newsletter`, `pwa`, `kidMode`, `darkMode`, `aiGenerator`, `photoToColoring`.
- Build envs: `PUBLIC_SITE_ENV`, where anything other than `production` adds noindex to every page, and `PUBLIC_REQUIRE_EDITOR`.

**Privacy (M1).**
- Data stays on the device only: `localStorage` for `kci:paper`, `kci:imagery` and `kci:palette` (every access in try/catch), and IndexedDB `kidscolorit` for artwork.
- The Cloudflare Web Analytics beacon is a manual script tag; zone auto-injection is disabled.
- No forms, no newsletter, and `/contact/` is a mailto link.
- No raw search or 404 query logging, ever.
- `docs/PRIVACY.md` records child-directed status, the processor list, retention and a DPIA.

**CI** (`ubuntu-latest`):
- `ci.yml` on pull requests: install → biome → typecheck → vitest → `gen` (cached) → `qa` → build → pagefind → `check:dist` → e2e → lhci.
- `deploy.yml` on main: the same, then `wrangler deploy` and IndexNow (M2).
- `nightly.yml`: rebuild and deploy (season windows), triggered in M2 by a Cloudflare Cron Trigger calling `workflow_dispatch`, with failure alerts.

---

## Online coloring app

**Route and loading.**
- `src/pages/color/index.astro` uses `AppLayout` with `noindex,follow` and is excluded from the sitemap.
- The page renders `<ColoringApp client:only="react"/>` and parses `location.hash` as `#{hub}/{slug}`.
- The server-rendered shell shows the 800w WebP as the LCP `<img>`. The island fetches `/files/svg/{hub}/{slug}.svg` from the same origin and replaces the image in place.
- With no hash, it shows a gallery of 24 popular designs. A `<noscript>` block links to the PDF.
- Design pages link with a plain `<a href="/color/#…">`; there is no prerender.

**Architecture.**
- `Engine` and `DocStore` are vanilla TypeScript. React renders only the chrome, through `useSyncExternalStore` selectors, so there are zero React renders during a gesture.
- The fetched SVG is inserted after sanitizing: DOMParser, then removal of `script`, `foreignObject` and `on*` attributes.
- The stage is forced `dir="ltr"`, and art is never mirrored.
- Layers, bottom to top:
  1. `regions` (fills set with `setAttribute('fill')`).
  2. A brush canvas (M2).
  3. `ink` (`pointer-events:none`).
  4. An overlay (focus ring).
- All pointer and wheel input lands on the viewport, which has `touch-action:none`.
- **Hit test:** a 32×32 grid index over the region bounding boxes, then `isPointInPath(Path2D)`. A direct hit always wins. Only when the tap lands outside every region (frame edge) does a 9-point ring sample run. (Resolves: majority vote overriding thin regions.)
- **Gestures:**
  - Fill happens on `pointerup` when movement is under 10 px, the gesture lasts under 600 ms, and no second pointer appeared.
  - Two pointers pinch-zoom (1× to 8×) around the midpoint.
  - Wheel with ctrl zooms; plain wheel pans.
  - Buttons: [−] [Fit] [+].
  - `will-change: transform` is set only during a gesture.

**M1 tools.**
- Fill only.
- A strip of 12 swatches (48 px targets) with 3 palettes: Kids Rainbow, Ramadan Night, Iznik Tiles.
- Undo and redo with a command stack of fill commands (`{region, before, after}`), capped at 200.
- "Start over" is itself an undoable clear command.
- Download PNG: clone the regions SVG, set its pixel size, serialize, `img.decode()`, draw to a canvas at 2× the viewBox (1440×1880), draw the ink the same way, add a "Colored on kidscolorit.com" strip, then `toBlob` and download with `a[download]`.
- No share button and no external links, so no parent gate is needed in M1.

**Persistence.**
- IndexedDB `kidscolorit` v1, store `docs` with keyPath `id = {slug}@{generatorVersion}`. Each record holds `{fills: Record<regionId, hex>, updatedAt, progress}`.
- Autosave is debounced at 800 ms and flushed on `visibilitychange` and `pagehide`.
- Opening a design resumes it automatically.
- A hand-written promise wrapper of about 1 KB; no `idb` dependency.

**Later.**
- M2:
  - Brush and eraser using perfect-freehand 1.2.3, clipped to the region with `ctx.clip(Path2D)`. Strokes are stored as vectors and replayed in the dirty rectangle.
  - Print through a hidden iframe (vector ink over a raster paint layer); on iOS, the share sheet instead.
  - The `/my-coloring/` gallery (noindex).
  - Color-by-number mode from a `regions.json` sidecar (label points, numbers, legend; gentle and strict modes).
  - Keyboard region navigation and live-region announcements.
- v1.1, Jan 2027: gradient and pattern fills, crayon texture, stickers (disabled on sacred-place and sacred-text designs), offline service worker, Arabic tracing mode.
- Kid mode and ParentGate (a number written in words) arrive with share in M3.

**Budgets.**
- App code ≤35 KB gz in M1 and ≤60 KB gz in total later. First-load JS on `/color/` ≤100 KB gz including React 19 (about 58 KB).
- A fill paints in under 16 ms; INP under 100 ms.
- A custom mark `kci:interactive` fires in under 2.5 s on Slow 4G with 4× CPU throttling.
- CLS = 0, because the shell uses `aspect-ratio: 720/940`.

---

## Design system & UX

**Thesis.** "A sunlit courtyard for little artists": warm sand surfaces, Iznik teal, 8-fold star geometry. The UI never shows people or animals.

**Brand.**
- Wordmark: lowercase `kidscolorit`, set as live text in Nunito 900 in M1. The words `kids` and `it` are ink-900 #1B2440 and `color` is teal-600 #0B7D76. The last "i" has a saffron crescent dot as an inline SVG.
- Mark: Najma, the Crayon Star, using the exact 64×64 SVG from the design spec, saved as `public/brand/mark.svg` and `public/favicon.svg` (collars removed in the favicon).
- Tagline: "Little hands, beautiful traditions."
- (Resolves: "bismillah" is removed from UI microcopy and taglines.)

**Tokens** (`src/styles/global.css`, Tailwind 4 `@theme`, with `--color-*: initial` so only brand colors exist):

| Token | Value | Contrast |
|---|---|---|
| page / surface / surface-2 / surface-3 | #FFFBF4 / #FFFFFF / #FBF3E4 / #F3E6CE | — |
| fg / fg-muted / fg-subtle | #1B2440 / #46566F / #5E6F8A | 14.83 / 7.22 / 4.95 on page |
| line / line-strong | #E6D2AF / #5E6F8A | decorative / 5.10 |
| primary / primary-hover / on-primary | #0B7D76 / #0A6660 / #FFFFFF | 4.99 / 6.81 |
| link, focus | #2A47BE | 7.42 |
| accent / on-accent | #FDB528 / #1B2440 | 8.61 |
| success / warning-text / danger | #1C7243 / #A65E08 / #C0262F | ≥4.8 |
| paper / lineart | #FFFFFF / #000000 (never invert) | — |

**Other tokens.**
- Full brand scales (teal, cobalt, saffron, pomegranate, palm, sand, ink) are copied from the design spec into `@theme`. teal-400 is decorative only.
- `tests/unit/tokens.contrast.test.ts` recomputes every pair and requires text ≥4.5 and UI ≥3.0.
- Type: the fluid scale from the design spec. `--text-base` is `clamp(1rem,0.9511rem+0.2174vw,1.125rem)` and `--text-4xl` is `clamp(2.062rem,1.671rem+1.739vw,3.062rem)`. Headings are Nunito 800 with `text-wrap: balance`. Arabic gets line-height 1.9 and `letter-spacing: 0` under `:lang(ar)`.
- Spacing: 4 px base. Side gutter `clamp(1rem,…,2rem)`, which is 16 px at phone width. Container 80rem; prose 68ch.
- Radii 10/14/20/28 px. Warm shadows tinted `rgb(27 36 64/.08)`.
- Card thumbnail: an arch-shaped (mihrab) mask utility on the image wrapper only, aspect `720/940`.
- Touch targets ≥44 px. Focus ring 3 px `--color-focus` with a 2 px offset.
- Motion: transform and opacity only. Cross-document view transitions only under `prefers-reduced-motion: no-preference`.
- RTL readiness: logical properties only, enforced by `scripts/qa/lint-logical.ts`, which fails on `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`/`text-right`, `rounded-l`/`rounded-r` and `border-l`/`border-r`. An `ar` pseudo-locale fixture builds under `PUBLIC_KCI_TEST_LOCALES=ar` for the RTL e2e.

**M1 components:**
- Header: logo; a plain nav (Ramadan · Islamic · Patterns · Printables · Color Online); search; and an imagery toggle (3 states, explained in a `<details>` popover).
- `ComingUpBanner`: a fixed 40 px slot that is always present and shows an evergreen promo when no event is near.
- Breadcrumbs, `HubGrid`, `DesignCard`, `FilterBar`, `DownloadButtons`, `FactChips`, `PaletteSwatches`, `QuickFacts`, `FaqList` (exclusive `<details name>` accordion), `BundleCTA`, `RelatedHubs`, `BridgeLinks`, `Byline`, `LetterFormsTable`.
- `AdSlot`, which returns null in M1.
- Footer: 4 link columns, the licence line, "No tracking cookies", a "Suggest a correction" link (mailto), and "© 2026 KidsColorIt · made in Dhaka by the Color Experts International studio".

**Wireframes (mobile-first, 360–390 px).** On every page that shows a design, the art and a Download button must be visible without scrolling. Playwright checks this with `toBeInViewport()` at 360×740 and 390×844.
- **Home:** banner → H1, lede and search → featured design (line art plus PDF button) → Islamic events tiles → Ramadan printables strip → patterns for grown-ups band → trust row (Free · No signup · Letter & A4 · Faith-aware imagery) → footer.
- **Hub:** compact hero (at most 360 px tall: eyebrow, H1, lede, "Download all N" accent CTA) → chips → 2-column grid (5 columns at 1280) → anchored age sections → copy → FAQ → related.
- **Design:** H1 → preview with a white paper look (at most 52vh) → paper toggle → Download PDF (52 px) → Print and Color online → details. A mobile action bar with [Print] [Download PDF · A4] [Color] appears when the in-flow button scrolls off screen (M2).
- **Activities:** a numbered activity list, each with a thumbnail and PDF buttons.
- **/color/:** a 52 px top bar (back, title, saved, redo) → canvas → swatch strip → toolbar (Fill, Undo, Zoom fit, Download).

---

## Islamic content & imagery standards

The full text goes in `docs/ISLAMIC-IMAGERY.md`, version IIS-1.0. The specialist draft arrived missing §1–§3.3, so M1 rewrites those sections conservatively: tier definitions, the sacred-text matrix, placement, notices, the Hijri calendar and Ashura copy.

**Imagery tiers.**
- **A, aniconic:** architecture, patterns, plants, objects, food, letters. This is the default, and all launch content is Tier A.
- **B, animals:** featureless by default. `animalFaces: simple` is allowed only outside Islamic hubs.
- **C, faceless people:** modest dress. Studio-made only, and always R2.
- **NEVER:** Allah, prophets, angels, the Buraq, halos, winged humans or winged horses, faces on people, object-faces in Islamic hubs, other-faith or occult symbols.
- Islamic hub heroes, OG and pin images, and the first 12 cards are always Tier A (L02).

**Sacred-text format matrix (L04).**

| Class | Allowed placement |
|---|---|
| `none`, `arabic-letters`, `arabic-words`, `greeting-en` | Coloring pages, puzzles, cards, the app |
| `greeting-ar` | Cards and posters after AR review |
| `divine-name`, `basmalah`, `shahada`, `quran`, `dua` (including Latin transliterations) | **Solid, non-colorable text only**, on learning cards, posters or reference sheets, with the notice "Contains the name of Allah — please keep or dispose of respectfully". Never on cut-outs, folds, crafts, word searches, mazes, stickers or app regions. Never in the bottom band. R2 with both IS and AR review |

**Symbols.**
- L16 motif rule as in the QA gates.
- Crescents never touch at the horns, never have faces, and never copy a national flag.
- Stars on cut-outs, tags and crafts are 5-, 8-, 10-, 12- or 16-pointed.

**Sacred places.**
- The Kaaba, Masjid an-Nabawi and al-Aqsa are drawn by the studio only. They are never used in transforms (maze, dot-to-dot, strict color-by-number, stickers), never cropped by the page edge, never in the bottom band, and never shown with party props.
- Slugs are `al-aqsa-compound`, `qibli-mosque` and `dome-of-the-rock`. Jerusalem entries carry no country field and no `addressCountry`.
- Maps show coastlines and city dots only, with no borders.

**Observances** (`src/data/islamic/observances.ts`).
- **Universal** (may appear in nav, banners and calendars): Ramadan, the last ten nights (all odd nights treated equally), Eid al-Fitr, the Day of Arafah, Hajj, Eid al-Adha, 1 Muharram (neutral), and Ashura framed as fasting and history.
- **Community** (never in nav, banners or printed calendars; neutral explainers only): Mawlid, Isra' and Mi'raj, Nisfu Sha'ban, Ghadir.
- The Hijri New Year hub is reframed as "The Hijri New Year & Islamic Months": calm, with no fireworks, balloons or confetti. The banner is off for 1–10 Muharram.
- Dates are always phrased "expected around", with a ±1-day note. No prayer or iftar time tables.

**General topics and holidays policy.**
- **Allowed:** nature, food (halal-only list), architecture, space (astronomy only, with Arabic-origin star names), seasons (autumn shown as leaves, apples and harvest).
- **Allowed with rules:** dogs in outdoor or working contexts only; rainbows as a weather arc; mandalas in the general hub only.
- **Never:** unicorns or winged horses, dragons, fairies, mermaids, witches, wizards or magic, genies, zodiac figures, Christmas, Halloween or Easter imagery, carved or faced pumpkins, scarecrows, musical instruments (the Indonesian bedug is an exception only after id-reviewer approval), birthdays, Valentine's Day, pork, alcohol, swimwear.
- These lists seed `blocked-terms.json`, which covers requests, search and AI prompts.
- Search for religious terms such as "Allah" or "Prophet Muhammad" shows a respectful explanation plus learning links, never "search for something else".

**Review workflow.**
- Tiers R0, R1 and R2 as in decision 13.
- **Roles.** The Islamic Studies reviewer (IS: alim or alimah, or a degree in Islamic studies, plus at least 3 years teaching children) and the Arabic reviewer (AR: native speaker who teaches Arabic) are two different people.
- **Contracts** target 2026-10-24, with a hard deadline of 11-01 and a named backup.
- **Madhab consultant pool** (Hanafi, Shafi'i, Maliki, Hanbali-leaning) signs off R2 worship sheets by 2026-12-15. When they disagree, the sheet shows both practices or drops the detail.
- **Indonesian reviewer** by 2026-11-16, otherwise the `/id/` pilot moves to January.
- **SLA:** 5 working days, or 48 hours between 15 Nov and 15 Dec.
- **Process:** the reviewer works from the PR preview plus PDF proofs and the checklist IIS-1.0 (IMG, TXT, AR, FA, ARCH, TONE, SAFE). The result is recorded with `pnpm review islamic|arabic --by <id> --checklist IIS-1.0`.
- **CODEOWNERS:** `@kidscolorit/islamic-review` owns `docs/ISLAMIC-IMAGERY.md`, `src/data/islamic/**` and `src/data/arabic/**`.

**Facts.**
- `facts/*.json` entries carry `level: basic|referenced`. Basic facts ship under R1; referenced facts (Quran or hadith) need IS sign-off.
- `scripts/qa/islamic-lint.ts` validates every "Quran s:a" against a pinned table of ayah counts per surah.
- AI never drafts Islamic facts.

**House style** (L10, auto-fix): Quran, Kaaba, Makkah, Madinah, taraweeh, Arafah, masha'Allah, insha'Allah, and the ﷺ glyph in body copy only. Banned: pbuh, (SWT), Mohammedan, Koran, "Islamic Christmas".

**Fasting content.**
- Fasting trackers are labelled ages 8+ and default to practice fasts ("until Dhuhr", "half-day").
- No reward is tied to completing a fast.
- A grown-ups note says that children don't have to fast and to check with a doctor for health conditions.

---

## Docs & skills to write

**Docs**

| Path | Scope |
|---|---|
| `docs/DECISIONS.md` | Written first. Every table in "Key decisions", the URL table, the schema, the difficulty table, imagery tiers, review tiers and storage keys. Changes need a PR with a dated entry |
| `docs/SEO.md` | The final SEO plan: URL map, keyword map rules, title, meta and alt formulas, indexability policy and promotion criteria, JSON-LD per template, robots, sitemaps, hreflang, the season window, the link-acquisition program, KPIs and the measurement plan (GSC with BigQuery export, Bing, the monthly AI-answer panel, replaceable vs durable query CTR) |
| `docs/ISLAMIC-IMAGERY.md` | IIS-1.0 in full, including the restored §1–§3: tiers, sacred-text matrix, placement and notices, the observance table, the general-topics policy, the mosque list (40) with "must get right" notes, the 20 pattern sources, worship-sheet specs with madhab notes, review workflow and checklist, the AI guardrails, lint rules L01–L18 (L12 by tier, L16 by motif, L05 including Latin transliterations) |
| `docs/DESIGN.md` | Brand, wordmark and Najma SVG, tokens and the contrast table (generated by `scripts/contrast-report.ts`), type, layout, the arch mask, the half-colored illustration style, icons (Lucide build-time), motion, line-art production standards (the difficulty table), the print and PDF spec, OG and pin templates |
| `docs/UI-UX.md` | UX principles with Playwright acceptance checks, templates with above-the-fold contracts, component specs, interactions (download and paper, print, filters, imagery toggle, banner states), the app spec, the accessibility matrix, kid-safety rules (banned dark patterns), budgets (`budgets.json`), ad-layout rules for later, i18n and RTL rules |
| `docs/SKILLS.md` | Index of skills: shipped vs planned (intake-illustrated-art, translate-hub, pinterest-batch, build-bundle, design-review) and when to use each |
| `docs/ARCHITECTURE.md` | Repo layout, pipeline stages and cache keys, KCI-SVG v1, region engine, routes manifest, hosting, Worker, CI, the R2 migration path at about 80K files |
| `docs/PRIVACY.md` | Child-directed status, data inventory (localStorage and IndexedDB keys), processors, retention, DPIA, the rule against logging queries, the conditions for newsletter and forms (COPPA counsel, neutral birth-year screen), ad COPPA flags for later |
| `docs/RUNBOOK.md` | Human launch checklist (below), deploy and rollback (`wrangler rollback`), the one-deploy family-noindex switch, incident handling for content on the NEVER list (unpublish within 24 h, 410, delete pins, log in `docs/incidents/`) |

**Skills** (`.claude/skills/*/SKILL.md`; each wraps scripts that exist and ends with `pnpm verify`):

| Skill | What it does |
|---|---|
| `add-generated-design` | Run `gen explore`, read the contact sheet, add seeds to `src/content/designs/{hub}.yaml`, run `gen build` and `qa:art`, draft copy, request editor approval |
| `new-generator` | Scaffold a generator under `generators/`, plus its params schema, determinism and QA tests, a snapshot baseline and a registry entry |
| `add-hub` | Create the hub MDX, run the keyword ownership check (`cannibalization.ts`), add it to the routes and bridges, enforce the ≥20 threshold |
| `seasonal-hub` | Event data in `events.ts`, a season-window test, a "New for {year}" set, a bundle edition, year rollover of printables |
| `seo-audit` | Run `check:dist` (seo-lint, JSON-LD, sitemaps, link graph), `export-keyword-map`, a GSC export review checklist, and the cannibalization report |
| `islamic-review` | Run `check:islamic`, render PDF proofs and a contact sheet, print the IIS-1.0 checklist, record sign-off |
| `release` | Run `pnpm verify`, `wrangler deploy --dry-run`, check deploy limits, the post-deploy smoke test (redirect status codes, PDF canonical header) and the rollback steps |

---

## Milestones

### M1 — this session (deploy-ready MVP)

Each step ends with `pnpm verify` passing and a commit on `claude/pensive-fermi-qaxfnq`. If time runs short, cut in this order: M1.7 (app) first, then M1.5 (keep mandala only), then M1.4. **Never cut:** the Ramadan hub, the activities page, the printables, the bundle, or the SEO plumbing.

**M1.0 Spike and contracts (≤10% of the session).** Exit criteria:
- [ ] `pnpm init`. Pin every dependency listed under Technical architecture. `.nvmrc` = 22. Hello build working with Astro 7, Tailwind 4 and a React island.
- [ ] Playwright launches with the procedure in decision 31; record which version was used.
- [ ] resvg and sharp natives render a test SVG.
- [ ] harfbuzzjs shapes ب in all 4 forms with distinct glyph ids, using a vendored static TTF (via `@expo-google-fonts/*` TTF or Fontsource woff2 → wawoff2). Store the sha256 in `fonts.lock.json`.
- [ ] Golden tests pass for clipper2-ts offset and union; otherwise switch to clipper2-wasm.
- [ ] Write `docs/DECISIONS.md` and `CLAUDE.md`.

**M1.1 Generator core and pipeline.**
- [ ] `generators/core/*`: rng, geom, bezier, clipper, text, regions (raster), svg emitter, difficulty, palette, colorize, qa, dhash.
- [ ] `scripts/gen.ts` with explore, build and derive, plus `scripts/pipeline/*` (render, encode, pdf, bundle, cache).
- [ ] Generators `fanoos`, `crescent-sky` and `mandala`, each with determinism (sha) tests and QA property tests over 50 seeds.
- [ ] PDF golden test: render page 1 with pdfjs-dist in Playwright and compare with the resvg render at the same DPI, tolerance ≤0.5%.

**M1.2 Site skeleton, SEO plumbing and the Ramadan hub (first deployable build).**
- [ ] `src/content.config.ts`, `src/loaders/designs.ts`, `src/lib/routes.ts` with a snapshot test, `src/lib/season.ts` with tests, and `src/lib/seo/*`.
- [ ] `BaseLayout` with `SeoHead` (title, meta, canonical, robots, OG, preload of the LCP image) and `JsonLd`. Header, footer, banner, imagery toggle (vanilla), paper script, filters script.
- [ ] Templates `Home`, `Hub`, `Design`, `Navigator` and `Prose`. `[...path].astro`. `404.astro`. `search/index.astro` (Pagefind UI loaded on focus).
- [ ] Endpoints: `robots.txt.ts`, `sitemap-index.xml.ts`, `sitemaps/[name].xml.ts`, `rss.xml.ts`, `[hub]/rss.xml.ts`, `llms.txt.ts`. `kciPostBuild` produces `_headers`, `_redirects` and the PDF canonical map. `worker/index.ts` with tests.
- [ ] Generators `geometric`, `mosque`, `objects` and `lettering-en`. `src/content/designs/ramadan-coloring-pages.yaml` with **48** curated designs and copy. Hub MDX at about 500 words.
- [ ] Trust pages: about, how-we-make, editorial-policy, islamic-content-guidelines (summary), license, privacy, terms, contact, how-to-print, faq.

**M1.3 Ramadan printables.**
- [ ] Generators `calendar-tracker`, `word-search` (with filler blocklist test) and `maze` (with solution test).
- [ ] Templates `Activities`, `PrintablesIndex`, `Printable` and `Bundle`. Pages `/ramadan-activities-for-kids/`, `/printables/`, `/printables/ramadan-calendar-for-kids/`, `/printables/ramadan-good-deeds-tracker/`, `/bundles/ramadan-activity-pack/`.

**M1.4 Arabic alphabet (built but gated).**
- [ ] The `arabic-letters` generator, `src/data/arabic/letters.json` (28 letters, frozen slugs, forms, `approvedBy: null`), templates `LetterHub` and `Letter`, the 57 designs, and the workbook bundle.
- [ ] Production builds exclude these pages until `arabicBy` is set. Preview builds show them with noindex and a DRAFT ribbon.

**M1.5 Breadth hubs.**
- [ ] `/islamic-geometric-coloring-pages/` (20), `/mandala-coloring-pages/` (20), `/mosque-coloring-pages/` (20, generic styles), the `/islamic-coloring-pages/` navigator, and `/color-online/`.

**M1.6 Docs, skills, CI.**
- [ ] All 9 docs, the 7 skills, `.github/workflows/*`, `lighthouserc.json`, `budgets.json`, `.github/CODEOWNERS`, and the `.github/PULL_REQUEST_TEMPLATE/islamic-review.md` template.

**M1.7 Fill-only coloring app.**
- [ ] `src/islands/coloring/*` and `src/pages/color/index.astro`, with the e2e tests listed under Verification.

**Session definition of done.**
- `pnpm verify` is green.
- `npx wrangler deploy --dry-run` succeeds.
- Contact sheets for every hub have been reviewed.
- About 175 designs are built, all indexability flags are set, and `docs/RUNBOOK.md` lists the human steps.

**Human launch checklist** (in `docs/RUNBOOK.md`, target 2026-10-20 to 10-27):
- Cloudflare account and API token stored as repo secrets.
- kidscolorit.com on Cloudflare DNS.
- Turn off: the managed "Block AI bots" robots.txt, Rocket Loader, Email Obfuscation, and Web Analytics auto-inject.
- Create the Redirect Rules.
- GSC domain property, then import into Bing.
- Check domain history (Wayback, existing backlinks, manual actions).
- Name the editor, who batch-approves copy (about 4 hours).
- Sign the IS and AR reviewers.
- After deploy: submit the sitemap index; URL-inspect `/`, the Ramadan hub, the activities page and the calendar; run the Rich Results Test on 6 template URLs.

### M2 — by 2026-12-14 (Ramadan indexing deadline)
- **L0 deploy** of the M1 output, target 10-27.
- Pin JPG pipeline and per-hub RSS feeding Pinterest. Pinterest business account and domain claim by 11-03.
- IndexNow, nightly rebuild via a Cloudflare Cron Trigger, and the gone list.
- Ramadan expanded to 60 designs. Basic facts plus IS-reviewed referenced facts. "Reviewed by" bylines turn on after sign-off.
- Arabic alphabet and workbook go live after AR sign-off (target 11-24).
- App: brush and eraser, print, `/my-coloring/`, color-by-number mode, mobile action bar.
- Eid al-Fitr hub (24 designs), `/printables/eid-cards/`, Eid puzzles, and the Eid bundle (12-08).
- `/printables/islamic-calendar/` 2027 edition (R2, 12-01).
- Request-a-page form: D1 plus Turnstile, no identity fields, at most 100 characters, PII scrubber, private queue. The CSP adds `challenges.cloudflare.com` on that page only.
- Teacher packs: "Islamic geometry in the maths classroom" and "Learning about Ramadan" (descriptive, no worship instruction).
- Indonesian pilot (12-07, if the id reviewer is signed): `/id/mewarnai-ramadhan/`, `/id/mewarnai-masjid/`, and `/id/mewarnai-huruf-hijaiyah/` (30 letters including lam-alif and hamzah). Uses an id house-style file, A4-default PDFs with a Nama/Kelas box, and hreflang only between true twins.
- Landmark mosque W1 entity pages as studio art passes the ARCH-01 check.

### M3 — Q1 2027
- Evergreen animal wave 1 (horse, cow/cattle, camel, sheep, goat; see the art backlog). Each hub needs ≥20 designs and editor-approved copy.
- Wave 2 intake: `scripts/intake/vectorize.ts` (potrace CLI at build time only) feeding the same region engine. Foods of the Quran.
- Wudu, salah and five-pillars printables (01-12).
- Ramadan child hubs (lanterns, crescents) once Ramadan exceeds 60 designs. "New for 2027" set.
- Arabic tracing with AR-corrected stroke JSON. `/ar/` pilot.
- Kid mode plus ParentGate, dark mode, full hashed CSP, service worker v1.1, advanced app tools.
- Eid al-Adha hub and Hajj hub with the Dhul Hijjah tracker (03-12).
- Monthly SERP-overlap cannibalization runs; facet promotion only when a facet's SERP overlaps its parent's by less than 30%, it has ≥20 designs, and the parent ranks 11–30 for the facet query.

### M4 — later in 2027
- tr and fr pilots (04-09); ms and ur (12-01).
- Hijri New Year & Islamic Months hub. Animals of the Quran.
- How-to-draw pages with silent YouTube Shorts (made-for-kids).
- On-device photo-to-coloring.
- July build month: Ramadan 2028 assets; Muslim-angle evergreen content (A–Z "M is for Mosque", numbers, snowflakes, autumn harvest).
- Ads only after COPPA counsel, the block lists (`docs/ads-blocklist.csv`, AdSense sensitive categories) and child-directed tagging. Membership stubs.

---

## Seasonal publishing calendar

Islamic dates are estimates, ±1 day for moon sighting:
- Ramadan 1448 begins about 2027-02-08.
- Eid al-Fitr is about 03-09/10.
- 1 Dhul Hijjah is about 05-07; Eid al-Adha about 05-16.
- 1 Muharram 1449 is about 06-05/06.
- Ramadan 1449 begins about 2028-01-28.

| Publish by | Ships | Why |
|---|---|---|
| 2026-10-24 | IS and AR reviewer contracts (hard 11-01); editor named | Critical path for every R2 item |
| **2026-10-27** | **L0**: Ramadan hub (48), activities, calendar, tracker, Ramadan pack, geometric, mandala, mosque (styles), navigator, `/color-online/` + `/color/`, trust pages | Starts crawl history. The Ramadan window has been open since 10-19, so titles show "2027" |
| 2026-11-03 | Pinterest account and domain claim; GSC monitoring per family (crawled-not-indexed alarm at 30%) | |
| 2026-11-10 | Ramadan expanded to 60; pin images; link outreach starts (about 40 pitches a week, 0.5 FTE owner) | Schools plan in Dec–Jan |
| 2026-11-17 | IS review of facts and R1 batch; bylines on; Eid al-Fitr season window opens | |
| 2026-11-24 | Arabic alphabet, 28 letters and the workbook (after AR) | Second link asset |
| 2026-12-01 | Islamic calendar 2027 printable; request form; teacher packs | |
| 2026-12-07 | Indonesian pilot (conditional) | About 9 weeks before the Ramadhan peak |
| 2026-12-08 | Eid al-Fitr hub, cards, tags, puzzles, bundle; color-by-number in the app | The Eid peak (about 02-27 to 03-09) is 11 weeks away |
| 2026-12-10 | Landmark mosques W1 entity pages (rolling) | |
| 2026-12-14 | Pinterest Ramadan seeding at 5 a day, rising to 15 a day by 01-04 | 8 weeks before Ramadan |
| 2027-01-04 | Foods of the Quran (Wave 2) | Iftar and dates bridges |
| 2027-01-12 | Wudu, salah and five-pillars printables (after IS and the madhab pool) | High-gap, spam-flooded searches |
| 2027-01-11 | Ramadan child hubs, "New for 2027", last-ten-nights activities; `/ar/` pilot; outreach wave 2 | Freshness |
| 2027-02-01 | Template freeze; data and copy only | Ramadan about 02-08 |
| 2027-02-08 → 03-10 | Ramadan live ops: daily "Day N" pin, monitoring, no structural changes | Peak |
| 2027-03-12 | Eid al-Adha hub, Hajj hub (maps, studio Kaaba), Dhul Hijjah tracker, Tier B Adha animals | 8 weeks before 1 Dhul Hijjah |
| 2027-03-17 | Ramadan window closes; titles drop "2027" automatically | Window rule |
| 2027-04-09 | Hijri New Year & Islamic Months hub (calm); tr and fr pilots | 8 weeks before 1 Muharram |
| 2027-04-16 | Pinterest ramp for Eid al-Adha and Hajj | Peaks in the first 10 days of Dhul Hijjah |
| 2027-05-01 | Animals of the Quran (canonical list) | |
| 2027-06-01 | Mosques W2; how-to-draw set and silent Shorts | Bangladesh and Pakistan "drawing" searches |
| 2027-07 | Build month: Ramadan 2028 (+30), Muslim-angle evergreen, prune pages with no clicks in 180 days | Lowest coloring demand |
| 2027-08-30 | Autumn (harvest) hub | |
| **2027-10-08** | Ramadan 2028 window opens: titles show "2028"; bundle edition 2 | 16 weeks before about 2028-01-28 |
| 2027-10-15 | Islamic calendar 2028 edition | |
| 2027-11-01 | Outreach wave; Eid hub refresh live by 11-26 | Eid al-Fitr 2028 about 02-26 |
| 2027-12-01 | Pinterest Ramadan 2028 seeding; ms and ur pilots | |

---

## Verification

`pnpm verify` runs the following in order, and every command must exit 0:

| Command | Checks |
|---|---|
| `pnpm lint` | Biome; `scripts/qa/lint-logical.ts` (no physical-direction CSS); `scripts/qa/islamic-lint.ts` (L01–L18, including house-style auto-fix in `--fix` mode); a grep that bans `Math.random` and `Date` under `generators/` |
| `pnpm typecheck` | `tsc --noEmit` and `astro check` |
| `pnpm test` | Vitest projects. **generators:** sha determinism for 5 seeds each; property tests over 50 seeds (regions within level bounds, min area and inscribed radius, stroke ≥1.5 pt, inside the safe area, SVG size, no `<text>`); L16 golden cases; word-search exactly-once and blocklist; maze solvability and path length; harfbuzz forms (22 joining letters give 4 distinct glyph runs, the 6 non-connectors give 2). **lib:** routes snapshot and reserved slugs; `seasonYear` boundaries; title fitting ≤60 characters for every entry; contrast tokens; Worker canonical and 410. **app:** history, viewport math, storage (fake-indexeddb) |
| `pnpm gen && pnpm qa:art` | Regenerate masters (cache-aware), run all art QA gates, compare snapshot shas. Writes `qa-report.json` |
| `pnpm gates` | `content-gates.ts` (dHash, Jaccard, word counts, review-tier exclusion, `editedBy` for indexable pages, hub ≥20, cross-hub card overlap ≤30%, shingle overlap ≤15%), `cannibalization.ts` (primaries and secondaries), `export-keyword-map.ts` (regenerates `docs/keyword-map.csv`; fails if it differs from the committed file) |
| `pnpm build` | `astro build`, then `pagefind --site dist` |
| `pnpm check:dist` | `html-validate` on every page. `jsonld-validate.ts`: parse every `ld+json`, resolve every `@id`, absolute https URLs only, ImageObject licence fields present, BreadcrumbList positions are 1..n, ItemList `numberOfItems` equals rendered cards, no HowTo/SearchAction. `seo-lint.ts`: one H1, title 30–60, meta 70–155, unique titles and descriptions, self canonical on indexable pages only, noindex where required, width and height on every image, `fetchpriority` only on the LCP image. `sitemap-check.ts`: every URL exists in `dist`, is indexable and self-canonical, appears in exactly one sitemap, `lastmod` is not the build time, `image:loc` files exist. `link-graph.ts`: inbound links ≥2, depth ≤3, no broken links, trailing slashes. `headers-check.ts`: `_headers` ≤100 rules, `_redirects` ≤1,900. `js-budget.ts` against `budgets.json`. `deploy-limits.ts`: file count (fail at 90K), file size (fail at 25 MiB) |
| `pnpm e2e` | Playwright against `astro preview`. `journey`: home → Ramadan hub → design; the PDF href returns 200 `application/pdf`; above-the-fold art and download at 360×740 and 390×844. `filters`: chips hide cards; the imagery toggle persists; the hash round-trips. `print`: `emulateMedia('print')` shows only `.print-art`. `app`: open `/color/#…`; tapping a region's label point sets its `fill`; undo and redo; reload restores fills; the PNG download has a valid signature and is 1440×1880; it also runs against 20 real generated designs, tapping every region's label point. `a11y`: axe finds zero serious issues on every template. `rtl`: the `ar` fixture mirrors chrome and leaves art unmirrored. `seo`: robots.txt contents; noindex on `/search/` and `/color/` |
| `pnpm lhci` | Six URLs (home, Ramadan hub, design, activities, calendar, `/color/`), mobile. **Hard fail:** SEO = 1, accessibility ≥0.95, CLS ≤0.05, byte budgets. **Warn locally, fail in CI:** performance ≥0.9, LCP ≤1.8 s, TBT ≤150 ms (≤250 ms on `/color/`) |
| `pnpm review sheet --all` | Writes contact sheets (`.kci/review/*.png`, 24 thumbnails each). Claude views every sheet in-session and records rejects in the YAML (`status: rejected`, with a reason) before committing |
| `npx wrangler deploy --dry-run` | The Worker and assets bundle validates |

**Post-deploy** (in RUNBOOK):
- `curl -sI` checks:
  - `/ramadan-coloring-pages` returns 301 to the slash version.
  - `/Ramadan-Coloring-Pages/` returns 301 to the lowercase path.
  - www redirects to the apex with a 301.
  - A PDF returns a `Link` canonical header.
  - `/files/svg/…` returns `X-Robots-Tag: noindex`.
- Rich Results Test by hand on 6 template URLs.
- GSC URL Inspection on the priority URLs.
- Cloudflare Web Analytics receives beacons.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Scaled-content-abuse demotion of a new domain | About 50 indexable URLs at L0 and about 150 by mid-December. Parametric design pages are noindex unless promoted. Visual and text gates. Release velocity ≤200 indexable URLs a week. A one-deploy family-noindex switch. Per-family "crawled – not indexed" alarm at 30% |
| Reviewers not hired in time | R0/R1/R2 tiers let aniconic Ramadan content ship with editor QA. R2 items (Arabic, worship sheets, referenced facts) are the only ones that slip. Escalate contracts now, with a named backup |
| Schedule overrun in M1 | Explicit cut order (app → breadth → Arabic). The Ramadan cluster comes first. Each sub-milestone is committed with verify passing |
| clipper2-ts API churn, pdf-lib dormant, harfbuzzjs API drift | Wrappers in `generators/core/{clipper,text}.ts` with golden tests. Fallbacks clipper2-wasm and @cantoo/pdf-lib. Regions don't depend on Clipper (raster engine) |
| Arabic shaping or vowel errors damage trust with teachers | harfbuzzjs only, fixed features, static fonts with pinned sha, glyph-run golden tests. Every Arabic string needs AR sign-off. Stroke arrows are deferred until AR corrects them |
| Playwright 1.64 vs preinstalled Chromium 141 | Use executablePath, falling back to pinning 1.56.1 for the session, recorded in DECISIONS.md |
| URL or asset-path churn after indexing | Frozen route table plus snapshot test. Same-origin `/files/` with no hashes in filenames. `redirectFrom` gives 301s |
| AI Overviews generating simple coloring images | Lead with bundles, calendars, trackers, worksheets and vector PDFs; "Download all" sits above the grid. Track replaceable vs durable query CTR monthly. Move Indonesian work earlier |
| Over-optimistic traffic expectations | Re-baselined KPIs. Pinterest is treated as the main seasonal channel for 2027 |
| Link building fails | A 0.5 FTE owner with quotas, 3 link assets (Ramadan pack, Arabic workbook, geometry teacher pack), madrasah and teacher partnerships. Guardrails: brand anchors only, no paid links, a single parent-company link |
| COPPA or Children's Code exposure | Treated as child-directed. No PII collection in M1. No raw query logs. Forms and newsletter only after counsel. Ads later only with child-directed flags and block lists |
| Contested religious content (Mawlid, Ashura, madhab practice, al-Aqsa, mandala naming) | Observance table, madhab consultant pool, "some families…" phrasing, neutral geography, shamsa naming in Islamic hubs, community-tagged content kept out of nav and calendars |
| Hexagram or other symbol misreads in generated art | Motif-level L16 lint plus golden tests, 6-point stars removed from crescent-sky and tags, a human contact-sheet reject pass |
| Season-window or banner bugs (wrong year, stale countdown) | One `events.ts`, a pure `seasonYear` with boundary tests, client-side day count, nightly rebuild with failure alerts |
| Safari evicts IndexedDB artwork | Copy reads "Saved on this device — download to keep". PWA install tip in M3 |
| Cloudflare managed settings override robots or inject scripts | Runbook checklist, plus a post-deploy test that robots.txt matches the build output |
| Pinterest AI labels on AI-assisted art | Seasonal pin sets use code-generated or studio art only. AI use is disclosed on the page. IPTC `algorithmicMedia` for code art |