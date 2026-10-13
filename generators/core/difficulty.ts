/** The single source of truth for difficulty levels (docs/DECISIONS.md #11). */
export const DIFFICULTIES = ['bold', 'easy', 'medium', 'hard', 'expert'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface DifficultySpec {
  label: string;
  ages: [number, number];
  /** ink width in KCI units (1 u = 0.254 mm) */
  inkWidth: number;
  regions: [number, number];
  /** minimum colorable region area, mm² at print size */
  minRegionMm2: number;
  /** minimum inscribed radius, mm */
  minInscribedMm: number;
  /** max fraction of the artboard covered by ink */
  maxCoverage: number;
}

export const DIFFICULTY: Record<Difficulty, DifficultySpec> = {
  bold: {
    label: 'Bold & Easy',
    ages: [2, 4],
    inkWidth: 7,
    regions: [6, 25],
    minRegionMm2: 150,
    minInscribedMm: 3.5,
    maxCoverage: 0.18,
  },
  easy: { label: 'Easy', ages: [4, 6], inkWidth: 5, regions: [15, 60], minRegionMm2: 60, minInscribedMm: 2.5, maxCoverage: 0.2 },
  medium: {
    label: 'Medium',
    ages: [6, 9],
    inkWidth: 3.5,
    regions: [50, 160],
    minRegionMm2: 20,
    minInscribedMm: 1.5,
    maxCoverage: 0.22,
  },
  hard: {
    label: 'Detailed',
    ages: [9, 12],
    inkWidth: 2.8,
    regions: [140, 400],
    minRegionMm2: 8,
    minInscribedMm: 1.0,
    maxCoverage: 0.25,
  },
  expert: {
    label: 'Expert',
    ages: [13, 99],
    inkWidth: 2.1,
    regions: [350, 1200],
    minRegionMm2: 3,
    minInscribedMm: 0.6,
    maxCoverage: 0.28,
  },
};

/** 1 KCI unit = 0.01 in = 0.254 mm. 1.5 pt = 0.529 mm ≈ 2.08 u (print floor). */
export const MM_PER_UNIT = 0.254;
export const MIN_STROKE_UNITS = 2.08;
