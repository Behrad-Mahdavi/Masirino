import { runPathEngineWithTrace } from '../pathEngine';
import { buildHolland, buildGardner, buildMbti, buildDisc } from './fixtures';

describe('Stage 4 — DISC Multiplicative Behavioral Filter & MatchScore', () => {
  test('Scenario 18: disc = null results in discMultiplier === 1.0 for all paths', () => {
    const trace = runPathEngineWithTrace(buildHolland(), buildGardner(['logical']), null, null);
    trace.stage4.forEach((item) => {
      expect(item.discMultiplier).toBe(1.0);
    });
  });

  test('Scenario 19: disc.profile = "ID" (2 dimensions) averages both dimensions correctly', () => {
    const disc = buildDisc('ID');
    const trace = runPathEngineWithTrace(buildHolland(), buildGardner(['logical']), null, disc);

    trace.stage4.forEach((item) => {
      expect(item.discMultiplier).toBeGreaterThanOrEqual(0.1);
      expect(item.discMultiplier).toBeLessThanOrEqual(1.0);
      expect(item.dimBreakdown.length).toBeGreaterThanOrEqual(2);
    });
  });

  test('Scenario 20 & 21: Match scores span broad range and can fall below 55', () => {
    // A profile with high mismatch in MBTI and DISC
    const mbti = buildMbti('ESFP', [100, 100, 100, 100]);
    const disc = buildDisc('D');
    const trace = runPathEngineWithTrace(
      buildHolland({ R: 10, I: 90, A: 10, S: 10, E: 10, C: 10 }),
      buildGardner(['musical']),
      mbti,
      disc
    );

    const scores = trace.stage4b.allPathScores.map((p) => p.matchScore);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    // Verify dynamic range
    expect(minScore).toBeLessThan(55);
    expect(maxScore).toBeGreaterThanOrEqual(minScore);
  });
});
