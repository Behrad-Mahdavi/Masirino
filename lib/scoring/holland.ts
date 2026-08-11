export interface HollandResponse {
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  value: number; // 1 to 5
}

export interface HollandResult {
  scores: Record<string, number>;
  normalizedScores: Record<string, number>;
  code: string; // Top 3 letters e.g. "SAE"
  primaryDimension: string;
}

const FIXED_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];

export function scoreHolland(responses: HollandResponse[]): HollandResult {
  const totals: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const r of responses) {
    totals[r.dimension] = (totals[r.dimension] ?? 0) + r.value;
    counts[r.dimension] = (counts[r.dimension] ?? 0) + 1;
  }

  const normalizedScores: Record<string, number> = {};
  for (const key of FIXED_ORDER) {
    const answeredCount = counts[key] || 1;
    const maxPossible = answeredCount * 5;
    normalizedScores[key] = Math.round(((totals[key] || 0) / maxPossible) * 100);
  }

  // Sorting with 3-stage Tie-break rule:
  // 1. Higher normalizedScore
  // 2. Higher raw score
  // 3. Fixed order: R > I > A > S > E > C
  const sortedDimensions = [...FIXED_ORDER].sort((a, b) => {
    const normDiff = (normalizedScores[b] || 0) - (normalizedScores[a] || 0);
    if (normDiff !== 0) return normDiff;

    const rawDiff = (totals[b] || 0) - (totals[a] || 0);
    if (rawDiff !== 0) return rawDiff;

    return FIXED_ORDER.indexOf(a) - FIXED_ORDER.indexOf(b);
  });

  const code = sortedDimensions.slice(0, 3).join('');
  const primaryDimension = sortedDimensions[0] || 'R';

  return {
    scores: totals,
    normalizedScores,
    code,
    primaryDimension,
  };
}
