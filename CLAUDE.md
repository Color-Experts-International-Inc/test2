# kidscolorit.com

Islamic-first coloring and activity site for Muslim families. Astro 7 (static) + one React 19 island (`/color/`) + Tailwind 4, on Cloudflare Workers Static Assets. Artwork is code-generated vector art (generators/), shipped as vector PDFs (Letter + A4), WebP previews and an online fill-coloring app.

**Read first:** `docs/DECISIONS.md` (binding contracts) → `docs/PLAN.md` (full plan and rationale). Specialist research lives in `docs/_research/` (superseded by PLAN/DECISIONS where they disagree).

## Commands
- `pnpm install` · `pnpm dev` · `pnpm build` (astro build + pagefind)
- `pnpm gen <explore|build|derive|bundles>` — art pipeline (scripts/gen.ts)
- `pnpm test` (vitest) · `pnpm e2e` (Playwright, uses /opt/pw-browsers Chromium) · `pnpm typecheck` · `pnpm lint`
- `pnpm verify` — everything CI runs; must pass before every commit

## Invariants (CI enforces these)
- Generators are pure and deterministic: no `Math.random`, `Date`, network or fs inside `generators/`. Randomness only via the injected `Rng`.
- No `<text>` in any SVG; all text is converted to paths (harfbuzzjs for Arabic, font outlines for Latin).
- URLs and public file paths are built only in `src/lib/routes.ts`. Lowercase, trailing slash, no years in URLs.
- Content schemas live in `src/lib/schema.ts` and are shared by Astro, the pipeline and the QA gates.
- Imagery: Tier A aniconic by default; never prophets, angels, Allah, or faces on people. Sacred text (divine names, basmalah, shahada, Quran, du'a) is never colorable. See `docs/ISLAMIC-IMAGERY.md`.
- Review tiers: R2 content (Arabic strings, people, sacred places, worship steps, sacred text) is excluded from production builds until the reviewer fields are set.
- Design pages are `noindex,follow` unless `seo.index: true` (DECISIONS #6). Hubs need ≥20 designs to be indexable.
- Only `/color/` loads React. Content pages ship ≤10 KB gz JS (vanilla scripts only).
- CSS uses logical properties only (RTL-ready); no `ml-/mr-/pl-/pr-/left-/right-/text-left/text-right`.
- Children-directed privacy: no cookies, no third-party trackers, no PII forms, no query logging.
- `public/files/` and `.kci/` are generated (gitignored); `art/.snapshots.json` is committed.
