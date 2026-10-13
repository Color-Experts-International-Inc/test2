<!-- Specialist draft (Design system, brand & UI/UX). Superseded by docs/PLAN.md where they disagree. -->

# Brand, design system and UI/UX plan for kidscolorit.com

**Scope:** brand, design tokens, components, page templates, coloring app UX, and outlines for `/docs/DESIGN.md` and `/docs/UI-UX.md`. This is a plan only; no files were written.

**How this was checked:**
- Every text and UI color pair below was run through the WCAG 2.x relative-luminance formula (Python, read-only). The ratios in the tables are the computed results.
- The fluid type and spacing `clamp()` values were computed from a 360px → 1280px viewport range.
- The Astro Fonts API is stable since Astro 6 (stable `<Font />` component, automatic fallbacks and preloads). I could not find a primary source that confirms Astro 7 changed it, so this plan assumes it still works the same way in Astro 7.

---

## 0. Design thesis and decisions at a glance

**Thesis:** "A sunlit courtyard for little artists."
- The palette is warm sand plus Iznik-tile color.
- Geometry is the decorative language: 8-fold stars, pointed arches, merlon crenellations.
- Subjects default to places, patterns, objects and nature.
- One system serves three moods:
  - **Play:** kid mode, ages 3–10.
  - **Trust:** the default for parents and teachers.
  - **Calm:** grown-up geometric art.

| Decision | Choice |
|---|---|
| Wordmark | lowercase **`kidscolorit`**, two-tone, with a crescent as the dot of the final "i". The name in prose and titles is **KidsColorIt**. |
| Logo mark | **"Najma, the Crayon Star"**: an 8-point star of eight crayon tips around a night-sky octagon holding a gold crescent. |
| Brand character | Najma (نجمة, "star"). It never has a face and expresses emotion only through motion and color. |
| Tagline | **"Little hands, beautiful traditions."** SEO descriptor: "Free printable coloring pages & activities for Muslim families." |
| Primary color | Iznik Teal `#0B7D76` (white text 4.99:1) |
| Fonts | Baloo 2 (display) + Nunito (body) for Latin; Baloo Bhaijaan 2 + Noto Naskh Arabic for Arabic; Baloo Da 2 + Noto Sans Bengali for Bengali (phase 2). All OFL, self-hosted through the Astro Fonts API. |
| Dark mode | "Ramadan Night". Uses CSS `light-dark()` tokens, follows the system with no JS, and can be overridden with `data-theme`. Line-art paper is always white. |
| Card shape | Pointed-arch (mihrab) thumbnail made with an SVG `mask-image`, plus an arch outline using `vector-effect: non-scaling-stroke` |
| UI illustration style | "Half-colored" (ink outline, about 40% of regions filled with flat brand color offset 1–2px, like a child mid-coloring). The UI shows no people or animals at all. |
| JS on content pages | No framework. About 4 KB br of vanilla modules: filters, paper size, banner, preferences, toast. React only in `/color-online/*` and `/search/`. |
| Family filter | A 3-way setting: **Show all / No faces / Objects & places only**. Filtering is client-side CSS over `data-imagery` attributes. |
| Kid mode | Opt-in. Hides external links, ads, text-heavy blocks and forms. Leaving it requires a parent gate (type a number written in words). |
| Ads | `flags.ads=false` at launch. `<AdSlot>` renders nothing while off and renders fixed `min-height` boxes when on. Never in kid mode, the app, print output or PDFs. |

---

## 1. Brand

### 1.1 Name and lockup
- **The name in running text and `<title>` suffixes is "KidsColorIt"** (CamelCase, so the domain is readable).
- **The wordmark is lowercase `kidscolorit`.**
  - Set in Baloo 2 ExtraBold (800), tracking −0.01em, converted to outlined SVG paths (no font dependency, about 2.5 KB).
  - Colors: `kids` ink-900 `#1B2440`, `color` teal-600 `#0B7D76`, `it` ink-900.
  - The first "i" keeps a round ink dot.
  - The **dot of the final "i" is a saffron-400 `#FDB528` crescent**. It is the same geometry as the crescent in the mark, scaled to 1.3× the "i" stem width and opening to the upper right.
- **Lockups:**
  - Horizontal: the mark sits at the left. Mark height = 1.6 × wordmark cap height. Gap = 0.25 × mark height.
  - Stacked: mark centered above the wordmark.
  - Mark only: favicon, app icon, Pinterest avatar.
- **Reversed version** (on night or teal backgrounds): `kids`/`it` sand-50 `#FFFBF4`, `color` teal-300 `#5CC6BC`, crescent saffron-300 `#FFC84A`.
- **Clear space:** one crayon-tip length (about 24% of mark height) on every side.
- **Minimum sizes:** horizontal lockup 112px wide; mark 16px (simplified favicon cut).
- **RTL:** the lockup is never mirrored. In phase 2 an Arabic tagline sits under the wordmark in Baloo Bhaijaan 2: «لوّن وتعلّم واحتفل».
- **Don'ts:**
  - Don't rotate the star off-axis. One point always faces straight up.
  - Don't recolor the tips outside the brand scales.
  - Never give Najma eyes or a mouth.
  - Don't place the logo on busy art.
  - Don't add drop shadows or gradients.

### 1.2 Logo mark: "Najma, the Crayon Star" (exact geometry)
- `viewBox="0 0 64 64"`, center (32,32).
- **The center is a night-sky octagon:** vertex radius 16, flat edges facing the 8 directions, fill ink-900.
- **8 crayon tips:** each is an isosceles triangle on an octagon edge with its apex at radius 30, which gives an 8-point star silhouette. Each tip is split at 28% of its height into:
  - a darker **collar** (the crayon's paper band), and
  - a lighter **cone** (the wax tip).
- **Opposite tips share a color** for symmetry. Clockwise from the top:

  | Tips | Color | Cone | Collar |
  |---|---|---|---|
  | Top and bottom | Teal | `#12958C` | `#0A6660` |
  | Upper-right and lower-left | Saffron | `#FDB528` | `#D17F05` |
  | Right and left | Pomegranate | `#DE3A45` | `#9F1F27` |
  | Lower-right and upper-left | Cobalt | `#3A5FD9` | `#233A9B` |

- **Crescent:** saffron-300 `#FFC84A`. Outer circle r 8.5 at (32,32), minus an inner circle r 7 at (35.4,29.6). It opens to the upper right.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="KidsColorIt">
  <defs>
    <polygon id="c" points="25.88,17.22 27.59,12.96 36.41,12.96 38.12,17.22"/>
    <polygon id="t" points="27.59,12.96 32,2 36.41,12.96"/>
  </defs>
  <polygon fill="#1B2440" points="38.12,17.22 46.78,25.88 46.78,38.12 38.12,46.78 25.88,46.78 17.22,38.12 17.22,25.88 25.88,17.22"/>
  <g fill="#0A6660"><use href="#c"/><use href="#c" transform="rotate(180 32 32)"/></g>
  <g fill="#12958C"><use href="#t"/><use href="#t" transform="rotate(180 32 32)"/></g>
  <g fill="#D17F05"><use href="#c" transform="rotate(45 32 32)"/><use href="#c" transform="rotate(225 32 32)"/></g>
  <g fill="#FDB528"><use href="#t" transform="rotate(45 32 32)"/><use href="#t" transform="rotate(225 32 32)"/></g>
  <g fill="#9F1F27"><use href="#c" transform="rotate(90 32 32)"/><use href="#c" transform="rotate(270 32 32)"/></g>
  <g fill="#DE3A45"><use href="#t" transform="rotate(90 32 32)"/><use href="#t" transform="rotate(270 32 32)"/></g>
  <g fill="#233A9B"><use href="#c" transform="rotate(135 32 32)"/><use href="#c" transform="rotate(315 32 32)"/></g>
  <g fill="#3A5FD9"><use href="#t" transform="rotate(135 32 32)"/><use href="#t" transform="rotate(315 32 32)"/></g>
  <path fill="#FFC84A" d="M31.97 23.5A8.5 8.5 0 1 0 40 34.88A7 7 0 1 1 31.97 23.5Z"/>
</svg>
```

- **Favicon cut** (`public/favicon.svg`, 16–32px): drop the collars (single-color tips), keep the octagon and crescent.
- **Other icon files:**
  - `apple-touch-icon.png` 180px: the mark on sand-50 with 12% padding.
  - `icon-512-maskable.png`: the mark at 60% safe zone, for the future PWA.
- **Seasonal variants** are swapped at build time by date window:
  - **Ramadan:** a thin saffron crescent ring arcs around the star's left side, with 2 small 4-point sparkles.
  - **Eid:** 6 confetti dots in the brand colors orbit the star.
  - All other times: the standard mark.

### 1.3 Personality
**"Khala (auntie) energy":** the warm, organized aunt who is also a gifted artist and a primary-school teacher.

| We are | We are not |
|---|---|
| Warm, welcoming, gently Islamic | Preachy, fear-based, sectarian |
| Crafted, studio-made, premium | Clip-art, cluttered, "free-stuff" spammy |
| Playful for kids | Hyper, loud, manipulative |
| Clear and competent for parents and teachers | Vague, salesy |
| Calm and elegant for grown-ups | Childish in adult sections |

### 1.4 Voice and tone

**Rules:**
- Address people as "you". Use contractions.
- Parent and teacher sentences: 20 words or fewer. Kid sentences: 8 words or fewer.
- Praise effort, not outcome.
- On first use on a page, an Islamic phrase gets a plain-English gloss via `<abbr title>` or an inline aside.
- Never shame, threaten, or claim one ruling as universal. Use "many families…" phrasing for differences of practice.

| Context | Parent / teacher-facing | Kid-facing (kid mode) |
|---|---|---|
| Download button | "Download PDF · A4" | "Print it!" |
| Color online | "Color online — free, no signup" | "Color it here!" |
| Completion | "Saved on this device. Print it or save the image." | "MashaAllah! You did it!" |
| Undo | "Undo" | "Oops! Go back" |
| Loading | "Getting your pages ready…" | "Crayons ready… bismillah!" |
| Empty search | "No pages for "unicorn" yet. Tell us and our designers may draw it." | "Najma can't find that. Try "moon"!" |
| Filter empty | "No pages match these filters. Remove "Expert" to see 12 more." | n/a (kid mode has no filters) |
| Ramadan countdown | "Ramadan starts in about 42 days — get the free 30-day calendar pack." | "42 sleeps until Ramadan!" |
| During Ramadan | "Ramadan Mubarak! Day 12 — today's page is ready." | "Ramadan Mubarak! Day 12!" |
| Eid | "Eid Mubarak! Cards, gift tags and pages for the big day." | "Eid Mubarak! Let's make a card!" |
| Error | "That download didn't start. Try again, or use the Letter version." | "Uh-oh! Let's try again." |
| Newsletter | "One email a month, a little more before Ramadan. Unsubscribe anytime." | hidden |
| Parent gate | "Grown-ups: type this number in digits — seven hundred forty-two." | "Ask a grown-up to help." |

**Greeting calendar.** Event dates come from `src/content/events/*.yaml` and are always worded "about", because moon sighting can shift them ±1 day.
- "Ramadan Mubarak" / "Ramadan Kareem": 1 Ramadan through the last day of Ramadan.
- "Eid is coming": the last 10 nights of Ramadan.
- "Eid Mubarak": Eid day plus 2 days for al-Fitr; Eid day through 13 Dhul Hijjah for al-Adha.
- "Welcome 1449 AH": Islamic New Year (~Jun 5–6 2027), neutral wording.
- Mawlid: descriptive only, with no greeting banner.
- Not used: "Jumu'ah Mubarak" site-wide (practice differs) and "Happy Ramadan" in our own voice.

**Spelling standards:**
- Ramadan (Ramazan only on `/tr/`; "Ramzan" only as a keyword variant), Eid al-Fitr, Eid al-Adha, Dhul Hijjah, Quran (never "Koran"), masjid/mosque.
- The Prophet Muhammad ﷺ: the U+FDFA glyph must be in the font subset. In running English, "(peace be upon him)" is also acceptable.
- Transliteration is simplified ALA-LC without diacritics in the UI (e.g. "baṭṭa" appears only on learning cards).

### 1.5 Tagline set
- **Primary:** "Little hands, beautiful traditions."
- **Descriptor (SEO, home lede):** "Free printable coloring pages & activities for Muslim families."
- **Kid:** "Grab your crayons — bismillah!"
- **Seasonal:** "Your Ramadan, colored in." · "Eid joy, ready to print." · "Ten blessed days, ten beautiful pages."

---

## 2. Color

### 2.1 Brand scales
Each cell becomes `--color-{scale}-{step}` in `@theme`.

| Scale | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **teal** (Iznik turquoise, primary) | #E8F8F6 | #C8EFEA | #94DDD5 | #5CC6BC | #2FAFA5 | #12958C | **#0B7D76** | #0A6660 | #0B504C | #0A3F3C | #052725 |
| **cobalt** (secondary, links, focus) | #EEF3FF | #DCE6FE | #B9CCFC | #8AA8F7 | #5B80EE | #3A5FD9 | **#2A47BE** | #233A9B | #1F327C | #1C2C63 | #121B3D |
| **saffron** (accent, gold) | #FFF8E6 | #FFEDC0 | #FFDC85 | #FFC84A | **#FDB528** | #F29D0B | #D17F05 | #A65E08 | #874A0E | #6F3D10 | #401F05 |
| **pomegranate** (danger, festive) | #FFF0F0 | #FFDCDC | #FFBDBD | #FB8F92 | #F05E66 | #DE3A45 | **#C0262F** | #9F1F27 | #841E25 | #6E1D23 | #4A1A1F |
| **palm** (date-palm green, success) | #ECF8F0 | #D2EFDC | #A6DEBB | #6FC593 | #40A86D | #268C54 | **#1C7243** | #195B37 | #17482E | #133B27 | #0A2215 |
| **sand** (warm neutral surfaces) | **#FFFBF4** | #FBF3E4 | #F3E6CE | #E6D2AF | #CDB38A | #A98F66 | #84704F | #66563E | #4A3F2F | #2F2820 | #1C1712 |
| **ink** (cool text neutral) | #F5F7FA | #E9EDF3 | #D3DAE5 | #B0BCCD | #8394AD | #5E6F8A | #46566F | #35425A | #253049 | **#1B2440** | #0F1529 |
| **night** (dark-mode neutrals) | #F4F1EA | — | #B8C1D3 | #95A1B8 | — | #66779A | — | #33405F | #283456 | #18203A (850: #1F2947) | #0F1529 |

teal-400 `#2FAFA5` reaches only 2.69:1 on white, so it is **decorative only and never used for text or meaningful UI edges**.

### 2.2 Semantic tokens
Components use **only** these tokens. The `dark:` variant is banned in components.

| Token | Light | Dark ("Ramadan Night") | Verified contrast |
|---|---|---|---|
| `page` | sand-50 #FFFBF4 | night-950 #0F1529 | — |
| `surface` | #FFFFFF | night-900 #18203A | — |
| `surface-2` (alt bands) | sand-100 #FBF3E4 | night-850 #1F2947 | — |
| `surface-3` (hover, chip fill) | sand-200 #F3E6CE | night-800 #283456 | — |
| `fg` | ink-900 #1B2440 | night-50 #F4F1EA | L 14.83 on page · D 16.05 on page / 14.25 on surface |
| `fg-muted` | ink-600 #46566F | night-200 #B8C1D3 | L 7.22 page, 6.75 surface-2 · D 10.01 page, 7.91 surface-2 |
| `fg-subtle` (meta, captions) | ink-500 #5E6F8A | night-300 #95A1B8 | L 4.95 page, 4.63 surface-2 · D 6.18 surface, 5.50 surface-2 |
| `line` (decorative borders) | sand-300 #E6D2AF | night-700 #33405F | decorative (exempt) |
| `line-strong` (inputs, chips, 1.4.11) | ink-500 #5E6F8A | night-500 #66779A | L 5.10 on white · D 3.57 surface, 4.03 page |
| `primary` / `on-primary` | teal-600 / #FFFFFF | teal-300 / night-950 | L 4.99 · D 8.85 |
| `primary-hover` | teal-700 #0A6660 | teal-200 #94DDD5 | L white 6.81 · D 11.70 |
| `primary-text` (teal labels) | teal-700 | teal-300 | L 6.60 page · D 8.85 |
| `primary-soft` / `on-primary-soft` | teal-50 / teal-800 | teal-900 / teal-100 | L 8.47 · D ≈10 |
| `link` | cobalt-600 #2A47BE | cobalt-300 #8AA8F7 | L 7.42 page · D 7.78 page, 6.91 surface |
| `accent` / `on-accent` | saffron-400 / ink-900 | saffron-300 / night-950 | L 8.61 · D 11.74 |
| `focus` (ring) | cobalt-600 | saffron-300 | L 7.42 vs page · D 10.42 vs surface |
| `success` / soft / on-soft | palm-600 / palm-50 / palm-700 | palm-300 / palm-900 / palm-100 | L white-on 5.94, text 5.75, soft 7.42 · D 8.70 |
| `warning` / soft / on-soft | saffron-700 text / saffron-50 / saffron-800 | saffron-300 / saffron-950 / saffron-100 | L 4.82, soft 6.57 · D 10.03 |
| `danger` / soft / on-soft | pom-600 / pom-50 / pom-700 | pom-300 / pom-950 / pom-100 | L white-on 5.90, text 5.72, soft 7.03 · D 8.15, soft 11.33 |
| `info` / soft / on-soft | cobalt-600 / cobalt-50 / cobalt-800 | cobalt-300 / cobalt-900 / cobalt-100 | L 10.47 · D 10.56 |
| `paper` | #FFFFFF | #FFFFFF (never inverts) | — |
| `lineart` | #000000 | #000000 | — |
| `toast` bg / fg | ink-900 / #FFFFFF | night-50 / night-950 | 15.30 |

### 2.3 Tailwind 4 implementation: `src/styles/global.css`

```css
@import "tailwindcss";

@theme {
  --color-*: initial;            /* brand tokens only — no stray Tailwind palette */
  --font-*: initial;
  --color-white: #fff; --color-black: #000;
  /* scales: --color-teal-50 … --color-night-950 exactly as table 2.1 */

  /* semantic — light-dark() follows OS with zero JS */
  --color-page:        light-dark(#FFFBF4, #0F1529);
  --color-surface:     light-dark(#FFFFFF, #18203A);
  --color-surface-2:   light-dark(#FBF3E4, #1F2947);
  --color-surface-3:   light-dark(#F3E6CE, #283456);
  --color-fg:          light-dark(#1B2440, #F4F1EA);
  --color-fg-muted:    light-dark(#46566F, #B8C1D3);
  --color-fg-subtle:   light-dark(#5E6F8A, #95A1B8);
  --color-line:        light-dark(#E6D2AF, #33405F);
  --color-line-strong: light-dark(#5E6F8A, #66779A);
  --color-primary:     light-dark(#0B7D76, #5CC6BC);
  --color-primary-hover:light-dark(#0A6660, #94DDD5);
  --color-on-primary:  light-dark(#FFFFFF, #0F1529);
  --color-primary-soft:light-dark(#E8F8F6, #0A3F3C);
  --color-on-primary-soft:light-dark(#0B504C, #C8EFEA);
  --color-link:        light-dark(#2A47BE, #8AA8F7);
  --color-accent:      light-dark(#FDB528, #FFC84A);
  --color-on-accent:   light-dark(#1B2440, #0F1529);
  --color-focus:       light-dark(#2A47BE, #FFC84A);
  /* success/warning/danger/info (+ -soft, on-*-soft) per table 2.2 */
  --color-paper: #FFFFFF;  --color-lineart: #000000;

  --font-display: "Baloo 2", "Baloo Bhaijaan 2", "Baloo Da 2", ui-rounded, system-ui, sans-serif;
  --font-body: "Nunito", "Noto Naskh Arabic", "Noto Sans Bengali", ui-rounded, system-ui, sans-serif;

  --breakpoint-xs: 25rem;   /* 400 */ /* sm 40rem, md 48rem, lg 64rem, xl 80rem kept */
  /* type, radii, shadows, motion: sections 3–4 */
}

:root { color-scheme: light dark; }
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
:lang(ar), :lang(ur) { --font-display: "Baloo Bhaijaan 2", "Noto Naskh Arabic", sans-serif;
                       --font-body: "Noto Naskh Arabic", "Geeza Pro", sans-serif; }
:lang(bn) { --font-display: "Baloo Da 2", sans-serif; --font-body: "Noto Sans Bengali", sans-serif; }
```

A pre-paint inline script in `<head>` (~600 B) reads `localStorage['kci:prefs']` inside try/catch and sets these attributes on `<html>` before first paint:
- `data-theme`
- `data-mode` (kid)
- `data-imagery`
- `data-paper`
- `data-motion`
- `data-season` (the build writes the default)

A vitest file, `tests/tokens.contrast.test.ts`, re-computes every pair in table 2.2 and fails CI if text falls below 4.5 or UI below 3.0.

### 2.4 Seasonal accents (`html[data-season]`)
These change only the banner, the hub-hero band and the logo variant. Core UI colors never change, which keeps accessibility stable.

| Season | Band gradient | Band text | Motif |
|---|---|---|---|
| `ramadan` | #121B3D → #1F327C | saffron-300 #FFC84A (8.56 on #1C2C63) + moon-white | lanterns, crescent |
| `eid-fitr` | saffron-50 → pom-100 | pom-800 #841E25 (7.53) | bunting, star confetti |
| `dhul-hijjah` / `eid-adha` | sand-100 → palm-50 | palm-800 | tent and palm silhouette, sun |
| `autumn` | sand-100 → saffron-100 | saffron-800 | pomegranates, leaves |
| `winter` | cobalt-50 → ink-100 | cobalt-800 | snow-dusted domes |
| `spring` | palm-50 → teal-50 | palm-800 | blossoms, tulips (Iznik) |
| `summer` | teal-50 → saffron-50 | teal-800 | sea, dates, sun |

### 2.5 Coloring palettes for the app
Defined in `src/data/palettes.ts`:

```ts
type Swatch = { hex: string; name: string; nameAr?: string };
type Palette = { id: string; name: string; mood: string; forTags: string[]; swatches: Swatch[] };
```

Every swatch has a spoken name for screen readers and an `aria-label`.

| id · Name | Swatches (hex · name) |
|---|---|
| `kids-rainbow` · **Kids Rainbow** (kid-mode default, 12) | #E5383B Red · #FF7B00 Orange · #FFC300 Sunny Yellow · #8AC926 Lime · #2DA44E Green · #00A6A6 Teal · #4CC9F0 Sky · #1E6FD9 Blue · #6A4C93 Purple · #F15BB5 Pink · #8D5524 Brown · #1B1B1B Black |
| `iznik-tiles` · **Iznik Tiles** | #0E4C92 Deep Cobalt · #1F6FB2 Cobalt · #A7C4E5 Soft Blue · #2BB3B1 Turquoise · #8ED6D3 Pale Turquoise · #C8102E Bole Red · #E86A5C Coral · #2E8B57 Iznik Green · #5B3A7A Manganese · #F5F1E6 Slip White |
| `andalusian-courtyard` · **Andalusian Courtyard** | #C1502E Terracotta · #F4A259 Orange Blossom · #D9A441 Ochre · #6B8E23 Olive · #2F4F3A Cypress · #2E5EAA Azulejo Blue · #A7C7E7 Fountain · #D98C8C Rose · #F3E9D2 Plaster · #9C8F7A Stone |
| `desert-sunset` · **Desert Sunset** | #FFE8C2 Dune Light · #F6D186 Sand Gold · #FFB347 Apricot Sky · #FF7F50 Coral Sun · #E4572E Ember · #A23B72 Dusk Rose · #5B2A86 Twilight · #2E1A47 Night · #C08552 Camel · #8C5E3C Date Brown |
| `ramadan-night` · **Ramadan Night** | #0B1D51 Midnight · #1E3A8A Deep Blue · #3B5BDB Twilight Blue · #7C9CF5 Evening · #B2EBF2 Moonlight · #F4F1EA Moon White · #FFE29A Lantern Glow · #F7C548 Lantern Gold · #E8A33D Brass · #6A4C93 Dusk Violet |
| `eid-sweets` · **Eid Sweets** | #FFB5C2 Rose Lokum · #FF8FAB Candy Pink · #FFD6A5 Apricot · #FDFFB6 Lemon Cream · #B5E48C Pistachio · #9BF6FF Aqua Icing · #A0C4FF Periwinkle · #BDB2FF Lavender · #E9C46A Honey Gold · #D4A373 Baklava |
| `oasis` · **Oasis** | #1B5E20 Palm Frond · #2E7D32 Leaf · #66BB6A Fresh Green · #A5D6A7 Mint · #00897B Spring Water · #4DD0E1 Pool · #0277BD Deep Water · #F9E79F Sand · #D4A276 Dune · #6D4C41 Palm Trunk |
| `pastel-garden` · **Pastel Garden** | #F8C8DC Blush · #FAD4C0 Peach · #FFF1B6 Butter · #D7F2C2 Sprout · #B8E0D2 Sage Mint · #C6E2F5 Baby Blue · #D6CDEA Lilac · #F2D7EE Orchid · #E8D5B5 Oat · #BFD8B8 Celery |
| `spice-souk` · **Spice Souk** | #9E2A2B Sumac · #B5462E Paprika · #D2691E Cinnamon · #E0A100 Turmeric · #F2C14E Saffron · #6B8F3A Za'atar · #3E5641 Cardamom · #7A3E1D Clove · #E9D8A6 Cumin · #4A2C2A Coffee |
| `deep-blue-sea` · **Deep Blue Sea** | #03045E Abyss · #023E8A Deep Sea · #0077B6 Ocean · #0096C7 Current · #00B4D8 Lagoon · #48CAE4 Shallows · #90E0EF Foam · #CAF0F8 Spray · #FFB4A2 Coral · #F1FAEE Pearl |
| `mosque-marble` · **Mosque Marble** (grown-ups default) | #FAF7F0 Marble · #E8E2D4 Limestone · #CFC6B4 Travertine · #A89F8E Sandstone · #6E6758 Basalt · #3F3A33 Ebony · #C9A227 Gold Leaf · #8C6E1F Antique Gold · #2F4858 Slate · #7A9E9F Celadon |
| `pomegranate-orchard` · **Pomegranate Orchard** (foods of the Quran) | #8E1B2B Pomegranate · #E74C3C Aril Red · #F5A3A3 Blossom · #5D3A5A Fig · #4B2C5E Grape · #708238 Olive · #3D4B2A Olive Leaf · #7B3F00 Date · #E3A21A Honey · #FFF8E7 Milk |
| `basics` (always pinned) | #000000 Black · #4A4A4A Charcoal · #9E9E9E Grey · #D9D9D9 Light Grey · #FFFFFF White |
| `skin-hair` (for faceless figures) | #F9D9C5 · #EDB98A · #D08B5B · #AE5D29 · #7D4A2A · #4A2F23 · #2B1D16 Dark Hair · #A8692E Chestnut |

**How palettes are used:**
- **Defaults by hub:** Ramadan → `ramadan-night`; Eid → `eid-sweets`; geometric/adult → `mosque-marble`; mosques → `iznik-tiles`; animals/nature → `oasis`; food → `pomegranate-orchard`.
- Design frontmatter `palettes: [...]` overrides the default.
- **Color-by-number legends** take swatches by index. Label text color is `contrastText(hex)`: ink-900 or white, whichever ratio is higher.
- **Selected-swatch indicator:** a double ring (2px white inside, 2px ink-900 outside), so it stays at 3:1 or better against any swatch, including black and white.

---

## 3. Typography

### 3.1 Families
All are OFL, self-hosted, woff2, and split into subsets by `unicode-range`.

| Role | Family | Axes / weights used | Subsets | Loaded on |
|---|---|---|---|---|
| Latin display | **Baloo 2** Variable | wght 500–800 (600, 700, 800) | latin, latin-ext | all pages; **only preloaded file** (latin) |
| Latin body / UI | **Nunito** Variable | wght 400–800 | latin, latin-ext (covers tr, fr, id, ms) | all pages |
| Arabic display | **Baloo Bhaijaan 2** Variable | 500–800 | arabic | `/ar/`, `/ur/`, letter pages |
| Arabic body + letter teaching | **Noto Naskh Arabic** Variable | 400–700 | arabic (include U+FDFA ﷺ, Arabic-Indic digits) | anywhere Arabic text appears (`unicode-range` means it downloads only when Arabic glyphs render) |
| Urdu (phase 2) | **Noto Nastaliq Urdu** | 400, 700 | arabic | `/ur/` only |
| Bengali (phase 2) | **Baloo Da 2** (display) + **Noto Sans Bengali** Variable (body) | 500–800 / 400–700 | bengali | `/bn/` only |
| Build-time art only (never shipped) | Noto Naskh Arabic (tracing outlines), **Reem Kufi** (Kufic bubble phrases), **Aref Ruqaa** (Eid calligraphy pages) | — | — | SVG generator: `harfbuzzjs` shaping → `fontkit` paths → stroke offset for bubble letters |

**Loading:**
- Use the Astro Fonts API (stable since Astro 6) with the Fontsource provider in `astro.config.mjs` under `fonts: [...]`, and `<Font cssVariable="--font-display" preload />` only for Baloo 2 latin.
- It generates metric-matched fallbacks (`size-adjust`, `ascent-override`) so the font swap causes no layout shift.
- `font-display: swap`.
- **English-page font budget: 90 KB or less** (2 files).

### 3.2 Fluid type scale
Computed for 360px → 1280px viewports.

| Token | Range px | `clamp()` | Line-height (Latin) | Typical use |
|---|---|---|---|---|
| `--text-xs` | 12→13 | `clamp(0.75rem, 0.7255rem + 0.1087vw, 0.8125rem)` | 1.4 | legal, ad label (never essential info) |
| `--text-sm` | 14→15 | `clamp(0.875rem, 0.8505rem + 0.1087vw, 0.9375rem)` | 1.45 | card description, chips, meta |
| `--text-base` | 16→18 | `clamp(1rem, 0.9511rem + 0.2174vw, 1.125rem)` | 1.6 | body |
| `--text-lg` | 18→21 | `clamp(1.125rem, 1.052rem + 0.3261vw, 1.312rem)` | 1.45 | card title (Baloo 2 600), lede |
| `--text-xl` | 20→25 | `clamp(1.25rem, 1.128rem + 0.5435vw, 1.562rem)` | 1.3 | H4, panel headings |
| `--text-2xl` | 24→31 | `clamp(1.5rem, 1.329rem + 0.7609vw, 1.938rem)` | 1.25 | H3 |
| `--text-3xl` | 28→39 | `clamp(1.75rem, 1.481rem + 1.196vw, 2.438rem)` | 1.2 | H2 |
| `--text-4xl` | 33→49 | `clamp(2.062rem, 1.671rem + 1.739vw, 3.062rem)` | 1.1 | H1 (hubs, design pages) |
| `--text-5xl` | 39→61 | `clamp(2.438rem, 1.899rem + 2.391vw, 3.812rem)` | 1.05 | home display |

- In Tailwind each token is declared as `--text-lg: …; --text-lg--line-height: 1.45;`.
- Headings: Baloo 2 700–800 (600 in the calm grown-ups tone), `letter-spacing: -0.01em`, `text-wrap: balance`.
- Body: Nunito 400, with 700 for emphasis. `text-wrap: pretty`. Line length 68ch or less.
- **Kid mode** overrides `--text-base` to 18→22px and `--text-lg` to 22→26px.

### 3.3 Script and RTL rules
- **Line-heights:**
  - Arabic: body 1.9, headings 1.5.
  - Urdu Nastaliq: body 2.3, headings 1.9.
  - Bengali: body 1.75, headings 1.4.
  - Arabic inside English text: `<span lang="ar" dir="rtl" class="ar-inline">` with `font-size: 1.15em; line-height: 1;` inside `unicode-bidi: isolate`.
- **Never** use `letter-spacing`, italics, or `text-transform` on Arabic, Urdu or Bengali; letter-spacing breaks Arabic letter joining. A global `:lang(ar), :lang(ur), :lang(bn) { letter-spacing: 0 }` enforces this. Turkish uppercase only with the correct `lang="tr"` (dotted İ).
- **Highlighting one letter inside a joined Arabic word** (e.g. ب in بيت) is pre-rendered at build time as SVG from a HarfBuzz-shaped glyph run with the target glyph colored. This avoids cross-browser shaping breakage when a `<span>` sits mid-word. The plain-text word is kept as visually-hidden text for SEO and screen readers.
- **Logical properties only:**
  - Allowed: `ms-/me-/ps-/pe-/start-/end-/text-start/border-s/rounded-s-*`, `inset-inline-*`, `margin-inline`, `padding-block`.
  - CI script `scripts/lint-logical.mjs` greps `src/` for `\b(ml|mr|pl|pr|left|right|text-left|text-right|rounded-[lr]|border-[lr])-` and fails the build on a match.
- **Mirror in RTL** (`rtl:-scale-x-100`): chevrons, back/forward arrows, breadcrumb separators, undo/redo (and their positions swap), "show more" arrows, the drawer side, carousel start, horizontal-scroll start, progress fill direction.
- **Never mirror:** the logo, line art, numbers, the play icon, checkmarks, clocks, the search magnifier.
- **Digits:**
  - `/ar/` prose uses Arabic-Indic digits (`Intl.NumberFormat('ar-u-nu-arab')`).
  - Color-by-number art uses Western digits on every locale, except designs from the "Arabic numbers" set.
  - Phone numbers, emails and URLs are wrapped in `dir="ltr"`.

---

## 4. Layout, shape, decoration, icons, motion

### 4.1 Spacing and layout tokens
- **Base unit:** Tailwind `--spacing: 0.25rem` (4px).
- **Semantic spacing:**
  - `--space-gutter: clamp(1rem, 0.6087rem + 1.739vw, 2rem)` (16→32). This is the page side gutter, 16px at phone width.
  - `--space-section: clamp(3rem, 1.826rem + 5.217vw, 6rem)` (48→96).
  - `--space-stack: clamp(1.5rem, 1.109rem + 1.739vw, 2.5rem)` (24→40).
  - Card padding 8px (mobile) / 12px (≥ md).
- **Containers:** site 80rem (1280); prose 68ch; app full-bleed.
- **Design grid:**
  - `grid-template-columns: repeat(auto-fill, minmax(min(100%, 9.75rem), 1fr))`, gap 12px. At 360px this gives 2 columns (2×156 + 12 + 32 = 356).
  - At `lg`: `minmax(13rem, 1fr)`, gap 20px. That gives 4 columns at 1024 and 5 at 1280.
  - Cards use `@container` queries: under 176px wide the description hides and the buttons stack icon-over-label. Targets stay 44px or larger.
- **Touch target:** `--tap: 2.75rem` (44px); kid mode `3.5rem` (56px); app kid tools 64px.
- **Z-index:**

  | Layer | z-index |
  |---|---|
  | base | 0 |
  | sticky filter bar | 20 |
  | header | 30 |
  | mobile action bar | 35 |
  | toast | 50 |
  | dialogs and popovers | top layer (native) |

- **Scroll padding:** `scroll-padding-top: 72px; scroll-padding-bottom: 96px`. This meets WCAG 2.4.11 (focus not obscured) under the sticky header and action bar.

### 4.2 Radii, borders, shadows
- **Radii:** `--radius-xs 6px` (tiny chips), `sm 10px` (inputs), `md 14px` (buttons), `lg 20px` (cards), `xl 28px` (sheets, panels), `2xl 36px` (hero bands), `full 9999px` (pills, swatches).
- **Borders:** 1px decorative (`line`); 2px on interactive inputs and chips (`line-strong`); 3px in kid mode.
- **Shadows** are warm and tinted with ink `27 36 64`:
  - `--shadow-xs: 0 1px 2px rgb(27 36 64/.06)`
  - `--shadow-sm: 0 1px 3px rgb(27 36 64/.08), 0 1px 2px rgb(27 36 64/.04)`
  - `--shadow-md: 0 6px 16px -4px rgb(27 36 64/.12), 0 2px 6px -2px rgb(27 36 64/.06)`
  - `--shadow-lg: 0 16px 40px -12px rgb(27 36 64/.22)`
  - `--shadow-chunky: 0 4px 0 0 var(--chunky-edge)`: the kid-mode and primary-CTA "3D" button; the edge is teal-800 on primary. On `:active`, `translateY(2px)` and the shadow goes to 2px.
  - Dark mode replaces shadows with `inset 0 1px 0 rgb(255 255 255/.05)` plus a `line` border.

### 4.3 Arch (mihrab) frame
- **Mask utility** (about 250 B):

```css
@utility arch {
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 125' preserveAspectRatio='none'%3E%3Cpath d='M0 125V40C0 18 30 6 50 0c20 6 50 18 50 40v85z'/%3E%3C/svg%3E") center/100% 100% no-repeat;
}
```

- **Outline:** an absolutely positioned `<svg viewBox="0 0 100 125" preserveAspectRatio="none">` with the same path, `fill:none; stroke: var(--color-line); stroke-width:2; vector-effect:non-scaling-stroke`. On card hover the stroke changes to `accent`.
- **Thumbnail aspect** is `17/22` (Letter page). Thumbnails are cropped at build time to the art bounding box with a 4% margin, then laid out with `padding-block-start: 12%` so the arch never clips the art.
- The mask goes on the image wrapper only, never on the card or link, so focus rings are not masked.

### 4.4 UI illustration style: "half-colored"
- **Look:**
  - Ink outlines in `fg`, 2px at 1×, with round caps and joins.
  - About 40% of regions are filled with flat brand colors, offset 1–2px from the outline, like crayon that missed the line.
  - No gradients, no gloss, **no people and no animals in UI art** (the UI is always aniconic).
- **Motif library:** `src/assets/deco/*.svg`, built into `sprite.svg`.

  | Motif | Max size (svgo-minified) |
  |---|---|
  | `girih-strip` (8-fold border tile) | 1.5 KB |
  | `star-tile` (background texture, used at 5% opacity on heroes only) | 1.2 KB |
  | `merlon-divider` (stepped crenellation section divider) | 0.6 KB |
  | `arch-frame` | 0.4 KB |
  | `lantern` | 2.5 KB |
  | `crescent-stars` | 1 KB |
  | `dome-skyline` | 2.8 KB |
  | `pomegranate` | 2 KB |
  | `najma-*` poses (happy-bounce, searching-tilt, sleeping-dim, celebrate-spin) | 2 KB each |

- **Budget:** each decorative SVG 3 KB or less minified; 8 KB of decoration per page or less. Deco is never placed inside or over a line-art preview.

### 4.5 Iconography
- **Library:** Lucide.
  - `@lucide/astro` for build-time inline SVG on content pages (zero JS).
  - `lucide-react` (tree-shaken) in islands.
  - 24px grid, 2px stroke (1.75 in dense desktop UI), round caps — this matches Baloo's rounded forms.
- **Custom icons** in `src/icons/*.svg` on the same grid, used through `<Icon name>`: crescent, lantern, mosque, minaret, khatam-star, prayer-mat, tasbih, dates, dallah, arabic-letter (ا), tracing (dotted A), color-by-number (grid with numerals), crayon, no-faces (blank oval head with a small check), pdf-file, paper-letter, paper-a4.
- **Respect rule:** no Kaaba icon in UI chrome. The Kaaba appears only as content art.
- **Icon-only buttons** always have an `aria-label` and a visible tooltip on hover or focus. Primary actions always show a text label.

### 4.6 Motion and sound
- **Tokens:**
  - Durations: `--dur-instant 80ms`, `--dur-fast 140ms`, `--dur-base 220ms`, `--dur-slow 360ms`, `--dur-celebrate 1600ms`.
  - Easing: `--ease-standard cubic-bezier(.2,0,0,1)`, `--ease-out cubic-bezier(.16,1,.3,1)`, `--ease-spring cubic-bezier(.34,1.56,.64,1)` (kid mode and Najma only).
- **Rules:**
  - Animate only `transform` and `opacity`.
  - Hover lift −2px; press scale .97.
  - No parallax, autoplay carousels, or hero video.
  - No loop longer than 5s (WCAG 2.2.2).
- **Page transitions:** CSS cross-document view transitions, `@view-transition { navigation: auto; }`, with no Astro ClientRouter (no JS). A card thumbnail morphs into the design-page preview via `view-transition-name: art-{slug}`.
- **Reduced motion:** the OS `prefers-reduced-motion` **or** the site setting `data-motion="reduce"`. The site setting exists because kids' tablets rarely have the OS preference set. It zeroes transition and animation durations, sets `@view-transition { navigation: none }`, replaces confetti with an opacity-only badge, and turns off smooth scroll.
- **Sound:** off by default; a kid-mode toggle turns it on. "pop" (fill) and "chime" (complete), each 8 KB or less Opus/WebM, preloaded only when the toggle is on.

---

## 5. Component inventory

Path conventions:
- `src/components/ui/`: primitives
- `src/components/site/`: chrome
- `src/components/content/`: content blocks
- `src/scripts/`: vanilla modules
- `src/islands/`: React

"JS" means client JS. Every component must meet 44px targets, a visible `focus` ring (3px solid `--color-focus`, 2px offset, `:focus-visible`), and pass axe in all four modes (light, dark, RTL, kid).

**Primitives:**

| Component | Spec |
|---|---|
| `Button` | Variants: primary (teal), secondary (surface + line-strong border), soft (primary-soft), ghost, accent (saffron, for bundle CTAs), chunky (kid mode). Sizes: md 44, lg 52, xl 64. States: default, hover (primary-hover, lift), active (press), focus-visible, disabled (`aria-disabled`, 40% opacity, still focusable with explanation), loading (spinner + `aria-busy`). Always icon + text for primary actions. |
| `IconButton` | 44×44, `aria-label` required, tooltip via `popover="hint"` with a `title` fallback. |
| `Chip` | 40px visual, 44px hit area (block padding), pill. Default: surface + 2px line-strong. Selected: primary-soft + on-primary-soft + check icon + `aria-pressed="true"`. Count suffix "(12)". Zero-count chips: `aria-disabled`. |
| `Badge` | 24px, radius-xs, text-xs 700. Types: New (accent), Seasonal (season tint), No faces (primary-soft + icon), Teacher pick (info-soft). |
| `SegmentedControl` | `role="radiogroup"`; 44px segments; selected segment is a surface pill with shadow-xs inside a surface-3 track. Used for paper size, family filter, theme. |
| `Dialog` / `Sheet` | Native `<dialog>`, opened with `command="show-modal"` invokers plus a ~200 B fallback script. Sheet: bottom on mobile (radius-xl top, drag handle visual only, Esc and backdrop close), side on desktop. |
| `Skeleton` | Static surface-3 blocks (no shimmer when reduced motion is set). |

**Site chrome and content components:**

**Header** (`site/Header.astro`, JS: none)
- Mobile, 56px, sticky: [☰ 44] [logo lockup, 112px] … [search 44] [family settings 44].
- Desktop, 72px: logo · nav (Islamic Events · Topics · Arabic & Learning · Activities · For Grown-ups) · search field `<form action="/search/">` (no typeahead at launch) · Kid-mode switch · family settings.
- Backdrop: `page` at 92% with `backdrop-filter: blur(8px)` and a bottom `line` border on scroll.

**MegaMenu** (`site/MegaMenu.astro`, JS: none)
- Each top item is `<button popovertarget="mm-events">` controlling a `<div popover>` full-width panel. This gives light-dismiss and Esc for free, and the DOM order puts the panel right after its button so Tab flows in. Click only, no hover.
- Panels use a 4-column grid with icon + label links and a featured card on the right:
  - **Islamic Events:** Ramadan, Eid al-Fitr, Eid al-Adha, Hajj & Umrah, Islamic New Year, Laylat al-Qadr, Mawlid (labelled "optional section"). Featured: "Ramadan 2027 pack" + countdown.
  - **Topics:** Animals of the Quran, Animals, Nature, Food & Sunnah foods, Mosques of the World, Vehicles, Space, Patterns, Seasons (Autumn, Winter, Spring, Summer).
  - **Arabic & Learning:** Arabic Alphabet (mini 28-letter grid), Letter Tracing, Arabic Numbers ٠–٩, English Alphabet, Numbers, Shapes, 5 Pillars, Wudu Steps, Salah Steps, 99 Names.
  - **Activities:** Color by Number, Mazes, Word Search, Dot-to-Dot, Calendars & Trackers, Cards & Gift Tags, How to Draw.
  - **For Grown-ups:** Islamic Geometric, Mandalas, Calligraphy, Zellige & Iznik, Coloring Books (bundles), For Teachers, Our Standards.

**MobileNav** (`site/MobileNav.astro`)
- `<dialog>` drawer from the inline-start edge, 88vw, max 360.
- Sections are `<details name="nav">` accordions with 48px rows.
- Footer of the drawer: family settings, language, Kid mode.

**SeasonalBanner** (`site/SeasonalBanner.astro`, JS: `banner.ts` ~0.4 KB)
- `<aside aria-label="Seasonal">` below the header, not sticky. 48px tall (64px if it wraps to 2 lines).
- Season band gradient, 20px lantern icon, text, CTA link, dismiss ✕ 44px. Dismissal is stored as `kci:dismiss:{event}-{year}`.
- The build renders the text for the build date (daily rebuild via deploy hook). `banner.ts` recomputes "about N days" from `data-start` in the user's local time.
- States:
  - pre (T−60 to T−1)
  - ongoing (day N)
  - last-10-nights
  - Eid
  - evergreen season
- Hidden in print.

**DesignCard** (`content/DesignCard.astro`, JS: none; `paper.ts` rewrites PDF hrefs)
- Container: `surface`, radius-lg, 1px line, shadow-xs.
- **Thumbnail:**
  - `arch` mask on `paper` white, 17/22.
  - `<img>` WebP srcset 320w/480w/640w, `width`/`height` set, `loading="lazy"` except the first 4.
  - Badges sit over the thumbnail: New at top inline-start; No faces at top inline-end (icon only, label in `aria-label`).
- **Title:** Baloo 2 600, `text-lg`, 2-line clamp. It is the card's primary `<a>`, and a `::after` stretched link covers the thumbnail.
- **Description:** `text-sm` fg-muted, 1 line, hidden when the container is under 176px.
- **Meta row:**
  - Difficulty dots, 4 levels: Easy ●○○○, Medium, Detailed, Expert. Filled = teal-600; empty = 1.5px ink-500 ring. `aria-label="Difficulty: Easy"`.
  - Age chip: 3–5 · 6–8 · 9–12 · Grown-ups (info-soft).
- **Actions**, 2 buttons at 44px, z-index above the stretched link:
  - `[⬇ PDF]` soft: `<a download href="/pdf/{slug}-a4.pdf" aria-label="Download {title} PDF">`.
  - `[🖍 Color]` ghost: `/color-online/{slug}/`.
- Data attributes: `data-age data-difficulty data-imagery data-type data-style data-new`.
- States:
  - hover: lift −2px, shadow-md, arch stroke turns accent
  - focus: `:has(:focus-visible)` ring on the card
  - pressed
  - hidden-by-filter (`hidden`)
  - skeleton

**HubHero** (`content/HubHero.astro`)
- Variants: event (season band), topic (surface-2), learning (primary-soft), grown-ups (marble `#FAF7F0`, calm).
- Anatomy:
  - eyebrow ("Islamic events · Updated Dec 2026")
  - H1 "{N} {Topic} Coloring Pages" (count computed from the collection)
  - lede of 160 characters or less
  - TrustRow
  - primary CTA "Download all {N} · one PDF" (accent)
  - secondary "Color online"
  - desktop-only collage: 3 arch thumbnails rotated −4°/0°/4°
- **Mobile height is 360px or less**, so the first card row appears above the fold.

**TrustRow** (`content/TrustRow.astro`)
- Inline list with check icons: "Free · No signup · Letter & A4 · Reviewed for Islamic content".
- The last item links to the standards page, and appears only when the entry has `reviewedBy`.

**FilterChips** (`content/FilterChips.astro`, JS: `filters.ts` ~1.5 KB)
- Groups: Age, Difficulty, Type (Coloring, Color by number, Tracing, Worksheet, Card), Style (Bold & easy), Imagery ("No faces").
- Logic: OR within a group, AND across groups. Matching cards get `hidden` toggled.
- `aria-live="polite"` count: "Showing 18 of 49".
- `history.replaceState` writes `?age=3-5&difficulty=easy`. Those parameter URLs canonicalize to the clean hub URL.
- Mobile: a horizontal-scroll row (`scroll-snap-type: x proximity`, edge fade via a logical mask). Once scrolled past, a floating **"Filters · 2"** pill (48px, bottom inline-end, thumb zone) opens a bottom sheet.
- Desktop: sticky under the header.
- "Clear all" chip.

**Breadcrumbs** (`site/Breadcrumbs.astro`)
- `<nav aria-label="Breadcrumb"><ol>`. Separator is an `aria-hidden` chevron that flips in RTL. The last item is `aria-current="page"` text.
- Mobile collapses to "‹ {Parent}". Desktop shows the full trail.
- `BreadcrumbList` JSON-LD.

**DownloadPanel** (`content/DownloadPanel.astro`, JS: `paper.ts`, ~0.5 KB)
- Paper SegmentedControl: "Letter 8.5×11 in" | "A4 210×297 mm".
- **Default paper:** the stored preference, otherwise the region of `navigator.language`. US, CA, MX, PH, CL, CO, VE get Letter; everyone else gets A4.
- Primary: "Download PDF" (lg 52px, full width on mobile) with the size line "PDF · 1 page · 140 KB".
- Row of buttons:
  - "Print": `window.print()`; `paper.ts` injects `@page { size: A4|letter; margin: .4in }`, and the print CSS shows only `.print-art`.
  - "Color online".
- Tertiary links: "PNG · 300 DPI", "Copy link", "Save to Pinterest" (hidden in kid mode).
- License line: "Free for home, classroom & mosque-school use. Please don't resell." links to `/license/`.
- After a download, a Toast suggests the bundle.

**MobileActionBar** (`content/MobileActionBar.astro`, JS: `IntersectionObserver` in `paper.ts`)
- Below `lg` only. 64px plus `env(safe-area-inset-bottom)`, `surface` with a top shadow.
- Buttons: [🖨 Print, 56px wide] [⬇ Download PDF · A4, primary, flex-1] [🖍 Color, 56px wide].
- Visible whenever the in-flow Download button is **not** in the viewport. This guarantees "download above the fold" even on a 667px-tall iPhone SE.
- Body gets `padding-bottom` while it shows.
- No ad may ever sit here.

**PaletteSuggestion** (`content/PaletteSuggestion.astro`)
- "Try these colors": 2–3 rows of palette name + 10 overlapping 24px swatch circles (−4px overlap).
- Each row links to `/color-online/{slug}/?palette={id}`.

**ArabicWordCard** (`content/ArabicWordCard.astro`)
- Arabic word large: Noto Naskh Arabic 48px, `lang="ar" dir="rtl"`. The target letter is highlighted via a build-time SVG; plain text is kept as visually-hidden text.
- Transliteration in `lang="ar-Latn" dir="ltr"`, e.g. "bayt".
- Meaning: "house".
- 64px half-colored object icon (aniconic words preferred).
- Audio button (44px speaker, `<audio preload="none">`) rendered only when `audio` exists in the entry (phase 2).
- States: default, playing (`aria-pressed`), no-audio.

**LetterHero** (`content/LetterHero.astro`)
- Glyph at 160px (Naskh), name, sound hint ("b as in bat"), "2 of 28".
- 4 position forms: isolated ب · initial بـ · medial ـبـ · final ـب. Each form is its own card with a label.

**FaqAccordion** (`content/FaqAccordion.astro`, JS: none)
- `<details name="faq">` exclusive accordion. 52px summary rows, plus/minus icon, answer in `fg-muted`.
- `FAQPage` JSON-LD (useful for AI answers even though Google limits FAQ rich results).

**RelatedGrid** (`content/RelatedGrid.astro`)
- "More {topic} pages": 4 cards on mobile, 6 on desktop. Same hub first, then shared tags.
- A row of "Explore related" hub chips.
- Cards obey the family filter.

**BundleCTA** (`content/BundleCTA.astro`)
- `surface-2` band with a girih-strip top border.
- 3 fanned page thumbnails (CSS transforms).
- Copy: "Get all {N} {Topic} pages in one PDF", "Free · 14 MB · Letter or A4 · no email needed".
- Accent button.

**Newsletter** (`site/Newsletter.astro`)
- Eyebrow "For grown-ups", H2 "New pages before every Ramadan & Eid".
- One email field (48px) + Subscribe. Double opt-in. Confirmation is inline, not a new page.
- Text: "For parents & teachers (18+)".
- Hidden in kid mode.

**Footer** (`site/Footer.astro`)
- Girih top border.
- 4 link columns (2-up on mobile, no accordions): Coloring Pages · Islamic Events · Learning & Printables · About.
- Language switcher (endonyms with `lang`), theme, family settings, "Request a page", "Our Islamic content standards", license, privacy ("No tracking cookies"), contact. Help and contact sit in the same place on every page (WCAG 3.2.6).
- Credit: "© 2026 KidsColorIt · designed in Dhaka by the Color Experts International studio".
- Kid mode: the footer collapses to Home + "Grown-ups" (gated).

**AdSlot** (`site/AdSlot.astro`)
- Props: `slot`, `sizes`, `minH={{ mobile: 280, desktop: 250 }}`.
- When `flags.ads === false` it renders **nothing**.
- When on, it renders `<div class="ad" style="min-height:…">` with an "Advertisement" label (text-xs fg-subtle).
- `?debugAds=1` shows dashed placeholders in dev.
- Never rendered in kid mode, in print, or on excluded routes (section 7.6).

**EmptyState** (`content/EmptyState.astro`)
- Najma pose, H2, one helpful sentence, a primary action and a secondary action.
- Types:
  - `no-results`: "Request it" form link + 6 popular chips
  - `filter-empty`: names the chip that would free the most results
  - `gallery-empty`
  - `offline`: app only
  - `error`
- Never publish a hub with fewer than 12 designs, so there is no "coming soon" thin page.

**Toast** (`site/Toast.astro` + `toast.ts` ~0.6 KB)
- Triggered by a `kci:toast` CustomEvent.
- Position: mobile bottom-center above the action bar (`bottom: calc(64px + env(safe-area-inset-bottom) + 12px)`); desktop bottom inline-end. Max width 360px.
- `toast` colors, icon, optional action, ✕ 44px.
- `role="status"`; errors use `role="alert"` and don't auto-dismiss.
- Auto-dismiss 5s, paused on hover or focus. One toast at a time.

**KidModeToggle + ParentGate** (`site/KidModeToggle.astro`, `ParentGate.astro`)
- Switch `role="switch" aria-checked` labelled "Kid mode". Entering is one tap and sets `data-mode="kid"`.
- **Exiting**, and any external link while in kid mode, opens the ParentGate `<dialog>`: "Type this number in digits: *seven hundred forty-two*".
  - The number is random 100–999, written in words in the current locale.
  - `inputmode="numeric"`, 3 tries, no timer.
  - It is keyboard and screen-reader accessible, unlike press-and-hold gates.

**FamilySettings** (`site/FamilySettings.astro` sheet, JS: `family.ts`)
- Paper size (Letter / A4).
- **Imagery:** Show all | No faces | Objects & places only.
- Kid mode.
- Theme: System / Light / Dark.
- Reduce motion.
- Sounds (kid mode).
- Language.
- Everything is stored in `kci:prefs`.
- Imagery is applied with CSS, e.g. `html[data-imagery="no-faces"] [data-imagery="animals"] { display: none }`.

**ReviewedBy** (`content/ReviewedBy.astro`)
- "Drawn by {designer} · Reviewed by {name}, {credential} · Updated {Mon YYYY}".
- Rendered **only** when there is a real person entry in `src/content/people/`. Avatars are monogram illustrations, never photos, in line with our own standards.

**LanguageSwitcher** (phase 2)
- Endonyms: English, العربية, Bahasa Indonesia, বাংলা, Türkçe, Bahasa Melayu, Français, اردو.
- Links to the translated twin if it exists, otherwise to the locale home.

**Imagery levels** (must match ISLAMIC-IMAGERY.md):

| Level | `data-imagery` | Meaning | "No faces" badge | Hidden by "No faces" | Hidden by "Objects & places only" |
|---|---|---|---|---|---|
| L0 | `aniconic` | Patterns, architecture, plants, objects, food, letters, landscapes | yes | no | no |
| L1 | `faceless` | Figures or animals with no facial features | yes | no | yes |
| L2 | `animals` | Animals with simple faces | no | yes | yes |
| — | — | People with faces, prophets, angels | never produced | — | — |

The design page states the level in words, e.g. "Imagery: Objects & places only".

---

## 6. Page wireframes

**Shared rules:**
- Mobile-first (390×844 reference; 360 minimum). The thumb zone (bottom 40%) holds the primary actions.
- **On every page that shows a design, the line art and a Download button are visible in the first viewport.** On mobile the MobileActionBar guarantees this.

URL patterns used here (final say belongs to SEO.md):

| Page | URL |
|---|---|
| Hub | `/ramadan-coloring-pages/` |
| Design | `/ramadan-coloring-pages/lantern-and-crescent/` |
| App | `/color-online/lantern-and-crescent/` (noindex) |
| Arabic alphabet hub | `/arabic-alphabet/` |
| Arabic letter | `/arabic-alphabet/ba/` |
| Printables hub | `/printables/` |
| Printable | `/printables/ramadan-calendar-for-kids/` |
| Search | `/search/?q=` (noindex) |
| Standards | `/about/islamic-content-standards/` |
| Locales | `/ar/…`, `/id/…` |
| PDFs | `/pdf/{slug}-{letter\|a4}.pdf` |
| Images | `/img/{slug}-coloring-page.webp` |

Design-side title defaults:
- Hub: `{N} {Topic} Coloring Pages{ {Year} if seasonal} (Free Printable PDFs) | KidsColorIt`
- Design: `{Title} Coloring Page — Free PDF (Letter & A4) | KidsColorIt`
- Letter: `Arabic Letter {Name} ({glyph}) Coloring & Tracing Worksheets — Free PDF | KidsColorIt`

The H1 is never the full title: hub "49 Ramadan Coloring Pages"; design "Lantern and Crescent Coloring Page".

### 6.1 Home, mobile
```
┌──────────────────────────────────────┐
│ ☰   ✦ kidscolorit          🔍   ⚙   │ 56 sticky
├──────────────────────────────────────┤
│ ☾ Ramadan starts in about 60 days —  │ SeasonalBanner 48–64
│   get the free 30-day pack ›      ✕  │
├──────────────────────────────────────┤
│ Free coloring pages & activities     │ H1 (5xl→4xl on mobile)
│ for Muslim families                  │
│ Little hands, beautiful traditions.  │ lede
│ [🔍 Search 300+ pages…            ]  │ GET /search/ (48px)
│ ✓Free ✓No signup ✓Letter & A4        │ TrustRow
│ ┌──────┐ This week's page            │ Featured (line art + PDF
│ │ arch │ Lantern & Crescent           │ above the fold)
│ │ art  │ [⬇ PDF]  [🖍 Color]          │
│ └──────┘                              │
├──────────────────────────────────────┤
│ Islamic events          See all ›    │ h-scroll arch tiles 120×150
│ [Ramadan][Eid Fitr][Eid Adha][Hajj]→ │
├──────────────────────────────────────┤
│ Popular this week   (2×2 DesignCard) │
├──────────────────────────────────────┤
│ Learn the Arabic letters             │ 7×4 grid of 44px letter tiles
│ ا ب ت ث ج ح خ …                      │ (RTL order inside grid)
├──────────────────────────────────────┤
│ Topics (2×4 icon tiles): Animals ·   │
│ Nature · Food · Mosques · Space ·    │
│ Vehicles · Patterns · Seasons        │
├──────────────────────────────────────┤
│ Printables: Ramadan calendar · Good  │ 3 PrintableCards
│ deeds tracker · Eid cards            │
├──────────────────────────────────────┤
│ For grown-ups (calm marble band):    │
│ Islamic geometric patterns ›         │
├──────────────────────────────────────┤
│ Why parents & teachers trust us      │ 3 points + standards link
├──────────────────────────────────────┤
│ Newsletter · Footer                  │
└──────────────────────────────────────┘
```
On desktop the hero splits in two: text + search on the left (7/12) and the featured design card plus 2 more arch thumbnails on the right (5/12).

### 6.2 Hub (`/ramadan-coloring-pages/`), mobile
```
┌──────────────────────────────────────┐
│ ☰   ✦ kidscolorit          🔍   ⚙   │
├──────────────────────────────────────┤
│ ‹ Islamic Events                     │ breadcrumb (collapsed)
│ ISLAMIC EVENTS · Updated Dec 2026    │ eyebrow
│ 49 Ramadan Coloring Pages            │ H1
│ Lanterns, mosques, crescents & a     │ lede ≤160 chars
│ 30-day calendar. Free PDFs.          │
│ [⬇ Download all 49 · one PDF ]       │ accent, 52
│ [🖍 Color online             ]       │ secondary, 44
├──────────────────────────────────────┤
│ [All][3–5][6–8][9+][Easy][No faces]→ │ chips (non-sticky on mobile)
│ Showing 49 pages                     │ aria-live
├──────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐              │ 2-col DesignCards
│ │  arch   │ │  arch   │              │ (row 1 visible above fold)
│ │  art    │ │  art    │              │
│ │Title    │ │Title    │              │
│ │●○○○ 3–5 │ │●●○○ 6–8 │              │
│ │[PDF][🖍]│ │[PDF][🖍]│              │
│ └─────────┘ └─────────┘   …rows 2–3  │
│ ‹AdSlot hub-inline-1 — flag off›     │ renders nothing at launch
│ …rows… [Show all 49] (if >48)        │ no infinite scroll
├──────────────────────────────────────┤
│ Ramadan activities: Calendar · Good  │ cross-links (printables)
│ deeds tracker · Word search · Maze   │
├──────────────────────────────────────┤
│ H2 How to use these pages (guide,    │ 300–600 words, parent-useful
│ conversation prompts, age tips)      │
│ FAQ (5–7 details)                    │
│ Related: Eid al-Fitr · Lanterns ·    │
│ Mosques · Arabic letters             │
│ ReviewedBy · BundleCTA · Footer      │
└──────────────────────────────────────┘
          [ Filters · 2 ]  ← floating pill appears after chips scroll away
```
On desktop: the hero has the collage at inline-end; the filter bar is sticky under the header; the grid has 5 columns at 1280. A future ad rail (300×600, ≥1280 only) is a separate grid column switched by the flag at build time, so the grid changes from 5 to 4 columns at build, not at runtime, and causes no layout shift.

### 6.3 Single design page, mobile
```
┌──────────────────────────────────────┐
│ ☰   ✦ kidscolorit          🔍   ⚙   │
├──────────────────────────────────────┤
│ ‹ Ramadan Coloring Pages             │
│ Lantern and Crescent Coloring Page   │ H1 (4xl, 2 lines)
│ [Ages 3–5] ●○○○ Easy  [No faces]     │
│ ┌──────────────────────────────────┐ │
│ │                                  │ │ paper preview: white, radius-md,
│ │        LINE ART (17:22)          │ │ shadow-sm, max-height 52vh,
│ │                                  │ │ view-transition-name: art-{slug}
│ └──────────────────────────────────┘ │
│ Paper  ( Letter | ●A4 )              │ SegmentedControl
│ [⬇ Download PDF · A4 · 140 KB     ]  │ primary 52
│ [🖨 Print ]       [🖍 Color online]  │ 48 each
│ PNG 300 DPI · Copy link · Pin        │
│ Free for home, classroom & madrasa…  │
├──────────────────────────────────────┤
│ About this page: what's drawn, skill │ 2–3 sentences
│ Talk about it: "Why do we hang       │ conversation prompts
│ lanterns in Ramadan?"                │
│ Try these colors: Ramadan Night ●●●● │ PaletteSuggestion
│                   Iznik Tiles   ●●●● │
│ Details: Imagery · Pages · Size ·    │
│ Drawn by · Reviewed by · Updated     │
├──────────────────────────────────────┤
│ More Ramadan pages (2×2) · Related   │
│ hub chips · BundleCTA · Footer       │
├──────────────────────────────────────┤
│ [🖨]  [ ⬇ Download PDF · A4 ]  [🖍]  │ MobileActionBar (when in-flow
└──────────────────────────────────────┘  button is off-screen)
```
On desktop: 12 columns. The preview takes 7 columns (sticky, top 96px). The DownloadPanel, details and palettes take 5 columns. Breadcrumbs show the full trail.

If the family filter hides this design's level, the preview shows an interstitial instead: "This page includes animal faces. [Show anyway] [See faceless pages]".

### 6.4 Online coloring app (`/color-online/{slug}/`, full-screen, no site chrome)
**Mobile portrait:**
```
┌──────────────────────────────────────┐
│ ‹  Lantern & Crescent   ✓Saved ↷ 💧 ⋯│ 52: back · title · saved · redo ·
├──────────────────────────────────────┤      eyedropper · more
│ sand-100 workspace                   │
│   ┌──────────────────────────────┐   │
│   │                              │   │ white paper canvas
│   │        canvas (pinch/pan)    │   │ touch-action: none
│   │                              │   │
│   └──────────────────────────────┘   │
│                              [⤢ Fit] │ 44, only when zoomed
├──────────────────────────────────────┤
│ ◉ ● ● ● ● ● ● ● ● ●   [▴ Iznik Tiles]│ palette strip 64: 40px swatches
├──────────────────────────────────────┤  (48 hit), h-scroll; drawer btn
│ [🪣Fill][🖌Brush][⌫Erase][●Size][↶Undo]│ toolbar 64 + safe-area, labels
└──────────────────────────────────────┘
```
- **Landscape phone:** the toolbar becomes a 72px rail at inline-end and the palette a rail at inline-start.
- **⋯ menu** (sheet): Save image (PNG), Print, Share, Color-by-number on/off, Start over (confirm), Thick lines (high contrast), Sounds, Help (gestures).

**Desktop (≥1024):**
```
┌────────────────────────────────────────────────────────────────────────────┐
│ ‹ Back to page   Lantern & Crescent     ↶ ↷ │ − 100% + ⤢ │ ✓Saved  🖨 ⬇PNG ⤴ │ 56
├──────┬──────────────────────────────────────────────────┬─────────────────┤
│ 🪣 F │                                                  │ Palette ▾       │
│ 🖌 B │                                                  │ Iznik Tiles     │
│ ◐ G  │              paper canvas (fit)                  │ ■■■■■ ■■■■■     │
│ ⌫ E  │                                                  │ Recent ■■■■     │
│ 💧 I │                                                  │ Custom ＋        │
│ ───  │                                                  │─────────────────│
│ 🔢   │                                                  │ Brush size      │
│ CBN  │                                                  │ ∙ • ● ⬤ ⬤ (XS–XL)│
│      │                                                  │ Opacity ─────●  │
│      │                                                  │─────────────────│
│      │                                                  │ CBN legend /    │
│      │                                                  │ progress 23/40  │
└──────┴──────────────────────────────────────────────────┴─────────────────┘
 72px tool rail (role=toolbar)                              280px side panel
```
Full app specification is in section 8.

### 6.5 Arabic letter page (`/arabic-alphabet/ba/`), mobile
```
│ ‹ Arabic Alphabet                         │
│ Arabic Letter Ba (ب)                      │ H1
│ Coloring & Tracing Worksheets             │
│ ┌───────────────┐  Ba · بَاء             │ LetterHero: glyph 160px
│ │       ب       │  Sounds like "b" in    │
│ │               │  "bat" · Letter 2 of 28│
│ └───────────────┘  [🔊 Hear it] (phase 2)│
│ Forms: [ب isolated][بـ initial]          │
│        [ـبـ medial][ـب final]            │ 2×2 cards
│ Printables (2-col cards, each w/ PDF):   │
│  [ب is for بيت (house) coloring]         │ aniconic word default
│  [Tracing worksheet] [Bubble letter]     │
│  [Find & circle ب]  [Color by letter]    │
│ Words with ب (ArabicWordCards):          │
│  بيت bayt house · باب bāb door ·         │
│  بحر baḥr sea · برتقال burtuqāl orange   │
│ ‹ Ta (next)      Alif (previous) ›       │ RTL-aware prev/next
│ All 28 letters (7×4 tile grid)           │
│ Teacher tips · FAQ · Bundle: "All 28     │
│ letters workbook · 60 pages"             │
```
On this page the MobileActionBar acts for the first printable: [🖨] [⬇ Tracing PDF] [🖍].

### 6.6 Printables hub (`/printables/`)
```
│ H1 Free Islamic Printables for Kids      │
│ lede · TrustRow                          │
│ [Calendars][Cards & tags][Worksheets]    │ type chips + event chips
│ [Games][Classroom packs]  [Ramadan][Eid] │
│ ── Calendars & trackers ──────────────── │ section per type
│ PrintableCard ×3: Ramadan 30-day         │ PrintableCard = DesignCard
│ calendar · Good-deeds tracker ·          │ variant: landscape-capable
│ Fasting tracker   [6 pages] badge        │ thumb, page-count badge
│ ── Cards & gift tags ── Eid cards …      │
│ ── Worksheets ── Wudu steps · Salah      │
│ steps · 5 Pillars · Arabic tracing       │
│ ── Games ── Word search · Maze ·         │
│ Dot-to-dot · Bingo                       │
│ For teachers: classroom packs (bundle)   │
```

### 6.7 Search results (`/search/?q=lantern`, React island + Pagefind, noindex)
```
│ [🔍 lantern                      ✕ ]     │ sticky under header, autofocus
│ 18 results for "lantern"                 │ aria-live
│ [All 18][Coloring 12][Printables 4]      │ tabs = Pagefind filters
│ [Arabic 2]                               │
│ 2-col compact DesignCards with <mark>    │
│ highlighted title match                  │
│ [Load 12 more]                           │
│ — zero results → EmptyState no-results:  │
│ "No pages for 'unicorn' yet." [Request   │
│ it] + popular chips (Ramadan, Mosque,    │
│ Arabic letters, Patterns, Animals)       │
```

### 6.8 About: Our Islamic content standards (`/about/islamic-content-standards/`)
```
│ H1 Our Islamic content standards         │
│ Summary card: 6 commitments (✓ list)     │
│  1 We never depict prophets, angels or   │
│    Allah  2 No faces on people, ever     │
│  3 Family filter for faces & living      │
│    beings  4 Respect for Arabic &        │
│    Quranic text  5 Named reviewers       │
│  6 We say "many families" where views    │
│    differ                                │
│ H2 What we draw / never draw (2 columns) │
│ H2 Faces & living beings (L0/L1/L2       │
│    explained with sample thumbnails)     │
│    [Open family settings]                │
│ H2 Arabic, names of Allah & the Quran    │
│    (disposal note, why no full verses on │
│    coloring sheets)                      │
│ H2 How a page is made & reviewed         │
│    (studio → QA → reviewer, diagram)     │
│ H2 Who we are: team cards, monogram      │
│    avatars, roles, credentials, links    │
│ H2 Tell us if we got something wrong     │
│    (form + email) · Standards changelog  │
```
No ads on this page, ever.

### 6.9 404 (friendly)
```
│ [Najma, searching-tilt pose, no face]    │
│ H1 This page wandered off!               │
│ We couldn't find it — let's find you     │
│ something to color.                      │
│ [🔍 Search pages…                  ]     │
│ Popular: Ramadan · Mosques · Arabic      │
│ letters · Patterns · Animals             │
│ Mini game: "Color the 404" — the digits  │
│ "4 0 4" drawn as 12 geometric tiles;     │
│ tap or Enter to fill (vanilla, ≤2 KB,    │
│ keyboard accessible)                     │
│ [Go home]                                │
```

---

## 7. UX principles and rules

### 7.1 Core principles and their acceptance criteria
1. **Line art first.** On any design or printable page at 390×844 and 360×740, the art (or a thumbnail at 40% of the viewport or larger) and a Download control are visible without scrolling. Playwright checks this with `toBeInViewport()`.
2. **Zero-signup downloads.** No email, account or wait screen before any PDF, PNG or bundle. Downloads are static files served from the CDN.
3. **Two clicks to print.** Print → system dialog → Print. The `@page` size matches the chosen paper.
4. **One decision at a time.** Each viewport has one primary button. Paper size remembers the user's choice.
5. **Honest counts and claims.** H1 counts come from the collection. "Reviewed by" appears only with a real reviewer. "Updated" only changes on real content changes.
6. **Respect.** No fear-based or sectarian copy. Greetings follow the calendar. Imagery levels are visible on every design.
7. **Light by default.** Content pages ship no framework JS.

### 7.2 Parent-trust signals and where they appear
- TrustRow on every hub, design and printable page.
- "No faces" badges plus the 3-way family filter.
- The standards page, linked in the header's For Grown-ups menu, the footer and the TrustRow.
- ReviewedBy with named people.
- A real company credit in the footer.
- "No tracking cookies" in the footer at launch (cookieless analytics).
- License clarity.
- A "Request a page" form.
- A visible "Kid mode" control.
- No pop-ups or interstitials.
- Bundles explicitly labelled "no email needed".

### 7.3 Accessibility (WCAG 2.2 AA)
- **Contrast:** token pairs are verified in CI (section 2.2). Non-text UI uses `line-strong`, 3:1 or better.
- **Focus:** 3px `--color-focus` ring with 2px offset on every interactive element. Sticky elements are compensated with `scroll-padding` (2.4.11).
- **Targets:** 44px or larger everywhere, 56px in kid mode (exceeds 2.5.8).
- **Dragging alternatives (2.5.7):** the brush needs dragging, so the app also offers the single-tap Fill tool, zoom and pan buttons, and keyboard region navigation.
- **Keyboard:**
  - Skip link to `#main`.
  - Popover and dialog menus with Esc.
  - Roving tabindex in toolbars.
  - Chips are buttons with `aria-pressed`.
- **Language of parts (3.1.2):** `lang` and `dir` on all Arabic, Urdu and Bengali spans.
- **Alt text formula:** `"{Title} coloring page — {what is drawn, 8–15 words}. Black-and-white printable outline."` Decorative SVGs get `aria-hidden="true"`.
- **Media:** future how-to-draw videos need captions and a transcript; letter audio is always paired with transliteration text.
- **Consistent help (3.2.6):** help, contact and request links sit in the same footer slot on every page.
- **Testing:** `@axe-core/playwright` on every template in light, dark, RTL (`/ar/` sample) and kid mode. Manual VoiceOver iOS and TalkBack passes before launch.

### 7.4 Kid-safe UX
- **In kid mode:**
  - No external links (they intercept to the ParentGate).
  - No ads, forms, newsletter, social, share or FAQ.
  - Picture-based navigation tiles.
  - Kid-voice microcopy.
- **Never, anywhere on the site:**
  - streaks or guilt notifications
  - timers
  - loot or reward economies
  - infinite scroll (use "Show more")
  - autoplay
  - chat or user-generated content
  - collecting a child's personal data
- **Dark patterns banned:**
  - fake download buttons
  - confirmshaming
  - pre-checked consent boxes
  - "you'll lose your work" scare copy (we autosave instead)
  - interstitials before downloads
  - countdown pressure on free items
- **Legal:** the newsletter is parent-directed (18+ statement), with double opt-in. This aligns with the amended COPPA rule; the site collects no personal information from children.

### 7.5 Print UX (the PDF spec owned by the design team)
- **Page sizes:** Letter 612×792pt, A4 595×842pt.
- **Margins:** 0.4in (28.8pt) safe area on all sides. Art is scaled to fit while preserving aspect, centered, never stretched.
- **Lines:** pure `#000` lines. No grey fills or tinted backgrounds. Decorative borders hairline only (very low ink).
- **Footer:** 8pt Nunito 60% grey: "{Title} · kidscolorit.com · Free for home & classroom use".
- **Worksheets:** optional "Name ______ Date ______" header.
- **Pages showing Allah's names or Quranic phrases** get a footer note: "Contains the name of Allah — please keep or dispose of respectfully."
- **Bundles:** cover page, contents, then 1 design per page. Only the cover carries a 0.5in QR code linking to the hub.
- **Files:** named `{slug}-{letter|a4}.pdf`; PDF `Title` metadata = page title; fonts subset-embedded.
- **HTML print stylesheet:** `@media print` hides everything except `.print-art`; no URLs printed after links.

### 7.6 Performance-aware design budgets
These are p75 targets on mobile, Moto G-class hardware, 4G.

| | HTML (br) | CSS (br) | JS (br) | Fonts | Images | LCP | CLS | INP |
|---|---|---|---|---|---|---|---|---|
| Home / hub / design | ≤ 50 KB | ≤ 25 KB | ≤ 12 KB (vanilla) | ≤ 90 KB (2 files) | thumbnails WebP ≤ 12 KB each; only first 4 eager | ≤ 2.0 s | ≤ 0.05 | ≤ 150 ms |
| Coloring app | — | ≤ 15 KB | ≤ 95 KB (React 19 + engine; worker lazy) | same | line art + label map ≤ 150 KB | interactive ≤ 3 s | 0 | ≤ 100 ms per fill |

Other limits:
- No hero video and no raster hero images.
- Decorative SVGs 3 KB or less each.
- `fetchpriority="high"` only on the LCP element (H1 font preload, or the design preview image).

### 7.7 Ad-layout rules for later (enforced in `AdSlot` and a Playwright layout test)
- **Never:**
  - inside, between, or within 150px vertically of any Download, Print, Color or Bundle button
  - between the art preview and its download controls
  - inside the MobileActionBar area
- **Never on:**
  - `/color-online/*`
  - kid mode
  - print, PDFs, PNG exports
  - `/about/*` and the standards page
  - pages showing Quranic text or the 99 Names
  - search
  - 404
  - the home first viewport
- **Allowed slot map:**
  - **Hub:** `hub-inline` after grid row 3, then every 6 rows, max 3. Desktop rail 300×600 sticky at 1280px and wider only.
  - **Design page:** `design-below-details` after the Details block (at least one full section after the download controls). `design-after-related`.
  - **Long guides:** one in-content slot per about 1.5 viewports.
- **Sticky anchor ad:** **desktop only** (90px bottom anchor). **None on mobile**, because the mobile bottom edge belongs to the action bar.
- **Mobile ad density** is 30% or less of content height (Better Ads Standard). No interstitials, auto-play video ads or pop-ups.
- Every slot has a fixed `min-height` and an "Advertisement" label. Styling must clearly differ from our buttons: no teal fills inside slots.
- **Blocked ad categories:** gambling, alcohol, dating, astrology/occult, mature content, religious-proselytizing and sectarian, political, weight-loss, "software download" lookalikes.
- Child-directed treatment is enabled on all requests (non-personalized ads).
- **Membership (ad-free) is a stub** behind `flags.membership=false`. The "Support us" page design is deferred.

---

## 8. Online coloring app UI in detail

**Location:**
- Route `src/pages/color-online/[slug].astro` → `<ColoringApp client:only="react" design={...} />`
- Island: `src/islands/coloring/ColoringApp.tsx`
- Engine: `src/islands/coloring/engine/*` (Web Worker)

**Art pipeline contract (build time).** For each design the build produces:
- `lineart.png` at 2048px wide (aspect 17:22 → 2048×2650).
- `labels.png`: a 24-bit region-ID map from connected-component labeling of the closed regions. Regions under 12px² are merged into their neighbor.
- `regions.json`: `id`, `bbox`, `area`, `label point` (the polylabel pole of inaccessibility), `cbn` number and target swatch.

**Rendering.** Three Canvas2D layers under the line art:
1. `fill` (raster).
2. `brush`.
3. `lineart` (the PNG on top, `multiply`).

**Fill:** the worker scans only the region's bbox and writes the color where `label == id`. Results:
- instant, under 20 ms
- **no fill leaks**
- color-by-number completion detection is free

Gradient fill uses the region mask as a clip with `source-in`.

### 8.1 Tools

| Tool | Behavior | Kid mode | Grown-up mode |
|---|---|---|---|
| **Fill** (default) | Tap a region to fill it with the current color; tap again with a new color to replace | ✓ (64px) | ✓ |
| **Brush** | Round brush with pressure (Pointer Events `pressure`) and stroke smoothing; sizes XS 4 · S 8 · M 16 · L 32 · XL 64 px at canvas resolution | ✓ S/M/L only | ✓ all + opacity 10–100% |
| **Eraser** | Erases brush and fill pixels; same sizes | ✓ | ✓ |
| **Eyedropper** | Picks a color from the composite; long-press 500ms in any tool also picks | — | ✓ |
| **Gradient fill** | Linear or radial; tap a region, drag the direction; 2 stops (current + secondary color) | — | ✓ |
| **Color by number** | Toggle (if the design has CBN data) | ✓ Guided | ✓ Guided / Free |

### 8.2 Palette drawer
- **Strip:** the current palette's 10–12 swatches (40px visual, 48px hit area; kid mode 56px in 2 rows of 6), plus a palette-name button.
- **Drawer:** bottom sheet on mobile at 60% height; on desktop the side panel shows it inline.
  - Tabs: **Palettes** (the 12 named palettes, each a row of swatches with its name and mood line) · **Recent** (last 12 colors used) · **Custom** (grown-up mode: HSV square, hue slider, hex input, "add to Recent").
  - Basics and Skin & Hair are pinned at the bottom.
- Swatches are a `role="radiogroup"` with color names ("Iznik cobalt"). Arrow keys move through them; numbers 1–9 and 0 pick swatches on desktop.

### 8.3 Gestures and zoom
- One finger: tool action (tap = fill, drag = brush).
- Two-finger pinch: zoom 1×–8×, anchored at the pinch midpoint. Two-finger drag: pan.
- Two-finger tap: undo (grown-up mode only).
- No double-tap zoom (it conflicts with fill taps).
- `touch-action: none` on the canvas only, so the page itself stays zoomable.
- Desktop: Ctrl/⌘+wheel or trackpad pinch zooms; Space+drag pans; − / + / 0 (fit) keys and buttons; % readout.
- When zoomed in, a "Fit" button appears.

### 8.4 Undo and redo
- Command stack of fill operations (`regionId`, previous color, new color) and brush operations (256px tile snapshots before and after), up to 50 steps or about 60 MB.
- **Mobile:** Undo lives in the **bottom toolbar** (thumb zone; kids use it constantly); Redo is in the top bar.
- **Desktop:** both in the top bar, with ⌘/Ctrl+Z and ⇧⌘/Ctrl+Z.
- In RTL the icons are mirrored and their order swaps.

### 8.5 Save, print and share
- **Autosave** to IndexedDB, debounced 1s:
  - `fills` (region→color map, tiny) and the `brush` layer as a PNG blob, plus a thumbnail.
  - The top bar shows "✓ Saved" (announced once).
  - Works are listed at `/my-gallery/` (local-only, noindex).
- **Save image:** a composite PNG at 2550×3300 (Letter) or 2480×3508 (A4) with a small "kidscolorit.com" credit in the bottom margin (good for Pinterest spread).
- **Print:** composite → print view sized to the selected paper.
- **Share:** Web Share Level 2 with files on mobile; on desktop it downloads. Hidden in kid mode.
- No accounts and no cloud save at launch.

### 8.6 Color-by-number mode
- The legend bar replaces the palette strip. Each chip shows: number, swatch, name, and remaining count, e.g. `3 ■ Lantern Gold · 8 left`.
- Numbers are drawn at each region's label point in Nunito 700, scaled with zoom. Below 10px on screen they hide until the user zooms in.
- **Guided** (default, kid mode): only matching regions accept the selected number's color.
  - A wrong tap gives a 2-frame outline flash (or a static outline when reduced motion is set) and the hint "That spot is number 3".
- **Free:** any color goes anywhere. A number disappears once its region has the correct color.
- **Hint** (lightbulb): outlines the remaining regions for the selected number (pulse, or a static thick outline when reduced motion is set).
- **Progress:** a ring in the top bar (`23/40`) plus an `aria-live` update every 5 regions.

### 8.7 Completion moment
- **Triggers:**
  - All CBN regions are correct, or
  - in free mode, the "I'm done!" button, which appears once 70% or more of regions are filled.
- **Full motion:**
  - A canvas overlay confetti burst (about 1.5 KB custom) of crescents, 8-point stars and dots in the current palette's colors: 70 particles, 1.6s, gravity, falling from the top.
  - Najma does one spin.
  - `navigator.vibrate(30)` in kid mode where supported.
  - Optional chime (if sounds are on).
- **Reduced motion:** no confetti or spin. A gold star badge fades in (opacity, 200ms).
- **Then a sheet:**
  - Headline: "MashaAllah! You finished it!" (grown-up: "Beautiful work!").
  - Buttons: [Save to my gallery] [Print] [Color another →]. Grown-up mode adds [Share]. The "another" suggestions come from the same hub.

### 8.8 Kid mode vs parent (grown-up) mode in the app

| | Kid mode | Parent / grown-up mode |
|---|---|---|
| Tools | Fill, Brush, Eraser, Undo (64px, labelled) | All tools + gradient, eyedropper, opacity |
| Palette | Kids Rainbow (12 × 56px); "More colors" shows only Eid Sweets, Oasis, Pastel Garden | All 12 palettes + custom |
| Sizes | S / M / L (3 big dots) | XS–XL + slider |
| Top bar | Back (stays in site), title, big Redo | Full: zoom %, save, print, PNG, share |
| Share / download | Hidden (Print allowed) | Shown |
| Shortcuts | Off | Full keyboard map |
| Copy | Kid voice | Neutral |

### 8.9 Keyboard and screen readers
- **Desktop shortcuts:**

  | Key | Action |
  |---|---|
  | F | fill |
  | B | brush |
  | G | gradient |
  | E | eraser |
  | I | eyedropper |
  | [ ] | brush size |
  | 1–9, 0 | swatches |
  | ⌘/Ctrl Z / ⇧⌘/Ctrl Z | undo / redo |
  | Space-drag | pan |
  | − + 0 | zoom out / in / fit |
  | ? | help overlay |

- **Region navigation:**
  - Tab into the canvas; arrow keys move a visible "region cursor" (3px focus outline traced around the region) in reading order, using label points sorted row-major and mirrored in RTL.
  - Enter or Space fills.
  - An `aria-live` region announces "Region 12 of 40, number 3, not filled".
- The toolbar is `role="toolbar"` with roving tabindex.
- **Thick lines** toggle loads a pre-dilated line-art variant for low vision.

### 8.10 Performance
- The island and the worker load only on this route.
- Line art and label map use `<link rel="preload">`.
- The worker is created on first interaction.
- The canvas buffer is capped at 2048px wide with DPR-aware display scaling.
- The engine uses no external libraries.

---

## 9. Doc outlines

### `/docs/DESIGN.md`: the visual system (what things look like)
1. **Purpose and design principles.** Thesis, the 3 moods (Play / Trust / Calm), 7 principles.
2. **Brand.**
   - Name usage rules.
   - Wordmark spec.
   - Najma mark geometry with the SVG source (section 1.2).
   - Lockups, clear space, minimum sizes, color versions, seasonal variants, don'ts.
   - Najma character rules (never a face; pose library).
   - Taglines.
3. **Voice and tone.**
   - Personality table.
   - Voice rules.
   - Parent / kid / teacher / grown-up microcopy library.
   - Greeting calendar and Islamic phrase bank with glosses.
   - Spelling and transliteration standards.
   - Words we avoid.
4. **Color.**
   - Brand scales.
   - Semantic tokens light/dark.
   - The contrast table, auto-generated by `scripts/contrast-report.mjs`.
   - Seasonal accents.
   - Coloring palettes (pointer to `src/data/palettes.ts`, with naming rules for new palettes).
   - The "paper never inverts" rule.
5. **Typography.**
   - Families and licenses.
   - Loading strategy and budgets.
   - Fluid scale table.
   - Per-script line-heights.
   - Arabic, Urdu and Bengali rules.
   - Build-time art fonts.
   - Glyph-highlight technique.
6. **Layout.** Breakpoints, containers, grid recipes, spacing tokens, z-index, touch-target tokens, container-query rules.
7. **Shape and depth.** Radii, borders, shadows, chunky button, arch mask utility and outline technique.
8. **Decoration and illustration.**
   - The half-colored style guide.
   - The motif library with byte budgets.
   - Pattern opacity rules.
   - Do's and don'ts, with sample SVGs.
9. **Iconography.** Lucide usage, custom icon grid rules, the custom icon list, the RTL mirroring list.
10. **Motion and sound.** Tokens, allowed properties, view transitions, reduced-motion behavior, confetti spec, sound files.
11. **Line-art production standards** (for code-generated and studio art).
    - Artboards 2550×3300 (Letter) and 2480×3508 (A4) at 300 DPI.
    - Stroke weights per difficulty: Easy 14–18px · Medium 8–10px · Detailed 4–6px · Expert 2–3px.
    - Every region closed (zero gaps).
    - Minimum region size per difficulty: Easy 15mm · Medium 8mm · Detailed 4mm · Expert 2mm.
    - SVG hygiene: a single `lineart` group, no fills, `stroke-linejoin: round`, svgo profile.
    - File naming.
    - Imagery-level tagging (pointer to ISLAMIC-IMAGERY.md).
    - Vectorize and QA checklist for studio and AI-assisted art.
12. **Print and PDF spec.** Section 7.5 verbatim, plus bundle cover and contents templates.
13. **Social templates.** Pinterest pin 1000×1500 (top 75% half-colored preview, bottom band with title, "Free printable PDF" and the logo); OG image 1200×630; both generated at build.
14. **Tokens: source of truth and change process.** `src/styles/global.css`, `palettes.ts`, the contrast test, the `/dev/styleguide` page, visual-regression baselines.
15. **Changelog.**

### `/docs/UI-UX.md`: behavior and interaction (how things work)
1. **UX principles with acceptance criteria** (section 7.1), each mapped to a Playwright check.
2. **Audiences and modes.**
   - Personas: parent on a phone, teacher on a desktop, kid 3–5, kid 6–10, adult colorist.
   - Default, kid and calm modes.
   - Family settings and their storage keys.
3. **Information architecture.** Site map, mega-menu contents, footer columns, URL patterns (pointer to SEO.md), breadcrumb rules, hub-size rule (12 designs minimum).
4. **Page templates.** One subsection per template (Home, Hub, Design, App, Arabic letter, Printables hub and item, Search, About/Standards, 404, My Gallery), each with:
   - the wireframe
   - the above-the-fold contract
   - section order
   - ad slots (future)
   - kid-mode differences
   - RTL notes
5. **Component specs.** For each component in section 5: purpose, anatomy, props (TypeScript interface), variants, states, a11y notes, JS (none / vanilla module / island), file path, and test IDs.
6. **Interaction patterns.**
   - Download flow and paper detection.
   - Print flow.
   - Filters (logic, URL state, empty states).
   - Search (Pagefind index fields and filters).
   - Family filter and interstitial.
   - Kid mode and ParentGate.
   - Seasonal banner state machine with the event-date data format.
   - Toasts.
   - View transitions.
   - Pre-paint preferences script.
7. **Online coloring app spec.** All of section 8: tools, gestures, palettes, CBN, completion, autosave, export, the shortcuts table, screen-reader model, engine data contract (`lineart.png`, `labels.png`, `regions.json`).
8. **Accessibility standard and test matrix.** WCAG 2.2 AA mapping, axe matrix (light/dark × LTR/RTL × kid), manual screen-reader scripts, alt-text formula.
9. **Kid safety and ethics.** Banned dark patterns, kid-mode guarantees, data and COPPA posture, newsletter rules.
10. **Performance budgets** (section 7.6) and how they are enforced: a Lighthouse CI budget file plus a bundle-size check.
11. **Monetization layout rules** (section 7.7). Feature flags in `src/config/flags.ts`, the slot map, blocked categories, membership stub.
12. **i18n and RTL UX.** Locale routing UX, language switcher, translated-twin fallback, digit policy, mirroring list, per-script typography reminders, pseudo-locale testing (`/xx/` with doubled strings and an RTL flag).
13. **Content design.** Microcopy library keys (`src/i18n/en.json`), error-message patterns, empty-state copy, greeting rules, glossary.
14. **QA checklist** run per release and per new template.
15. **Future features.** Photo-to-coloring-page (an "Eid/masjid photo" upload flow, parent-only, processed on-device first), audio pronunciation, accounts and cloud gallery, membership, the "AI page generator" ethics guardrails.

---

## 10. Implementation map

```
src/styles/global.css                     # @theme tokens, utilities (arch, season-band), base, print
src/config/flags.ts                       # ads:false, membership:false, kidMode:true, audio:false
src/data/palettes.ts                      # 12 palettes + basics + skin-hair
src/content/events/*.yaml                 # Hijri→Gregorian windows per year (±1 day note)
src/content/people/*.md                   # designers & reviewers (ReviewedBy)
src/assets/brand/{mark,mark-favicon,wordmark,lockup-h,lockup-stacked}.svg
src/assets/deco/*.svg  → sprite.svg       # motifs ≤3 KB each
src/icons/*.svg                           # custom icons (24px grid)
src/components/ui/{Button,IconButton,Chip,Badge,SegmentedControl,Dialog,Sheet,Skeleton,Icon}.astro
src/components/site/{Header,MegaMenu,MobileNav,SeasonalBanner,Breadcrumbs,Footer,Newsletter,
                    LanguageSwitcher,KidModeToggle,ParentGate,FamilySettings,AdSlot,Toast}.astro
src/components/content/{DesignCard,DesignGrid,PrintableCard,HubHero,TrustRow,FilterChips,
                    DownloadPanel,MobileActionBar,PaletteSuggestion,ArabicWordCard,LetterHero,
                    FaqAccordion,RelatedGrid,BundleCTA,ReviewedBy,EmptyState}.astro
src/scripts/{prefs-inline.ts,filters.ts,paper.ts,banner.ts,family.ts,toast.ts,gate.ts}
src/islands/coloring/{ColoringApp.tsx,Toolbar.tsx,PaletteDrawer.tsx,CbnLegend.tsx,
                      Completion.tsx,engine/{worker.ts,fill.ts,brush.ts,history.ts,store-idb.ts}}
src/islands/search/SearchApp.tsx          # Pagefind JS API
src/pages/dev/styleguide.astro            # noindex living style guide (all tokens/components, 4 modes)
public/favicon.svg · apple-touch-icon.png · icon-512-maskable.png
tests/tokens.contrast.test.ts (vitest) · tests/e2e/{above-fold,a11y,rtl,kid-mode,ads-layout}.spec.ts
scripts/{lint-logical.mjs,contrast-report.mjs}
```

A project skill such as `.claude/skills/design-review/` would run the style-guide screenshots, the axe matrix, the logical-property lint and the contrast report before merging any UI change. This is suggested alongside the content-ops skills.

Sources:
- [Astro 6 launch post (preview mirror)](https://a457ba07.previews.astro.build/blog/astro-6/)
- [Astro 6 Beta](https://astro.build/blog/astro-6-beta/)
- [Astro 5.7 (Fonts API introduced as experimental)](https://astro.build/blog/astro-570/)