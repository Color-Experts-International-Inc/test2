<!-- Specialist draft (Online coloring app (React island) engineering design). Superseded by docs/PLAN.md where they disagree. -->

# Online Coloring App: Engineering Design (React 19 island in Astro 7)

**Scope:** `/color-online/...` routes for kidscolorit.com. This is a planning section with no files written.
**Target:** beat SketchJoy's online app on mobile performance and on kid usability, while staying ad-free inside the app.

---

## 0. Decisions at a glance

| Area | Decision |
|---|---|
| Rendering | **Vector-first hybrid.** Region fills are SVG `fill` attributes on `<path data-region>`. Brush strokes are stored as vectors and drawn to a canvas that sits between the region SVG and the line-art SVG. Each stroke is clipped to its region with `ctx.clip(Path2D)`. A **raster engine** (label map) is a lazy fallback for art without clean regions. |
| Hit-testing | The app does its own hit-testing: a uniform grid index, then `isPointInPath(Path2D)`. Touch taps use a 9-sample tolerant test. The same API serves both engines. DOM event targets are not used. |
| State | A framework-agnostic `DocStore` and `Engine` (vanilla TS). React renders only the chrome, through `useSyncExternalStore` selectors. **Zero React renders during a stroke or gesture.** |
| History | A command stack (fill / stroke / clear / batch). Removed strokes are tombstoned. Caps are 200 commands or 8 MB (lite devices: 100 or 4 MB). History is not persisted across reloads. |
| Persistence | IndexedDB `kidscolorit` v1 with stores `docs`, `strokes` (append-only), `thumbs`. Autosave is debounced at 800 ms and flushed on `visibilitychange`/`pagehide`. There is a device gallery at `/my-coloring/`. |
| Export | PNG through canvas composition (regions SVG → canvas, then stroke replay, then lines SVG, then watermark). Print through a hidden iframe with **vector line art** over a 200-DPI paint layer. Web Share with files. On iOS, print goes through the share sheet. |
| Budget | App code ≤ **60 KB gz** in total (≤ 38 KB initial plus lazy chunks). React 19 runtime is about 58 KB gz, counted and cached separately. 60 fps brush on a Galaxy A15-class phone. TTI < 2.5 s on Slow 4G. |
| Loading | The island exists **only** on `/color-online/{topic}/{design}/` with `client:load`. Design pages get a plain link plus Speculation Rules prerender on hover or pointerdown. |
| Modes | **Kid mode** (default) is icon-only: 5 tools, 12 big swatches, stay-inside always on. **Advanced mode** is the default for `audience: adult` pages. |
| Ads | **None inside the app viewport, ever.** Flags are reserved; ads appear only on design and topic pages once monetization is enabled. |

### Feature comparison with SketchJoy's online app (from the teardown; their internals are not verified)

| Feature | SketchJoy | kidscolorit |
|---|---|---|
| Bucket fill + gradients | yes | yes, plus a drag-direction gradient, radial from the tap point, and "gold/silver/rainbow" preset swatches for calligraphy and lanterns |
| Pattern fills | no | dots, stripes, zigzag, checker, 8-point star, zellige, Iznik scales, hex |
| Brush / eraser / eyedropper | yes | yes, plus pen pressure, a marker, crayon grain (v1.1), and an optional "stay inside the lines" clip |
| Undo/redo | yes | yes, plus two-finger-tap undo and three-finger-tap redo |
| Palettes | 25+ | 28 named palettes from design tokens, plus custom picker, recent colors and "my colors" |
| Pinch zoom | yes | yes, plus inertia, rubber-band, zoom-to-hint, and palm rejection / stylus-only drawing |
| Autosave | yes | yes, plus a multi-artwork gallery, resume, and a cross-tab lock |
| Download | yes | PNG HD, print with vector lines, native share sheet, watermark |
| Color-by-number | none found in the teardown | yes: legend, progress ring, highlight mode, magic hint, gentle and strict modes |
| A11y / RTL | not observed | keyboard spatial navigation, screen-reader announcements, RTL toolbar, localized numerals |

---

## 1. Rendering model

### 1.1 Why vector-first (option a)

Full rasterization with a scanline flood fill (option b) has several costs:
- It throws away the resolution independence of the generated SVGs.
- Every fill becomes an O(pixels) operation.
- The page needs a large backing bitmap for crisp zoom (iOS caps a single canvas at 16.7 M px).
- Gradients and patterns would have to be re-implemented in software.

With SVG region fills:
- A fill is one `setAttribute('fill', …)` and repaints only the dirty rect of a single path, in under 1 ms.
- Fills stay crisp at 16× zoom.
- Gradients and patterns are native `<defs>`.
- Print stays vector.

The brush goes on canvas, not SVG paths. Appending or updating `<path>` nodes on every `pointermove` makes the browser repaint the SVG layer, and that gets slower as artworks reach hundreds of strokes and 1,500 regions. Canvas gives constant cost per frame. Strokes are still **stored as vectors** (point arrays), so we can re-rasterize at any resolution for zoom or export.

### 1.2 Design asset contract (produced by the build-time region compiler)

The app depends on `scripts/art/compile-regions.ts`, which belongs to the content pipeline. It has to guarantee the following outputs and checks.

**`/art/{design}.{hash8}.svg`** (immutable, `Cache-Control: public, max-age=31536000, immutable`). It is also **inlined** into the app page as two sibling SVGs:

```html
<svg class="kc-art kc-regions" viewBox="0 0 1000 1294" data-kc="1" role="img" aria-labelledby="kc-t">
  <title id="kc-t">Blue Mosque coloring page</title>
  <defs id="kc-paints"></defs>
  <g id="kc-regions">
    <path data-region="bg" fill="#fff" fill-rule="evenodd" d="M0 0H1000V1294H0Z M…holes…"/>
    <path data-region="r1" fill="#fff" d="M412.5 210.1C…Z"/>
    …
  </g>
</svg>
<svg class="kc-art kc-lines" viewBox="0 0 1000 1294" aria-hidden="true">
  <g id="kc-lines" fill="none" stroke="#1d1d1f" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">…</g>
  <g id="kc-decor" fill="#1d1d1f">…solid non-colorable bits…</g>
</svg>
```

**Compiler rules:**
- Every region is a single `<path>` with absolute coordinates. Transforms are flattened, and shapes are converted to paths.
- Precision is 1 decimal place in a 1000-unit-wide viewBox. Paper ratios are Letter 1000×1294 and A4 1000×1414.
- Region ids are **stable across re-exports**. Generated art uses deterministic ids. Illustrated art maps old ids to new ones by IoU ≥ 0.8.
- Regions must not overlap. This is checked by raster sampling at 1000 px.
- Region edges sit on the **centerline** of the line art, so the lines always cover the seams. That means no white halos and no anti-alias gaps.
- `bg` is computed as the artboard minus the union of all regions (evenodd), which makes its clip exact.
- Default fill is opaque `#fff`, never `none`.
- The tap-size floor is a minimum inscribed-circle radius per difficulty: d1 ≥ 55 units (about 40 CSS px tall at fit on a 360 px phone), d2 ≥ 30, d3 ≥ 15, d4 ≥ 8, d5 ≥ 4. Smaller regions are merged or flagged `tiny`.
- Region-count caps: d1 ≤ 30, d2 ≤ 80, d3 ≤ 200, d4 ≤ 500, d5 (adult) ≤ 1,500.

**`/art/{design}.{hash8}.regions.json`** (the manifest, preloaded) holds per-region `bbox`, `area`, `label` (polylabel pole of inaccessibility), `r` (inscribed radius), `name`, `cbn`, and `nb` (adjacency). It also carries the CBN legend and the design flags. See §6.

**Raster-mode designs** additionally have `/art/{design}.{hash8}.lines.webp` (transparent line art) and `/art/{design}.{hash8}.labels.png`. The labels file is lossless, with 16-bit labels packed into R and G. The compiler grows labels under line pixels so there are no halos.

### 1.3 Layer stack (z-order)

All of these live inside `div.kc-stage-content`, which carries the single CSS transform:

```
z5  UI chrome (Toolbar, PaletteDrawer, ZoomControls)       outside the transformed content
z4  svg.kc-overlay   CBN numerals, focus ring, hint pulse, brush-size cursor ring   pointer-events:none
z3  svg.kc-lines     line art + decor (never repaints while coloring)              pointer-events:none
z2  canvas.kc-wet    live stroke only (desynchronized ctx)                         pointer-events:none
z2  canvas.kc-dry    committed strokes (adaptive raster window, §1.5)              pointer-events:none
z1  svg.kc-regions   region fills + <defs> paints                                   pointer-events:none
z0  paper            CSS background #fff
```

- `div.kc-stage-viewport` (`touch-action:none; overscroll-behavior:none; user-select:none; -webkit-touch-callout:none`) owns all pointer and wheel events.
- Because the line art is a separate SVG, complex line art is never re-rasterized when a fill changes.
- The two art SVGs arrive through the **Astro slot**. `astro-slot` is `display:contents`, so they share a stacking context with the React-rendered canvases. Each layer is `position:absolute; inset:0; contain:strict`.

### 1.4 Fills

- `RegionLayer` keeps `Map<RegionId, SVGPathElement>`. A fill is `el.setAttribute('fill', paint.k === 'solid' ? paint.c : \`url(#${defId(paint)})\`)`.
- `paints.ts` derives `<defs>` **from state**, never from history:
  - Each def is keyed by a hash of the paint.
  - Gradients that use `from/to/at` in design units use `gradientUnits="userSpaceOnUse"`. They are per-region by nature because they come from the drag or tap point.
  - Patterns use `patternUnits="userSpaceOnUse"` and are generated by `patterns.ts`.
  - Unreferenced defs are garbage-collected in `requestIdleCallback`.
- **Ink-spread animation**: the app clones the region path into the overlay with the new paint. It clips the clone with a `<clipPath>` circle centered on the tap point and animates the circle's `transform: scale(0→1)` with WAAPI over 180 ms. It then commits the real fill and removes the clone. Under `prefers-reduced-motion`, or on the lite profile, the fill is instant.
- **Fill over brush strokes**: a fill on a region hides that region's clipped strokes (tombstoned, undoable), because kids expect the bucket to paint over. Free strokes (`region: null`) are not affected.

### 1.5 Brush layer: clipping and the adaptive raster window

**Stay inside the lines.** At `pointerdown`, the hit test picks the region under the first point. The stroke stores `region`, and every render of that stroke clips to it:

```ts
// core/brush.ts
export function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke, clip: Path2D, rule: CanvasFillRule, w: RasterWindow) {
  ctx.save();
  ctx.setTransform(w.k, 0, 0, w.k, -w.x * w.k, -w.y * w.k);   // design units -> bitmap px
  ctx.clip(clip, rule);                                        // region Path2D (or ARTBOARD for free strokes)
  ctx.globalCompositeOperation = s.tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.globalAlpha = s.opacity;
  ctx.fillStyle = s.tool === 'crayon' ? grainFill(ctx, s.color) : s.color;
  ctx.fill(s.outline ??= outlineToPath2D(getStroke(unpack(s.pts), PRESET[s.tool](s))));  // perfect-freehand polygon
  ctx.restore();
}
```

- `Path2D` per region is built lazily from the path's `d` attribute on first use and then cached. `fillRule` comes from the manifest. Raster mode builds the same `Path2D` from run-lengths (§1.7), so the brush code is engine-agnostic.
- Clip edges fall under the line art, so they are never visible. Advanced mode can turn the toggle off, in which case the stroke clips to the artboard only and `region = null`.
- **Wet/dry split.** During a stroke, only `kc-wet` is cleared and redrawn each rAF:
  - The current outline and **predicted points** (`getPredictedEvents()`) go to the wet canvas only.
  - The wet canvas uses `getContext('2d', { desynchronized: true })` where supported, for low latency.
  - On `pointerup`, the final outline (without predicted points) is drawn once to `kc-dry` and the wet canvas is cleared.
  - Strokes longer than 512 points are automatically split into chained segments to keep `getStroke` under 1 ms per frame.
- **Undo/redo of a stroke uses dirty-rect replay, not bitmap snapshots.** The app clears the stroke's bbox (padded by the brush size) on `kc-dry`, clips to that rect, and replays, in global order, the live strokes whose bbox intersects it. Each stroke keeps its own region clip. Consecutive strokes with the same region share one `save/clip/restore`. Regions are disjoint, so in kid mode this is nearly always one clip per region. This means no bitmap checkpoints and constant memory.
- **Adaptive raster window.** The dry and wet canvases map to a design-space rect `w = {x, y, w, h}` at scale `k` (device px per design unit). They are positioned inside the transformed content, so they move with the SVG during gestures for free.
  - When `zoom × dpr × artboard` fits under the pixel cap, the window covers the whole artboard at `k = min(zoom × dprCap, kCap)`.
  - Otherwise the window is the visible rect plus 50% overscan at `k = zoom × dprCap`.
  - On gesture settle, the window is re-rendered (double-buffered: draw to a spare canvas, then swap) if the visible rect has left it or `k` is off by more than 1.25×.
  - Pixel caps are lite 2.5 M, standard 5 M, high 8 M. DPR cap is 1.5 on lite and 2 otherwise. Strokes under crisp vector lines look identical at 2 and 3 DPR.
  - If the replay exceeds 8 ms, it is chunked across frames, and the old (CSS-scaled) bitmap stays visible until the swap.

### 1.6 Hit-testing

- `core/hitTest.ts` builds a 32×32 uniform grid over the viewBox from manifest bboxes, in under 5 ms, at idle.
- A query converts client coordinates to design units with the inverse of the app's own matrix. The viewport rect is cached through `ResizeObserver`, never read per event.
- It walks the grid cell's candidates **in reverse paint order** and calls `probeCtx.isPointInPath(path2d, x, y, rule)` on a detached 1×1 context with an identity transform. Each query costs under 0.1 ms.
- **Tolerant tap** applies to `pointerType === 'touch'` only. The app samples the point plus 8 points on a ring of radius `6 / scale` CSS px and picks the region with the most hits; ties go to the center point. This handles the very common case of a kid tapping on a line.
- DOM event targets are not used, for three reasons: pointer capture retargets events to the viewport, all art layers are `pointer-events:none`, and raster mode needs the identical API (`engine.hitTest(pt) → RegionId | null`).

### 1.7 Raster fallback engine (lazy: `raster/engine.ts` and `raster/labeler.worker.ts`, ≤ 6 KB gz)

Raster mode is used for illustrated art that failed region extraction QA, and later for user-generated pages (§8).

- **Label map.** The app fetches `labels.png` and calls `createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' })`. It reads the pixels in a worker via OffscreenCanvas and builds a `Uint16Array` (2048 px long side is 4 M px, or 8 MB). From that it derives per-label bboxes and run-lengths `[y, x0, x1]`.
- **Runtime labeling** (future user uploads only) also runs in the worker: luma/alpha threshold, 1 px dilation to close gaps, two-pass union-find connected-component labeling, line pixels assigned to the nearest label, and components smaller than 0.05% of the area merged. This takes about 100 ms at 2048².
- `RegionLayer` becomes a fill canvas. A fill is `ctx.fill(runsToPath2D(label))` with a solid color, `createLinearGradient/RadialGradient`, or `createPattern`. A hit test is a single label lookup. The brush, history, CBN and export code are unchanged.

---

## 2. Tools and interaction

### 2.1 Tool matrix

| Tool | Kid mode | Advanced | Notes |
|---|---|---|---|
| Fill (bucket) | yes, solid plus 4 "magic swatches" (rainbow, gold, silver, zellige) | solid / linear / radial / pattern | Kid gradients are presets: top-to-bottom, current color to the next palette color |
| Brush | yes, 3 sizes (6/14/28 screen px) | 1–96 px slider, opacity | perfect-freehand with pressure |
| Marker | no | yes | flat, no thinning |
| Crayon (v1.1) | yes (it is fun) | yes | paper-anchored grain mask |
| Eraser | yes | yes | drag erases strokes; **tap on a region clears its fill and strokes** |
| Eyedropper | no | yes | region paint or dry-canvas pixel |
| Hand | yes | yes | one-finger pan, double-tap zoom |
| Stickers | later | later | §2.8 |

The brush size is set in **screen px** and converted to design units at stroke start (`size / scale`). Zooming in therefore gives finer control, which is what kids expect.

### 2.2 Fill paints

- **Linear (advanced):** pointerdown in a region, drag, release. The two points become `from/to` in design units. A tap without a drag gives a vertical default.
- **Radial:** the center is the tap point, and `r` is the distance to the farthest bbox corner.
- **Patterns** come from `patterns.ts` (about 3 KB). Each is a generator returning a `<pattern>` with `fg/bg/scale`:
  - `dots`, `stripes`, `zigzag`, `checker`
  - `star8` (khatam 8-point star tile)
  - `zellige` (4-fold star-and-cross tile)
  - `scales` (Iznik fish-scale)
  - `hexgrid`

  These are on-brand, purely geometric, and export natively.
- **Presets** `gold`, `silver` and `night-sky` are multi-stop linear gradients tuned for calligraphy, lanterns and domes.

### 2.3 Brush engine details

- **Input:**
  - Use `e.getCoalescedEvents()` when available. Apple Pencil and Wacom send 120–240 Hz.
  - Use `getPredictedEvents()` on the wet layer only.
  - Feature-detect both; Safari support varies.
  - The `pointermove` handler only pushes Float32 triples into a buffer, which takes under 0.2 ms. A single rAF loop renders. It runs only while drawing or animating, never at idle.
- **Pressure:** `pointerType === 'pen'` uses `e.pressure`. Mouse and touch use `simulatePressure: true` (velocity-based).
- **Presets** (perfect-freehand 1.2.3):
  - brush `{ thinning: 0.6, smoothing: 0.5, streamline: 0.45, start: { cap: true }, end: { cap: true } }`
  - marker `{ thinning: 0, smoothing: 0.6, streamline: 0.5, simulatePressure: false }` at opacity 0.92. A single outline polygon means a stroke never self-darkens.
  - crayon: brush preset with thinning 0.2 plus grain.
  - eraser: marker preset × 1.5 size.
- **Crayon grain (v1.1):** a 128 px grayscale noise tile is generated once (seeded value noise, about 1 KB of code). The stroke is drawn to a scratch canvas, then masked with the paper-anchored tiled grain via `destination-in`, then composited. Export uses the same routine, so the look is identical.
- **Eyedropper:** if `dry.getImageData(px, 1, 1)` has alpha > 0, use that pixel. Otherwise use the region's paint (for a gradient, its first stop). The picked color goes into recent colors.

### 2.4 Palette system

- **28 named palettes** live in `src/design/palettes.ts`, sourced from DESIGN.md tokens. Each has 12 colors, and every color has a localized `nameKey` (used for screen readers):
  - Ramadan Nights, Eid Morning, Lantern Glow, Zellige Fez, Iznik Blue, Medina Green, Desert Dunes, Date Palm, Andalus Garden, Spice Market, Ocean, Rainbow
  - Bold & Easy, Pastel Dream, Forest, Autumn, Winter, Spring, Summer, Space, Fruits, Skin Tones (for faceless hands and figures)
  - Earth & Clay, Sunset, Candy, Metallic Flats, Neon (advanced), Grays
- The **suggested palette** per design is inlined in props. The full catalog is lazily loaded from `/data/palettes.{hash8}.json` (about 3 KB gz) when the drawer opens.
- **Kid UI:** the bottom strip shows 12 swatches of 48×48 px with 8 px gaps. The "more" button opens the drawer, which shows one palette per scroll-snap page with an icon instead of a name.
- **Advanced:**
  - A custom HSV picker (`ColorPicker.tsx`, about 3 KB, no library): saturation/value square, hue strip, and hex input.
  - **Recent colors** (last 12, `localStorage['kci:recentColors']`).
  - **My colors** (12 slots, `kci:customColors`).
- The selected state is shown with a 3 px ring plus a check glyph, never by color alone.

### 2.5 Color-by-number (`colorByNumber.ts` + `CbnLegend.tsx`, lazy, ≤ 5 KB gz)

- **Data:** `RegionMeta.cbn = n` and `manifest.cbn.legend[{ n, color, nameKey }]`. Regions without `cbn` (decor, `bg`) are excluded.
  - Generated designs get numbers from the generator.
  - Illustrated designs get them in the pipeline: k-means in CIELAB over a reference colored version, with k = 6 / 8 / 12 by difficulty.
- **Numerals:**
  - Rendered in the overlay at `label` with font size `clamp(r × 0.9, 10, 48)` design units, `paint-order: stroke` and a white halo, using system-ui with tabular numerals.
  - **Zoom-aware culling**: a numeral is hidden when it would be under 9 CSS px on screen or offscreen. The cull is recomputed on settle. When small numbers are hidden, a "zoom in" hint chip appears.
  - Numerals are formatted with `Intl.NumberFormat(locale, { numberingSystem })`, giving `arab` ٣ for Arabic, `arabext` ۳ for Urdu, and `beng` ৩ for Bengali.
- **Legend** replaces the palette strip with numbered swatches. Each swatch fills up as its regions are completed and shows a check when its group is done.
- **Highlight mode:** selecting swatch *n* gives that number's unfilled regions a light hatch pattern (a def) and dims the others to 85%.
- **Fill check:**
  - `gentle` (default, kids): a wrong color is allowed, the numeral stays visible, and the region does not count.
  - `strict` (Puzzle mode toggle): a wrong tap gives a 120 ms wobble and no fill. A correct tap gives an 8 ms haptic if enabled.
- **Progress:** O(1) incremental counters with `done/total` on the toolbar ring. Completion fires **once**, persisted in `cbn.completedAt`.
- **Magic hint** (wand button): picks the selected number's unfilled region nearest the viewport center, falling back to the smallest. It animates `zoomToRect(bbox × 3)` and pulses the region 3 times. There is a 3 s cooldown. Reduced motion means a jump and a static outline.
- **Tiny-bits assist:** once 95% of a number is done, the remaining regions with `r < 6` units are auto-filled as one `batch` command.
- **Completion:** confetti of SVG crescents and 8-point stars (lazy `Celebration.tsx`, 1.2 s, skipped under reduced motion) and `navigator.vibrate?.([30, 40, 30])` (Android only; iOS has no Vibration API). The Done sheet then opens. On `sacredText` designs (99 names, bismillah), the celebration is a soft glow only: no confetti over the text, no sounds, no stickers.

### 2.6 Undo/redo (`core/history.ts`, `hooks/useHistory.ts`)

```ts
export class History {
  private undo: Command[] = []; private redo: Command[] = []; private bytes = 0;
  constructor(private doc: DocModel, private cap = { cmds: 200, bytes: 8 << 20 }) {}
  push(c: Command) { apply(this.doc, c); this.undo.push(c); this.bytes += cost(c);
    for (const r of this.redo) release(this.doc, r);   // free strokes only reachable via discarded redo
    this.redo = []; this.evict(); this.emit(); }
  undoOnce() { const c = this.undo.pop(); if (!c) return; revert(this.doc, c); this.redo.push(c); this.emit(); }
  redoOnce() { const c = this.redo.pop(); if (!c) return; apply(this.doc, c); this.undo.push(c); this.emit(); }
  private evict() { while (this.undo.length > this.cap.cmds || this.bytes > this.cap.bytes) {
    const c = this.undo.shift()!; this.bytes -= cost(c); finalize(this.doc, c); } } // purge tombstones
}
```

- `cost(stroke)` is `pts.byteLength + 64` plus about `pts.length × 8` for the cached Path2D estimate. A fill costs 64 bytes.
- Commands reference stroke ids. A stroke removed by a fill, erase-tap or clear is **tombstoned**, not deleted, so undo is O(1) plus a dirty-rect replay.
- **Inputs:**
  - Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl+Y
  - **two-finger tap = undo**, three-finger tap = redo (fingers down under 250 ms, movement under 10 px)
  - big undo/redo buttons, mirrored in RTL
- `useHistory()` subscribes only to `{ canUndo, canRedo }`.
- "Start over" is a `clear` command, so it is undoable, behind a big icon confirm dialog (trash icon with ✓ / ✕).

### 2.7 Gesture router, zoom/pan and palm rejection (`core/gestures.ts`, `core/viewport.ts`, `hooks/useZoomPan.ts`)

**Pointer state machine** on `kc-stage-viewport`. The drawing pointer gets `setPointerCapture`.

| State | Transition |
|---|---|
| `idle` → `pending` | first `pointerdown`. With the brush, the stroke starts on the wet layer **immediately**, with zero latency. |
| `pending` → `gesture` | a second pointer goes down. If the current stroke is under 250 ms old or its path is under 24 px, it is **discarded**; otherwise it is committed first. |
| `pending` (fill tool) → **fill** | `pointerup` with movement under 10 px, duration under 600 ms, and no second pointer. Fills on **up**, not down, to prevent accidental fills at the start of a pinch. |
| `pending` (fill tool) → `pan` | movement over 10 px while zoomed beyond fit. Kids drag to pan and tap to fill. |
| any → `idle` | `pointercancel` or `lostpointercapture`: the wet stroke is aborted. |

**Pinch math** keeps the midpoint anchored:

```ts
const s = clamp(g.s0 * dist / g.d0, minS, maxS), k = s / g.s0;
v.tx = mid.x - (g.mid0.x - g.tx0) * k;
v.ty = mid.y - (g.mid0.y - g.ty0) * k;
```

**Wheel** (`{ passive: false }`):
- `ctrlKey` (trackpad pinch) zooms by `exp(-deltaY × 0.01)` around the cursor.
- Mouse-like input (`deltaMode === 1` or integer |deltaY| ≥ 50) zooms by `exp(-deltaY × 0.0015)`.
- Anything else pans.
- Space+drag pans on desktop.

**Limits and behavior:**
- Minimum zoom is fit, with rubber-banding to 0.85×. Maximum is 8× in kid mode and 16× in advanced.
- At least 25% of the artboard stays visible, with a spring back on release.
- Fling inertia decays at 0.95 per frame. Inertia and spring are off under reduced motion.
- Double-tap (Hand tool only, to avoid a conflict with fill taps) toggles fit ↔ 2.5× at the tap point.
- Floating `ZoomControls` [−][fit][+] step by ×1.5.

**Compositing:**
- Each frame writes only `style.transform = translate3d(tx,ty,0) scale(s)`.
- `will-change: transform` is set **only during the gesture**. It is removed on settle so Chrome re-rasters the SVG crisply at the new scale. Then the raster-window check runs.
- Safari `gesturestart`/`gesturechange` events get `preventDefault` to block page zoom.
- `visualViewport` resize (URL bar show or hide) triggers a re-fit.

**Palm rejection and stylus:**
- Once a `pen` pointer has been seen, `stylusOnly = true`: touch never draws. One finger pans and two fingers zoom. This is auto-detected, can be toggled in settings, and is persisted in `kci:stylusOnly`.
- Touches with `width` or `height` over 40 CSS px are ignored when reported.
- `contextmenu` is prevented on the stage.

### 2.8 Stickers (v1.1, behind the `flags.stickers` flag)

- Stickers are an SVG `<symbol>` library: crescent, 8-point star, fanoos lantern, dates bowl, dallah, mosque dome, camel, kite, balloon.
- They are placed in a sticker layer above the line art, as `{ id, sym, x, y, s, r }`. One finger moves a sticker; two fingers scale and rotate it.
- The library is filtered by the site-wide **"no animate beings"** toggle, which removes the camel and any other animals.
- Stickers are disabled on `sacredText` designs.

---

## 3. State and persistence

### 3.1 Store architecture

- `DocStore` (vanilla) holds `fills`, `strokes`, `order`, `hidden`, `cbnDone`, `tool` state and `viewport` (settled values only).
- It exposes `subscribe(listener)` and `getSnapshot()` with **sliced snapshots**, so the toolbar only re-renders when `tool`, `color` or `canUndo` change.
- `Engine` owns all DOM and canvas mutation. React components call `engine.*` and read the store through `useStore(selector)`, which is `useSyncExternalStore` with a selector and equality check.
- No React Compiler is needed, because the hot paths never enter React.

### 3.2 Data model and IndexedDB schema (`core/storage.ts`, a hand-written promise wrapper of about 1 KB, with no `idb` dependency)

```
DB "kidscolorit" v1
  docs     keyPath "id" (crypto.randomUUID())   indexes: bySlugVer ["slug","designVersion"], byUpdated "updatedAt"
  strokes  keyPath ["docId","strokeId"]         index:   byDoc "docId"          (append-only writes)
  thumbs   keyPath "docId"                      value:   { blob: Blob(webp|png 320px), updatedAt }
```

```ts
export interface DocRecord {
  id: string; schema: 1; slug: string; designVersion: string; artUrl: string;   // immutable hashed URL
  title: string; topic: string; locale: string; createdAt: number; updatedAt: number;
  fills: Record<RegionId, Paint>; strokeOrder: number[]; nextStrokeId: number;
  cbn?: { done: RegionId[]; strict: boolean; completedAt?: number };
  progress: number;                       // 0..1, CBN correct/total or filled/colorable
}
export interface StrokeRecord extends Omit<Stroke, 'outline'> { docId: string; strokeId: number }  // pts: Float32Array (structured-clone)
```

**Autosave:**
- It is debounced at 800 ms after the last command, with a maximum interval of 5 s during continuous activity.
- It is flushed on `visibilitychange → hidden`, `pagehide` and `freeze`.
- Each flush is **one transaction**: put `docs` (small), put only the dirty strokes, and delete the strokes that are no longer live. Strokes that are undone or tombstoned are deleted on flush and re-put on redo. A 500-stroke artwork (about 700 KB) therefore never rewrites in full.
- `data-save-state="saving|saved"` on the app root drives a subtle cloud icon and the tests.
- The thumbnail is regenerated in `requestIdleCallback` at most every 10 s (OffscreenCanvas, `convertToBlob('image/webp', 0.8)`, falling back to PNG).

**Version safety:** design SVGs are published at immutable hashed URLs and **kept for 12 months**, so an old document always reopens against its exact art. When a newer version exists, "Continue" migrates: it keeps the fills and strokes whose region ids still exist. If more than 20% would be lost, the app keeps the old document on the old art and shows a small "new version available, start fresh?" chip.

**Durability and limits:**
- Call `navigator.storage.persist()` after the third saved artwork.
- Safari evicts script-written storage after 7 days without interaction unless the site is installed. The fix is a PWA `manifest.webmanifest` plus an "Add to Home Screen" tip in the gallery, plus copy saying "Saved on this device. Download to keep forever."
- The gallery soft cap is 60 documents. On overflow, the app prompts to delete the oldest. `navigator.storage.estimate()` is shown in advanced settings.
- **Cross-tab:** `navigator.locks.request(docId, { ifAvailable: true })`. A second tab opens read-only with the banner "This picture is open in another tab". `BroadcastChannel('kci-docs')` refreshes the gallery.
- `localStorage` keys (per-device conveniences, all wrapped in try/catch): `kci:mode`, `kci:recentColors`, `kci:customColors`, `kci:hasDocs`, `kci:paper`, `kci:stylusOnly`, `kci:sound`, `kci:haptics`.

### 3.3 Resume and "continue where you left off"

- **On `/color-online/{topic}/{design}/`:** if `bySlugVer` has a document, it is **auto-resumed** with no modal (kids). "New copy" and "Start over" live in the Done sheet.
- **`/my-coloring/`** (and `/{locale}/my-coloring/` later) is a `noindex` page with a small `MyGallery` island (≤ 6 KB gz, `client:load`). It shows a thumbnail grid sorted by `updatedAt`, with a progress ring, Continue, Download, and Delete with confirm.
- **"Continue coloring" strip** on the homepage and design pages: a vanilla `<script>` of ≤ 1.5 KB that does nothing unless `localStorage['kci:hasDocs'] === '1'`. It then reads the 6 most recent documents in `requestIdleCallback`, so first-time visitors pay zero.

### 3.4 Export pipeline (`core/export.ts`, lazy, ≤ 4 KB gz, prefetched at idle +10 s)

**PNG:**
1. Clone the live `svg.kc-regions` (current fills and defs) and set `width`/`height` to the target pixels so Safari rasterizes at full size.
2. Serialize with `XMLSerializer` to a Blob URL, load it into an `Image`, `await img.decode()`, and draw it to a canvas. `createImageBitmap(svgBlob)` cannot be used because Chrome rejects SVG blobs.
3. Replay the strokes with the same `drawStroke` at `k = targetPx / viewBoxW`.
4. Draw `svg.kc-lines` the same way.
5. Draw the watermark strip "Colored on kidscolorit.com" (22 px, bottom inline-end). It is on by default for PNG.
6. Call `canvas.toBlob('image/png')`.

There are no external references and no `foreignObject`, so the canvas is never tainted.

**PNG sizes:**
- HD = 2× the viewBox (2000×2588 for Letter-ratio art).
- "Print quality" = 2550×3300 (Letter at 300 DPI) or 2480×3508 (A4), offered only on the standard and high profiles.
- The lite profile is capped at a 2000 px long side.

**Print:**
1. Create a hidden `<iframe srcdoc>` containing the paint layer (regions plus strokes, as a 200-DPI PNG) with the **vector `kc-lines` SVG inline on top**.
2. Use `@page { size: letter portrait; margin: 0.25in }` or A4. The default comes from the locale region (US, CA, MX and PH use Letter; everywhere else A4) and is persisted in `kci:paper`.
3. Call `iframe.contentWindow.print()`.

On iOS and iPadOS, where iframe printing is unreliable, the Print button produces the PNG and opens the share sheet, which includes Print.

**Share:**
- `navigator.canShare({ files: [file] })` leads to `navigator.share({ files, title, text })`. The fallback is an `<a download>` with an object URL.
- The filename is `kidscolorit-{design}-{yyyymmdd}.png`.
- The PNG is **pre-rendered when the Done sheet opens**, so `share()` runs inside the tap's transient activation. iOS rejects `share()` calls that come after long async work.
- In kid mode, Share requires a **2-second press-and-hold parent gate**, so a child cannot accidentally send to WhatsApp.

**Blank-page fallback:** "Download PDF" links to the static build-time PDF (`design.pdfUrl`) and works without JS.

---

## 4. Performance budget

### 4.1 JavaScript (gzip, enforced by `scripts/check-bundle.mjs` in CI, which reads the Vite/Rolldown manifest and fails the build)

| Chunk | Budget | Loaded |
|---|---|---|
| React 19 runtime (`react` + `react-dom/client`) | about 58 KB (measured, tracked, not counted in the app budget) | shared and cached immutable |
| `coloring-core`: app shell, Stage, engine, regions, paints (solid), brush (brush/marker/eraser), gestures, viewport, history, storage, kid toolbar, palette strip, perfect-freehand | **≤ 38 KB** | `client:load` |
| `advanced`: gradient/pattern UI, `patterns.ts`, ColorPicker, eyedropper, settings | ≤ 9 KB | on mode switch, or at idle when `advancedDefault` |
| `cbn` | ≤ 5 KB | `modulepreload` when `hasCbn` |
| `export` | ≤ 4 KB | at idle +10 s, or on Done |
| `raster` + worker | ≤ 6 KB | only when `mode: 'raster'` |
| `crayon` / `celebrate` / `sound` | ≤ 1 / 1.5 / 0.5 KB | on use |
| **App total** | **≤ 60 KB** | |

**Dependencies:**
- **perfect-freehand 1.2.3** (about 2.5 KB gz, zero dependencies) is the only runtime dependency. Its pressure-aware outline generation with streamline and smoothing is about 300 lines we would otherwise rewrite.
- No `idb`. The hand-written wrapper is smaller and needs compound keys anyway.
- No icon library. A single inline `<symbol>` sprite of about 4 KB gz ships in the HTML.
- No color library. HSV↔hex is about 30 lines.
- No gesture library.

### 4.2 Runtime targets

- **Reference devices:** Samsung Galaxy A15 / A25 or Moto G Power 2024 (4 GB RAM, Chrome stable); iPhone SE (3rd gen); iPad (10th gen) with Pencil; a low-end Chromebook.
- **Brush:** 60 fps. The `pointermove` handler is under 0.2 ms. rAF wet render is under 4 ms, with `getStroke` on ≤ 512 points at about 1 ms and clip plus fill at 1–2 ms. **Zero React commits during a stroke.** Input-to-ink latency under 30 ms with desynchronized canvas and predicted events.
- **Fill:** tap to paint under 16 ms. INP under 100 ms.
- **Load (Lighthouse Slow 4G: 150 ms RTT, 1.6 Mbps, 4× CPU):**

  | Item | Budget (gz) |
  |---|---|
  | HTML with inlined art | ≤ 45 KB kids designs, ≤ 120 KB adult |
  | CSS | ≤ 12 KB |
  | JS | ≤ 100 KB |
  | Manifest | ≤ 15 KB |

  Targets: LCP (the inline SVG) < 1.8 s, `kci:interactive` mark < **2.5 s**, CLS = 0 (the shell layout is fixed by `aspect-ratio` from the viewBox), TBT < 200 ms.
- **Init is chunked.** Hydrate the toolbar and stage first. Then build Path2D objects, the grid index and the manifest join in `scheduler.yield()` / `requestIdleCallback` slices. Fills work before the manifest arrives, because Path2D comes from `d`.
- **Pre-hydration tap queue:** a 300-byte inline script records the last tap on the stage before hydration, and the engine replays it on mount. No lost first taps.
- **Profiles,** chosen by `navigator.deviceMemory` and `hardwareConcurrency`:
  - **lite** (≤ 2 GB or ≤ 4 cores): DPR cap 1.5, 2.5 M px raster window, history 100 commands / 4 MB, no ink-spread animation.
  - **standard:** DPR cap 2, 5 M px window.
  - **high** (≥ 8 GB): 8 M px window, print-quality PNG enabled.

### 4.3 Loading strategy and routes

| URL | Purpose | Indexing |
|---|---|---|
| `/color-online/` | hub: "Color Online – Free Online Coloring Pages for Kids \| KidsColorIt" | index |
| `/color-online/{topic}/` (e.g. `/color-online/ramadan/`) | topic grid of online-colorable designs plus intro | index |
| `/color-online/{topic}/{design}/` (e.g. `/color-online/ramadan/fanoos-lantern-bold-easy/`) | **the app** | `noindex, follow`, self-canonical, revisit at +90 days with Search Console data |
| `/my-coloring/` | device gallery | noindex |
| `/{locale}/color-online/{topic-l10n}/{design-l10n}/` | Phase 2 | per SEO.md hreflang |

- The app page title (used for tabs, bookmarks and shares) is `Color the {Design Name} Online – {Topic} | KidsColorIt`. `og:image` is the design thumbnail.
- **Island placement:** `src/pages/color-online/[topic]/[design].astro` is the **only** page that imports `ColoringApp`. Design pages ship **no app JS**.
- **The "Color online" button on design pages** (`src/components/ColorOnlineButton.astro`) is a plain `<a href>`, which is crawlable and works without JS. It is paired with a site-level Speculation Rules block:
  ```html
  <script type="speculationrules">{"prerender":[{"where":{"href_matches":"/color-online/*/*/"},"eagerness":"moderate"}]}</script>
  ```
  That means prerender on hover after 200 ms on desktop and on pointerdown on mobile. Non-Chromium browsers fall back to Astro `data-astro-prefetch="tap"`.
- **Prerender caveat:** the engine defers IndexedDB open, the Web Locks request, analytics and autosave until `document.prerendering === false` (it listens for `prerenderingchange`).
- **Head of the app page:**
  - `<link rel="preload" as="fetch" href={manifestUrl} crossorigin>`
  - `modulepreload` for `cbn` when `hasCbn`

---

## 5. Accessibility and kid UX

**Layout:**
- **Phone portrait:**
  - Top bar (56 px): Exit, Undo, Redo, Done ✓, with the save cloud indicator.
  - Bottom: a tool row (5 × 56 px), then the palette strip (48 px swatches).
  - The stage fills the rest. `env(safe-area-inset-*)` is respected.
- **Landscape or ≥ 768 px:** a tool rail at `inset-inline-start` and a vertical palette rail at `inset-inline-end`.
- Targets are ≥ 48×48 CSS px in kid mode and ≥ 44 in advanced, with ≥ 8 px gaps.

**Simple vs advanced:**
- Kid mode is **icon and color only**. Text exists only in `aria-label`s and long-press tooltips.
- There is one-time onboarding: a 3-frame animated hand that taps, paints, then pinches. It is skippable and stored in localStorage.
- Advanced mode is reached through a settings gear with a long-press, so toddlers don't find it. It is persisted in `kci:mode`, and it is the default when `audience === 'adult'`.

**Keyboard (pragmatic, no 1,500 tab stops):**
- The stage is **one** focusable element: `tabindex=0`, `role="group"`, `aria-roledescription="coloring picture"`, labelled by the design title.
- Arrow keys move a **region cursor** spatially. The next region is the nearest `label` point within a ±45° cone in the arrow's direction, with ties broken by the `nb` adjacency.
- Enter or Space fills. The cursor ring is a 3 px high-contrast outline in the overlay, and the view auto-pans if the region is offscreen.
- `1`–`9` and `0` pick swatches. `B`, `F`, `E`, `I`, `H` pick tools. `[` and `]` change size. `+`, `−` and `0` zoom.
- Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z undo and redo. `N` jumps to the next unfilled region of the selected number. `Tab` leaves to the toolbar.

**Screen readers:**
- Tool buttons use `aria-pressed`.
- The palette is a `role="radiogroup"` of `role="radio"` swatches labelled with localized color names.
- A polite live region announces, for example, "Dome — filled with Sky Blue. 12 of 40 done." Region names come from the manifest (generated designs carry semantic names, such as "Minaret left" or "Star 3"); otherwise the label is "Area 17".

**Haptics and sound:**
- `navigator.vibrate` is used only for CBN completion `[30,40,30]` and strict-mode correct taps (8 ms). It sits behind a setting and is feature-detected.
- An optional WebAudio "pop" is synthesized with no audio files and is **off** by default. It is never used on `sacredText` designs.

**Reduced motion** (`matchMedia('(prefers-reduced-motion: reduce)')`) disables:
- ink-spread
- confetti
- inertia and spring
- animated zoom-to-hint, which becomes a jump

Pulses become static outlines.

**RTL:**
- The toolbar uses logical properties only (`inset-inline-*`, `margin-inline-*`, flex in DOM order). Undo/redo and back icons get the `.icon-flip` class under `[dir=rtl]`.
- **The stage is forced to `dir="ltr"` and the artwork is never mirrored.** Arabic letters and calligraphy must not flip.
- Numerals are localized (§2.5).

**Islamic-content behavior:**
- `sacredText` designs get no stickers, no confetti or sound, and neutral wording such as "Start fresh" instead of "Trash".
- Sticker and AI subject lists follow the site-wide "no faces / no animate beings" toggle and ISLAMIC-IMAGERY.md.

---

## 6. Component and file breakdown with the props contract

```
src/islands/coloring/
  ColoringApp.tsx            island root: props, engine lifecycle, mode switch, lazy chunk loader
  types.ts                   shared interfaces (below)
  strings.ts                 AppStringKey union (≈60 keys)
  core/
    engine.ts                Engine implementation (vector), wires store/history/layers
    DocStore.ts              vanilla store + selectors
    history.ts  commands.ts  History class; apply/revert/release/finalize per Command
    regions.ts               SVG adoption, Path2D cache, bg handling
    hitTest.ts               grid index + isPointInPath + tolerant sampling
    paints.ts  patterns.ts   Paint → <defs> keyed diff; pattern generators
    brush.ts                 perfect-freehand presets, outline→Path2D, drawStroke, grain
    rasterWindow.ts          adaptive window math + double-buffered replay
    gestures.ts              pointer state machine, palm/stylus rules, multi-finger taps
    viewport.ts              matrix math, fit, clamp, inertia, toDesign/toScreen
    colorByNumber.ts         (lazy) pure CBN logic
    storage.ts               IndexedDB wrapper, autosave scheduler, locks, broadcast
    export.ts                (lazy) PNG compose, print iframe, share/download
    a11y.ts                  spatial nav, announcer
    profile.ts               lite/standard/high detection
    raster/engine.ts  raster/labeler.worker.ts   (lazy)
  hooks/  useStore.ts  useHistory.ts  useZoomPan.ts
  ui/  Stage.tsx  RegionLayer.tsx  BrushLayer.tsx  OverlayLayer.tsx  KidToolbar.tsx
       AdvancedToolbar.tsx (lazy)  PaletteStrip.tsx  PaletteDrawer.tsx  ColorPicker.tsx (lazy)
       SizePicker.tsx  ZoomControls.tsx  CbnLegend.tsx (lazy)  DoneSheet.tsx (lazy)
       Celebration.tsx (lazy)  Icon.tsx
  coloring.css               Tailwind 4 @layer components; tokens from DESIGN.md as CSS vars
src/islands/gallery/MyGallery.tsx
src/pages/color-online/index.astro, [topic]/index.astro, [topic]/[design].astro
src/pages/my-coloring/index.astro
src/components/ColorOnlineButton.astro, ContinueStrip.astro (vanilla script)
```

```ts
// types.ts (core contracts)
export type RegionId = string;                                  // "r1".."r1499" | "bg"
export type Rect = [x: number, y: number, w: number, h: number];
export interface RegionMeta { id: RegionId; bbox: Rect; area: number; label: [number, number]; r: number;
  fillRule?: 'evenodd'; name?: string; cbn?: number; nb?: RegionId[]; tiny?: boolean }
export interface DesignManifest { schema: 1; slug: string; version: string; viewBox: [number, number, number, number];
  mode: 'vector' | 'raster'; lineWidth: number; regions: RegionMeta[];
  cbn?: { legend: { n: number; color: string; nameKey: string }[] };
  flags: { sacredText: boolean; animate: boolean; people: 'none' | 'faceless' };
  raster?: { lineArtUrl: string; labelsUrl: string; width: number; height: number } }
export type PatternId = 'dots'|'stripes'|'zigzag'|'checker'|'star8'|'zellige'|'scales'|'hexgrid';
export type Paint =
  | { k: 'solid'; c: string }
  | { k: 'linear'; c: string[]; from: [number, number]; to: [number, number] }
  | { k: 'radial'; c: string[]; at: [number, number]; r: number }
  | { k: 'pattern'; id: PatternId; fg: string; bg: string; scale: 1 | 2 | 3 }
  | { k: 'preset'; id: 'gold' | 'silver' | 'rainbow' | 'night-sky' };
export type ToolId = 'fill'|'brush'|'marker'|'crayon'|'eraser'|'eyedropper'|'hand'|'sticker';
export interface Stroke { id: number; tool: 'brush'|'marker'|'crayon'|'eraser'; color: string; size: number;
  opacity: number; region: RegionId | null; pts: Float32Array /* x,y,p */; bbox: Rect; pen: boolean; outline?: Path2D }
export type Command =
  | { t: 'fill'; region: RegionId; before: Paint | null; after: Paint | null; hid: number[] } // after:null = erase-tap
  | { t: 'stroke'; id: number }
  | { t: 'clear'; fills: Record<RegionId, Paint>; hid: number[] }
  | { t: 'batch'; cmds: Command[] };
export interface Viewport { s: number; tx: number; ty: number; fit: number }
export interface RasterWindow { x: number; y: number; w: number; h: number; k: number }
export interface ToolState { tool: ToolId; color: string; paintKind: Paint['k']; patternId?: PatternId;
  sizePx: number; opacity: number; stayInside: boolean; mode: 'kid' | 'advanced'; cbnSelected?: number; strict: boolean }

// Astro → island props (serialized; keep < 4 KB; art comes via slot, NOT props)
export interface ColoringAppProps {
  design: { slug: string; version: string; title: string; topic: string; topicTitle: string;
    viewBox: [number, number, number, number]; mode: 'vector' | 'raster';
    manifestUrl: string; artUrl: string; pdfUrl: string; designPageUrl: string;
    audience: 'kids' | 'adult'; difficulty: 1 | 2 | 3 | 4 | 5; hasCbn: boolean; sacredText: boolean };
  palette: { suggested: PaletteDef; catalogUrl: string };
  locale: { code: string; dir: 'ltr' | 'rtl'; numerals: 'latn' | 'arab' | 'arabext' | 'beng'; paper: 'letter' | 'a4' };
  strings: Record<AppStringKey, string>;   // only the keys the app uses; {region} {color} {done} {total} placeholders
  flags: { advancedDefault: boolean; crayon: boolean; stickers: boolean; member: boolean; ads: false };
  children?: React.ReactNode;              // slot: <svg.kc-regions/><svg.kc-lines/> | <img.kc-lineart/>
}
export interface PaletteDef { id: string; nameKey: string; icon: string; colors: { hex: string; nameKey: string }[] }

// Engine (imperative; React never touches art DOM)
export interface Engine {
  store: DocStore; history: History;
  attachArt(regions: SVGSVGElement | HTMLCanvasElement, lines: SVGSVGElement | HTMLImageElement): void;
  attachCanvases(dry: HTMLCanvasElement, wet: HTMLCanvasElement, overlay: SVGSVGElement): void;
  setManifest(m: DesignManifest): void;
  hitTest(clientX: number, clientY: number, tolerant: boolean): RegionId | null;
  fill(region: RegionId, paint: Paint | null): void;
  beginStroke(e: PointerEvent): void; extendStroke(e: PointerEvent): void; endStroke(commit: boolean): void;
  setViewport(v: Viewport, settled: boolean): void; zoomToRect(r: Rect, animate: boolean): void;
  pick(clientX: number, clientY: number): string | null;
  destroy(): void;
}

// UI component props
interface StageProps { engine: Engine; children: React.ReactNode }                 // viewport + content + layers
interface RegionLayerProps { children: React.ReactNode; onReady(r: SVGSVGElement, l: SVGSVGElement): void } // memo'd slot host
interface BrushLayerProps { onReady(dry: HTMLCanvasElement, wet: HTMLCanvasElement): void }
interface ToolbarProps { engine: Engine; strings: Strings; dir: 'ltr' | 'rtl' }    // Kid/Advanced variants read store
interface PaletteDrawerProps { open: boolean; onClose(): void; catalogUrl: string; strings: Strings }

// hooks
declare function useHistory(h: History): { canUndo: boolean; canRedo: boolean; undo(): void; redo(): void };
declare function useZoomPan(viewport: React.RefObject<HTMLElement>, content: React.RefObject<HTMLElement>,
  o: { min: number; max: number; onSettle(v: Viewport): void }):
  { scale: number /* settled only */; zoomBy(f: number, at?: [number, number]): void; fit(): void; zoomToRect(r: Rect): void };

// storage.ts
export declare function openDb(): Promise<IDBDatabase>;
export declare function findLatest(slug: string, version?: string): Promise<DocRecord | null>;
export declare function flush(doc: DocRecord, dirty: StrokeRecord[], deleted: number[]): Promise<void>;
export declare function loadStrokes(docId: string): Promise<StrokeRecord[]>;
export declare function listDocs(limit?: number): Promise<(DocRecord & { thumbUrl?: string })[]>;
export declare function deleteDoc(id: string): Promise<void>;
// export.ts
export declare function renderPng(engine: Engine, o: { longSide: number; watermark: boolean }): Promise<Blob>;
export declare function printArt(engine: Engine, o: { paper: 'letter' | 'a4' }): Promise<void>;
export declare function shareOrDownload(blob: Blob, filename: string, text: string): Promise<'shared' | 'downloaded' | 'cancelled'>;
// colorByNumber.ts
export interface CbnState { total: number; done: Set<RegionId>; perNumber: Map<number, { total: number; done: number }>; completedAt?: number }
export declare function initCbn(m: DesignManifest, restored?: RegionId[]): CbnState;
export declare function checkFill(s: CbnState, m: DesignManifest, region: RegionId, selected: number, strict: boolean): 'correct' | 'wrong-allowed' | 'rejected' | 'ignored';
export declare function nextHint(s: CbnState, m: DesignManifest, n: number, center: [number, number]): RegionId | null;
export declare function tinyAutocomplete(s: CbnState, m: DesignManifest, n: number): RegionId[];
```

```astro
---
// src/pages/color-online/[topic]/[design].astro
import ColoringApp from '@/islands/coloring/ColoringApp';
import AppLayout from '@/layouts/AppLayout.astro';
const { design, artSvgHtml, manifestUrl, palette, locale, strings, flags } = Astro.props; // from getStaticPaths
---
<AppLayout title={`Color the ${design.title} Online – ${design.topicTitle} | KidsColorIt`} robots="noindex,follow" dir={locale.dir}>
  <link slot="head" rel="preload" as="fetch" href={manifestUrl} crossorigin />
  <ColoringApp client:load design={design} palette={palette} locale={locale} strings={strings} flags={flags}>
    <Fragment set:html={artSvgHtml} />   <!-- rendered once in <astro-slot>; no prop duplication -->
  </ColoringApp>
  <noscript><a href={design.pdfUrl}>Download the printable PDF</a></noscript>
</AppLayout>
```

The slot HTML is read once from `<astro-slot>` at hydration and rendered by React as an opaque `dangerouslySetInnerHTML` element. `RegionLayer` wraps it in `memo` so it never re-renders. All later mutations (fills, defs) are imperative.

---

## 7. Testing

**Unit tests (Vitest 5).** The `node` project covers pure logic. The `browser` project uses `@vitest/browser-playwright` on Chromium for Path2D and canvas.

| File | Coverage |
|---|---|
| `core/history.test.ts` | push/undo/redo, redo cleared on push, eviction by count **and** bytes, batch atomicity, tombstone release/finalize |
| `core/commands.test.ts` | a fill hides that region's strokes and undo restores them in order; erase-tap; clear round-trip |
| `core/colorByNumber.test.ts` | progress counters; gentle vs strict; completion fires exactly once; the hint prefers nearest then smallest; tiny-bits autocomplete threshold |
| `core/viewport.test.ts` | the pinch midpoint is invariant; clamp and rubber-band; `toDesign∘toScreen = id` (property test over random matrices) |
| `core/paints.test.ts` | def dedupe by hash, GC of unreferenced defs, valid pattern SVG |
| `core/storage.test.ts` (`fake-indexeddb`) | DocRecord and Float32Array round-trip; incremental flush; version migration keeps surviving ids; the >20% loss rule |
| `core/hitTest.browser.test.ts` | grid candidates, reverse-order topmost, evenodd holes, tolerant sampling on a line between two rects |
| `core/brush.browser.test.ts` | a clipped stroke leaves 0 alpha outside the region; the dirty-rect replay equals a full replay (pixel compare) |

**E2E (`@playwright/test` 1.64)** against `astro preview`. Fixture designs (`fixture-grid` 3×3 rects, `fixture-cbn` 6 regions/3 numbers, `fixture-raster`) are built only when `KCI_FIXTURES=1`. The projects are `desktop-chromium` and `mobile-android` (Pixel 7, `hasTouch`). `mobile-webkit` runs when WebKit is installed in CI.

| Spec | Checks |
|---|---|
| `tests/e2e/coloring.spec.ts` | Tap the center of `[data-region="r5"]` and expect its `fill` attribute to be the selected hex. **Pixel-verify** with `page.screenshot({ clip })` read through `sharp(...).raw()`. Undo and redo via button and Ctrl+Z. Drag a brush across a boundary with stay-inside on, then `getImageData` shows alpha 0 outside the region and > 0 inside. Pinch through CDP `Input.dispatchTouchEvent` with 2 points, then `data-scale` > 1.5 and no stroke committed. Two-finger tap equals undo. Palm rejection: a synthetic `pen` pointerdown, then a touch drag, commits no stroke. |
| `tests/e2e/coloring-persist.spec.ts` | Fill, wait for `[data-save-state="saved"]`, reload, and the fill persists. `/my-coloring/` shows the card. A second tab is read-only. |
| `tests/e2e/coloring-export.spec.ts` | Download leads to `waitForEvent('download')`. Check the PNG signature and the IHDR size (2000×2588). The pixel at the r5 center equals the fill (via `sharp`). Golden image through `expect(buf).toMatchSnapshot({ maxDiffPixelRatio: 0.002 })`. `navigator.share` is stubbed with `addInitScript` to capture `File.type === 'image/png'`. `print` is stubbed in all frames, and the test asserts that the iframe contains an `svg.kc-lines`. |
| `tests/e2e/coloring-cbn.spec.ts` | Select swatch 2, tap its regions, check the progress text. Strict mode rejects a wrong tap. The completion sheet appears and the `navigator.vibrate` stub receives `[30,40,30]`. |
| `tests/e2e/coloring-a11y.spec.ts` | `@axe-core/playwright` finds 0 serious or critical issues. Keyboard path: Tab to the stage, Arrow, Enter fills, and the live region announces it. Under `reducedMotion: 'reduce'` no animations run (`document.getAnimations().length === 0` after a fill). In RTL (`dir=rtl` fixture) the toolbar is mirrored and the stage computed transform has no negative `scaleX`. |

**Mobile performance gate** (`tests/perf/coloring-mobile.perf.spec.ts`, Chromium, Pixel 7 emulation):
- CDP `Emulation.setCPUThrottlingRate({ rate: 4 })` and `Network.emulateNetworkConditions({ latency: 150, downloadThroughput: 204800, uploadThroughput: 96000 })`.
- **Assertions:**
  - `kci:interactive` mark < 2500 ms
  - LCP < 2000 ms (PerformanceObserver)
  - CLS = 0
  - long tasks sum < 200 ms
  - script `encodedBodySize` sum ≤ 100 KB
- **Brush:** a 2 s spiral of `Input.dispatchTouchEvent` moves every 8 ms. rAF deltas are sampled in the page. p95 frame time must be ≤ 20 ms under 4× throttle (the CI proxy for 60 fps on device), with < 5% dropped frames. `window.__kciRenderCount` (React Profiler `onRender`, test builds only) must not change during the stroke.
- **Nightly:** Lighthouse CI mobile on the fixture route, with budgets mirroring the above.
- **Pre-launch sign-off** happens manually on the reference devices through remote debugging and is logged in `docs/QA.md`.

---

## 8. Future (Phase 3, not for launch): AI generators

These sit behind the feature flag `ai_generator=false` and ship with landing pages `/coloring-page-generator/` and `/photo-to-coloring-page/` (about 2.4–4.4K and 1–3K searches a month).

**Endpoints** (Cloudflare Workers): `POST /api/ai/describe-page` and `POST /api/ai/photo-to-page`.
- Both are protected by Turnstile, which every generation must pass.
- The **Workers Rate Limiting binding** allows 5 generations a day per IP/device for anonymous users and 30 a day for members.
- A KV global daily cost cap acts as a kill switch.
- Cloudflare Queues absorb spikes.
- Results are cached in R2 by normalized prompt hash.

**Describe-your-page:**
1. Text moderation: a blocklist plus an LLM classifier against the ISLAMIC-IMAGERY.md policy. It blocks prophets, angels, any depiction of Allah, faces, licensed characters and brands, violence, and romance.
2. The prompt is rewritten into a locked style template: "bold clean black outlines, coloring book, white background, no shading, no text, no faces".
3. Image generation.
4. Output vision moderation for faces, people, religious figures, text and logos. One stricter retry is allowed, then a refusal with friendly icon-only copy.
5. Vectorize (potrace), then the region compiler (merge < 0.05% area, polylabel, CBN optional).
6. Return the SVG and manifest. The page opens as a **private, device-only** design in raster or vector mode.

Subject chips are pre-approved: mosque, lantern, dates, crescent, Eid table, kites, and camel (camel shown only when animals are allowed).

**Photo-to-page:**
1. The client downscales to 1024 px and re-encodes, which strips EXIF, behind a "grown-up" parent gate.
2. The server processes in memory only: no storage and no image logging.
3. **v1 accepts places and things only.** Photos where people or faces are detected are rejected, both for privacy (it is a kids' site) and for the "no faces" guarantee.
4. Line extraction (XDoG or a line-art model), then the same vectorize and compile steps.

Nothing user-generated is ever auto-published. A future "share to community" would need a human review queue.

---

## 9. Milestones (to land before the Ramadan hub must be indexed in mid-December 2026) and risks

| By | Deliverable |
|---|---|
| **Oct 30** | Engine core: vector regions, fill, hit-test, viewport, history, IndexedDB autosave, kid toolbar and palette strip, fixtures, unit tests |
| **Nov 13** | Brush, marker and eraser with clip; raster window; PNG, print and share; `/my-coloring/`; E2E plus the perf gate in CI |
| **Nov 27** | Color-by-number, advanced mode (gradients, patterns, picker, eyedropper), a11y and RTL pass, raster engine |
| **Dec 1–12** | Real-device hardening; Ramadan 2027 design set wired in; launch alongside the Ramadan hub |
| **Jan 2027 (v1.1)** | Crayon, Ramadan/Eid stickers, offline service worker (app shell, visited designs, immutable `/art/*`), sound, online Arabic-letter tracing mode (reusing the brush engine with `data-trace-order` guide paths and deviation scoring) |

**Risks and mitigations:**
1. **React runtime weight (about 58 KB gz).** Mitigations: hot paths outside React and aggressive splitting. Last resort, only if the A15 TTI gate fails after every other lever: run this one island under `@astrojs/preact` with `compat: true` scoped by include globs, which saves about 45 KB. That is not planned.
2. **iOS iframe printing and Safari 7-day storage eviction.** Mitigations: the share-sheet print path, the PWA install tip, and "download to keep" copy.
3. **1,500-region adult pages on lite devices.** Mitigations: lazy Path2D, grid hit-test, numeral culling. If p95 still exceeds budget, default adult pages to a "best on tablet or desktop" hint.
4. **Region quality from illustrated art.** The compiler's validation gates are hard build failures. Anything that fails goes to the raster engine rather than shipping broken taps.

Sources (version facts were checked with `npm view`; perfect-freehand is 1.2.3): [Astro 7.1 release](https://astro.build/blog/astro-710), [Astro changelog](https://releases.sh/astro.md), [Astro 7 / Vite 8 / Rolldown overview](https://nevercodealone.de/de/frontend-development/astro-js-static-site-generator-website-performance).