<!-- Specialist draft (SEO architecture & keyword-to-page map). Superseded by docs/PLAN.md where they disagree. -->

# KidsColorIt SEO architecture and keyword-to-page map (v1, 2026-10-13)

Scope: the SEO plan for kidscolorit.com, to be committed as `docs/SEO.md`. Everything below is a decision. Where a fact depends on a 2026 platform change, the source is listed at the end.

---

## 0. Main decisions

1. **URLs.** Topic hubs are flat at the root (`/ramadan-coloring-pages/`). Each design is nested under its single primary hub (`/ramadan-coloring-pages/lantern-with-crescent-moon/`). Every URL ends in a trailing slash. Everything is lowercase ASCII.
2. **Seasonal hubs keep one evergreen URL forever.** The year goes in the `<title>`, H1 and OG title only, and only inside a computed "season window". URLs never contain a year.
3. **Ownership of keywords:**
   - A topic hub owns its age and style facets (`/ramadan-coloring-pages/preschool/`).
   - A format silo owns format × topic (`/color-by-number/ramadan/`).
   - The Arabic alphabet is the one exception: it owns its own formats.
4. **Filters are JS-only.** Age, difficulty and the "no animate beings" toggle filter the page in the browser and create no indexable URLs. A facet gets a static indexable page only when it is whitelisted, has demand, and has at least 12 designs.
5. **Online coloring has no separate URL per design.** The canvas opens on the design URL (`#color`). There is one indexable `/color-online/` hub, plus topic online hubs later, but only after Search Console shows demand.
6. **No tag pages.** Tags are internal data used for filters and related links.
7. **One canonical HTML page per design.** The PDFs send an HTTP `Link: rel="canonical"` header back to that page.
8. **Hosting:** Cloudflare Workers Static Assets on the paid plan (100,000 files per version, against 20,000 on the free plan), plus a 20-line Worker on `/files/pdf/*` for the canonical headers. Pages do not get an auto-redirect by IP or language.
9. **Sitemaps are custom Astro endpoints,** not `@astrojs/sitemap`. That is needed because slugs are translated per locale, sitemaps are split by type, and image tags are needed.
10. **Structured data reflects October 2026:**
    - FAQ rich results were retired for all sites on 2026-05-07.
    - HowTo rich results are gone.
    - The sitelinks search box is gone.
    - Practice Problems and Learning Video markup were deprecated in January 2026.
    - We emit markup for meaning and for other engines, and we chase only the features that still produce results: image licence metadata, breadcrumbs (desktop) and site names.
11. **The Ramadan 2027 hub goes live on 2026-11-20 with at least 40 designs,** so it is indexed well before mid-December. An Indonesian pilot goes live on 2026-12-14.
12. **Content is released in waves.** Wave 1 is code-generated only: geometric patterns, mandalas, Arabic letters, numbers, shapes, lanterns, crescents, mosque silhouettes, calendars, cards, color-by-number, mazes and word search. Illustrated pages (animals, foods, detailed mosques, Hajj scenes) start in Wave 2, from 2027-01-04.
13. **Build gates block thin or duplicate programmatic pages.** The build fails or the page is excluded; the gates are part of the guard against Google's "scaled content abuse" policy.
14. **Pages that require Islamic review are excluded from the build until a named reviewer has signed off.** We never invent reviewers.
15. **Monetization stays off.** `<AdSlot>` renders nothing when the flag is off, and reserves a fixed `min-height` from the first paint when it is on, so turning ads on later causes no layout shift (CLS).

---

## 1. URL architecture and taxonomy

### 1.1 Global URL rules

- **Canonical host:** `https://kidscolorit.com`. Redirect `www`→apex and `http`→`https` with 301s (Cloudflare Redirect Rules).
- **Trailing slash:** always. Astro config: `trailingSlash: 'always'`, `build.format: 'directory'`. Files keep their extension and have no slash (`.pdf`, `.xml`, `.txt`, `.webp`).
- **Case:** lowercase only. The Worker 301s any path that contains uppercase. That matters because TheColor.com's mixed-case `.aspx` URLs are a known canonical problem we should not repeat.
- **Query parameters** never create content. Every page's canonical is the clean path.
- **No auto-redirect** by `Accept-Language` or by IP, because Googlebot crawls from the US. A dismissible "View in Bahasa Indonesia?" bar is fixed to the bottom of the viewport and is client-side only, so it causes no CLS.
- **Previews:** non-production hosts (`*.workers.dev` and preview branches) get `<meta name="robots" content="noindex">`, controlled by the build env `PUBLIC_SITE_ENV !== 'production'`. The `workers.dev` route is disabled on the production Worker.

### 1.2 URL patterns

| Page type | Pattern | Example |
|---|---|---|
| Home | `/` | `/` |
| Silo parent | `/{silo}-coloring-pages/` | `/islamic-coloring-pages/`, `/animal-coloring-pages/` |
| Topic hub | `/{topic}-coloring-pages/` | `/ramadan-coloring-pages/`, `/mosque-coloring-pages/` |
| Topic facet (static, whitelisted) | `/{topic}-coloring-pages/{facet}/` | `/ramadan-coloring-pages/preschool/`, `/mandala-coloring-pages/adults/`, `/ramadan-coloring-pages/bold-and-easy/` |
| Single design | `/{primary-hub}/{design-slug}/` | `/ramadan-coloring-pages/lantern-with-crescent-moon/` |
| Entity page (mosque, Quran animal, Quran food) | `/{hub}/{entity-slug}/` | `/mosque-coloring-pages/blue-mosque/`, `/animals-of-the-quran-coloring-pages/elephant/` |
| Event umbrella | `/{event}-activities-for-kids/` | `/ramadan-activities-for-kids/` |
| Format silo | `/{format}/` | `/color-by-number/`, `/word-search/`, `/mazes/`, `/dot-to-dot/`, `/tracing-worksheets/` |
| Format × topic | `/{format}/{topic}/` | `/color-by-number/ramadan/`, `/word-search/eid/` |
| Format item (artworks only: color-by-number, dot-to-dot) | `/{format}/{topic}/{item}/` | `/color-by-number/ramadan/crescent-lantern/` |
| Arabic alphabet | `/arabic-alphabet/`, `/arabic-alphabet/{format}/`, `/arabic-alphabet/{letter}/` | `/arabic-alphabet/tracing-worksheets/`, `/arabic-alphabet/alif/` |
| Printables silo | `/printables/` | — |
| Printable hub | `/printables/{slug}/` | `/printables/ramadan-calendar-for-kids/` |
| Printable item | `/printables/{slug}/{item}/` | `/printables/eid-cards/lantern-eid-mubarak-card/` |
| Tools (interactive) | `/tools/{slug}/` | `/tools/ramadan-calendar-maker/`, `/tools/eid-card-maker/` |
| Bundles | `/bundles/`, `/bundles/{slug}/` | `/bundles/ramadan-activity-pack/`, `/bundles/islamic-coloring-book-pdf/` |
| Online coloring hub | `/color-online/` (topic hubs `/color-online/{topic}/` only when the demand gate in §1.5 is met) | `/color-online/` |
| How to draw | `/how-to-draw/{subject}/` | `/how-to-draw/mosque/`, `/how-to-draw/eid-moon/` |
| Guides | `/guides/`, `/guides/{slug}/` | `/guides/how-to-explain-ramadan-to-kids/` |
| Team | `/team/`, `/team/{person-slug}/` | `/team/<reviewer-slug>/` |
| About and trust | `/about/`, `/about/how-we-make-coloring-pages/`, `/about/editorial-policy/`, `/about/islamic-content-guidelines/`, `/about/license/` | — |
| Contact | `/contact/`, `/request-a-page/` | — |
| Legal | `/privacy/`, `/terms/` | — |
| Search | `/search/` (noindex) | `/search/?q=camel` |
| HTML sitemap | `/sitemap/`, `/sitemap/{silo}/` | `/sitemap/islamic/` |
| Pagination (rare, see §1.6) | `/{hub}/page/{n}/` | `/animal-coloring-pages/page/2/` |
| Files: preview images | `/files/img/{hub}/{design}-coloring-page-{400\|800\|1200}.{webp\|avif}` | — |
| Files: colored example | `/files/img/{hub}/{design}-colored-example-{w}.{avif\|webp}` | — |
| Files: PDFs | `/files/pdf/{hub}/{design}-coloring-page-{letter\|a4}.pdf` | — |
| Files: pin and OG images | `/files/pin/{hub}/{design}-pin.jpg` (1000×1500), `/files/og/{hub}/{design}.jpg` (1200×630) | — |
| Files: SVG source (for the canvas) | `/files/svg/{hub}/{design}.svg` (sent with `X-Robots-Tag: noindex`) | — |
| Locales | `/{locale}/…`, with translated slugs for `id`, `tr`, `fr`, `ms` and English slugs for `ar`, `bn`, `ur` | `/id/mewarnai-ramadhan/`, `/ar/ramadan-coloring-pages/` |

**Reserved slugs.** A design slug may not be `easy`, `medium`, `detailed`, `toddler`, `preschool`, `kindergarten`, `adults`, `bold-and-easy`, `page`, `rss.xml` or `color`. These names collide with facet and pagination paths. The rule is enforced in the Zod schema of the `designs` collection.

### 1.3 Slug rules

- Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`, at most 60 characters.
- A design slug has 2–5 words, puts the subject first, and does not repeat the hub term. Use `/mosque-coloring-pages/blue-mosque/`, not `blue-mosque-coloring-page`.
- Slugs never contain years, "free", "printable" or numeric IDs.
- Transliteration follows one dictionary, `src/data/transliteration.ts`:
  - ramadan (copy also covers "ramadhan" and "ramzan")
  - eid-al-fitr, eid-al-adha
  - quran (not "koran"), hajj, umrah, wudu, salah (copy mentions "namaz")
  - masjid inside proper names; "mosque" in hub URLs
  - kaaba, fanoos
  - The 28 letter slugs: `alif ba ta tha jeem haa khaa daal dhaal ra zay seen sheen saad daad taa dhaa ayn ghayn fa qaf kaf lam meem noon ha waw ya`
- Never change a slug after publishing. If a change is unavoidable, add `redirectFrom: []` to the frontmatter, which feeds the 301 list in `_redirects`.

### 1.4 Locale routing

- Astro i18n config: `locales: ['en','ar','id','bn','tr','ms','fr','ur']`, `defaultLocale: 'en'`, `routing: { prefixDefaultLocale: false }`, and **no fallback**. Astro's `rewrite` fallback would publish English duplicates under `/id/`.
- Only translated pages exist in a locale. The locale switcher links to the translated twin when one exists, and to the locale home when it does not.
- Translated slugs come from a shared `translationKey` field on each content entry. Paths are generated in `getStaticPaths` per type. `src/lib/i18n/paths.ts` exports `localizedPath(key, locale)`.
- `<html lang="{locale}" dir="{rtl|ltr}">`. Arabic and Urdu are `dir="rtl"`. The layout uses logical CSS properties (`ms-*`, `me-*`, `start-*` and `end-*` in Tailwind 4).

### 1.5 Seasonal hubs and year stamping

- One evergreen URL per event: `/ramadan-coloring-pages/`, `/eid-coloring-pages/`, `/eid-al-adha-coloring-pages/`, `/hajj-coloring-pages/`, `/islamic-new-year-coloring-pages/`.
- **Season window**, computed at build from `src/data/calendar/events.ts`:
  - The year appears in the title, H1 and OG title from **16 weeks before** the event starts until **7 days after** it ends.
  - Ramadan 2027: from 2026-10-19 to 2027-03-17.
  - Outside the window the title has no year.
  - A daily rebuild at 00:30 UTC flips the year automatically.
- **Inside the window** the page also shows:
  - A "New for {year}" strip (at least 10 new designs per season).
  - An "Updated for {year}" badge.
  - A quick-facts box with the expected dates.
- `dateModified` changes only when content really changes: at least 10 new designs, or a copy refresh of at least 150 words.
- Year-specific products (`/printables/islamic-calendar/`) also keep an evergreen URL. Last year's PDF stays linked on the page as "2026 edition".
- Never create `/ramadan-2027-coloring-pages/` or anything similar.
- Seasonal hubs stay live all year. They are never removed or redirected after the season.

**Online topic hubs (`/color-online/{topic}/`).** Create one only when Search Console shows at least 200 impressions a month for "{topic} coloring online" and similar queries landing on the design pages.

### 1.6 Pagination

- A hub shows **at most 60 cards** on one URL. Every card is in the HTML, and images below the first row are lazy-loaded.
- Above 60 designs, **split the hub into sub-hubs first**. For example, `/animal-coloring-pages/` becomes a parent of tiles that link to `/dinosaur-coloring-pages/`, `/cat-coloring-pages/` and so on.
- Use `/page/{n}/` only when a split makes no sense (a flat hub such as `/mandala-coloring-pages/` with 150 designs). In that case:
  - Each page is self-canonical and `index,follow`.
  - The title gets " – Page {n}".
  - Plain `<a href>` links go to page 1…n.
  - Pages 2 and up show the lede only, with no body copy.
  - No `rel=prev/next`, and no infinite scroll without paginated URLs.

### 1.7 Facets and filters

| Facet | Values | Implementation | Indexable static pages |
|---|---|---|---|
| Age | toddler (2–3), preschool (3–5), kindergarten (5–6), kids (6–9), tweens (9–12), teens and adults | `<FilterBar>` with `<button>` elements (not `<a>`). State goes into the URL `?age=` through `history.replaceState`, and cards are hidden through `data-age` attributes. Vanilla JS, at most 4 KB gzipped. | Whitelist only, each needing at least 12 qualifying designs: `ramadan × {toddler, preschool, kindergarten}`, `eid × {toddler, preschool}`, `mandala × adults`, `islamic-geometric × adults` |
| Difficulty | easy, medium, detailed, expert | Same as age (`?level=`) | `{ramadan, eid, mosque, mandala}/easy/` |
| Style | bold-and-easy, detailed | Same (`?style=`) | `{ramadan, eid, animal}/bold-and-easy/` |
| Content filter | "No animate beings" (hides animals and people) | A **site-wide toggle** in the header. The setting is stored in `localStorage` (wrapped in try/catch) and adds `html.no-animate`. CSS then hides `[data-animate="true"]`. **Off by default**, so Googlebot sees everything. | Never. A curated `/no-faces-coloring-pages/` hub is a separate editorial page. |
| Faces | — | People are always drawn faceless. This is a content rule, not a filter. | — |
| Sort | popular, new | JS only | Never |

- Whitelisted facet pages are generated from `src/data/facets.ts`. A facet page with fewer than 12 designs builds as `noindex,follow` and is left out of the sitemap.
- No `Disallow` for parameters in robots.txt, so Google can still read the canonical tags.

### 1.8 Robots meta by template

Indexable pages use `index,follow,max-image-preview:large,max-snippet:-1`. That covers:
- Home, silo parents and topic hubs (at least 8 designs)
- Whitelisted facets (at least 12 designs)
- Design pages, entity pages, letter pages
- Printable hubs and items, tools, bundles, format × topic pages (at least 8 items)
- `/color-online/`, how-to-draw pages, guides
- Team, about and policy pages, and HTML sitemap pages

Pages that use `noindex,follow`:
- `/search/`
- Hubs and format × topic pages under their thresholds
- Form thank-you pages
- 404
- Every page on a preview host

Not crawlable: `/api/*` (blocked in robots.txt).

---

## 2. Keyword → page map

### 2.1 Rules against cannibalization

1. **One primary keyword per indexable URL.** Each content entry has frontmatter `seo.primaryKeyword` and `seo.secondaryKeywords[]`. The CI script `scripts/seo/cannibalization.ts` fails the build if two indexable URLs share a normalized primary keyword (lowercased, singularized, with "colouring" mapped to "coloring").
2. **Which URL owns which query:**
   - Topic hub: "{topic} coloring pages", plus "for {age}" and "easy/bold {topic}".
   - Format silo: "{topic} {format}" (color by number, word search, maze, dot to dot).
   - Printables: "{activity} printable/worksheet".
   - Guides: informational "how/what/why" queries.
   - Root age hubs (`/toddler-coloring-pages/`, `/preschool-coloring-pages/`): cross-topic curated pages.
3. **Exception:** `/arabic-alphabet/` owns its own formats (tracing, coloring, chart). There is **no** `/tracing-worksheets/arabic-letters/`; the tracing silo links across to it instead.
4. **UK spelling:** "colouring" appears once in each hub's lede or FAQ ("…or colouring pages, as UK families say"). There is no en-GB locale.
5. **Roman Urdu:** "Ramzan", "namaz" and "Bakra Eid" are covered in English copy and FAQs. They get no separate URLs.

### 2.2 TOP tier (umbrella terms)

These terms are tracked but not expected to rank in the first 6–12 months.

| Head term (volume) | Supporting URL | Notes |
|---|---|---|
| coloring pages (~1M), coloring page (~823K), colouring pages (~1M), coloring pages for kids (~301K), coloring page printable (~135K), free printable coloring pages | `/` | Home title: **"KidsColorIt: Free Coloring Pages & Muslim Kids Activities"**. H1: "Free Printable Coloring Pages & Islamic Activities for Kids". |
| online coloring / color online | `/color-online/` | "Online Coloring Pages – Color Online Free (No Download)" |
| islamic coloring pages, muslim coloring pages, islamic activities for kids | `/islamic-coloring-pages/` | Hub for the Islamic silo |
| animal coloring pages | `/animal-coloring-pages/` | Wave 2 |
| mandala coloring pages, color by number, easy coloring pages, cute coloring pages | Their own hubs (§2.3–2.5) | Head-like terms; aim for long-tail wins first |
| worksheets for kids / printable activities | `/printables/` | — |

### 2.3 MID tier: standard hub template

These formulas and sections apply to every hub unless a hub overrides them.

- **Title:**
  - `{N} {Topic} Coloring Pages{ {Year}} (Free Printable PDFs)` when N ≥ 12.
  - Otherwise `{Topic} Coloring Pages{ {Year}} – Free Printable PDFs`.
  - At most 60 characters. When too long, the build falls back to `(Free PDFs)`.
  - No brand suffix; Google shows the site name separately.
  - N is the real count of designs in the hub, computed at build.
- **H1:** `{Topic} Coloring Pages{ {Year}}` (shorter than the title).
- **Meta description** (130–155 characters): `{N} free {topic} coloring pages for kids: {top-3 subjects}. Print vector PDFs (Letter & A4) or color online. No signup.{ {differentiator}}`
  - Example differentiators: "Faceless options.", "Reviewed by an Islamic studies teacher."
- **Word counts by tier:**
  - Tier A (flagship: Ramadan, Ramadan activities, Eid, Islamic parent, mosques, Arabic alphabet): lede 60–80 words, body below the grid 800–1,200 words.
  - Tier B (other Islamic hubs, color-by-number, mandala, bold-and-easy, geometric): lede 50–70, body 500–800.
  - Tier C (general evergreen): lede 40–60, body 350–550.
  - Facet pages: lede 40–60, plus 150–300 unique words of age- or style-specific tips.
  - Format × topic pages: 200–400 words.
- **Section order:**
  1. `<Breadcrumbs>`
  2. H1, lede, `<Byline>` ("Designed by … · Reviewed by … · Updated …")
  3. `<FilterBar>` and the no-animate toggle
  4. `<HubGrid>` with cards (thumbnail, name, one-line description, difficulty and age chips, [Download PDF], [Color online])
  5. `<BundleCTA>` ("Download all {N} as one PDF")
  6. "How to use and print" (80–120 words)
  7. "About {topic} for kids", educational and answer-first (150–400 words)
  8. "Coloring ideas and palettes" (80–150 words, with swatches)
  9. FAQ (4–8 questions, visible)
  10. `<RelatedHubs>` (6) and `<BridgeLinks>`
- The global `<ComingUpBanner>` sits above the header.

### 2.4 MID tier: launch hub specs (Islamic and flagship)

Each block lists only what differs from the template in §2.3. Volume estimates come from the research brief.

**H1. Ramadan coloring pages, Tier A**
- URL: `/ramadan-coloring-pages/`. Breadcrumb: Home › Islamic Coloring Pages › Ramadan.
- Primary: "ramadan coloring pages" (8–15K a month; 50–90K at the US peak).
- Secondaries: ramadan coloring pages 2027, ramadan coloring sheets, ramadan kareem/mubarak coloring pages, ramzan coloring pages, ramadan colouring pages, ramadan coloring pages for kids/preschool, iftar coloring page.
- Title: `48 Ramadan Coloring Pages 2027 (Free Printable PDFs)`. H1: `Ramadan Coloring Pages 2027`.
- Meta: `48 free Ramadan coloring pages for kids: lanterns, crescent moons, mosques & iftar treats. Print vector PDFs (Letter/A4) or color online. No signup.`
- Unique sections:
  - Quick-facts box "When is Ramadan 2027?": expected around 8 February 2027, ±1 day depending on moon sighting.
  - "What is Ramadan? Explained for kids" (200 words, reviewed).
  - "By age" tiles linking to the toddler, preschool and kindergarten facets and to `/bold-and-easy/`.
  - "More Ramadan activities" strip: calendar, tracker, color-by-number, word search, maze, cards.
  - "New for 2027" grid.
  - FAQ "Ramadan or Ramzan?".
- Links out: `/ramadan-activities-for-kids/`, `/printables/ramadan-calendar-for-kids/`, `/printables/ramadan-good-deeds-tracker/`, `/color-by-number/ramadan/`, `/word-search/ramadan/`, `/mazes/ramadan/`, `/ramadan-lantern-coloring-pages/`, `/eid-coloring-pages/`, `/mosque-coloring-pages/`, `/islamic-geometric-coloring-pages/`, `/foods-of-the-quran-coloring-pages/dates/`, `/moon-and-stars-coloring-pages/`, `/bundles/ramadan-activity-pack/`.
- Art: code-generated (CG) for lanterns, crescents, mosque silhouettes, patterns and calligraphy. Illustrated (IL) for iftar tables, from Wave 2.

**H2. Ramadan activities for kids, Tier A (event umbrella)**
- URL: `/ramadan-activities-for-kids/`.
- Primary: "ramadan activities for kids" (5–10K; 30K+ at peak).
- Secondaries: ramadan activities for toddlers/preschoolers, ramadan printables, ramadan activity sheets/worksheets, ramadan activity book pdf, ramadan ideas for kids, ramadan classroom activities.
- Title: `Ramadan Activities for Kids 2027: {N} Free Printables`. H1: `Ramadan Activities for Kids (2027)`.
- Meta: `Free Ramadan activities for kids: 30-day calendar, good-deeds tracker, coloring pages, word search, mazes & Eid cards. Printable PDFs for home & class.`
- Lede 70 words. Body 1,000–1,300 words (a hub and guide hybrid).
- Sections:
  - By age (2–3, 3–5, 6–9, 10–12)
  - By week of Ramadan: moon sighting and intention; kindness; Quran stories; last 10 nights and Laylat al-Qadr; Eid preparation
  - "A day in Ramadan" routine printable
  - "Teaching Ramadan in a mixed classroom", written for non-Muslim teachers in US and UK schools, who are a large audience for this query
- Links: every Ramadan asset, `/tools/ramadan-calendar-maker/`, `/guides/how-to-explain-ramadan-to-kids/`, `/guides/when-is-ramadan-2027/`.

**H3. Eid coloring pages, Tier A**
- URL: `/eid-coloring-pages/`.
- Primary: "eid coloring pages" (3–6K; 15–30K).
- Secondaries: eid mubarak coloring pages, eid al fitr coloring pages, eid coloring sheets, eid colouring, eid drawing easy (a bridge to how-to-draw).
- Title: `36 Eid Coloring Pages 2027 (Free Eid Mubarak PDFs)`. H1: `Eid Coloring Pages 2027: Eid Mubarak!`
- Meta: `{N} free Eid coloring pages: Eid Mubarak lettering, lanterns, gifts, sweets & mosques. Printable PDFs for Eid al-Fitr & Eid al-Adha, or color online.`
- Sections:
  - Quick facts "Eid al-Fitr vs Eid al-Adha", with 2027 dates (about 9–10 March and about 16 May)
  - A strip for cards, gift tags and Eidi envelopes
  - A strip for Eid word search and color-by-number
  - "Eid party table activities"
- Season window: from 2026-12-08 to 2027-05-23. One window covers both Eids.
- Links: `/printables/eid-cards/`, `/eid-al-adha-coloring-pages/`, `/how-to-draw/eid-moon/`, `/ramadan-coloring-pages/`, `/islamic-calligraphy-coloring-pages/`.

**H4. Eid al-Adha coloring pages, Tier B**
- URL: `/eid-al-adha-coloring-pages/`.
- Primary: "eid al adha coloring pages" (1–2K; 8–12K).
- Secondaries: eid ul adha coloring, bakra eid / bakrid coloring, qurbani coloring, sheep eid coloring page, dhul hijjah activities for kids.
- Title: `{N} Eid al-Adha Coloring Pages 2027 (Free PDFs)`. H1: `Eid al-Adha Coloring Pages 2027`.
- Sections:
  - "The story behind Eid al-Adha", told in text only with no depiction of prophets (reviewed).
  - "The 10 days of Dhul Hijjah" tracker, linking to the printable.
  - Animal designs (sheep, goat, cow, camel) with a note on the toggle and a list of non-animate alternatives.
  - Qurbani explained gently. Policy: no slaughter imagery.
- Links: `/hajj-coloring-pages/`, `/mosque-coloring-pages/masjid-al-haram/`, `/sheep-coloring-pages/` (Wave 2), `/animals-of-the-quran-coloring-pages/camel/`, `/printables/eid-cards/`.

**H5. Hajj and Kaaba coloring pages, Tier B**
- URL: `/hajj-coloring-pages/`.
- Primary: "hajj coloring pages", with "kaaba coloring page" (300–800 combined).
- Secondaries: umrah coloring, hajj activities for kids, steps of hajj for kids, makkah coloring page.
- Title: `{N} Hajj & Kaaba Coloring Pages (Free Printable PDFs)`. H1: `Hajj & Kaaba Coloring Pages`.
- Sections:
  - "Steps of Hajj for kids", shown through places only, no people: Kaaba with tawaf arrows, Safa–Marwa, Mina tents, Arafat, Muzdalifah pebbles, Jamarat, Zamzam.
  - A Hajj-route map to color (CG).
- Links: Masjid al-Haram page, Masjid an-Nabawi page, `/eid-al-adha-coloring-pages/`, `/printables/five-pillars-of-islam-worksheets/`, camel.

**H6. Islamic coloring pages, Tier A (silo parent)**
- URL: `/islamic-coloring-pages/`.
- Primary: "islamic coloring pages" (1.5–3K), with "muslim coloring pages" (~1K).
- Secondaries: islamic coloring sheets, islamic coloring pages for kids, islamic coloring book pdf (linked to the bundle).
- Title: `Islamic Coloring Pages for Muslim Kids ({N} Free PDFs)`. H1: `Islamic Coloring Pages for Kids`.
- Sections:
  - Silo navigator tiles: Ramadan, Eid, Hajj, Mosques, Arabic alphabet, Calligraphy, Geometric, Animals of the Quran, Foods, Islamic objects, 99 Names, Printables.
  - "Our Islamic content guidelines": a 120-word summary linking `/about/islamic-content-guidelines/`.
  - What the no-animate toggle does.
  - Grid of the top 24 designs.
  - Bundle CTA.

**H7. Islamic geometric patterns, Tier B**
- URL: `/islamic-geometric-coloring-pages/`. Parent: `/geometric-coloring-pages/`.
- Primary: "islamic geometric pattern coloring" (200–500).
- Secondaries: islamic pattern coloring pages, islamic art coloring pages, zellige / girih / iznik tile coloring, islamic geometric coloring pages for adults, 8-point star pattern, shamsa.
- Title: `40 Islamic Geometric Pattern Coloring Pages (Free PDFs)`. H1: `Islamic Geometric Pattern Coloring Pages`.
- Sections:
  - "How Islamic geometric patterns are made": compass and straightedge; 6-, 8-, 10- and 12-fold symmetry.
  - "Draw your own 8-point star", as an ordered list with step images (no HowTo schema).
  - "Where to see them": Alhambra, Isfahan, Fez, with links to the mosque pages.
  - "Math in Islamic art" for teachers (UK KS2/KS3 art and maths), marked up as LearningResource.
- Facets: `/adults/`, `/easy/`.
- Art: 100% CG.

**H8. Mosque coloring pages, Tier A (Mosques of the World series)**
- URL: `/mosque-coloring-pages/`.
- Primary: "mosque coloring page(s)" (1–2.5K).
- Secondaries: masjid coloring page, mosques of the world, famous mosques for kids, mosque drawing (Bangladesh and Pakistan, linked to how-to-draw), parts of a mosque.
- Title: `30 Mosque Coloring Pages: Famous Masjids (Free PDFs)`. H1: `Mosque Coloring Pages: Mosques of the World`.
- Sections:
  - A clickable SVG world map linking every mosque page (CG; plain `<a>` links).
  - A labelled "Parts of a mosque" diagram: dome, minaret, mihrab, minbar, wudu area.
  - A "Mosque passport" printable for collecting all 30. It drives engagement and is hard for AI image tools to copy.
  - Simple and detailed tiers.
- Entity pages: see §2.6.

**H9. Arabic alphabet, Tier A (3 hubs and 28 letter pages)**
- `/arabic-alphabet/`
  - Primary: "arabic alphabet worksheets" (2–5K).
  - Secondaries: arabic alphabet for kids, arabic letters printable, arabic alphabet chart printable, alif ba ta, hijaiyah letters.
  - Title: `Arabic Alphabet Worksheets for Kids: 28 Letters (Free PDF)`. H1: `Arabic Alphabet Worksheets for Kids`.
  - Sections:
    - A printable alphabet chart poster (CG)
    - A 28-letter tile grid
    - "How to teach the Arabic alphabet": right to left, letter families by dot pattern, the 6 non-connecting letters (ا د ذ ر ز و)
    - An HTML table of the 4 positional forms for all 28 letters. It is easy for AI systems to cite.
    - A workbook bundle CTA
- `/arabic-alphabet/tracing-worksheets/`
  - Primary: "arabic letter tracing" (1–2K).
  - Secondaries: arabic alphabet tracing worksheets, arabic handwriting practice pdf.
  - Title: `Arabic Letter Tracing Worksheets (28 Free PDFs)`.
- `/arabic-alphabet/coloring-pages/`
  - Primary: "arabic alphabet coloring pages" (0.5–1.5K).
  - Secondaries: arabic letters coloring, color by arabic letter.
  - Title: `28 Arabic Alphabet Coloring Pages (Free Printable PDFs)`.
- The 28 letter pages are specified in §2.6.
- Art: 100% CG. Letters are typeset from OFL fonts (Amiri, Reem Kufi) converted to outlines. Stroke-direction arrows come from data.

**H10. Islamic printables (silo and launch pages)**

| URL | Primary (volume) | Secondaries | Title | H1 | Body words | Unique sections |
|---|---|---|---|---|---|---|
| `/printables/` | islamic activity sheets (1–2K) | islamic worksheets for kids, islamic printables | `Islamic Worksheets & Printables for Kids (Free PDFs)` | Islamic Worksheets & Activity Printables | 500 | Grid by type and by age |
| `/printables/ramadan-calendar-for-kids/` | ramadan calendar printable for kids (1–3K; 10K) | ramadan countdown calendar, ramadan advent calendar printable, 30 day ramadan calendar | `Printable Ramadan Calendar for Kids 2027 (Free PDF)` | Printable Ramadan Calendar for Kids (2027) | 600–800 | Table comparing 4 versions (color-in 30-day, moon-phase CG, countdown chain, 30 deed cards); a dates note (calendar uses "Day 1–30" with optional Gregorian dates); link to `/tools/ramadan-calendar-maker/` (adds the child's or class name) |
| `/printables/ramadan-good-deeds-tracker/` | ramadan good deeds tracker | good deeds chart for kids, ramadan fasting tracker for kids, ramadan reward chart | `Ramadan Good Deeds Tracker for Kids (Free Printable PDF)` | Ramadan Good Deeds & Fasting Tracker | 500–700 | A 30-deed idea list by age; a fasting tracker for first-time fasters; a deeds-jar cut-out |
| `/printables/wudu-steps-for-kids/` | wudu steps for kids (0.5–1.5K) | how to make wudu for kids, wudu chart printable, wudu poster | `Wudu Steps for Kids: Printable Chart & Coloring Sheets` | Wudu Steps for Kids (Printable Chart) | 600 | Numbered steps in text first, so AI systems can quote them; Arabic terms; body-part icons only; note that it follows the widely taught Sunni sequence, with madhhab differences noted by the reviewer |
| `/printables/salah-steps-for-kids/` | salah steps printable (0.5–1.5K) | how to pray for kids, salah chart, prayer positions for kids, **namaz steps for kids** | `Salah Steps for Kids: Printable Prayer Chart (Free PDF)` | Salah Steps for Kids (Printable Chart) | 600 | Boy and girl versions with faceless, modestly dressed pose figures (CG); position names in Arabic with transliteration |
| `/printables/five-pillars-of-islam-worksheets/` | 5 pillars of islam worksheet (1–2.5K) | five pillars of islam for kids, 5 pillars coloring page, 5 pillars hand craft | `5 Pillars of Islam Worksheets for Kids (Free PDFs)` | 5 Pillars of Islam Worksheets | 700 | 40 words on each pillar; matching, cut-and-paste, hand-craft template, poster, word search; "suits KS1–KS2 RE" note for teachers |
| `/printables/eid-cards/` | eid card printable (1–3K) | eid mubarak card printable, eid cards to color, eid gift tags printable, eidi envelope printable | `24 Printable Eid Cards to Color (Free Eid Mubarak PDFs)` | Printable Eid Cards to Color | 500 | Quarter-fold cards (Letter and A4), gift tags, Eidi/salami envelopes, bunting; link to `/tools/eid-card-maker/` (name personalization in the browser with pdf-lib) |
| `/printables/islamic-calendar/` | islamic calendar 2027 printable | hijri calendar 2027 for kids | `Islamic Calendar 2027 for Kids – Printable Hijri Calendar` | Islamic (Hijri) Calendar 2027 for Kids | 500 | 12 months to color with Hijri and Gregorian dates and approximate events; the 2026 edition stays linked |

**H11. Color by number, Tier B (format silo; head-like term)**
- URL: `/color-by-number/`.
- Primary: "color by number" (100K+ tier).
- Secondaries: color by number printable, color by number for kids/adults, color by number worksheets, ramadan color by number, color by letter.
- Title: `{N} Color by Number Printables for Kids (Free PDFs)`. H1: `Color by Number Printables`.
- Sections:
  - By level: numbers 1–5 (preschool), 1–10, addition, subtraction, multiplication, Arabic-Indic numerals (٠–٩), and "color by Arabic letter", which no competitor offers.
  - Answer keys.
  - An online color-by-number mode in the canvas.
- Sub-pages: `/color-by-number/ramadan/`, `/eid/`, `/addition/`, `/arabic-numbers/`, `/arabic-letters/`, `/adults/` (geometric).
- Art: 100% CG (region maps).

**H12. Mandala coloring pages, Tier B**
- URL: `/mandala-coloring-pages/`.
- Primary: "mandala coloring pages" (100K+).
- Secondaries: easy mandala for kids, flower mandala, mandala for adults, printable mandala, ramadan mandala, islamic mandala / shamsa.
- Title: `{N} Mandala Coloring Pages (Free Printable PDFs)`. H1: `Mandala Coloring Pages`.
- Copy frames mandalas as "circular pattern art" with no religious framing.
- A "Shamsa (sun rosette) patterns" section bridges to the geometric hub.
- Facets: `/easy/`, `/adults/`.
- Art: 100% CG.

**H13. Bold and easy, Tier B**
- URL: `/bold-and-easy-coloring-pages/`.
- Primary: "bold and easy coloring pages" (estimated 20–50K).
- Secondaries: thick line coloring pages, simple coloring pages for adults, bold easy ramadan.
- Title: `40 Bold and Easy Coloring Pages (Thick Lines, Free PDFs)`.
- Sections: "Why bold lines?" (fine motor skills, markers, seniors); grids by theme.
- Art: CG. The generator has a stroke-width parameter and a cap of 30 regions or fewer.

**H14. Animals of the Quran, Tier B**
- URL: `/animals-of-the-quran-coloring-pages/`.
- Primary: "animals in the quran" (informational with coloring intent; estimated low hundreds to 1K).
- Secondaries: animals mentioned in the quran for kids, quran animals coloring, surah al-fil coloring.
- Title: `Animals in the Quran Coloring Pages ({N} Free PDFs)`. H1: `Animals of the Quran Coloring Pages`.
- Sections: an HTML table (animal | Arabic | surah name and number | ayah | one-line story), reviewed and with no depiction of prophets. This answers "Which animals are mentioned in the Quran?" directly.
- Art: IL from Wave 2. Every page is flagged `animate:true`.

**H15. Foods of the Quran and Sunnah, Tier B**
- URL: `/foods-of-the-quran-coloring-pages/`.
- Primary: "foods mentioned in the quran".
- Secondaries: sunnah foods for kids, dates coloring page, pomegranate coloring page, fig/olive coloring page.
- Title: `Foods of the Quran & Sunnah Coloring Pages (Free PDFs)`.
- Sections: a food table with references; "Iftar foods around the world", bridging to Ramadan.
- Art: simple foods are CG (dates, olives, grapes, pomegranate, honey jar); detailed versions are IL.

**H16. Islamic calligraphy, Tier B**
- URL: `/islamic-calligraphy-coloring-pages/`.
- Primary: "arabic calligraphy coloring pages".
- Secondaries: islamic calligraphy coloring, bismillah coloring page, eid mubarak calligraphy, alhamdulillah coloring.
- Every design carries `requiresReview: true` and shows a "Handling with respect" note.
- Art: CG from OFL fonts.

**H17. 99 Names of Allah, Tier B (review required)**
- URL: `/99-names-of-allah-coloring-pages/`.
- Primary: "99 names of allah coloring" (100–300).
- Secondaries: asmaul husna coloring, 99 names of allah printable.
- **A single URL.** It holds 99 cards, 9 sheet PDFs and a full-book PDF. There are no per-name pages, because those would be thin and the subject is sensitive.
- Title: `99 Names of Allah Coloring Cards – Asmaul Husna (Free PDF)`.

**H18. Ramadan lanterns**
- URL: `/ramadan-lantern-coloring-pages/`. Parent: Ramadan.
- Primary: "ramadan lantern coloring page".
- Secondaries: fanoos coloring page, fanous ramadan, lantern coloring pages.
- Title: `{N} Ramadan Lantern (Fanoos) Coloring Pages – Free PDFs`.
- Art: 100% CG (parametric lanterns).

**H19. No-faces hub**
- URL: `/no-faces-coloring-pages/`.
- Primary: "coloring pages without faces".
- Secondaries: faceless coloring pages, islamic coloring pages no faces.
- Title: `Coloring Pages Without Faces for Muslim Kids (Free PDFs)`.
- Content: explains the policy and the toggle; a curated grid of designs with no animate beings; a link to the guidelines. This is the page for digital PR and AI answers about the differentiator.

**H20. Online coloring**
- URL: `/color-online/`.
- Primary: "online coloring pages".
- Secondaries: color online for kids, coloring games online free, ramadan coloring online.
- Title: `Online Coloring Pages – Color Online Free (No Download)`.
- Grid cards open `/{hub}/{design}/#color`.
- Sections: a tool features list (fill, brush, eraser, eyedropper, undo, palettes, autosave, save PNG); privacy note: no account, nothing is uploaded.

### 2.5 MID tier: general evergreen hubs

All of these use the standard template (§2.3), Tier C.

| URL | Primary (tier or volume) | Key secondaries | Unique section | Bridges | Art / wave |
|---|---|---|---|---|---|
| `/easy-coloring-pages/` | easy coloring pages (T1) | simple coloring pages | "Easy by age" | bold-and-easy, toddler | CG W1 |
| `/toddler-coloring-pages/` | coloring pages for toddlers | toddler coloring sheets | Crayon-grip tips | ramadan/toddler | CG W1 |
| `/preschool-coloring-pages/` | preschool coloring pages | coloring pages for preschoolers | Skills each page builds | ramadan/preschool | CG W1 |
| `/geometric-coloring-pages/` | geometric coloring pages (T3) | tessellation coloring, op art coloring | "Symmetry explained" | islamic-geometric, mandala | CG W1 |
| `/number-coloring-pages/` | number coloring pages (T3) | number 1–20 coloring page, arabic numbers | Number line poster | color-by-number, tracing | CG W1 |
| `/alphabet-coloring-pages/` | alphabet coloring pages (T2) | letter a coloring page… | A–Z chart | tracing, arabic-alphabet | CG W1 |
| `/shape-coloring-pages/` | shapes coloring pages (T3) | 2D shapes worksheet | Shape names table | geometric | CG W1 |
| `/moon-and-stars-coloring-pages/` | moon and stars coloring pages (T3) | crescent moon coloring page | Moon phases chart (hilal) | ramadan, space, islamic-new-year | CG W1 |
| `/space-coloring-pages/` | space coloring pages (T3) | planet, rocket, solar system | Planet facts table | moon-and-stars | CG W1 |
| `/rainbow-coloring-pages/` | rainbow coloring pages (T2) | — | Color-order mnemonic | spring | CG W1 |
| `/fall-coloring-pages/` | fall coloring pages (US; bigger than "autumn") | autumn coloring pages, leaf coloring | Leaf ID chart | tree, nature | CG W1 |
| `/winter-coloring-pages/` | winter coloring pages | snowflake coloring pages (no Christmas imagery) | Snowflake symmetry | ramadan (Ramadan 2027 falls in winter) | CG W1 |
| `/spring-coloring-pages/` | spring coloring pages | flower, butterfly | — | eid (Eid 2027 falls in spring), flowers | CG/IL W2 |
| `/summer-coloring-pages/` | summer coloring pages | beach, sun | — | ocean, islamic-new-year | CG/IL W2 |
| `/flower-coloring-pages/` | flower coloring pages (T2) | rose, sunflower, tulip | Flower parts diagram | spring, mandala | CG→IL |
| `/tree-coloring-pages/` | tree coloring page (T3) | date palm coloring | L-system trees | foods (dates), nature | CG W1 |
| `/nature-coloring-pages/` | nature coloring pages (T3) | landscape | — | tree, flowers | IL W2 |
| `/butterfly-coloring-pages/` | butterfly coloring pages (T2) | — | Butterfly life cycle | spring, flowers | CG→IL |
| `/animal-coloring-pages/` (parent) | animal coloring pages (T1) | — | Sub-hub tiles | animals-of-the-quran | IL W2 |
| `/dinosaur-coloring-pages/` | dinosaur coloring pages (74K, KD 24); top illustrated priority | — | Dinosaur facts | — | IL W2 |
| `/camel-coloring-pages/` | camel coloring page (T3) | — | Camel facts | hajj, eid-al-adha, animals-of-the-quran | IL W2 |
| `/ocean-coloring-pages/` | ocean coloring pages (T2) | whale, fish, shell (spirals CG) | — | animals-of-the-quran/whale | IL W2 |
| Others in Wave 2: cat, dog, horse, bird, owl, elephant, lion, turtle, bee, shark, sheep, cow, farm animals | T2/T3 | — | — | Quran-animal bridges | IL W2–W3 |
| `/vehicle-coloring-pages/` (parent): car, truck, train, airplane | T2/T3 | — | — | — | IL W3 |
| `/fruit-coloring-pages/`, `/food-coloring-pages/` | T3 | — | — | foods-of-the-quran | CG→IL |
| Format silos: `/word-search/`, `/mazes/`, `/dot-to-dot/`, `/tracing-worksheets/` | printable word search; mazes for kids; dot to dot printables; tracing worksheets | `/{format}/{topic}/` | Answer keys | All Islamic hubs | CG W1 (algorithmic) |

Excluded:
- **Kawaii**: food characters with faces conflict with the faces policy.
- **Licensed characters.**
- **Christmas, Halloween and Easter.**
- **Gregorian "New Year" hubs.** The Islamic calendar printable replaces them.

### 2.6 LOW tier: programmatic families

| Family | URL pattern | Count | Unit decision | What makes it non-thin |
|---|---|---|---|---|
| Arabic letters | `/arabic-alphabet/{letter}/` | 28 (Malay locale adds 6 Jawi letters; Urdu adds Urdu-only letters later) | **One URL per letter** that holds all formats (tracing, 4 positional forms, "{letter} is for {word}" coloring, pattern-fill coloring) as anchors. **No per-format URLs per letter.** | Sound; letter family; connecting behavior; forms table; 3 example words (Arabic, transliteration, meaning); stroke order; common mistakes; previous/next navigation. Title `Alif (ا) – Arabic Letter Tracing & Coloring Worksheets`. |
| English letters | `/alphabet-coloring-pages/letter-{a..z}/` | 26 | One URL per letter | Pattern-filled letter, "{x} is for" object (CG simple, IL later), tracing |
| Numbers | `/number-coloring-pages/number-{0..20}/` | 21 | One URL per number, plus Arabic-Indic numeral | Counting objects, ten-frame, tracing |
| Mosques of the World | `/mosque-coloring-pages/{mosque}/` | 30: masjid-al-haram, masjid-an-nabawi, al-aqsa, dome-of-the-rock, blue-mosque, sheikh-zayed-grand-mosque, hassan-ii-mosque, faisal-mosque, badshahi-mosque, istiqlal-mosque, great-mosque-of-djenne, mezquita-cordoba, hagia-sophia, baitul-mukarram, star-mosque-dhaka, sixty-dome-mosque, … | Entity page with 2–4 variants (simple, detailed, color-by-number, bold) | Facts table (city, country, built, features, capacity); 120–200 words; architecture vocabulary; Wikidata `sameAs`. Title `{Mosque} Coloring Page – {City} Mosque Printable`. |
| Animals of the Quran | `/animals-of-the-quran-coloring-pages/{animal}/` | about 15: elephant, ant, bee, camel, whale, spider, cow, hoopoe, horse, dog-of-the-cave, crow, ram, fish, frog, locust | Entity page | Surah reference, reviewed story summary with no depiction of prophets, Arabic word card, bridge to the general animal hub |
| Foods of the Quran/Sunnah | `/foods-of-the-quran-coloring-pages/{food}/` | about 12: dates, pomegranate, fig, olive, honey, grapes, milk, ginger, gourd, barley, lentils, onion | Entity page | Reference, nutrition fun fact, iftar link |
| Islamic objects | Designs in their primary hub | about 10: lantern, crescent and star, prayer mat, tasbih, minaret, dallah, dates bowl, rehal, mihrab, zakat box | Designs | Arabic word card on each |
| Event × age | `/{event}-coloring-pages/{toddler\|preschool\|kindergarten}/` | 5–6 | Whitelisted facets | Age-specific tips, at least 12 designs |
| Event × style | `/{event}-coloring-pages/bold-and-easy/` | 3 | Facet | — |
| Event × format | `/{format}/{ramadan\|eid\|hajj\|eid-al-adha}/` | about 16 | Format × topic page. Word search and mazes have **no item URLs** (3 difficulty versions per page). Color-by-number and dot-to-dot have item URLs. | Answer keys, levels |
| Adult Islamic art | Designs in `/islamic-geometric-coloring-pages/` tagged zellige, girih, iznik, shamsa | — | **No sub-hubs** until Search Console shows at least 100 impressions a month per style | — |
| How to draw | `/how-to-draw/{mosque\|crescent-moon\|lantern\|eid-moon\|kaaba\|camel}/` | 6–12 | Article with 6–10 step images (CG from parametric generators). Targets Bangladesh "drawing" intent. | Steps, a printable practice sheet, link to the coloring version |
| Guides | `/guides/{slug}/` | 20 in year 1 | — | when-is-ramadan-2027, how-to-explain-ramadan-to-kids, ramadan-2027-fasting-hours (data study), eid-al-fitr-traditions-around-the-world, how-to-teach-arabic-alphabet, islamic-months-for-kids, laylat-al-qadr-activities |
| Year-stamped | — | — | **No year URLs**; year only in titles (§1.5) | — |

### 2.7 Locale twins (Phase 2 keyword map)

| Locale | URL | Primary | Notes |
|---|---|---|---|
| id | `/id/mewarnai-ramadhan/` | mewarnai ramadhan / gambar mewarnai ramadhan | Spelled "Ramadhan"; local designs (ketupat, bedug drum) |
| id | `/id/mewarnai-masjid/` | gambar mewarnai masjid | Istiqlal first |
| id | `/id/mewarnai-huruf-hijaiyah/` | mewarnai huruf hijaiyah | Twin of `/arabic-alphabet/` |
| id | `/id/mewarnai-kaligrafi/` | mewarnai kaligrafi | — |
| id | `/id/lomba-mewarnai/` | lomba mewarnai | Contest kit: A4 pages for TK and SD, judging rubric, certificate template (CG). **Indonesia-only; no English twin.** |
| id | `/id/mewarnai-idul-fitri/`, `/id/mewarnai-asmaul-husna/` | mewarnai idul fitri, mewarnai asmaul husna | — |
| ar | `/ar/ramadan-coloring-pages/`, `/ar/ramadan-lantern-coloring-pages/`, `/ar/arabic-alphabet/` | تلوين رمضان، فانوس رمضان للتلوين، تلوين الحروف العربية | English slugs, RTL |
| tr | `/tr/ramazan-boyama-sayfalari/`, `/tr/cami-boyama-sayfalari/`, `/tr/kurban-bayrami-boyama/` | ramazan boyama sayfası, cami boyama, kurban bayramı boyama | — |
| fr | `/fr/coloriage-ramadan/`, `/fr/coloriage-mosquee/`, `/fr/coloriage-aid/` | coloriage ramadan, coloriage mosquée, coloriage aïd | — |
| ms | `/ms/mewarnai-ramadan/`, `/ms/mewarnai-huruf-jawi/` | mewarnai huruf jawi | Jawi has 6 extra letters, which become Malay-only pages |
| bn | English slugs | — | Bangladeshi users search in English. Bangladesh demand is served first by English `/how-to-draw/` pages; the Bengali locale comes later. |
| ur | `/ur/ramadan-coloring-pages/` | — | Roman-Urdu terms are covered in English copy |

---

## 3. Single-design page template

### 3.1 Formulas

- **Title name:** `titleName = name.includes(hub.short) ? name : `${hub.short} ${name}``.
- **Title:** `{titleName} Coloring Page (Free PDF)`. If it fits in 60 characters, use `(Free Printable PDF)` instead.
  - Example: `Ramadan Lantern with Crescent Moon Coloring Page (Free PDF)`
- **H1:** `{titleName} Coloring Page`
- **Meta description:** `Free {titleName} coloring page: {visualSummary}. {Difficulty}, ages {min}–{max}. Download a vector PDF (Letter or A4) or color it online.` (at most 155 characters)
- **Filenames:**
  - `{design-slug}-coloring-page-{w}.webp` and `.avif`
  - `{design-slug}-colored-example-{w}.avif`
  - `{design-slug}-coloring-page-{letter|a4}.pdf`
  - `{design-slug}-pin.jpg`
- **Alt text:** `{titleName} coloring page – {altDetail}, printable line art for kids`, at most 125 characters.
  - `altDetail` is written by a human in the frontmatter.
  - It never describes faces.
  - The colored example's alt is `Colored example of the {titleName} coloring page`.
- **Visible `<figcaption>`:** `{titleName} · {Difficulty} · Ages {min}–{max} · {regions} areas to color`
- **Byline:** `Illustrated by {artist} · Reviewed by {reviewer} · Updated {date}`. If the art is AI-assisted, the byline adds "AI-assisted, redrawn and checked by {artist}".

### 3.2 Unique copy (80–200 words), built from structured data

Each design is an entry in the `designs` content collection. Zod schema in `src/content.config.ts`:

```ts
// required unless marked optional
{
  title, slug, primaryHub, hubs: string[], tags: string[],
  description: string,          // human-written, 25–60 words, unique (build-checked)
  altDetail: string,            // ≤ 70 chars
  difficulty: 'easy'|'medium'|'detailed'|'expert',
  ages: [number, number],
  regions: number,              // auto-computed from SVG closed paths
  minutes: number,              // auto from regions
  animate: boolean, people: boolean,   // people ⇒ faceless enforced in QA
  arabicWord?: { ar: string; translit: string; meaning: string },
  funFact?: { text: string; sourceUrl: string },   // ≤ 40 words, source mandatory
  palette: { name: string; hex: string }[],        // 4–6 swatches
  tips: string[],                                  // 1–3, specific to this art
  prompt?: string,             // a "for parents & teachers" question
  variants?: string[],         // ids of easy/detailed/CBN/bold versions
  artSource: 'code'|'illustrated'|'ai-assisted', artist: string,
  requiresReview: boolean, reviewedBy?: string, reviewedAt?: Date,
  publishedAt: Date, updatedAt?: Date, translationKey: string, redirectFrom?: string[]
}
```

Example of the rendered copy (about 150 words):

> *A tall fanoos lantern glows beside a thin crescent moon and five stars. The big panels make this an easy first Ramadan page for preschoolers, and the star border gives older kids something extra to decorate.*
> **Easy · 24 areas · Ages 3–6 · about 10 minutes · Vector PDF, Letter & A4**
> **Arabic word:** فانوس *fanoos*, "lantern".
> **Fun fact:** [one sourced sentence, at most 40 words, with a "Source" link]
> **Palette:** Lantern Gold, Night Sky, Moon Cream, Glass Teal, Rose Clay (clickable swatches that load into the canvas).
> **Tip:** Color the glass panels teal, then dot them with a white gel pen for sparkle. Leave the moon cream so it glows against a dark sky.
> **For parents & teachers:** "What does a lantern help us do at night? How can we bring 'light' to someone this Ramadan?"

Layout order on the page:
1. Breadcrumbs, then H1.
2. The preview image (the LCP element).
3. Action buttons: [PDF Letter] [PDF A4] [Color online] [Print].
4. Fact chips, description, learn box, palette and tips, prompt.
5. "Other versions" (variants), "More like this" (8), bundle CTA.
6. "All {N} {hub} coloring pages" link, then bridges.

### 3.3 What keeps a design page from being thin

Each page has:
- Unique art (checked by perceptual hash).
- A human-written description.
- At least 3 populated structured facts.
- One learning element (Arabic word, fun fact or prompt).
- A palette tailored to the art.
- Two real downloads (vector PDFs).
- An interactive canvas.
- Links to its variants.

Boilerplate blocks (print instructions, licence line) are wrapped in `data-boilerplate` and must stay under 40% of the main text.

### 3.4 Safeguards against scaled content abuse

These gates are enforced by `scripts/seo/content-gates.ts`, which runs before `astro build`. A failure stops the build unless noted otherwise.

1. **Art uniqueness.** A 64-bit dHash is computed on a 256-pixel render. Its Hamming distance must be at least 10 against every other design in the same hub, and at least 6 site-wide. An SVG geometry hash catches exact duplicates.
2. **Parametric variants are not pages.** A generator with only a different seed or size never creates a new URL. Variants are grouped on one page unless the **named subject** differs. "8-point star tile" and "10-point star tile" are different subjects; "seed 41" and "seed 42" are not.
3. **Text uniqueness.**
   - `description` must be at least 25 words.
   - Word-trigram Jaccard similarity against every sibling in the hub must be below 0.5.
   - Main content must be at least 80 unique words for designs and at least 300 for hubs. For hubs a failure is a warning, and the page is set to noindex.
4. **Sourcing.** `funFact.sourceUrl` is required. A Quran reference must give surah and ayah.
5. **Review gate.** `requiresReview && !reviewedBy` removes the page from the build. This applies to calligraphy, 99 Names, wudu and salah, Hajj steps, and Quran-animal stories.
6. **Release velocity.**
   - At most 400 indexable URLs at launch.
   - After that, at most 200 new indexable URLs a week until the indexed ratio is at least 80%.
   - If "Crawled – currently not indexed" passes 30% for a cluster, pause that cluster and improve it.
7. **AI text policy.** AI may draft copy. A human edits it, and the editor's name is recorded in `editedBy`. Nothing is published without that field.
8. **Pruning, every 6 months.** A page with 0 clicks and fewer than 10 impressions after 180 days is improved, merged (301 to its best sibling) or set to noindex.

---

## 4. Structured data

### 4.1 What still matters to Google (October 2026)

| Type | Google feature today | Our use |
|---|---|---|
| ImageObject with `license`, `acquireLicensePage`, `creditText`, `creator`, `copyrightNotice` | **Active**: the Licensable badge and credit in Google Images | Every design, hub hero and pin image. **Main investment.** |
| BreadcrumbList | Active on desktop. Mobile stopped showing breadcrumbs in January 2025. | All pages except home |
| WebSite (site name), Organization (logo, knowledge panel) | Active | Home only (the Organization `@id` is referenced everywhere) |
| WebSite SearchAction | Sitelinks search box **removed (Nov 2024)** | Emitted (harmless; other engines can use it) |
| FAQPage | Rich result **retired for all sites on 2026-05-07**; tooling removed June–August 2026 | Emit only where a visible FAQ exists. Costs nothing; Bing and AI systems parse it. No rich result expected. |
| HowTo | Rich result **deprecated in 2023** | **Do not emit.** Use ordered lists with step images. |
| Practice Problems, Learning Video | Deprecated in January 2026 | Do not use |
| LearningResource | No rich result; read for meaning | Worksheets and printables |
| CollectionPage + ItemList | No carousel for this content type; read for meaning | Hubs |
| VisualArtwork / MediaObject (PDF) | Read for meaning | Designs |
| Article, ProfilePage + Person | Article: active (bylines, Discover). ProfilePage: active. | Guides; team pages |
| Mosque (`schema.org/Mosque`) linked to Wikipedia and Wikidata through `sameAs` | Entity linking | Mosque entity pages |

### 4.2 Graph per template

Every page emits one `@graph` in its `<head>`.

| Template | Nodes |
|---|---|
| Home | Organization, WebSite (+SearchAction), WebPage |
| Hub, facet, format × topic | CollectionPage (`mainEntity` ItemList, `about` Thing with `sameAs`, `reviewedBy`/`lastReviewed` on Islamic hubs), BreadcrumbList, ImageObject (hero), FAQPage (if a FAQ is shown) |
| Design | ItemPage, VisualArtwork (`encoding` MediaObject PDFs), ImageObject (licence fields), BreadcrumbList |
| Mosque, Quran animal, Quran food | Design graph plus `about` (Mosque, or Thing with `sameAs`) |
| Arabic letter page | ItemPage, LearningResource, ImageObject, BreadcrumbList |
| Printable hub and item | WebPage (`reviewedBy`), LearningResource (`encoding` PDFs), ImageObject, BreadcrumbList, FAQPage (optional) |
| Bundle | WebPage, DigitalDocument (`hasPart` → designs, `encoding` → ZIP/PDF) |
| Tool | WebApplication (`isAccessibleForFree`, `applicationCategory`: "EducationalApplication"), BreadcrumbList |
| Guide, how-to-draw | Article (`author` Person, `publisher` Organization), WebPage (`reviewedBy`), ImageObject(s), BreadcrumbList |
| Team member | ProfilePage, `mainEntity` Person |

### 4.3 JSON-LD examples

**Home**
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"https://kidscolorit.com/#org","name":"KidsColorIt","url":"https://kidscolorit.com/",
  "logo":{"@type":"ImageObject","url":"https://kidscolorit.com/brand/logo-512.png","width":512,"height":512},
  "parentOrganization":{"@type":"Organization","name":"Color Experts International","url":"<parent-company-url>"},
  "sameAs":["https://www.pinterest.com/kidscolorit/","https://www.instagram.com/kidscolorit/","https://www.youtube.com/@kidscolorit"],
  "contactPoint":{"@type":"ContactPoint","contactType":"customer support","url":"https://kidscolorit.com/contact/"}},
 {"@type":"WebSite","@id":"https://kidscolorit.com/#website","url":"https://kidscolorit.com/","name":"KidsColorIt",
  "alternateName":["Kids Color It","kidscolorit.com"],"inLanguage":"en","publisher":{"@id":"https://kidscolorit.com/#org"},
  "potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://kidscolorit.com/search/?q={search_term_string}"},"query-input":"required name=search_term_string"}}
]}
```

**Hub (Ramadan)**
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"CollectionPage","@id":"https://kidscolorit.com/ramadan-coloring-pages/#webpage",
  "url":"https://kidscolorit.com/ramadan-coloring-pages/","name":"48 Ramadan Coloring Pages 2027 (Free Printable PDFs)",
  "description":"48 free Ramadan coloring pages for kids: lanterns, crescent moons, mosques & iftar treats.",
  "inLanguage":"en","isPartOf":{"@id":"https://kidscolorit.com/#website"},
  "about":{"@type":"Thing","name":"Ramadan","sameAs":["https://en.wikipedia.org/wiki/Ramadan","https://www.wikidata.org/wiki/<QID>"]},
  "audience":{"@type":"PeopleAudience","suggestedMinAge":3,"suggestedMaxAge":12},
  "breadcrumb":{"@id":"https://kidscolorit.com/ramadan-coloring-pages/#breadcrumb"},
  "primaryImageOfPage":{"@id":"https://kidscolorit.com/ramadan-coloring-pages/#primaryimage"},
  "reviewedBy":{"@id":"https://kidscolorit.com/team/<reviewer-slug>/#person"},"lastReviewed":"2026-11-18",
  "datePublished":"2026-11-20","dateModified":"2027-01-11",
  "mainEntity":{"@type":"ItemList","numberOfItems":48,"itemListElement":[
    {"@type":"ListItem","position":1,"url":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/","name":"Lantern with Crescent Moon"}]}},
 {"@type":"BreadcrumbList","@id":"https://kidscolorit.com/ramadan-coloring-pages/#breadcrumb","itemListElement":[
   {"@type":"ListItem","position":1,"name":"Home","item":"https://kidscolorit.com/"},
   {"@type":"ListItem","position":2,"name":"Islamic Coloring Pages","item":"https://kidscolorit.com/islamic-coloring-pages/"},
   {"@type":"ListItem","position":3,"name":"Ramadan Coloring Pages"}]}
]}
```

**Design page**
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"ItemPage","@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#webpage",
  "url":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/",
  "name":"Ramadan Lantern with Crescent Moon Coloring Page (Free PDF)","inLanguage":"en",
  "isPartOf":{"@id":"https://kidscolorit.com/#website"},
  "breadcrumb":{"@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#breadcrumb"},
  "primaryImageOfPage":{"@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#image"},
  "mainEntity":{"@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#artwork"},
  "datePublished":"2026-11-20","dateModified":"2026-11-20"},
 {"@type":"VisualArtwork","@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#artwork",
  "name":"Ramadan Lantern with Crescent Moon","artform":"Coloring page","artMedium":"Digital line art",
  "artworkSurface":"Paper (US Letter or A4)","creator":{"@id":"https://kidscolorit.com/team/<artist-slug>/#person"},
  "image":{"@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#image"},
  "typicalAgeRange":"3-6","educationalLevel":"Beginner","keywords":"Ramadan, lantern, fanoos, crescent moon",
  "isAccessibleForFree":true,"license":"https://kidscolorit.com/about/license/",
  "encoding":[
   {"@type":"MediaObject","name":"US Letter PDF","encodingFormat":"application/pdf","contentSize":"84 KB",
    "contentUrl":"https://kidscolorit.com/files/pdf/ramadan-coloring-pages/lantern-with-crescent-moon-coloring-page-letter.pdf"},
   {"@type":"MediaObject","name":"A4 PDF","encodingFormat":"application/pdf","contentSize":"83 KB",
    "contentUrl":"https://kidscolorit.com/files/pdf/ramadan-coloring-pages/lantern-with-crescent-moon-coloring-page-a4.pdf"}]},
 {"@type":"ImageObject","@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#image",
  "contentUrl":"https://kidscolorit.com/files/img/ramadan-coloring-pages/lantern-with-crescent-moon-coloring-page-1200.webp",
  "width":1200,"height":1553,"encodingFormat":"image/webp",
  "caption":"Ramadan lantern with crescent moon coloring page",
  "creator":{"@id":"https://kidscolorit.com/#org"},"creditText":"KidsColorIt",
  "copyrightNotice":"© 2026 KidsColorIt. Free for personal and classroom use.",
  "license":"https://kidscolorit.com/about/license/",
  "acquireLicensePage":"https://kidscolorit.com/about/license/#commercial-use"},
 {"@type":"BreadcrumbList","@id":"https://kidscolorit.com/ramadan-coloring-pages/lantern-with-crescent-moon/#breadcrumb","itemListElement":[
   {"@type":"ListItem","position":1,"name":"Home","item":"https://kidscolorit.com/"},
   {"@type":"ListItem","position":2,"name":"Islamic Coloring Pages","item":"https://kidscolorit.com/islamic-coloring-pages/"},
   {"@type":"ListItem","position":3,"name":"Ramadan Coloring Pages","item":"https://kidscolorit.com/ramadan-coloring-pages/"},
   {"@type":"ListItem","position":4,"name":"Lantern with Crescent Moon"}]}
]}
```

**Worksheet (LearningResource node)**
```json
{"@type":"LearningResource","@id":"https://kidscolorit.com/printables/ramadan-calendar-for-kids/#resource",
 "name":"Printable Ramadan Calendar for Kids (30 Days)","inLanguage":"en",
 "learningResourceType":["Worksheet","Calendar","Activity"],
 "educationalLevel":["Preschool","Kindergarten","Grade 1","Grade 2"],"typicalAgeRange":"4-10",
 "educationalUse":["Practice","Family activity"],"interactivityType":"active","timeRequired":"PT10M",
 "teaches":["Days of Ramadan","Daily good deeds","Counting to 30"],
 "audience":{"@type":"EducationalAudience","educationalRole":["parent","teacher"]},
 "author":{"@id":"https://kidscolorit.com/#org"},"isAccessibleForFree":true,
 "license":"https://kidscolorit.com/about/license/",
 "encoding":[{"@type":"MediaObject","encodingFormat":"application/pdf","contentUrl":"https://kidscolorit.com/files/pdf/printables/ramadan-calendar-for-kids-color-in-letter.pdf"}]}
```

**Mosque `about` node**
```json
"about":{"@type":"Mosque","name":"Sultan Ahmed Mosque (Blue Mosque)",
 "address":{"@type":"PostalAddress","addressLocality":"Istanbul","addressCountry":"TR"},
 "sameAs":["https://en.wikipedia.org/wiki/Blue_Mosque,_Istanbul","https://www.wikidata.org/wiki/<QID>"]}
```

**Team member (ProfilePage)**
```json
{"@type":"ProfilePage","mainEntity":{"@type":"Person","@id":"https://kidscolorit.com/team/<slug>/#person",
 "name":"<Real name>","jobTitle":"Islamic Content Reviewer","worksFor":{"@id":"https://kidscolorit.com/#org"},
 "knowsAbout":["Islamic studies","Children's religious education"],
 "hasCredential":{"@type":"EducationalOccupationalCredential","credentialCategory":"degree","name":"<e.g. MA Islamic Studies>"},
 "sameAs":["<LinkedIn or institutional profile>"]}}
```

**FAQPage**
```json
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"When is Ramadan 2027?",
 "acceptedAnswer":{"@type":"Answer","text":"Ramadan 2027 is expected to begin on about 8 February 2027 (±1 day depending on moon sighting) and end with Eid al-Fitr on about 9–10 March 2027."}}]}
```

### 4.4 How it is built and checked

- Builders in `src/lib/seo/jsonld.ts`: `orgNode`, `websiteNode`, `breadcrumbNode`, `collectionNode`, `designNodes`, `learningResourceNode`, `faqNode`, `personNode`, `articleNode`. They are typed with `schema-dts`.
- One component emits the graph: `<JsonLd graph={...}/>` in `src/layouts/BaseLayout.astro`.
- `tests/seo/jsonld.spec.ts` (Playwright) checks that every template's JSON parses, contains its required types, uses absolute URLs, and has `@id`s that resolve.
- Rich Results Test is run by hand on each template before launch and after any template change.
- Images also carry embedded XMP/IPTC metadata (Web Statement of Rights, Licensor URL, Creator, Copyright Notice). sharp writes it into WebP and JPEG output. CI runs `exiftool` on a sample, because AVIF metadata may be dropped; schema.org markup is the primary signal.

---

## 5. Technical SEO

### 5.1 Hosting and edge

- **Cloudflare Workers Static Assets on the paid plan.** Limits: 100,000 files per version on the paid plan (20,000 on free), 25 MiB per file, and Wrangler 4.34.0 or later is required for the higher cap.
- **Worker routes:** `run_worker_first: ["/files/pdf/*"]`. The Worker strips `-coloring-page-(letter|a4)\.pdf$` from the path, builds the canonical, adds `Link: <https://kidscolorit.com/{hub}/{design}/>; rel="canonical"`, and returns the asset through `env.ASSETS`.
- PDFs do **not** get noindex; Google advises against mixing noindex with canonical.
- **When files approach about 80,000,** move `/files/` to R2 behind the same Worker on the same origin. Never move images to a subdomain.
- **`_headers`** (at most 100 rules):
  - `/files/svg/*` → `X-Robots-Tag: noindex`
  - `/pagefind/*` → `X-Robots-Tag: noindex`
  - `/files/*` → `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`
  - HTML → `Cache-Control: public, max-age=0, must-revalidate`
- **`_redirects`**: generated from frontmatter `redirectFrom`, up to 2,000 static rules. Beyond that, the Worker uses a JSON map.
- **Trailing-slash redirects:** `html_handling: "auto-trailing-slash"`. Check which status code it returns (307 vs 308). Either is acceptable, because internal links and canonicals always carry the slash.
- **Daily rebuild:** a GitHub Actions cron (`30 0 * * *`) runs build → `wrangler deploy` → IndexNow diff. It flips season windows and the banner.

### 5.2 Canonical rules

1. Every indexable page has a self-referencing, absolute, `https`, apex, trailing-slash canonical.
2. A design listed in several hubs has one URL, its primary hub. Other hubs link to it.
3. Query-parameter variants (filters, `utm_*`, `?q=`) point their canonical at the clean URL. The pages are static, so no server logic is needed.
4. Paginated pages are self-canonical.
5. Locale twins are self-canonical. **Never use a canonical across locales**; hreflang links them instead.
6. PDFs carry a canonical HTTP header pointing to the design page. Images carry no canonical.
7. Non-production hosts: noindex.

### 5.3 hreflang

- `<link rel="alternate" hreflang="{xx}" href>` goes in the `<head>`, for the page itself and every **published** twin, built from `translationKey`. Add `hreflang="x-default"` pointing at the English URL.
- Codes are language-only: `en`, `ar`, `id`, `bn`, `tr`, `ms`, `fr`, `ur`. No region variants.
- `tests/seo/hreflang.spec.ts` checks the tags are reciprocal and that every target returns 200 and is self-canonical.
- Each locale page also gets `og:locale` and `og:locale:alternate`.

### 5.4 XML sitemaps

These are custom endpoints in `src/pages/sitemaps/[name].xml.ts` and `src/pages/sitemap-index.xml.ts`.

- **Index:** `/sitemap-index.xml` lists:
  - `pages.xml` (home, about, policies, team, tools, bundles)
  - `hubs-{locale}.xml` (hubs, facets, format × topic)
  - `designs-{locale}-{n}.xml` (at most 10,000 URLs each)
  - `printables-{locale}.xml`, `guides-{locale}.xml`
- **Image extension:** only `<image:loc>` is used; caption, title and licence tags were deprecated in 2022. Design URLs list the preview, the colored example and the pin image. Hub URLs list their first 20 card images.
- **`<lastmod>`** comes from `updatedAt`, or else `publishedAt`. It is never the build time.
- **Exclusions:** noindex pages, redirects, non-canonical URLs, `/search/`.
- Sitemaps are submitted in Google Search Console and Bing Webmaster Tools, and referenced in robots.txt.

### 5.5 robots.txt

```
User-agent: *
Disallow: /api/
Allow: /

# Training-only crawlers: allowed to read HTML text (brand/entity learning), kept out of art sources and PDFs
User-agent: GPTBot
User-agent: CCBot
User-agent: Bytespider
User-agent: meta-externalagent
User-agent: Applebot-Extended
User-agent: ClaudeBot
Disallow: /files/
Disallow: /api/

Sitemap: https://kidscolorit.com/sitemap-index.xml
```

- Search and answer crawlers stay fully allowed (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Google-Extended, Bingbot, Googlebot-Image).
- **Turn off Cloudflare's managed "Block AI bots" robots.txt setting** so it cannot override this file.
- `/search/` is not disallowed, so crawlers can see its noindex.

### 5.6 IndexNow, RSS, llms.txt

- **IndexNow:**
  - The key file lives at `/{key}.txt`.
  - `scripts/indexnow.mjs` runs after deploy. It fetches the live sitemaps, diffs them against the new build, and POSTs changed or new URLs (up to 10,000 per call) to `api.indexnow.org`. That covers Bing, Yandex, Seznam and Naver.
  - Cloudflare Crawler Hints is turned on as a backup.
  - Google does not use IndexNow. Google gets sitemaps and GSC inspection for priority URLs only, and **we do not use the Indexing API**, which is limited to job postings and livestreams.
- **RSS** (`@astrojs/rss`):
  - `/rss.xml` carries new designs and guides.
  - Per-hub feeds (`/{hub}/rss.xml`) exist for Ramadan, Eid, Eid al-Adha, mosques, Arabic alphabet, geometric and mandala.
  - Each item has a `media:content` 2:3 pin image. These feeds drive Pinterest RSS auto-publishing.
- **`/llms.txt`:** a 60–100 line Markdown summary of the brand, audience, key hubs, the licence and the Islamic content policy. Google says the file neither helps nor hurts, and adoption evidence is weak, so it gets 30 minutes of effort and no more.

### 5.7 Open Graph, Twitter and Pinterest meta

- **Every page:**
  - `og:title`, `og:description`, `og:url` (the canonical), `og:site_name`, `og:locale`
  - `og:image`: 1200×630 JPEG under 300 KB, the size WhatsApp needs for previews
  - `og:image:alt`
  - `twitter:card=summary_large_image`
- **Pinterest Article Rich Pins:**
  - `og:type=article`, `article:published_time`, `article:modified_time`, `article:author` on designs, hubs and guides.
  - No Product pins, because the items are free.
  - Claim the domain in Pinterest Business.
- **Save button:** the visible preview `<img>` has `data-pin-media="/files/pin/…-pin.jpg"` (1000×1500) and `data-pin-description="{pin description}"`. There are no hidden pin images. Decorative images get `nopin`.

### 5.8 Core Web Vitals budgets and the asset pipeline

| Metric (mobile, p75) | Budget |
|---|---|
| LCP | **under 1.8 s** (TTFB under 200 ms from the edge) |
| CLS | **under 0.05** |
| INP | **under 150 ms** |
| JS before interaction | Hubs 15 KB or less gzipped (filter, toggle, menu as vanilla scripts, **not React**). Designs 20 KB or less. |
| Canvas island | React 19 at 120 KB or less gzipped, `client:only` loaded by dynamic `import()` on the first "Color online" click |
| Search | Pagefind UI loads when the search input is focused |
| CSS | 25 KB or less gzipped (Tailwind 4, inlined when under 4 KB) |
| HTML | Hubs 50 KB or less gzipped |
| Fonts | At most 2 files on first load. One subset variable Latin UI font, under 40 KB, preloaded, with `size-adjust` fallback metrics. The Arabic font (Noto Naskh or Amiri subset) loads by `unicode-range` and `:lang(ar)` only. |
| LCP image | 60 KB or less |

- **LCP handling:**
  - Design pages: the preview `<img>` gets `fetchpriority="high"`, `loading="eager"` and `decoding="async"`, plus `<link rel="preload" as="image" imagesrcset>`.
  - Hubs: the first 2 card images (one mobile row) are eager with `fetchpriority="high"` on the first. All others use `loading="lazy"`.
  - Every image has `width` and `height`.
- **Image formats:**
  - Line-art previews are **lossless WebP**, plus AVIF where the AVIF file is at least 20% smaller.
  - Colored examples are AVIF with a WebP fallback, served through `<picture>`.
  - SVG is the master file. It is served only to the canvas, with noindex.
- **Pipeline** (`scripts/assets/build-assets.ts`, content-hash cached so only changed designs re-render; generated files live in the CI cache or R2, not Git):
  1. SVGO normalizes the SVG.
  2. sharp renders 400, 800 and 1200 pixel WebP/AVIF previews.
  3. The colored example is rendered from palette fills.
  4. A 1000×1500 pin composite and a 1200×630 OG JPEG are produced.
  5. Playwright Chromium `page.pdf({format:'Letter'|'A4'})` prints the vector PDF from a print template with a footer ("kidscolorit.com · Free for personal & classroom use").
  6. pdf-lib sets PDF metadata (Title, Author, Subject, Keywords, Creator, Language) and merges bundles.
  7. A `manifest.json` records dimensions and byte sizes for the HTML attributes and `contentSize`.
- **Enforcement:** Lighthouse CI (`lighthouserc.json` with budgets) runs on 12 template URLs per pull request. Real-user monitoring comes from Cloudflare Web Analytics.

### 5.9 Status codes and errors

- **404:** a custom page with noindex, Pagefind search, the top hubs, and "Request this page", prefilled with the path.
- **410:** designs withdrawn deliberately (for example, failed review) return 410 through the Worker gone-list `src/data/gone.json`. Never redirect removed items to the home page; Google treats that as a soft 404.
- **301:** only for renames and merges to a real equivalent.
- **Seasonal hubs never return 404 or 410.**

---

## 6. Internal linking system

| Mechanism | Component | Rule |
|---|---|---|
| Hub → spoke | `<HubGrid>` | Every design in the hub is a plain `<a>` card |
| Spoke → hub | `<Breadcrumbs>`, `<BackToHub>` | Breadcrumb plus an "All {N} {topic} coloring pages" button |
| Siblings | `<MoreLikeThis count={8}>` | Same primary hub. Ranked by shared tags, then nearest difficulty, then a seeded shuffle. The output is deterministic, so links do not change between builds. |
| Variants | `<OtherVersions>` | Easy, detailed, color-by-number and bold versions of the same subject |
| Bridges | `<BridgeLinks>` | A typed graph in `src/data/bridges.ts` (below) |
| Related hubs | `<RelatedHubs count={6}>` | Set by hand in hub frontmatter |
| Silo navigation | `<MegaMenu>` | 6 columns of plain HTML links: Islamic & Events · Seasons · Animals & Nature · Learning (letters, numbers, shapes, worksheets) · Patterns & Art · Color Online |
| Seasonal | `<ComingUpBanner>` | See below |
| HTML sitemap | `/sitemap/`, `/sitemap/{silo}/` | All hubs by silo; all designs per silo, at most 600 links per page |
| Footer | `<Footer>` | Silo parents, policies, locale switcher. No keyword link farms. |

**Bridge graph (launch):**
- camel ↔ hajj, eid-al-adha, animals-of-the-quran/camel
- sheep, goat, cow ↔ eid-al-adha
- dates and date palm ↔ ramadan (iftar), foods/dates, tree
- lantern ↔ ramadan
- crescent ↔ ramadan, islamic-new-year, moon-and-stars, space (moon phases)
- bee and honey ↔ animals-of-the-quran/bee (an-Nahl), foods/honey, spring, flowers
- whale and fish ↔ ocean, animals-of-the-quran/whale
- spider ↔ animals-of-the-quran/spider, guide on the Hijrah
- elephant ↔ animals-of-the-quran/elephant (al-Fil)
- mosque ↔ calligraphy, geometric, how-to-draw/mosque
- geometric ↔ mandala ↔ color-by-number/adults ↔ shapes
- Arabic letters ↔ Arabic numbers ↔ calligraphy ↔ color-by-number/arabic-letters
- winter ↔ Ramadan 2027
- spring ↔ Eid 2027
- summer ↔ Islamic New Year
- 5 pillars ↔ salah, ramadan (sawm), hajj, zakat box design

**Coming-up banner:**
- Data comes from `src/data/calendar/events.ts`: id, name, hub, Gregorian estimate, `approx: true`, `bannerFromDays: 60`.
- The banner is rendered at build time with the server's date, as crawlable HTML, inside a **fixed-height 40px slot that is always present**. When no event is near, it shows an evergreen promo, so there is zero CLS.
- It shows one event: the nearest within 60 days, with Ramadan taking priority.
- Copy: "Ramadan 2027 starts in about 37 days (≈ 8 Feb, depending on moon sighting) → Ramadan coloring pages & calendar".
- **Mawlid is excluded** unless the content board approves it.

**CI linking checks** (`scripts/seo/link-graph.ts`, run over `dist/`):
- Every sitemap URL has at least 2 inbound links from indexable pages (designs at least 5).
- Every page is reachable within 3 clicks of the home page.
- No internal link points to a 3xx or 404.
- Every internal href ends in a slash.

---

## 7. E-E-A-T and trust

1. **Team pages** (`/team/{slug}/`, ProfilePage + Person) for:
   - The editor-in-chief.
   - Lead illustrators (Color Experts International designers, named).
   - An **Islamic content reviewer**: a real, named person with stated credentials (for example ʿĀlimiyyah or ijāzah, or a degree in Islamic studies).
   - An **early-years education advisor**: a qualified teacher.
   - An **Arabic language reviewer**: a native-speaker teacher.
   - **Never invent people or credentials.** Until a reviewer has signed, pages show "Reviewed by the KidsColorIt editorial team".
   - Avatars may be illustrated rather than photos, which fits the brand's imagery policy.
2. **Bylines and review lines** on hubs, printables and Islamic designs: "Reviewed by {name}, {credential} · {date}". Schema uses `reviewedBy` and `lastReviewed` on the WebPage.
3. **Trust pages:**
   - `/about/`: the story of a design team in Dhaka making faith-friendly pages. This is also a digital-PR angle.
   - `/about/how-we-make-coloring-pages/`: code-generated geometry, illustration, vectorization, human QA, and **AI-use disclosure**.
   - `/about/editorial-policy/`: sourcing, corrections, update cadence.
   - `/about/islamic-content-guidelines/`: the public version of `docs/ISLAMIC-IMAGERY.md`. No depiction of prophets, angels or Allah; faceless people in modest dress; how Quranic text is handled; the animal filter; how disagreements are resolved.
   - `/about/license/`: free for personal, home, classroom, mosque, weekend-school and homeschool use; no resale; `#commercial-use` is the `acquireLicensePage` target.
4. **Corrections:** a "Suggest a correction" link on every Islamic page goes to `/contact/?topic=correction&url=…`. Corrections are logged publicly on the editorial-policy page.
5. **Forms:**
   - `/request-a-page/` uses Cloudflare Turnstile and posts to `/api/request` (a Worker writing to D1 and sending email).
   - The page shows a public "Most requested" list, which is both social proof and a content backlog.
   - `/contact/` uses the same pattern.
6. **Testimonials** (from month 3): only real, permissioned teacher and parent quotes with name, role and school. **No Review markup**, because self-serving reviews are not eligible.
7. **Audience and privacy:**
   - The site is framed as being for parents and teachers. Kids use it, but adults download.
   - No accounts, cookieless analytics.
   - Newsletter sign-up requires an "I'm 18+ (parent/teacher)" checkbox (COPPA and the UK Children's Code).

---

## 8. Off-page and distribution

**Pinterest (the main channel outside Google, and the largest one for Indonesia):**
- Business account, domain claimed, Rich Pins active through OG article tags.
- **English boards:**
  - Ramadan Coloring Pages for Kids
  - Ramadan Activities & Printables
  - Eid Coloring Pages, Cards & Crafts
  - Eid al-Adha & Hajj for Kids
  - Arabic Alphabet Worksheets & Tracing
  - Islamic Worksheets (Wudu, Salah, 5 Pillars)
  - Mosques of the World Coloring
  - Islamic Geometric Patterns Coloring (Teens & Adults)
  - Mandala & Pattern Coloring
  - Color by Number Printables
  - Bold and Easy Coloring Pages
  - Islamic Homeschool Printables
  - Muslim Classroom & Weekend School
  - Four season boards
- **A separate Indonesian profile** with boards: Mewarnai Ramadhan, Mewarnai Masjid, Mewarnai Huruf Hijaiyah, Mewarnai Kaligrafi, Lomba Mewarnai TK & SD, Asmaul Husna.
- **Pin formats.** Idea Pins were merged into standard Pins in 2023, so all of these are standard Pins:
  1. 1000×1500 single-design pin: colored sample, line art and a title band ("Free Ramadan Lantern Coloring Page · PDF").
  2. Collage pin: "30 Ramadan Coloring Pages (Free PDF)".
  3. Printed-mockup pin (a code composite on a desk photo from the design team).
  4. **9:16 video pins, 7–15 seconds**: canvas time-lapses recorded automatically with Playwright.
  5. Multi-image pins for sequences (the 5 wudu steps).
- **Pin text:** title up to 100 characters with the keyword first; description up to 500 characters in natural language; alt text; no hashtag stuffing.
- **Cadence:**
  - Seed **8–10 weeks** before an event.
  - Run 10–20 fresh pins a day from **6 weeks to 1 week** before.
  - Off season, 5 a day.
  - Per-hub RSS feeds auto-publish to their boards as a baseline. Hand-made pins sit on top.
  - Use Pinterest Trends to time "ramadan" content.

**Outreach (link building):**
- Build a target sheet of 300 contacts:
  - Weekend Islamic schools and madrasahs (UK, US, Canada, Australia)
  - Islamic school associations (for example AMS UK and the Islamic Schools League of America)
  - Islamic homeschool co-ops and Facebook groups
  - Mosque youth coordinators
  - Muslim parenting blogs and Instagram creators
  - Muslim children's book authors
  - **Public libraries' and US school districts' "Ramadan resources" pages**, which link to free printables
- **Offer:**
  - The free Ramadan pack.
  - The **co-branding tool**: a school or mosque adds its name or logo to the calendar or cards (CG PDF). The PDF footer credits the source, and we ask for a link back.
- **Waves:** 2026-12-01 (schools plan in December and January), 2027-01-11, 2027-03-15 (Eid al-Adha/Hajj), 2027-11-01 (Ramadan 2028).

**Link magnet:** `/bundles/ramadan-activity-pack/`, "Ramadan 2027 Activity Pack":
- Contents: a 30-day calendar, 30 coloring pages, a good-deeds tracker, a word search, a maze, 4 Eid cards.
- One PDF and a ZIP, **no email gate**. An optional "send me next week's pack" form sits below.
- A bundle refresh each year keeps the URL.

**Digital PR angles:**
1. **"Ramadan 2027 fasting hours in 100 cities"**: a code-computed sunrise and sunset data study (`/guides/ramadan-2027-fasting-hours/`) for news and Muslim media in January and February.
2. "Made in Dhaka: a faceless coloring site for Muslim kids", aimed at Bangladeshi press (The Daily Star, Dhaka Tribune) and Muslim lifestyle media.
3. "The first coloring site with a no-faces / no-animate-beings filter".
4. "AI can't write Arabic, so we typeset ours". AI image tools garble Arabic script, which is a tech-press angle.
5. "Islamic geometry in the maths classroom" for STEM and RE teachers (TES and teacher newsletters).
6. Mosques of the World poster series, for architecture and education blogs.

**Newsletter (Kit):**
- Double opt-in, adults only.
- Sequences:
  - A "Ramadan countdown" of 8 weekly emails from mid-December.
  - A daily "Ramadan Day N" email with the day's page, opt-in.
  - The weekly "New pages" digest.
- **WhatsApp Channel** with the weekly pack. WhatsApp is strong in Indonesia, Bangladesh, Pakistan and the Gulf.
- Instagram and Threads Reels reuse the Pinterest time-lapse videos.

---

## 9. AI search (GEO) and the defence against AI-generated images

**Getting cited:**
1. **Answer first.** Every hub and printable opens its "About" section with a definitional sentence plus the current fact, for example: "Ramadan is the ninth month of the Islamic calendar… In 2027 it is expected to begin on about 8 February."
2. **Tables that are easy to cite:**
   - Arabic letter forms
   - Animals in the Quran (surah and ayah)
   - Foods of the Quran
   - Mosque facts
   - Hijri months
   - Ramadan 2027 dates
3. **Original data:** the fasting-hours study; "Ramadan 2027 dates by country" with methodology and a ±1-day caveat. Data with a named method is what gets cited.
4. **Entity clarity:** consistent Organization and Person `@id`s; `about` and `sameAs` links to Wikipedia and Wikidata; `sameAs` to the social profiles. Create a Wikidata item for KidsColorIt once there is independent press coverage.
5. **Visible FAQs** with their FAQPage markup kept, reviewer quotes ("Ustadha X explains…"), and accurate `dateModified`.
6. **Crawlers and indexes:**
   - Answer crawlers are allowed (§5.5).
   - Bing Webmaster Tools and IndexNow are in place, because Bing's index feeds Copilot and parts of ChatGPT search.
   - `llms.txt` exists but is low priority.
7. **Tracking:** AI referrers (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com) are segmented in analytics. A monthly panel of 20 prompts is run across AI Overviews, ChatGPT, Perplexity and Gemini (§11).

**Defence against AI-generated images in search results** (Google started generating images in AI Overviews and switched Google Images to a feed layout in July 2026). We put our weight on products a generated image cannot replace:
- **Bundles and series:** the 28-letter workbook, the 30-mosque passport, the 30-day calendar.
- **Worksheets with pedagogy:** tracing with stroke-order arrows, positional forms, answer keys, color-by-number with math facts.
- **Personalized documents:** a child's name or a school's logo on calendars and cards (`/tools/*`).
- **Correctness AI cannot guarantee:** Arabic letters typeset from fonts; real mosque architecture; faith-compliant imagery (no faces) with named review; correct Hijri dates.
- **Interactive tools:** the canvas, color-by-number online, the calendar maker, the Eid card maker.
- **Print-ready vector PDFs** in Letter and A4.
- **Later:** "Turn your Eid/masjid photo into a coloring page", a tool that targets the "photo to coloring page" and "coloring page generator" demand.

---

## 10. Seasonal publishing calendar (October 2026 – December 2027)

All dates are publish-by dates. Islamic dates are astronomical estimates, ±1 day for moon sighting:
- Ramadan 1448 begins about 8 February 2027.
- Eid al-Fitr is about 9–10 March 2027.
- 1 Dhul Hijjah is about 7 May 2027, and Eid al-Adha about 16 May 2027.
- 1 Muharram 1449 is about 5–6 June 2027.
- Mawlid is about 14 August 2027.
- Ramadan 1449 begins about 28 January 2028.

| Publish by | Ships | Why |
|---|---|---|
| **2026-10-16** | Production domain live. GSC domain property and Bing verified. robots.txt, sitemap index, IndexNow key. Home, About, policies, licence, team (real people only). | Crawl history starts |
| **2026-10-23** | Wave 1 code-generated content: Islamic geometric (40), geometric (20), mandala (40), Arabic alphabet (3 hubs and 28 letters), numbers (0–20 plus Arabic-Indic), alphabet A–Z, shapes, color-by-number (20), word search and mazes (general), **fall (24)** | Fall demand peaks October–November. Ramadan season window opens 2026-10-19. |
| 2026-11-06 | Mosques series v1 (12 mosques with CG silhouettes and fact tables). Islamic coloring parent hub. Lanterns. Moon and stars. Calligraphy (reviewed). Bold-and-easy. Easy. Toddler and preschool hubs. **Winter** (snowflakes). No-faces hub. `/color-online/`. | Winter demand is December–February. Seasonal demand rises November–March. |
| 2026-11-13 | `/printables/islamic-calendar/` (2027 edition). 99 Names (after sign-off). Space. Rainbow. | Calendar demand in December and January |
| **2026-11-20** | **Ramadan 2027 core:** `/ramadan-coloring-pages/` (at least 40 designs), `/ramadan-activities-for-kids/`, `/printables/ramadan-calendar-for-kids/`, `/printables/ramadan-good-deeds-tracker/`, `/color-by-number/ramadan/`, `/word-search/ramadan/`, `/mazes/ramadan/`, `/ramadan-lantern-coloring-pages/` | 11.5 weeks before Ramadan. Indexed by mid-December, ahead of Google's "planning starts 8 weeks before" window. |
| 2026-12-01 | `/bundles/ramadan-activity-pack/`. `/tools/ramadan-calendar-maker/`. Guides: when-is-ramadan-2027, how-to-explain-ramadan-to-kids, **fasting-hours data study**. Outreach wave 1. Newsletter "Ramadan countdown" sign-up. | Schools plan in December and January |
| 2026-12-08 | `/eid-coloring-pages/`. `/printables/eid-cards/` (tags, Eidi envelopes). `/tools/eid-card-maker/`. Ramadan facets (toddler, preschool, bold-and-easy). Five pillars, wudu and salah printables (after review). | The Eid peak (last 10 days of Ramadan, about 27 Feb – 9 Mar) is 11 weeks away |
| 2026-12-14 | **Pinterest Ramadan seeding** (5 a day, rising to 15 a day by 2027-01-04). **Indonesian pilot:** `/id/` mewarnai-ramadhan, mewarnai-masjid, mewarnai-huruf-hijaiyah, mewarnai-kaligrafi, lomba-mewarnai. | 8 weeks before Ramadan. Indonesia is the largest locale opportunity. |
| 2027-01-04 | Wave 2 illustrated content: animals of the Quran (12), foods of the Quran and Sunnah (10), detailed mosque versions. **Arabic pilot** `/ar/` (Ramadan, fanoos, Arabic alphabet). | Dates and iftar bridges ahead of Ramadan |
| 2027-01-11 | Ramadan expanded to 80+ designs. Laylat al-Qadr and last-10-nights activities. Ramadan dot-to-dot. Outreach wave 2. | Freshness. "New for 2027" strip. |
| 2027-02-01 | Spring hub. Eid word search and color-by-number. **Content freeze for templates** (copy and data updates only). | Ramadan begins about 8 February |
| 2027-02-08 → 03-10 | Ramadan live operations: daily "Day N" pin and email, monitoring. No structural changes. | Peak |
| **2027-03-12** | `/eid-al-adha-coloring-pages/`. `/hajj-coloring-pages/` (Kaaba, Arafat, tents, route map). Eid al-Adha card variants. Dhul Hijjah tracker. Sheep, goat and cow (illustrated). Outreach wave 3. | 8 weeks before 1 Dhul Hijjah (about 7 May) |
| 2027-03-17 | Ramadan season window closes: titles automatically drop "2027". | Window rule (§1.5) |
| 2027-04-09 | `/islamic-new-year-coloring-pages/`. `/printables/islamic-months-for-kids/`. **Turkish and French pilots** (Ramadan, mosque, Kurban/Aïd). | 8 weeks before 1 Muharram (about 5–6 June) |
| 2027-04-16 | Pinterest ramp for Eid al-Adha and Hajj, peaking in the first 10 days of Dhul Hijjah (about 7–16 May) | — |
| 2027-05-01 | Summer hub. Ocean and whale bridges. Bee/an-Nahl pins for World Bee Day (20 May). | — |
| 2027-06-01 | Mosques series v2 (all 30). How-to-draw set (mosque, crescent, lantern, Eid moon, Kaaba, camel) aimed at Bangladesh and Pakistan drawing searches. | — |
| 2027-06-19 | *(Optional, board decision)* Mawlid/Seerah section. Kept out of the banner and out of site-wide promotion. | 8 weeks before about 14 August |
| July 2027 | Low season, build month: Ramadan 2028 assets (+30), Malay/Jawi and Urdu translations, Bengali landing pages, the "photo to coloring page" tool prototype. Prune and improve pages under the 180-day rule. | Coloring demand is lowest in July |
| 2027-07-12 | Weekend-school starter pack. Back-to-school printables. | August–September |
| 2027-08-30 | Fall 2027 refresh. | — |
| **2027-10-08** | Ramadan 2028 season window opens: titles show "2028". +30 designs. Bundle v2. | 16 weeks before about 28 January 2028 |
| 2027-10-15 | `/printables/islamic-calendar/` 2028 edition. Winter refresh. | — |
| 2027-11-01 | Ramadan 2028 outreach wave. Eid hub refresh (Eid al-Fitr 2028 is about 26–27 February), live by 2027-11-26. | — |
| 2027-12-01 | Pinterest Ramadan 2028 seeding. **Malay `/ms/` and Urdu `/ur/` pilots** live. | 8 weeks before Ramadan 2028 |

---

## 11. Measurement

**Tools:**
- **Google Search Console:**
  - A domain property, plus URL-prefix properties per locale folder (`/id/`, `/ar/`…).
  - **Bulk data export to BigQuery**, because the UI caps out at 1,000 rows and long-tail coverage needs the full data.
  - Regex segments:
    - hubs `^/[^/]+-coloring-pages/$`
    - designs `^/[^/]+-coloring-pages/[^/]+/$`
    - printables `^/printables/`
    - letters `^/arabic-alphabet/`
    - formats `^/(color-by-number|word-search|mazes|dot-to-dot|tracing-worksheets)/`
  - A Looker Studio dashboard sits on BigQuery.
- **Bing Webmaster Tools:** sitemaps imported, IndexNow, and its AI/Copilot citation reports where available.
- **Analytics:** Plausible (cookieless) for events, and Cloudflare Web Analytics for real-user Core Web Vitals. **No GA4 at launch.**
- **Events to track:**
  - `pdf_download{design,size}`
  - `color_online_open`, `color_online_save`
  - `bundle_download`
  - `print_click`
  - `filter_apply{facet}`
  - `noanimate_toggle{state}`
  - `tool_generate{tool}`
  - `newsletter_signup`, `request_submit`
  - `pin_save`
  - `search_query{q}`. Pagefind queries show content gaps; no personal data is recorded.
- **Rank tracking:** Ahrefs Rank Tracker if the plan includes it, otherwise SE Ranking. Run weekly in US, UK, CA, AU, ID, MY, PK, BD, AE, SA, TR and FR.
- **Pinterest Analytics.**
- A monthly **AI panel** of 20 prompts, for example:
  - "free ramadan coloring pages for kids"
  - "printable ramadan calendar for kids"
  - "arabic letter tracing worksheets free"
  - "islamic coloring pages without faces"
  - "wudu steps for kids printable"

  Track it with Ahrefs Brand Radar where available.

**Rank-tracking list (53 keywords):**
- **Islamic (English):** ramadan coloring pages, ramadan coloring pages 2027, ramadan activities for kids, ramadan calendar printable for kids, ramadan calendar for kids, ramadan good deeds tracker, ramzan coloring pages, eid coloring pages, eid mubarak coloring pages, eid al adha coloring pages, eid card printable, islamic coloring pages, muslim coloring pages, mosque coloring page, masjid coloring page, arabic alphabet worksheets, arabic letter tracing, arabic alphabet coloring pages, 5 pillars of islam worksheet, wudu steps for kids, salah steps printable, islamic geometric pattern coloring, ramadan lantern coloring page, kaaba coloring page, hajj coloring pages, 99 names of allah coloring, islamic coloring book pdf, animals in the quran for kids, islamic activity sheets, bismillah coloring page
- **General:** color by number printable, mandala coloring pages, bold and easy coloring pages, dinosaur coloring pages, geometric coloring pages, moon and stars coloring pages, number coloring pages, alphabet coloring pages, fall coloring pages, winter coloring pages, space coloring pages, butterfly coloring pages
- **Locales:** mewarnai ramadhan, gambar mewarnai masjid, mewarnai huruf hijaiyah, mewarnai kaligrafi, lomba mewarnai, تلوين رمضان, فانوس رمضان للتلوين, ramazan boyama sayfası, coloriage ramadan, eid drawing easy, mosque drawing

**KPIs** (floor / target):

| KPI | 3 months (mid-Jan 2027) | 6 months (mid-Apr 2027) | 12 months (mid-Oct 2027) |
|---|---|---|---|
| Indexable URLs live (English) | 700 | 1,500 | 3,000 |
| Indexed ÷ submitted | ≥75% | ≥85% | ≥90% |
| GSC impressions in the month | 300K / 600K | 3M / 6M (February peak) | 1.5M / 3M |
| Organic clicks in the month | 8K / 20K (January) | 80K / 200K (February peak) | 40K / 80K |
| "ramadan coloring pages" (US) | top 30 | top 20 / top 10 at peak | top 10 (UK, CA, AU top 5) |
| Tracked keywords in the top 10 | 8 / 15 | 20 / 30 | 30 / 45 |
| Referring domains | 25 / 40 | 80 / 120 | 200 / 300 |
| Pinterest monthly impressions | 500K / 1M | 3M / 6M (February) | 2M / 4M |
| Pinterest outbound clicks per month | 5K / 10K | 40K / 80K (February) | 20K / 40K |
| Newsletter subscribers | 1K / 2K | 6K / 10K | 12K / 20K |
| AI citations (out of 20 prompts) | 1 / 3 | 4 / 6 | 8 / 12 |
| Mobile URLs with good Core Web Vitals | 100% | 100% | 100% |
| Locales live | en + id pilot | en, id, ar | en, id, ar, tr, fr (ms and ur by Dec 2027) |

**Review cadence:**
- Weekly: indexing and coverage, plus new-page performance.
- Monthly: keyword map changes (new facets or online hubs that cross their thresholds), cannibalization report, AI panel.
- After each season: a retrospective that feeds the next year's design brief.

---

## 12. Where this lives in the repo

**Docs:** `docs/SEO.md` (this plan) and `docs/keyword-map.csv`, which is regenerated from frontmatter by `scripts/seo/export-keyword-map.ts`.

**Library code (`src/lib/seo/`):**
- `meta.ts`: title, H1 and meta formulas, season-window year logic, 60-character fallback
- `jsonld.ts`: the graph builders
- `hreflang.ts`
- `canonical.ts`
- `alt.ts`

**Data (`src/data/`):**
- `calendar/events.ts`: event dates, season windows, banner rules
- `facets.ts`: the facet whitelist
- `bridges.ts`
- `transliteration.ts`
- `gone.json`

**Components:** `BaseLayout.astro`, `SeoHead.astro`, `JsonLd.astro`, `Breadcrumbs.astro`, `Byline.astro`, `HubGrid.astro`, `DesignCard.astro`, `FilterBar.astro` (vanilla script), `NoAnimateToggle.astro`, `MoreLikeThis.astro`, `OtherVersions.astro`, `BridgeLinks.astro`, `RelatedHubs.astro`, `ComingUpBanner.astro`, `BundleCTA.astro`, `AdSlot.astro` (renders null when the flag is off), `MegaMenu.astro`, `ColoringCanvas.tsx` (a React island loaded on click).

**Endpoints:** `src/pages/sitemap-index.xml.ts`, `src/pages/sitemaps/[name].xml.ts`, `src/pages/rss.xml.ts`, `src/pages/[hub]/rss.xml.ts`, `public/robots.txt`, `public/llms.txt`, `public/_headers`, `_redirects` (generated).

**Worker:** `worker/index.ts` (PDF canonical headers, uppercase-to-lowercase 301, the 410 gone-list, `/api/request` and `/api/contact` with Turnstile). `wrangler.jsonc` sets `run_worker_first: ["/files/pdf/*","/api/*"]`.

**Scripts:**
- `scripts/seo/content-gates.ts`: dHash, trigram Jaccard, word counts, review gate, reserved slugs
- `scripts/seo/cannibalization.ts`
- `scripts/seo/link-graph.ts`
- `scripts/seo/seo-lint.ts`: one H1, title 30–60 characters, meta 70–160, canonical, `width` and `height` on images, `fetchpriority` on the LCP image, no noindex on indexable templates, sitemap ⊆ indexable pages
- `scripts/assets/build-assets.ts`
- `scripts/indexnow.mjs`

**Tests:** `tests/seo/{jsonld,hreflang,meta,robots}.spec.ts` (Playwright 1.64); `lighthouserc.json` with the budgets from §5.8.

**Claude Code skills (`.claude/skills/`):**
- `add-design/`: frontmatter checklist, gates, asset build
- `add-hub/`: the §2.3 template, keyword ownership check
- `seasonal-refresh/`: flip the season window, "New for {year}", bundle, Pinterest batch
- `seo-audit/`: run the lint, link-graph and cannibalization scripts plus a GSC export review
- `translate-hub/`: translationKey, localized slug, hreflang check
- `pinterest-batch/`: generate pin, video and RSS items for a hub

---

### Sources (checked October 2026)
- FAQ rich results retired 2026-05-07: [TechWyse](https://www.techwyse.com/news/ai-search/google-faq-rich-results-deprecated-2026), [jsonld.com](https://jsonld.com/google-faq-rich-results-deprecated/), [SEOcrawl](https://seocrawl.ai/blog/faq-structured-data-google-2026)
- Practice Problems and other structured data removals (January 2026): [Search Engine Land](https://searchengineland.com/google-to-remove-more-search-features-including-practice-problems-nutrition-facts-nearby-offers-and-more-464255)
- Image licence metadata: [Google Search Central: Image metadata](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata?hl=hi)
- Scaled content abuse and the August 2026 spam update: [GSQi case studies](https://gsqi.com/marketing-blog/august-2026-google-spam-update-case-studies/), [PPC Land](https://ppc.land/scaled-content-abuse/)
- llms.txt evidence and Google's position: [PPC Land](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/), [Pixelmojo](https://www.pixelmojo.io/blogs/google-says-you-dont-need-llms-txt)
- Cloudflare static asset limits: [Cloudflare changelog 2025-09-02](https://developers.cloudflare.com/changelog/2025-09-02-increased-static-asset-limits/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/index.md)
- Astro 7 (Rust compiler, Vite 8): [Astro blog, June 2026](https://astro.build/blog/whats-new-june-2026/), [Astro i18n routing docs](https://docs.astro.build/en/guides/internationalization/)
- 2027 Islamic dates: [Khaleej Times](https://www.khaleejtimes.com/uae/ramadan-eid-al-fitr-eid-al-adha-2027-likely-dates), [The National](https://www.thenationalnews.com/news/uae/2026/09/09/ramadan-2027-dates-eid-al-fitr-holiday/), [ProPakistani](https://propakistani.pk/2026/08/22/uae-reveals-expected-dates-for-ramadan-and-eids-in-2027/)
- Pinterest Rich Pins and the pin format merge: [Pinterest developers: Rich Pins](https://developers.pinterest.com/docs/rich-pins/overview/), [TechCrunch (Idea Pins merged, 2023)](https://techcrunch.com/2023/05/11/pinterest-is-combining-pins-and-idea-pins-into-a-single-format/)