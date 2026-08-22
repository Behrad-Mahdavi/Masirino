export interface GardnerResponse {
  dimension: string;
  value: number; // 1 to 5
}

export interface GardnerResult {
  scores: Record<string, number>; // average 1.0 to 5.0 across all 8 intelligences
  allScores?: Record<string, number>; // alias for explicit 8-intelligence score access
  topIntelligences: string[]; // Top 3 intelligence keys
  strongIntelligences: string[]; // Intelligences with score >= 4.0
  existentialScore?: number | null; // Supplementary
}

export const GARDNER_DIMENSIONS_FA: Record<string, string> = {
  linguistic: 'کلامی-زبانی',
  logical: 'منطقی-ریاضی',
  spatial: 'تصویری-فضایی',
  bodily: 'بدنی-جنبشی',
  musical: 'موسیقیایی',
  interpersonal: 'میان‌فردی',
  intrapersonal: 'درون‌فردی',
  naturalistic: 'طبیعت‌گرا',
  existential: 'وجود-شناختی (تکمیلی)',
};

const MAIN_8_ORDER = [
  'linguistic',
  'logical',
  'spatial',
  'bodily',
  'musical',
  'interpersonal',
  'intrapersonal',
  'naturalistic',
];

function calculateVariance(array: number[]): number {
  if (array.length <= 1) return 0;
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  const sumSquares = array.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
  return sumSquares / array.length;
}

export function scoreGardner(responses: GardnerResponse[]): GardnerResult {
  const groups: Record<string, number[]> = {};

  for (const r of responses) {
    if (!groups[r.dimension]) {
      groups[r.dimension] = [];
    }
    groups[r.dimension].push(r.value);
  }

  const scores: Record<string, number> = {};
  const variances: Record<string, number> = {};

  for (const [key, values] of Object.entries(groups)) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    scores[key] = parseFloat(avg.toFixed(2));
    variances[key] = calculateVariance(values);
  }

  // Handle existential separately if present
  let existentialScore: number | null = null;
  if (scores['existential'] !== undefined) {
    existentialScore = scores['existential'];
  }

  // Sort Main 8 Intelligences with tie-break rules:
  // 1. Higher score
  // 2. Lower variance (more consistent)
  // 3. Fixed order in table
  const sortedMain8 = [...MAIN_8_ORDER].filter((k) => scores[k] !== undefined).sort((a, b) => {
    const scoreDiff = (scores[b] ?? 0) - (scores[a] ?? 0);
    if (scoreDiff !== 0) return scoreDiff;

    const varDiff = (variances[a] ?? 0) - (variances[b] ?? 0); // lower variance comes first
    if (varDiff !== 0) return varDiff;

    return MAIN_8_ORDER.indexOf(a) - MAIN_8_ORDER.indexOf(b);
  });

  const topIntelligences = sortedMain8.slice(0, 3);
  const strongIntelligences = Object.entries(scores)
    .filter(([k, v]) => k !== 'existential' && v >= 4.0)
    .map(([k]) => k);

  return {
    scores,
    allScores: scores,
    topIntelligences,
    strongIntelligences,
    existentialScore,
  };
}
