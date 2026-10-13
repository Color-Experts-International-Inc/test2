/**
 * Generator contract (docs/DECISIONS.md §Contracts). Generators are pure and deterministic:
 * all randomness comes from the injected Rng; never use Math.random or Date.
 * Coordinates are KCI units: 1 u = 0.01 in. Portrait artboard 720×940 u (7.20×9.40 in).
 */
import type { z } from 'zod';
import type { Difficulty } from './difficulty';

export type { Difficulty } from './difficulty';

export type Kind = 'coloring' | 'calendar' | 'tracker' | 'word-search' | 'maze' | 'worksheet' | 'card';
export type Artboard = 'portrait' | 'landscape';
export const ARTBOARD: Record<Artboard, { w: number; h: number }> = {
  portrait: { w: 720, h: 940 },
  landscape: { w: 940, h: 720 },
};

export interface Rng {
  /** uniform float in [0, 1) */
  next(): number;
  /** integer in [lo, hi] inclusive */
  int(lo: number, hi: number): number;
  float(lo: number, hi: number): number;
  pick<T>(items: readonly T[]): T;
  chance(p: number): boolean;
  shuffle<T>(items: readonly T[]): T[];
  /** independent, reproducible sub-stream */
  fork(label: string): Rng;
}

/**
 * One stroked or filled path. `d` uses absolute commands in artboard units.
 * - line: stroked outline that bounds colorable regions (stroke width = `width` u)
 * - solid: filled black shape (counts as ink, not colorable)
 * - guide: thin dashed/dotted helper (tracing, fold lines); not a region boundary
 * - label: filled text-as-path that is not colorable (headers, numbers, footers); counts as ink
 */
export interface InkPath {
  d: string;
  width: number;
  role: 'line' | 'solid' | 'guide' | 'label';
  dash?: number[];
}

export interface Page {
  artboard: Artboard;
  ink: InkPath[];
  /** true → region extraction runs and the page can be colored online */
  colorable: boolean;
  /** human label for multi-page products, e.g. "Answer key" */
  label?: string;
}

/** pages[0] is the master: it drives previews, the online app and region data. */
export interface Drawing {
  pages: Page[];
}

export interface Described {
  /** e.g. ['Hexagonal', 'Ramadan Lantern'] → "Hexagonal Ramadan Lantern" */
  titleParts: string[];
  /** ≤70 chars, never mentions faces */
  altDetail: string;
  /** one sentence used on noindex pages */
  blurb: string;
  tags: string[];
}

export interface Generator<P> {
  id: string;
  /** semver; any visual change ⇒ bump ⇒ snapshot update + re-approval */
  version: string;
  kind: Kind;
  artboard: Artboard;
  paramsSchema: z.ZodType<P>;
  sample(rng: Rng, difficulty: Difficulty): P;
  draw(params: P, rng: Rng, difficulty: Difficulty): Drawing;
  describe(params: P, difficulty: Difficulty): Described;
}
