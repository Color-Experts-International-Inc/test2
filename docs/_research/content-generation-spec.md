<!-- Specialist draft (Launch content inventory & programmatic SVG generation). Superseded by docs/PLAN.md where they disagree. -->

# kidscolorit.com: launch content inventory and programmatic SVG generation

**Scope.** This section covers the content that code can produce in the first build session. That means all launch content (no image API and no illustrators), the shared generator core, the region model, the asset pipeline, the exact launch counts, and the backlog for illustrated art later. Planning only. Library versions were checked on npm on 2026-10-13.

---

## 0. Decisions at a glance

| # | Decision |
|---|---|
| 1 | **498 code-generated designs at launch**, released in three waves: **1A on Nov 10** (205, Ramadan-critical), **1B on Nov 24** (151), **1C on Dec 8** (142). Every launch design has `faces: "none"`. So the "No faces / no animate beings" toggle shows the whole launch catalog, and we can say so in our messaging. |
| 2 | **Region model: "ink-first, faces-derived".** Generators only draw ink centerlines. The fillable regions are computed as the faces of `frame − union(stroked ink)` using **Clipper2** (`clipper2-ts@2.0.1-18`, exact pin). Each face is then grown by 0.35× the stroke width, so it tucks under the line. Closure is guaranteed by construction. |
| 3 | **One canonical file format, "KCI-SVG v1"**: a `regions` layer of `<path data-region>`, an `ink` layer of strokes, plus optional `labels` and `guides` layers. Generated art and vectorized illustrated art produce the same format. |
| 4 | **Artboard is the same physical size on Letter and A4**: 7.20 × 9.40 in, viewBox `0 0 720 940`, so 1 unit = 0.01 in = 0.254 mm = 0.72 pt. Because the size is identical on both papers, the QA limits in millimetres are exact for both. |
| 5 | **Arabic text**: shaped with `harfbuzzjs@1.6.3`, outlines taken with `font.glyphToPath()`. Fonts are Noto Naskh Arabic (teaching), Reem Kufi (display) and Aref Ruqaa (greetings), all under the OFL. The Arabic is never rendered as live text. Pseudo-Arabic is banned, and every Arabic string comes from a verified string list. |
| 6 | **Tracing**: positional-form sheets use a dashed outline plus a gray "ghost" fill, which is fully automatic. The 28 isolated letters and 10 digits get dotted centerlines with stroke-order arrows. Those come from a skeleton draft that a person corrects (about 6 h of work by an Arabic teacher or the design team). |
| 7 | **PDF: `pdf-lib@1.17.1`** draws our path-only SVG directly with `drawSvgPath`, and the same library merges bundles. It can also personalize PDFs in the browser later. If needed, `@cantoo/pdf-lib@2.11.1` is a maintained drop-in fork. |
| 8 | **Raster**: `@resvg/resvg-js@2.6.2` rasterizes and `sharp@0.35.5` encodes. Each design gets 400/800 px AVIF and WebP, a colored example, a 1000×1500 Pinterest pin and a 1200×630 OG image. |
| 9 | **What goes in Git**: approved SVG masters, the manifests (generator@version + seed + params) and the content JSON. Derived PDFs and images are built in CI and cached by hash. That is about 5.5K files, under the 20K-file Free-plan limit for Cloudflare static assets. |
| 10 | **Distinctness gate**: a 64-bit pHash with Hamming distance ≥ 12 within a generator and ≥ 8 site-wide, plus a check on parameter distance. Seeds are curated, not shipped in bulk. This guards against Google's scaled-content-abuse policy, which was the target of the March, June and August 2026 spam updates. |
| 11 | **Respect rules enforced in code**: no names of Allah and no Qur'anic text on any coloring or scribble page at launch. Pages flagged `sensitivity: sacred-place` (the Kaaba, named mosques) need an Islamic review flag before publish. The 99 Names and Bismillah are excluded from launch. |

---

## 1. The page format: KCI-SVG v1

### 1.1 Artboards and units

| Artboard | viewBox | Physical size | Fits | Used for |
|---|---|---|---|---|
| Portrait | `0 0 720 940` | 7.20 × 9.40 in | Letter (0.65 in side margins) and A4 (0.535 in side margins); footer band below | Coloring, worksheets, puzzles, trackers |
| Landscape | `0 0 940 720` | 9.40 × 7.20 in | Both papers in landscape | Calendars, half-fold cards, bunting, envelopes |

Minimum printable margin on every PDF is **0.5 in**; home inkjets lose about 0.25 in. The footer is drawn in the PDF, not in the SVG.

### 1.2 Difficulty presets (`generators/core/difficulty.ts`)

Unit conversions: 1 u = 0.254 mm and 1 mm² = 15.5 u².

| Level (site label) | Ages | Ink width | Regions | Min region area | Min clear width (polylabel pole distance) | Ink coverage |
|---|---|---|---|---|---|---|
| `bold` (Bold & Easy) | 2–4 | 7 u = 5.0 pt = 1.78 mm | 6–25 | 150 mm² | ≥ 3.5 mm | ≤ 18 % |
| `easy` | 4–6 | 5 u = 3.6 pt = 1.27 mm | 15–60 | 60 mm² | ≥ 2.5 mm | ≤ 20 % |
| `medium` | 6–9 | 3.5 u = 2.5 pt = 0.89 mm | 50–160 | 20 mm² | ≥ 1.5 mm | ≤ 22 % |
| `hard` | 9–12 | 2.8 u = 2.0 pt = 0.71 mm | 140–400 | 8 mm² | ≥ 1.0 mm | ≤ 25 % |
| `expert` | 13+ / adults | 2.1 u = **1.5 pt floor** = 0.53 mm | 350–1,200 (online cap 1,500) | 3 mm² | ≥ 0.6 mm | ≤ 28 % |

### 1.3 SVG structure

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 940"
     data-kci="1" data-generator="fanoos@1.2.0" data-seed="r27-0413" data-difficulty="medium">
  <title>Hexagonal Ramadan lantern with star windows coloring page</title>
  <g data-layer="regions" fill="#fff" stroke="none" fill-rule="evenodd">
    <path data-region="r1" data-class="c0" d="M…Z"/>   <!-- r1..rn sorted by (pole.y, pole.x) -->
  </g>
  <g data-layer="paint"/>                                <!-- app brush layer (empty in file) -->
  <g data-layer="ink" fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">
    <path stroke-width="3.5" d="…"/>                     <!-- true Béziers, crisp -->
    <path data-solid="1" fill="#000" stroke="none" d="…"/> <!-- solid glyphs, absorbed specks -->
  </g>
  <g data-layer="labels" fill="#555" pointer-events="none"/>   <!-- CBN codes, outlined -->
  <g data-layer="guides" stroke="#9a9a9a" pointer-events="none"/> <!-- dashed tracing/cut/fold -->
</svg>
```

Layers are named with `data-layer` rather than `id`, so svgo's `cleanupIds` cannot break them. The online app fills `[data-region]` paths directly, without flood fill. The same paths double as `clipPath`s for "stay inside the lines" brushing.

### 1.4 Determinism

- `core/rng.ts` hashes `${designId}:${seed}` with `cyrb128` into an `sfc32` generator. The API is `float/int/pick/weighted/fork(label)`. `fork` gives each sub-decision its own stream, so adding a parameter later does not reshuffle the others.
- `Math.random` and `Date` are banned by a lint rule. All coordinates are rounded to 0.01 u when emitted. Node 22 is pinned.
- Every generator has a semver `version`. `art/.snapshots.json` stores the sha256 and pHash of each approved master. If CI regenerates a master and it differs (pixelmatch diff > 0 at 400 px), the build fails until someone re-approves it with `--accept`.

### 1.5 Generator contract

```ts
// generators/core/types.ts
export interface Generator<P> {
  id: string;                 // 'fanoos'
  version: string;            // '1.2.0' (bump ⇒ re-approval)
  kind: DesignKind;           // 'coloring' | 'tracing' | 'calendar' | 'word-search' | …
  paramsSchema: z.ZodType<P>;
  sample(rng: Rng, d: Difficulty): P;                    // exploration
  draw(p: P, rng: Rng, ctx: DrawCtx): Drawing;           // pure
  describe(p: P, d: Difficulty): DesignFacts;            // title parts, alt, blurb facts, tags, arabic{}
  steps?(p: P): StepGroup[];                             // for how-to-draw
}
export type InkPath = { d: Cmd[]; width: number; closed: boolean;
  role: 'line' | 'solid' | 'guide' | 'label'; step?: number; label?: string };
export type Drawing = { artboard: 'portrait' | 'landscape'; frame: Poly; ink: InkPath[];
  orbitHints?: Map<string, string>; answerKey?: Drawing };
```

---

## 2. Region closure: the chosen approach

**Decision: generators draw ink only, and regions are computed as planar faces with Clipper2.** This is `generators/core/regions.ts`:

1. Flatten every ink path with `role: 'line' | 'solid'` to polylines (adaptive Bézier subdivision, tolerance 0.05 u).
2. Stroke to polygons with `InflatePathsD(paths, w/2, JoinType.Round, EndType.Round)`; closed outlines use `EndType.Joined` and solid glyphs `EndType.Polygon`. Precision is 2 decimals. Then `Union` into the **INK** set.
3. `Difference(frame, INK)` gives a PolyTree. Each outer ring plus its direct holes is one **face**; nested children are walked recursively.
4. Per face, compute area, perimeter, bounding box and the `polylabel@2.1.0` pole with its distance. The face touching the frame is `r0` (background).
5. QA thresholds (§4.6). Faces under 1 mm² that are junction artifacts are absorbed into solid ink, up to 0.5 % of regions. Anything between 1 mm² and the level minimum fails, and the generator retries the next sub-seed (up to 20) or enlarges cells by 10 %.
6. **Tuck**: `InflatePathsD(face, +0.35·w, Round)`, clipped to the frame. Region edges then sit under the ink, so there are no white anti-aliasing halos at any zoom or in any app.
7. `SimplifyPaths(ε = 0.15 u)`. Region outlines are hidden under ink, so they can be coarse polylines and stay small.
8. **Adjacency graph**: two faces are adjacent when their 0.6·w dilations intersect (pruned with a spatial hash). This feeds color-by-number and the auto-colored previews.
9. **Symmetry class**: use the generator's `orbitHints` when present. Otherwise use a signature of (area/4, perimeter/2, centroid radius/3, rounded), adding Hu-moment invariants for tilings.

**Why this approach**

- A generator only has to draw lines, the way an illustrator does. Overlapping elements need no special planar-map logic: a lantern over stars, lettering over a border, a frame clipping a pattern.
- Closure is guaranteed because a face of a complement is closed by definition.
- Dangling strokes such as leaf veins correctly sit inside a region instead of splitting it.
- The same semantics carry over to vectorized raster art, where faces are found by connected-component labeling of white pixels (§6.5).
- Clipper2 uses exact integer/fixed-precision arithmetic, which matters because Hankin patterns produce many coincident and collinear edges. It also has built-in offsetting (stroke → polygon), PolyTree holes and open-path clipping.
- `clipper2-ts` is pure TypeScript under the BSL-1.0, so it runs the same way in Node and in the browser. That covers later "design your own" and photo-to-page features.

**Rejected alternatives**

- **paper.js booleans**: needs a canvas or jsdom in Node, and floating-point booleans are fragile on coincident edges.
- **polygon-clipping@0.15.7**: no offsetting, slow on 1K+ segments, and has known edge-case bugs.
- **Generators emitting regions directly**: every generator would need its own correct planar map, which is fragile for compositions.

**Risk**: `clipper2-ts` is a prerelease tag. We wrap it behind `core/clipper.ts`, cover it with golden tests (union, offset, PolyTree), and keep `clipper2-wasm@0.4.0` as the fallback.

---

## 3. Generator catalog

### 3.1 Summary

"High-quality ceiling" is my estimate of how many visibly different pages a generator can make at high quality, enforced by the pHash gate.

| ID | Generator | Launch | High-quality ceiling | Levels | Keyword family served |
|---|---|---|---|---|---|
| G01 | `rosette`: n-fold star medallions | 12 | ~80 | E–X | islamic geometric pattern coloring, 8 point star, geometric coloring pages |
| G02 | `pic-tiling`: Hankin polygons-in-contact | 16 | ~150 | E–X | islamic geometric pattern, geometric coloring pages (10–30K), adult coloring |
| G03 | `decagonal`: Penrose/girih 10-fold | 6 | ~30 | H–X | girih, islamic art coloring for adults |
| G04 | `zellige`: grouted tile pieces | 8 | ~40 | E–H | moroccan tile / zellige coloring |
| G05 | `interlace`: over-under strapwork | 6 | ~40 | H–X | islamic knot / interlace pattern |
| G06 | `mandala`: radial rings + motif library | 38 | 300+ | B–X | mandala (Tier 1), ramadan mandala, flower mandala |
| G07 | `iznik`: tulips, carnations, saz leaves, tiles | 12 | ~60 | E–H | flower coloring pages (Tier 2), tulip, turkish tile |
| G08 | `snowflake`: D6 dendrites | 12 | ~200 | B–H | snowflake / winter coloring pages (Dec–Jan) |
| G09 | `fanoos`: Ramadan lanterns and lantern scenes | 20 | ~120 + scenes | B–H | ramadan lantern, fanoos, ramadan coloring pages |
| G10 | `crescent-sky`: crescent, stars, clouds | 11 | ~40 | B–M | moon and stars (Tier 3), crescent moon, ramadan |
| G11 | `mosque`: style-coherent composer | 22 | ~60 | B–H | mosque coloring page, mosque drawing easy |
| G12 | `objects`: about 20 parametric object families | 35 | ~150 | B–H | prayer mat, tasbih, dallah, dates, gift, Kaaba… |
| G13 | `lettering`: EN bubble + AR calligraphy outlines | 14 | ~60 | B–M | eid mubarak / ramadan kareem coloring |
| G14 | `arabic-letters`: coloring, tracing, forms, chart | 85 | 140+ | B–M | arabic alphabet coloring/tracing/worksheets |
| G15 | `numerals`: Eastern Arabic + count-and-color 1–20 | 41 | 80+ (bn/ur digits later) | B–E | arabic numbers, number coloring pages |
| G16 | `latin-abc`: "M is for Mosque" | 26 | 78 (+ tracing, lowercase) | B–E | alphabet / letter coloring pages |
| G17 | `shapes` | 10 | ~20 | B | shapes coloring pages |
| G18 | `color-by-code` (transform) | 28 | ~0.5 × eligible bases × 4 code types | E–H | color by number (Tier 1), ramadan color by number |
| G19 | `pattern-in-silhouette` (transform) | 2 | ~200 | M–X | geometric crescent/lantern; animal silhouettes later |
| G20 | `how-to-draw` (transform) | 8 | ~30 | B–E | mosque/eid/lantern drawing easy (BD/PK/IN intent) |
| G21 | `calendar-tracker` | 19 | ~40 | — | ramadan calendar printable for kids, good deeds tracker |
| G22 | `paper-goods`: cards, tags, bunting, envelopes, door hangers, crafts | 28 | ~80 | — | eid card printable, eid gift tags, eid decorations |
| G23 | `word-search` | 13 | ~60 themed | E–H | ramadan word search |
| G24 | `maze` | 10 | ~100 | E–H | ramadan maze, mazes for kids |
| G25 | `dot-to-dot` | 6 | ~40 | E–H | dot to dot |
| G26 | `diy-template` + construction tutorials | 10 | ~30 | — | design your own, how to draw islamic pattern |
| | **Total** | **498** | | | |

### 3.2 Geometric family (G01–G05)

**G01 `rosette`.** The construction follows Kaplan's rosette method (Bridges 2000), re-implemented from the paper rather than copied from Taprats code.

- Start from a regular n-gon with circumradius R₀.
- Cast Hankin rays from the edge midpoints at contact angle θ to form the star {n/s}.
- For each petal ring k = 1..s, extend adjacent star edges outward and intersect them again. This produces kite and hexagon petals, and the outer boundary becomes a 2n-gon closed by a circle or polygon.
- Composition is the classic shamsa medallion: rosette, 0–3 concentric bands from the band library (8-star chain, arch row, scallop, plain), then corner quarter-rosettes inside a circle, square or octagon frame.

Parameters: n ∈ {6, 8, 10, 12, 16}; θ from a per-n compatible set (8: 45°, 56.25°, 67.5°; 12: 30°, 45°, 60°…); s ∈ {1, 2, 3}; bands 0–3; corners on/off; frame.
Launch split: E 2, M 3, H 4, X 3.

**G02 `pic-tiling` (Hankin method).**

1. Tilings, each as a translation unit (fundamental-cell polygons plus t₁, t₂): 4.4.4.4, 6.6.6, 3.6.3.6, 4.8.8, 3.12.12, 4.6.12, 3.4.6.4, 3.3.4.3.4, plus one 2-uniform tiling. Tile across the frame's bounding box plus one cell.
2. For each edge with midpoint m and direction u, place contact points at m ± δu. δ = 0 gives a single strand; δ = 0.15·edge gives two-point patterns.
3. Rays leave each contact point at ±θ into the polygon. Pair the right ray of edge i with the left ray of edge i+1 and intersect them to get segment [contact, p]. If they don't meet inside the polygon, fall back to Kaplan's "infer" rule: take the nearest valid ray intersection, otherwise clip at the center.
4. Snap endpoints to 0.01 u and remove collinear duplicates shared across neighboring tiles.
5. Clip the open segments to the frame (Clipper open-path `Intersect`). Frames: rectangle, circle, mihrab arch, 8-point star, lantern silhouette.
6. Style: single line, or double-line strapwork (offset ±b, so the strap becomes regions).

Cells across the frame width set difficulty: E 2–3, M 4–5, H 6–8, X 9–14.
About 9 tilings × ~3 θ × 2 δ × 2 styles gives roughly 108 base motifs.
Launch split: E 3, M 5, H 4, X 4.

**G03 `decagonal`.**

- Build a Penrose P3 rhomb patch by deflating Robinson triangles (4–6 iterations), with a seed-chosen sun or star center and crop. Apply Hankin at θ = 54° to get decagonal stars and bowties.
- Alternative mode: the five girih tiles (decagon, pentagon, elongated hexagon, bowtie, rhombus) with their canonical strapwork, assembled from six hand-coded periodic patch definitions in `data/girih-patches.json`.

Launch split: H 3, X 3.

**G04 `zellige`.**

- Take faces from G02 (4.8.8 at θ = 67.5° gives khatam stars and crosses) or G01 at n = 16.
- Shrink each face by grout g/2 with a negative offset and mitre joins (g = 1.6–2.4 mm), and round corners at r = 0.6 mm. Each tile becomes its own chunky closed piece; the grout network is the background region.
- Optional bejmat border of rectangular bricks.

Grouting makes even dense patterns child-friendly. Launch split: E 3, M 3, H 2.

**G05 `interlace`.**

- Input is the G01–G03 line graph. Build strands that pass straight through each degree-4 crossing.
- Assign alternating over/under along each strand. This is always consistent for degree-4 diagrams (checkerboard argument).
- Ribbon = centerline ± band half-width. At each under-crossing, cut the under-ribbon's edges inside the over-band plus a gap.
- Honest limit: graphs with vertices of degree 6 or more (some rosettes) are rejected.

Launch split: H 3, X 3.

### 3.3 Radial, floral and seasonal (G06–G08)

**G06 `mandala`.**

- **Ring stack**: radius 340 u split into k rings (B 3, E 3–4, M 5–7, H 8–11, X 12–16) by a Dirichlet-style partition with a per-level minimum ring width. Base symmetry n ∈ {6, 8, 10, 12, 16}; ring orders follow multiple chains (8 → 16 → 16 → 32) so motif aspect (arc length / ring width) stays in [0.5, 1.6].
- **Motif library**, functions in polar space (r₀, r₁, Δφ) mapped with arc-aware curvature: petal, double petal, lotus, ogee arch, horseshoe arch, scallop, leaf with midrib, crescent, 8-point star, dot ring (only when the dots pass min-area), zigzag, chevron, rope twist, ladder, checker, tulip, mini-rosette (G01).
- **Ramadan pack** adds lantern and onion-dome motifs with an 8-point star center.
- **Grammar**: no identical motif in adjacent rings; heavy and light rings alternate; centerpiece comes from G01 or a flower; outer edge is a ring line or scalloped silhouette, optionally with square-corner fills for a full-page look.
- Seeds are pre-ranked by score: region-area variance, ink coverage and balance.

Launch: 24 general (B 4, E 6, M 6, H 5, X 3), 8 Ramadan, 6 Eid.

**G07 `iznik`.**

- Parametric motifs: tulip (center petal plus two curled side petals; tip-curl, width and bulb ratio), carnation (fan of 5–9 serrated petals plus calyx), hyacinth (bell florets on a stem), 8-petal rosette, saz leaf (S-curved serrated lancet with an inner vein band).
- Compositions: vase arrangement (bilateral symmetry, vase from G12), 4-fold square tile with border, border strips.
- Honest quality: stylized Ottoman folk art is good; realistic botanical drawing is not possible.

Launch split: E 4, M 5, H 3.

**G08 `snowflake`.**

- Grow one 30° wedge as a branching tree: main arm plus k side branches at 60° with decaying length. Tips come from {hexagonal plate, dendrite, needle, fern}.
- Thicken the skeleton into capsules (inflate + union), mirror and rotate ×6, union, then use the outline as ink. Inner hexagons on plates add regions.
- This is a neutral winter topic (no Christmas) and is very high quality in code.

Launch split: B 3, E 4, M 3, H 2.

### 3.4 Parametric objects (G09–G12) and where quality stops

**G09 `fanoos`.**

The body is a frontal orthographic view of an n-sided prism (n ∈ {4, 6, 8}). Visible panel widths follow cos of each panel normal; for a hexagon that is 0.5w, w, 0.5w.

| Part | Options |
|---|---|
| Cap | onion (ogee Bézier), hemisphere, pyramid, stepped crown with merlons, spire |
| Body | straight prism, frustum, globe, tall cylinder |
| Base | inverted dome, stepped plinth, cone with drop finial |
| Window arch | pointed, ogee, horseshoe, multifoil, round, keyhole |
| Window fill | empty, radial bars, mini G02 pattern, star cut-outs, circle grid |
| Other | ribs as double lines (strap regions); hook = ring + 2–4 chain links; optional candle with teardrop flame |

Scenes: a hanging trio (three seeds at staggered heights on a scalloped string, with stars), a lantern hanging from the crescent tip, and a lantern on a table with a dates bowl.
Quality: **high**. Lanterns are symmetric and geometric, which suits code.
Launch: 14 singles (B 3, E 4, M 4, H 3) and 6 scenes.

**G10 `crescent-sky`.**

- Crescent = `Difference(circle r, circle k·r offset d)` with k 0.8–0.95.
- Stars: 5-, 6- and 8-point star polygons, rounded with an offset for the bold level, plus 4-point sparkles.
- Clouds: union of 3–6 circles on a flat baseline.
- Compositions: crescent with hanging stars, crescent cradling a lantern, crescent over a mosque skyline strip (G11), and an arched window onto a starry night.

Launch: 8 Ramadan and 3 Eid.

**G11 `mosque` composer.** A style profile (Ottoman, Mughal, Persian, Maghrebi, Simple-bold) keeps every element choice consistent.

| Element | Options |
|---|---|
| Domes | hemisphere; Mughal bulbous with lotus base; Persian ogee; Ottoman shallow dome with windowed drum and buttress turrets; Maghrebi pyramidal tiled roof |
| Ottoman cascade | central dome + 2 semi-domes + 4 small domes |
| Minarets | Ottoman pencil (1–3 şerefe balconies, conical spire); Mamluk stacked tiers with bulb; Maghrebi square tower with arch panels and jamour finial; Mughal octagonal with chhatri; Persian cylinder with stepped-corbel balcony |
| Body | arcades (pointed, horseshoe, multifoil), pishtaq or iwan portal, window rows, door, steps, merlon parapet, crescent alem finials |
| Layout | bilateral symmetry, minaret count {0, 1, 2, 4} by style, ground line, optional date palms and stars |

Element order also drives G20 how-to-draw sheets.
**Honest limit:** the output is a convincing stylized generic mosque. It is not a recognizable landmark, and at hard/expert levels it can look clip-arty. We mitigate that with a flat architectural-elevation look plus G02 pattern fills on façades (an adult "patterned mosque"). We never name a landmark for a generated mosque; landmarks go to the art backlog.
Launch: 10 in the Ramadan hub, 12 in the mosque hub.

**G12 `objects`.** About 20 families, each 40–120 lines of code, built from revolve-profile, oblique-box and arc-length-sampling helpers.

| Object | Construction | Quality | Launch |
|---|---|---|---|
| Prayer mat (sajjada) | rectangle, mihrab arch (pointed/ogee/multifoil), G02 border bands, field pattern, hanging-lamp motif in the arch, wavy fringe band (not hairlines) | High | 10 |
| Tasbih | 33 beads arc-length sampled on a teardrop loop, imam bead and spacers, tassel as a fan of 7–11 lens strands | High | 4 |
| Mashrabiya window | arch frame + lattice (G02, or bead-and-spindle grid) | High | 4 |
| Iznik vase / ewer | revolve profile + G07 decoration | Med-high | 2 |
| Qibla compass, honey jar + honeycomb | circles and needle with Kaaba glyph; jar profile + hex grid | High | 1 + 1 |
| Dates bowl, iftar plate + glass, dallah | ellipse packing; revolve profiles; crescent-beak spout | High / Med-high | 2 + 1 + 2 |
| Date palm | curved trunk of chevron segments, fronds as spine plus tapering lens leaflets, date clusters | Medium (works best as a scene element) | 1 scene |
| Gift box, balloons | oblique box, ribbon cross, Bézier bow, patterned wrap; balloon bunches with strings | High | 4 + 3 |
| Kaaba | oblique two-face cube, plain kiswah with a **geometric** hizam band (no fake script), door panels, mataf arcs; `sensitivity: sacred-place` | High | Wave 2 (4) |
| A–Z extras | arch, fig, olive branch, umbrella, yarn ball, rainbow, date box | Easy-level OK | via G16 |
| **Camel, sheep, any animal** | **Not at launch.** Procedural animals look amateur. Backlog: designer silhouettes, then G19 | Low | 0 |

### 3.5 Lettering, Arabic and numerals (G13–G16)

**Fonts.** All are OFL and committed under `assets/fonts/` with their `OFL.txt`; the font file hash is pinned in stroke data.

| Font | Use |
|---|---|
| Noto Naskh Arabic Bold | Teaching glyphs, words, numerals. Naskh is the school standard. |
| Reem Kufi Bold | Decorative Arabic titles, color-by-letter codes |
| Aref Ruqaa Bold | Greeting calligraphy: عيد مبارك, رمضان كريم |
| Andika Bold | All Latin worksheet text (designed for literacy; single-storey a and g) |
| Fredoka SemiBold | Latin bubble lettering |
| Relief SingleLine | Latin centerline tracing in Wave 2 (verify OFL at vendoring) |

**Glyph extraction (`core/text.ts`).**

- `hb.createFace(hb.createBlob(bytes))`, then `createFont`, then `buffer.addText(s)` and `guessSegmentProperties()` (RTL, Arab script), then `hb.shape(font, buf)` and `buf.json()` for glyph ids, advances and offsets.
- `font.glyphToPath(gid)` returns path data in font units (y-up). Scale by size/upem, flip y and place by the RTL advances.
- `opentype.js@2.0.0` is used only for metadata. Its Arabic GSUB/GPOS coverage (init, medi, fina, rlig, mark positioning) is not reliable enough for Naskh with tashkeel, which is why HarfBuzz is the shaper.

**Positional forms.**

- Shape the bare letter for isolated, `letter + U+200D` for initial, `U+200D + letter + U+200D` for medial, and `U+200D + letter` for final, then drop the ZWJ glyph.
- The six non-connectors (ا د ذ ر ز و) get two distinct forms and the caption "doesn't join the next letter".
- Example words are vocalized, verified by an Arabic teacher and stored in `data/arabic/letters.json`. The target letter is located through HarfBuzz cluster mapping and drawn hollow so the child colors it, while the rest of the word is 35 % gray.
- QA rejects any example where the target maps to a ligature glyph, for example لا.

**G14 `arabic-letters`**, 85 designs at `/arabic-alphabet/{letter}/` plus the hub:

- **Coloring (28, Easy).** Glyph outline, then per-contour `InflatePaths(+14 u)` with body and dots inflated separately. Dots shrink until clearance is at least 2× the stroke width so they don't merge. The outline becomes ink. Each page also has one of four rotating frames (8-star chain, mihrab arch, lantern corners, scallop), the letter name in Reem Kufi, and the transliteration and English name in Andika.
- **Tracing (28).** RTL layout:
  - A model letter with numbered green start dots and arrowheads at 20 % along each stroke tangent.
  - A row of 3 large dotted letters: centerline `stroke-dasharray="0 9"`, round caps, about 3.2 mm pitch.
  - A row of 5 medium letters, then a row of 6 ghost letters (15 % gray fill).
  - Two empty 3-line Arabic guide rows: ascender line, solid baseline, dashed descender.
- **Letter forms (28).** Four-column RTL table (Isolated | Initial | Medial | Final), each with a dashed contour and ghost fill, plus three example words with the hollow target letter.
- **Chart (1).** All 28 letters in a 7×4 grid.
- **Stroke data.** `scripts/arabic/skeletonize.ts`:
  1. Render the glyph at 1024 px (resvg).
  2. Binarize, then Zhang–Suen thinning.
  3. Extract the graph and prune spurs under 6 % of glyph height.
  4. Simplify with RDP and fit cubics.
  5. Draft the order: main body right-to-left and top-to-bottom, dots last.
  6. A person corrects the result in Inkscape and saves it as `data/arabic/strokes/{letter}.json` (`{font, fontSha, form, strokes:[{order, d, kind:'body'|'dot'}]}`).

  Budget: 28 letters × about 10 min, plus 10 digits.

**G15 `numerals`.**

- Eastern Arabic ٠–٩ (U+0660–0669): 10 bubble-numeral coloring pages, each with N lanterns to count and the number word (واحد…), plus 10 tracing pages and 1 chart.
- Western 1–20 count-and-color: N objects from G12 placed by Poisson-disk packing, with the number word.
- **Phase 2:** Urdu and Persian need Extended Arabic-Indic digits ۰–۹ (U+06F0–06F9; 4, 5 and 6 differ), and Bengali needs ০–৯. Script is a generator parameter.

**G16 `latin-abc`.** A Fredoka bubble capital (inflated and unioned, with an optional offset shadow region), the object, and the line "M is for Mosque". The A–Z objects, all drawable by G09–G12:

| A–I | J–R | S–Z |
|---|---|---|
| Arch | Jug (ewer) | Star |
| Balloon | Kaaba | Tasbih |
| Crescent | Lantern | Umbrella |
| Dates | Mosque | Vase |
| Eid (bunting) | Night sky | Window (mashrabiya) |
| Fig | Olive | "X is in boX" (date box) |
| Gift | Prayer mat | Yarn |
| Honey | Qibla compass | Zellige |
| Iftar | Rainbow | |

**G13 `lettering`.**

- English: Fredoka bubble words with a union outline, separate letter regions and a drop-shadow region.
- Arabic strings: عيد مبارك, عيد سعيد, رمضان كريم, رمضان مبارك, عيد أضحى مبارك. Set in Aref Ruqaa or Reem Kufi with a small inflate; dots stay separate.
- Every string lives in `data/strings/ar.json` with a native-reader sign-off and a sha. QA fails on any Arabic string that is not in the allowlist, or on any entry flagged `containsDivineName: true` used on a coloring page.

### 3.6 Transforms (G18–G20)

**G18 `color-by-code`**, applied to any approved design with 12–120 regions:

- **Colors.** Map symmetry classes to a palette of k colors (E 4–5, M 6–8, H 9–12). Color the class adjacency graph with DSatur (deterministic). The lightest color goes to the background and calm colors to large areas.
- **Labels.** Placed at the polylabel pole, font size clamp(0.9 × pole distance, 9 u, 22 u). 9 u is about 2.3 mm, roughly 6.5 pt. Regions with a pole distance under 6 u disqualify the base design. Labels are outlined into `labels` in #555.
- **Code types:**
  - number
  - Eastern Arabic numeral
  - **Arabic letter**, a differentiator that teaches letters
  - **sum** ("3+2"), for ages 7–9
- **Output.** A legend row (swatch, code, English color name, plus the Arabic color name on letter variants; names from `data/palettes.json`). The solution is the colored example.

**G19 `pattern-in-silhouette`.** `Intersect(G02/G06/G07 pattern, mask)` plus a thick mask outline, with an optional sparse pattern outside. Masks: crescent, lantern, 8-star, Arabic letter (Wave 2: 28 patterned letters), mosque, and later the designers' animal silhouettes.

**G20 `how-to-draw`.** Every generator tags its ink with a `step`. The sheet is a 2×3 or 3×3 grid: earlier steps in #bbb, the new step in black, captions from the step labels, and a large final drawing. This serves the Bangladesh, Pakistan and India "drawing" intent ("mosque drawing easy").

### 3.7 Printables and puzzles (G21–G26)

**G21 `calendar-tracker`.** Undated with a "start date" slot. The header reads "Ramadan 1448 AH · 2027" from a build-time `seasonYear`, so the title and header roll forward each year while the URL stays the same. All calendars are region-based, so the online app doubles as a daily "color today's lantern" tracker (local storage, no account), which brings people back each day.

| # | Calendar |
|---|---|
| 1 | 30-lantern grid |
| 2 | Path-to-Eid board (30 stones winding to a mosque) |
| 3 | Moon-phase calendar: day-d shape between the limb semicircle and a terminator semi-ellipse with semi-minor R·\|cos(2πd/29.53)\|. Labeled illustrative, not astronomical. |
| 4 | 30-window mosque |
| 5 | 30-petal rosette (one petal per day) |
| 6 | 30-star sky |
| 7 | Paper countdown chain |
| 8 | "Last 10 Nights" (10 lanterns) |

Trackers (8): good deeds (grid; jar with 30 stars), fasting (30 crescents; suhoor/iftar chart), Qur'an 30-juz (grid; segmented path), salah (5 × 30 grid with Fajr–Isha in EN and AR; daily mini-sheet).
Also: 2 journal/goal sheets and 1 "Ramadan Star" certificate.

**G22 `paper-goods`.** Sheet layout engine with dashed cut lines and dash-dot fold lines in `guides`.

| Item | Spec | Count |
|---|---|---|
| Half-fold landscape cards | Outside (back and front) on one side, so no duplex needed; optional page 2 for the inside: To/From and message lines | 8 Eid + 4 Ramadan |
| Gift-tag sheets | 6 per sheet: circle, scalloped, hole-tag, lantern, crescent, 8-star | 4 sheets |
| Bunting sets | Multi-page PDFs, 2 pennants per page (triangle, swallowtail, scallop, lantern): EID MUBARAK (12 pennants), RAMADAN KAREEM (15), and an Arabic set of isolated letters (Arabic reviewer sign-off) | 3 sets |
| Eidi money envelopes | Nets that fit notes up to 165×80 mm (USD, BDT, PKR, INR, IDR) | 4 |
| Door hangers | Die-cut shape | 3 |
| Crafts | Classic slit paper lantern; 3D hexagonal fanoos net with glue tabs and window panels (unique to us) | 2 |

**G23 `word-search`.**

- Backtracking placement, longest word first, maximizing overlaps on hard.
- Directions: easy E/S; medium adds SE/NE; hard uses all 8 including backwards.
- Grids: 8×8, 10×10, 13×13 to 15×15.
- Filler letters follow the theme's letter frequencies. An 8-direction scan runs against a profanity and offensive-term blocklist, and every list word must appear exactly once.
- Answer key on page 2.
- Themes from `data/wordlists/*.json` with transliterations from `data/glossary.json` (Suhoor, Iftar, Tarawih…): Ramadan ×2, Eid ×1, 5 Pillars, Islamic months, Hajj, Animals of the Qur'an (text only).

**G24 `maze`.**

- Recursive backtracker (long corridors) for easy; growing-tree with a Wilson's mix for hard; theta mazes on polar grids.
- Masked mazes: rasterize a silhouette (crescent, lantern, mosque, 8-star) onto the grid, keep cells at least 50 % inside, and keep the largest component.
- Corridors ≥ 6, 4 and 3 mm by level.
- The solution path must be at least 1.5× the Manhattan start–end distance. BFS solution on page 2.
- Start and end are objects only ("Guide the lantern to the mosque").

**G25 `dot-to-dot`.**

- Sample the outline of a G10–G12 object: all corners with turning angle > 25°, plus arc-length samples. N = E 10–20, M 25–40, H 50–80.
- Secondary contours are pre-drawn so the result is ready to color.
- Numbers sit 9 u outward along the normal, with collision sliding. Dots have r = 3–4 u.

**G26 `diy-template`.** Blank lantern (2), blank prayer mat (1), blank tiles with 8-fold dashed guides (2), blank mosque (1), blank Eid card (1), mandala guide grid (1), and two compass-and-ruler tutorials ("draw an 8-point star", "draw a 6-fold rosette") rendered by the G20 renderer.

---

## 4. Output pipeline per design

### 4.1 Repository layout

```
generators/core/{rng,geom,bezier,clipper,regions,svg,text,difficulty,palette,layout,qa,phash,types}.ts
generators/{geo,mandala,iznik,snowflake,objects,mosque,letters,printables,puzzles,transforms}/…
generators/registry.ts
data/arabic/{letters.json,strokes/*.json}  data/strings/{en,ar}.json  data/wordlists/*.json
data/palettes.json  data/glossary.json  data/girih-patches.json
assets/fonts/*.ttf + OFL.txt
manifests/{hub}.yaml                 # curated: slug, generator@major, seed, difficulty, param overrides, title, alsoIn
art/{hub}/{slug}.svg                 # APPROVED masters (committed)
art/.snapshots.json                  # sha256, pHash, generator version
src/content/designs/{hub}/{slug}.json
src/content/bundles/{id}.yaml
scripts/{gen-explore,gen-build,derive-assets,build-bundles,qa,review}.ts  scripts/intake/*.ts
public/assets/…                      # gitignored, built + CI-cached
```

```yaml
# manifests/ramadan-coloring-pages.yaml
- slug: hexagonal-lantern-star-windows
  generator: fanoos@1
  seed: r27-0413
  difficulty: medium
  params: { body: hex-prism, cap: onion, windows: { arch: pointed, fill: star-lattice } }
  title: Hexagonal Ramadan Lantern with Star Windows
  alsoIn: [islamic-coloring-pages]
```

### 4.2 Stages

| Stage | Tool | Output |
|---|---|---|
| 1. Explore | `pnpm gen explore fanoos --difficulty easy --n 96` | `.explore/fanoos-easy.html` contact sheet, ranked by score. Curator copies seeds into the manifest. |
| 2. Build masters | `pnpm gen build [--hub]` | `art/{hub}/{slug}.svg` (all layers); answer-key drawings for puzzles |
| 3. Auto-QA | `scripts/qa.ts` | `qa-report.json`; non-zero exit fails CI (§4.6) |
| 4. Optimize | `svgo@4.1.0`: multipass, floatPrecision 2. **`mergePaths` off** (it would destroy regions), `cleanupIds` off, `removeTitle` off, `collapseGroups` off, keep `data-*` | `/assets/{hub}/{slug}/{slug}-coloring-page.svg` (served to the online app) |
| 5. Rasterize | `@resvg/resvg-js@2.6.2` at 1600 px (deterministic; no fonts needed because everything is outlined) | in memory |
| 6. Encode | `sharp@0.35.5`. Line art: WebP near-lossless plus AVIF q60 4:4:4 at 400 and 800 px. Colored example (auto palette): WebP q80 at 800. Pin: 1000×1500 JPEG q82 (colored + line art + title band + "Free PDF" badge). OG: 1200×630. | `{slug}-coloring-page-{400,800}.{avif,webp}`, `{slug}-colored-example-800.webp`, `{slug}-pin.jpg`, `{slug}-og.jpg` |
| 7. PDF | `pdf-lib@1.17.1` | `{slug}-coloring-page-letter.pdf`, `{slug}-coloring-page-a4.pdf` |
| 8. Entry | write JSON | `src/content/designs/{hub}/{slug}.json` |
| 9. Snapshot | `sharp-phash@2.2.0`, sha256 | `art/.snapshots.json` |

- The cache key is sha256(master + pipelineVersion + stage config). A rebuild of 498 designs is about 10 minutes cold and seconds when warm.
- Astro never processes these images. Pages use pre-sized `<picture>` sources, with `ASSET_BASE` configurable so assets can move to R2.
- File suffixes by `kind`: `-coloring-page`, `-tracing-worksheet`, `-word-search`, `-maze`, `-calendar`, and so on.

### 4.3 Why pdf-lib

- Our SVG dialect is constrained: absolute M/L/C/Z paths only, with every glyph outlined. So `page.drawSvgPath()` covers 100 % of it.
- We pre-transform coordinates into PDF points (× 0.72, then translate to the centered art box) and call `drawSvgPath(d, {x, y, scale: 1, borderWidth: w_pt, borderColor: rgb(0, 0, 0), borderLineCap: LineCapStyle.Round})`. Paths are concatenated per stroke width.
- Round joins come from `page.pushOperators(pushGraphicsState(), setLineJoin(LineJoinStyle.Round))` before drawing and `popGraphicsState()` after. Tracing dots use `borderDashArray: [0, 9.2]`.
- Footer in `StandardFonts.Helvetica` (not embedded, ASCII only): "kidscolorit.com/{path} · {title} · Free for home & classroom use".
- `PDFDocument.create({ updateMetadata: false })`, then set title, author, subject, keywords and creator, with creation and modification dates fixed to `published`. PDFs are byte-stable, so they diff and cache cleanly.
- Typical size is 30–150 KB; the cap is 400 KB.
- The same library does bundle merges (`copyPages`), and later in-browser personalization (a child's name on a certificate or card) where the name never leaves the device.
- Rejected: `svg-to-pdfkit@0.1.8` is unmaintained since 2022 and only partially supports SVG, and pdfkit is heavier and Node-centric.

### 4.4 Content entry

Schema in `src/content.config.ts`: `defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/designs' }), schema })`, with `z` from `astro/zod`.

```json
{
  "id": "ramadan-coloring-pages/hexagonal-lantern-star-windows",
  "slug": "hexagonal-lantern-star-windows",
  "hub": "ramadan-coloring-pages",
  "alsoIn": ["islamic-coloring-pages"],
  "kind": "coloring",
  "onlineColoring": true,
  "title": "Hexagonal Ramadan Lantern with Star Windows",
  "altText": "Ramadan lantern coloring page: six-sided fanoos with pointed-arch windows of eight-point stars and an onion-dome cap",
  "blurb": "Three window panels, each filled with eight-point stars, sit under an onion dome and a chain-link hook.",
  "tip": "Try gold for the frame and deep blue for the star windows.",
  "tags": ["lantern", "fanoos", "ramadan", "star"],
  "difficulty": "medium",
  "ageRange": [6, 9],
  "faces": "none",
  "sensitivity": "standard",
  "orientation": "portrait",
  "pages": 1,
  "regionCount": 84,
  "minRegionMm2": 22.4,
  "source": "generated",
  "generator": { "id": "fanoos", "version": "1.2.0", "seed": "r27-0413", "params": { "body": "hex-prism", "cap": "onion" } },
  "palette": { "id": "ramadan-night", "colors": ["#1d2b53", "#f2b33d", "#1f8a8a", "#7b3f73", "#f4ead5"] },
  "arabic": { "word": "فانوس", "translit": "fānūs", "meaning": "lantern" },
  "keywords": { "primary": "ramadan lantern coloring page", "secondary": ["fanoos coloring page", "lantern coloring page"] },
  "season": { "event": "ramadan", "evergreen": true },
  "published": "2026-11-10", "updated": "2026-11-10",
  "review": { "status": "approved", "by": "QA-SR", "date": "2026-11-05", "islamic": false },
  "phash": "c3a1f0e19b7d2a44",
  "translationKey": "ramadan-coloring-pages/hexagonal-lantern-star-windows"
}
```

- `faces` is one of `none | faceless-people | animals`.
- `sensitivity` is one of `standard | sacred-place | text-review`.
- `source` is one of `generated | illustrated | hybrid`.
- File URLs are derived by convention, not stored.
- Illustrated entries add `provenance: {tool, model, briefId, editor, date}`.

### 4.5 URL, title and alt formulas

- **Design page (canonical):** `/{hub}/{slug}/`. Cross-listed designs keep the primary-hub canonical. Slugs come from `describe()` features, never seeds or years. On collision, add a feature word; `-2` is the last resort.
- **Grouped pages:**
  - Arabic letters: `/arabic-alphabet/{letter}/`, three designs each. Slugs follow `letters.json`: `alif, ba, ta, tha, jeem, haa (ح), khaa, dal, dhal, ra, zay, seen, sheen, sad, dad, taa (ط), dhaa (ظ), ain, ghain, fa, qaf, kaf, lam, meem, noon, ha (ه), waw, ya`.
  - Calendars: `/ramadan-calendar-for-kids/`.
  - Trackers: `/ramadan-good-deeds-tracker/`, `/ramadan-fasting-tracker/`, `/quran-reading-tracker/`, `/salah-tracker/`.
  - Puzzles: `/ramadan-word-search/`, `/ramadan-mazes/`, `/ramadan-dot-to-dot/`.
  - Paper goods: `/eid-cards/`, `/eid-gift-tags/`, `/eid-bunting/`, `/eid-money-envelopes/`.
  - Individual pages: `/alphabet-coloring-pages/letter-m/`, `/number-coloring-pages/number-5/`, `/how-to-draw/{slug}/`.
- **Titles:**
  - Hub: `{count} {Topic} Coloring Pages ({seasonYear}) – Free Printable PDFs`, with the year only on seasonal hubs and `count` computed at build.
  - Design: `{title} Coloring Page (Free PDF)`. `title` is at most 42 characters.
  - Letter: `Arabic Letter {Name} ({char}): Coloring & Tracing Worksheets (Free PDF)`.
- **Meta description:** `{describe() sentence}. Free printable PDF (Letter & A4) or color it online — no signup. {Level} · ages {a}–{b}.` (≤ 155 characters).
- **Alt text:** `{Subject} coloring page: {2–3 concrete visual features}` (60–160 characters).
- **`ImageObject`** per design: `contentUrl` (800 WebP), `thumbnailUrl`, `name`, `description`, `license`, `acquireLicensePage`, `creditText`, `creator` (Organization), `copyrightNotice`.

### 4.6 QA gate (`scripts/qa.ts`; blocks CI)

| Check | Rule |
|---|---|
| Schema | zod valid; slug and title unique; alt 60–160 characters; blurb ≥ 1 sentence and not duplicated anywhere |
| Stroke | every `line` ink ≥ level width and ≥ **1.5 pt** at print scale; guides ≥ 0.75 pt |
| Region count | within level bounds (§1.2); online-colorable designs ≤ 1,500 regions |
| Region size | every region ≥ level min area **and** min pole distance; absorbed artifacts ≤ 0.5 % and each < 1 mm² |
| Near-miss leaks | ink endpoints within 0.6 mm of other ink but not touching → snap or fail (catches visually "almost closed" shapes) |
| Ink coverage | ≤ level cap (saves printer ink, avoids muddy pages) |
| Margins | all ink within the artboard minus 2 mm; PDF ink ≥ 0.5 in from the paper edge |
| Text | no `<text>` elements; Arabic only from allowlisted, signed-off strings; no `containsDivineName` strings on `kind: coloring` / `color-by-code` |
| Sensitivity | `sacred-place` or `text-review` requires `review.islamic: true` |
| Text size | instructions ≥ 11 pt; CBN codes ≥ 6.5 pt; dot-to-dot numbers ≥ 8 pt; tracing dot pitch 3–3.5 mm |
| Distinctness | pHash Hamming ≥ 12 vs the same generator and ≥ 8 site-wide; parameter distance > 0 |
| File size | master SVG: bold/easy ≤ 150 KB, medium ≤ 250 KB, hard ≤ 400 KB, expert ≤ 700 KB. Single PDF ≤ 400 KB. 800 WebP ≤ 90 KB. 400 WebP ≤ 35 KB. Bundle ≤ 15 MB (Cloudflare per-file limit is 25 MiB). |
| PDF | exact media boxes (612×792 and 595.28×841.89); re-parses with pdf-lib; page count matches `pages` |
| Regression | 400 px pixelmatch vs the approved snapshot = 0 changed pixels, or re-approval is required |

**Human pass (`pnpm review`).** A keyboard-driven contact sheet that writes `review.status`; about 1 minute per design, roughly 8 hours for 498. Then physical test prints, one per generator per level, on Letter and A4 with both inkjet and laser printers. A crayon test with a 3–5-year-old for the bold and easy levels.

---

## 5. Launch inventory (exact)

**Wave 1A: publish Nov 10, 2026 (Ramadan-critical, early enough to be indexed by mid-December). 205 designs.**

| Hub (URL) | Designs | Composition | B/E/M/H/X |
|---|---|---|---|
| `/ramadan-coloring-pages/` | **60** | lanterns 14 · lantern scenes 6 · crescent & stars 8 · mosque scenes 10 · Ramadan Kareem/Mubarak lettering 6 · Ramadan mandalas 8 · iftar objects (dates bowl 2, dallah 2, iftar plate 1, palm scene 1) 6 · geometric crescent/lantern (G19) 2 | 10/18/18/10/4 |
| `/ramadan-color-by-number/` | **16** | color-by-number 12 (lanterns 4, mosques 2, mandalas 3, crescents 3) · color-by-Arabic-letter 4 | 0/6/7/3/0 |
| `/ramadan-activities-for-kids/` + sub-hubs | **44** | calendars 8 · trackers 8 · journal/goals 2 · certificate 1 · door hangers 3 · paper-lantern crafts 2 · Ramadan Mubarak cards 4 · word searches 6 · mazes 6 · dot-to-dots 4 | — |
| `/arabic-alphabet/` (29 URLs) | **85** | 28 bubble-letter coloring · 28 tracing · 28 letter-forms · 1 chart | — |

**Wave 1B: Nov 24, 2026. 151 designs.**

| Hub | Designs | Composition |
|---|---|---|
| `/eid-coloring-pages/` | **24** | Eid Mubarak lettering 8 · gift boxes 4 · balloon & bunting scenes 3 · crescent/lantern Eid scenes 3 · Eid mandalas 6 |
| `/eid-cards/`, `/eid-gift-tags/`, `/eid-bunting/`, `/eid-money-envelopes/` | **24** | cards 8 · tag sheets 4 · bunting sets 3 · Eidi envelopes 4 · word searches 3 · mazes 2 |
| `/arabic-numbers/` | **21** | 10 coloring · 10 tracing · 1 chart |
| `/islamic-geometric-patterns/` | **48** | rosettes 12 · tilings 16 · decagonal 6 · zellige 8 · interlace 6 (E 8 / M 11 / H 15 / X 14) |
| `/mosque-coloring-pages/` | **12** | Ottoman 3 · Mughal 2 · Persian 2 · Maghrebi 2 · simple-bold 3 (plus 10 cross-listed from Ramadan, 22 shown) |
| `/islamic-coloring-pages/` (umbrella; aggregates all Islamic designs) | **22** | prayer mats 10 · tasbih 4 · mashrabiya 4 · Iznik vase/ewer 2 · qibla compass 1 · honey jar 1 |

**Wave 1C: Dec 8, 2026 (evergreen; winter peak). 142 designs.**

| Hub | Designs |
|---|---|
| `/mandala-coloring-pages/` | 24 |
| `/snowflake-coloring-pages/` (+ `/winter-coloring-pages/` aggregator) | 12 |
| `/flower-coloring-pages/` (Iznik) | 12 |
| `/alphabet-coloring-pages/` (A–Z) | 26 |
| `/number-coloring-pages/` (1–20) | 20 |
| `/shapes-coloring-pages/` | 10 |
| `/color-by-number/` (6 geometric/mandala, 2 snowflake, 4 color-by-sum; plus 16 Ramadan cross-listed) | 12 |
| `/how-to-draw/` | 8 |
| `/design-your-own/` | 10 |
| `/word-search/`, `/mazes/`, `/dot-to-dot/` aggregators (word search 4, maze 2, dot-to-dot 2) | 8 |

**Total: 498 designs, which is 996 single PDFs plus 18 bundle PDFs, about 5.5K static files and about 375 indexable URLs.**

**Cut lines if we slip.** The hard minimum by Nov 24 is Wave 1A plus the Eid coloring pages (229). Everything else may move up to two weeks.

**Wave 2: Jan 15, 2027 (generator-only, about 91 designs).**

- Eid al-Adha starter: Kaaba 4, Adha lettering 3, Hajj-themed geometric/mandala 3, Adha cards 4.
- 28 patterned Arabic letters (G19).
- 3 Arabic-script word searches.
- 26 English letter tracing sheets (Relief SingleLine).
- 20 number tracing sheets.
- 3 extra Ramadan calendars.

Then the Indonesian twins with a *lomba mewarnai* A4 contest frame (Nama / Kelas / Sekolah box) and translated word lists.

---

## 6. Content that code cannot do well: the art brief backlog

### 6.1 Why these are not generator-friendly

- **People**: wudu and salah need correct postures, faceless figures and modest dress.
- **Animals**: anatomy needs a person to check it.
- **Named landmarks**: architectural accuracy needs a person working from references.
- **Food realism and multicultural scenes**: need illustration skill.

### 6.2 Prioritized backlog

Priority = keyword value × season urgency × SERP gap. Effort assumes AI-assisted pieces take about 0.5 h each, designer pieces 1.5 h, and landmarks 4 h.

| P | Set | Pieces | `faces` | Keyword (est.) | Live by | Method |
|---|---|---|---|---|---|---|
| P0-1 | **Wudu steps**: 10 single-step hand/feet close-ups (faceless by design, gender-neutral) + boy and girl sequence sheets + 2 posters | 16 | faceless-people | wudu steps for kids 0.5–1.5K; spam-flooded SERP | Jan 10 | Designer vector + Islamic review |
| P0-2 | **Salah positions**: 8 positions × boy/girl + 2 sequence sheets, madhab-neutral | 18 | faceless-people | salah steps printable 0.5–1.5K | Jan 10 | Designer vector + Islamic review |
| P0-3 | Ramadan family scenes: iftar table, suhoor, taraweeh rows from behind, food-box charity, Qur'an reading from behind, decorating, rooftop moon sighting | 12 | faceless-people | ramadan coloring pages 8–15K / 50–90K | Jan 10 | AI line art → vectorize → designer cleanup |
| P0-4 | **Mosques of the world A**: Masjid al-Haram, Masjid an-Nabawi, Dome of the Rock, Al-Aqsa Qibli Mosque (labeled distinctly), Blue Mosque, Sheikh Zayed, Hassan II, Faisal, Badshahi, Istiqlal, Baitul Mukarram, Sixty Dome | 12 | none | mosque coloring 1–2.5K + landmark long tail (TR/PK/ID/BD) | Jan 20 | **Designer only**, from ≥ 3 references (AI gets architecture wrong) |
| P0-5 | Foods of Qur'an/Sunnah: dates branch, pomegranate, fig, olive, grapes, honey, milk jug, pumpkin (dubba), barley bread, watermelon, ketupat, kurma platter | 12 | none | long tail + Ramadan hub depth | Jan 20 | AI line art |
| P0-6 | Eid al-Fitr scenes and treats: Eid prayer rows from behind, gifts, new clothes, ma'amoul, baklava, sheer khurma, ketupat | 10 | faceless/none | eid coloring 3–6K / 15–30K | Feb 1 | AI line art |
| P1-7 | Eid al-Adha animals: sheep 3, goat 2, cow 2, camel 3 (dromedary, one hump) | 10 | animals | eid al adha coloring 1–2K / 8–12K | Mar 10 | AI + designer |
| P1-8 | Hajj journey: tawaf from above, Mina tents, Arafat, Muzdalifah, Jamarat, Safa–Marwa, Zamzam, ihram from behind | 8 | faceless (distant) | kaaba/hajj 300–800 | Mar 10 | Designer |
| P1-9 | **Silhouette pack** for G19: camel, sheep, horse, elephant, whale, bee, butterfly, hoopoe, cat, fish, owl, turtle | 12 → 36+ pages | animals | animal coloring (Tier 1) | Feb 15 | Designer (2–3 days) |
| P1-10 | Dinosaurs | 24 | animals | dinosaur coloring 74K, KD 24 | Mar 2027 | AI line art |
| P1-11 | Animals of the Qur'an: elephant, bee, ant, spider and web, cow, hoopoe, whale (whale only), horse, camel, fish, birds | 12 | animals | Islamic-school long tail | Apr 2027 | AI + fact review |
| P1-12 | Mosques B: Süleymaniye, Selimiye, Shah (Isfahan), Nasir al-Mulk, Kul Sharif, Djenné, Córdoba arches, Hagia Sophia, Muhammad Ali (Cairo), Sultan Qaboos, Crystal, Putra, Sultan Omar Ali Saifuddien, Star Mosque, Xi'an, Kairouan, Jama Masjid, Baiturrahman (Aceh) | 18 | none | landmark long tail; i18n twins | May 2027 | Designer |
| P2-13 | Arabic "X is for Y" illustrations (28 nouns chosen by an Arabic teacher) | 28 | mixed | arabic alphabet worksheets 2–5K | Aug 2027 | AI line art |
| P2-14 | Islamic manners (adab) | 12 | faceless-people | islamic activity sheets 1–2K | Jun 2027 | AI line art |
| P2-15 | Vehicles: car, truck, train, airplane, bus, boat | 30 | none | car 30–100K; others 10–30K | Sep 2027 | AI line art |
| P2-16 | Ocean/sharks, butterflies, cats, horses, birds/owls, farm | 48 | animals | Tier 2 | rolling | AI line art |

P0 adds up to 80 pieces, about 115 designer-hours. That is roughly three weeks for two designers.

### 6.3 Brief file format (`briefs/{id}.yaml`)

```yaml
id: wudu-03-nose
target: { hub: islamic-worksheets, url: /wudu-steps-for-kids/ }
priority: P0
deadline: 2027-01-10
faces: faceless-people
difficulty: easy
subject: "Close-up of a child's two hands cupping water up toward the nose (wudu step 3)"
composition: "hands large and centered, falling water drops, small tap at top, plain background"
mustAvoid: [face, eyes, mouth, text, jewelry]
caption: { en: "3. Rinse your nose three times" }   # typeset by code, never in the art
keywords: { primary: "wudu steps for kids", secondary: ["wudu coloring page"] }
reviews: [islamic, technical, editorial]
```

### 6.4 AI line-art prompt template

```
{SUBJECT}. {COMPOSITION}.
Black-and-white line art for a children's coloring page.
{STYLE:
  bold   = "very thick uniform outlines, 10–25 large simple shapes";
  easy   = "thick uniform outlines, 25–60 shapes";
  medium = "medium uniform outlines, 60–150 shapes"}.
Pure white background, only black lines, every shape fully closed with no gaps.
No shading, no gray, no hatching, no texture, no solid black fills, no gradients, no shadows.
No text, letters, numbers, Arabic or any writing, signatures, watermarks or borders.
Flat 2D vector style, centered, whole subject inside the frame with a 5% margin, portrait 3:4, 2048 px.
People: {"no people" | "faces left completely blank with no eyes, nose, mouth or eyebrows, or seen from behind; modest loose clothing; girls wear hijab; boys wear thobe, kurta or baju koko"}.
Negative: prophets, angels, religious figures, divine depictions, winged beings, crosses, idols, holiday
(Christmas/Halloween/Easter) items, musical instruments, alcohol, pork, weapons, blood, revealing clothes,
licensed characters, brand logos, pseudo-Arabic, calligraphy, faces.
```

Generate 4–8 candidates per brief and pick one. Use only tools whose terms allow commercial use, and record provenance.

### 6.5 Vectorization: intake to KCI-SVG v1 (`scripts/intake/vectorize.ts`)

1. Input PNG ≥ 2048 px. Designer vectors are also rasterized at 4000 px to check closure.
2. Grayscale, auto-level, Otsu threshold. Remove black specks under 0.3 mm² (connected-component labeling).
3. Morphological closing with radius equal to 0.4 mm at print scale. Compare white-component counts before and after closing; any jump is flagged as a leak for a person to look at.
4. Estimate stroke width from the distance-transform median along the skeleton. If it is below the minimum, dilate. If AI line weight is uneven, optionally **re-ink**: skeletonize and re-stroke the centerlines at a uniform width, so illustrated art matches the generated house style.
5. Ink: `potrace -b svg -t 8 -a 1.0 -O 0.4`. Potrace 1.16 is run as an external CLI only (GPL-2), so it is never shipped to the browser. Ink is written as a filled path in `ink`.
6. Regions: 4-connected white components, each traced (`potrace -a 0`), simplified, tucked by +0.35·w. The background component becomes `r0`.
7. Run the same QA gate as generated art, then the human checklist.

`vtracer` is not used: it targets color separation, not line-art planar maps.

### 6.6 Human QA checklist for illustrated art

**Islamic**

- No prophets, angels or divine depictions, and nothing that implies them (light-beings, winged figures).
- People faceless: no eyes, nose, mouth or brows. Modest dress; hijab for girls in prayer and mosque scenes.
- Salah and wudu: correct order, mainstream positions, no shoes on the prayer mat, consistent qibla within a scene.
- Kaaba: door on the northeast face, Black Stone at the eastern corner, hizam band plain with no fake script.
- Dome of the Rock (gold octagon) labeled distinctly from Al-Aqsa Qibli Mosque (lead-gray dome).
- No Qur'anic text or divine names. No pseudo-Arabic.
- No stray crosses or other religious symbols. The traditional star-and-cross tessellation is fine.

**Animals**

- Anatomy correct, healthy, no slaughter or blood. `faces: animals`.

**Technical**

- Auto-QA passes. Uniform strokes, no specks or texture.
- Region count and minimum size fit the level.
- Test print on Letter and A4.

**Legal**

- No resemblance to licensed characters or brands.
- Landmarks drawn from at least three references, never traced from one photo.
- AI tool license recorded in `provenance`.

**Editorial**

- Title, alt and blurb accurate. Cultural labels correct (ketupat = Indonesian rice cake).
- Transliteration follows `glossary.json`.

---

## 7. Bundles (`src/content/bundles/*.yaml` → `scripts/build-bundles.ts`)

**How bundles are built**

- Merge the already-built single PDFs: `PDFDocument.create()`, then `copyPages(src, [0..n])`, then `addPage`. The footers use the non-embedded Helvetica, so merging adds no duplicate fonts.
- Add generated cover, contents and certificate pages through the same SVG→PDF renderer.
- Stamp "Page i of N". Metadata is deterministic.
- Each bundle is built in Letter and A4.
- Files go to `/assets/bundles/{id}/{id}-{letter|a4}.pdf`, with a landing page at `/{id}/` (serves "islamic coloring book pdf" and "ramadan coloring book pdf").
- A fanned-pages mockup is composited with sharp for the landing page and Pinterest.
- Bundles are free and ungated at launch; the schema has `gate: none | email | member` for later.

| Bundle | Pages | Composition |
|---|---|---|
| Complete Ramadan Activity Pack 2027 | **40** | cover · contents · 17 coloring (2B/6E/5M/4H) · 4 color-by-code (1 Arabic-letter) · 2 calendars (lantern grid, path-to-Eid) · 4 trackers · 6 puzzles (2 word search, 2 maze, 2 dot-to-dot) · 1 card · 1 door hanger · 1 certificate · 2 answer-key pages |
| Bold & Easy Ramadan (ages 2–5) | **20** | cover · 15 bold · 2 shapes (crescent, star) · 1 calendar · 1 certificate |
| Ramadan Calendars & Trackers | **18** | 8 calendars · 8 trackers · 2 journal |
| Eid al-Fitr Activity Pack | **30** | cover · 12 coloring · 4 cards · 2 tag sheets · EID MUBARAK bunting (6) · 2 envelopes · 2 word search · 1 key page |
| Arabic Alphabet Coloring Book | **30** | cover · chart · 28 letters |
| Arabic Letter Tracing Workbook | **60** | cover · chart · 28 × (tracing + forms) interleaved · review page · certificate |
| Arabic Numbers Workbook | **22** | cover · chart · 10 coloring · 10 tracing |
| Islamic Geometric Patterns for Teens & Adults | **30** | cover · "About Islamic geometry" page · 28 hard/expert patterns |
| A–Z Alphabet Coloring Book | **28** | cover · 26 letters · certificate |

The largest bundle is about 4 MB, well under the 25 MiB file limit.

---

## 8. Build-session execution order (this lane)

1. **Core:** rng, bezier/geom, clipper wrapper with golden tests, regions, svg emitter, text (harfbuzz), difficulty, palettes, qa, phash.
2. **Ramadan-first generators:** G09, G10, G13, G06, G11, G12 (iftar objects, prayer mat, tasbih, gift), G14 (coloring, forms, ghost tracing), G21, G23, G24, G18.
3. **Pipeline:** explore contact sheet, build, derive (svgo/resvg/sharp/pdf-lib), entries, bundles, review page.
4. **Remaining generators:** G01, G02, G04, G22, G25, G15, G16, G17, G08, G07, G03, G05, G20, G26, G19.
5. **Curate manifests to 498** using contact sheets plus score ranking. In-session, Claude curates by looking at rendered PNGs; the design team does the final human pass.
6. **Handoffs to people:**
   - Arabic stroke JSON correction (about 6 h)
   - `ar.json` string sign-off
   - Islamic review of sacred-place items
   - Test prints
7. **Project skills this lane needs** in `.claude/skills/`: `explore-generator-seeds`, `add-generated-design`, `intake-illustrated-art`, `build-bundle`, `content-qa`.

**Schedule:** generators by Nov 3 · Wave 1A QA Nov 4–7 → **live Nov 10** · 1B **Nov 24** · 1C **Dec 8** · Pinterest from Dec 28 to Jan 11 · Wave 2 plus first P0 art **Jan 15** · Eid al-Adha hub complete **Mar 10, 2027**.

## 9. Risks and guardrails

- **Scaled content abuse.** Only curated seeds ship. The pHash gate is enforced. Grouped URLs absorb low-differentiation variants. Every indexed page has a unique asset, a colored example, a fact-based blurb, and both PDFs plus online coloring. Year appears in titles only, never in duplicate URLs. "Teacher-reviewed" is never claimed unless it actually happened.
- **Library risk.** `clipper2-ts` is a prerelease: pinned, wrapped and tested, with `clipper2-wasm` as fallback. `pdf-lib` has been dormant since 2022; `@cantoo/pdf-lib` is the fallback. Potrace's GPL means it stays a build-time CLI only; a future photo-to-coloring feature in the browser needs a different tracer.
- **Respect.** The string allowlist and divine-name flag are enforced in QA. The 99 Names and Bismillah need advisor review and a "please store respectfully" note, and are excluded at launch. AI is never allowed to produce text.
- **Hosting.** About 5.5K files at launch, under Cloudflare's 20K-file Free limit (100K on Paid; 25 MiB per file). `ASSET_BASE` allows moving `/assets/*` to R2 once we pass about 12K files (roughly 1,200 designs).

**Sources:** [Cloudflare static asset limits changelog (Sep 2025)](https://developers.cloudflare.com/changelog/2025-09-02-increased-static-asset-limits/) · [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits) · [August 2026 spam update summary](https://sanjayb.com/august-2026-spam-update) · [June 2026 spam update](https://seosherpa.com/googles-june-2026-spam-update-has-finished-rolling-out/) · [March 2026 spam update](https://embryo.com/industry-updates/googles-march-2026-spam-update-finished-in-record-time/) · [TechCrunch on scaled content abuse](https://techcrunch.com/?p=2674706). npm versions were checked live on 2026-10-13: clipper2-ts 2.0.1-18, clipper2-wasm 0.4.0, polylabel 2.1.0, harfbuzzjs 1.6.3, opentype.js 2.0.0, svgo 4.1.0, @resvg/resvg-js 2.6.2, sharp-phash 2.2.0, pixelmatch 8.0.0, @cantoo/pdf-lib 2.11.1.