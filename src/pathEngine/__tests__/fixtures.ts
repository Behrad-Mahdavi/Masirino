import { HollandResult } from '../../../lib/scoring/holland';
import { GardnerResult } from '../../../lib/scoring/gardner';
import { MbtiResult } from '../../../lib/scoring/mbti';
import { DiscResult } from '../../../lib/scoring/disc';

export function buildHolland(
  overrides?: Partial<Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', number>>
): HollandResult {
  const base = { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50, ...overrides };
  return { scores: base, normalizedScores: base, code: '', primaryDimension: 'R' as any };
}

export function buildGardner(
  topIntelligences: string[],
  scores?: Record<string, number>
): GardnerResult {
  return { topIntelligences, scores } as unknown as GardnerResult;
}

export function buildMbti(
  type: string,
  certaintyPctPerAxis: [number, number, number, number] = [50, 50, 50, 50]
): MbtiResult {
  const axes = ['EI', 'SN', 'TF', 'JP'];
  const certaintyScores: any = {};
  axes.forEach((axis, i) => {
    certaintyScores[axis] = { dominantLetter: type[i] || 'X', intensityPct: certaintyPctPerAxis[i] };
  });
  return { type, certaintyScores } as MbtiResult;
}

export function buildDisc(profile: string): DiscResult {
  return { profile } as DiscResult;
}
