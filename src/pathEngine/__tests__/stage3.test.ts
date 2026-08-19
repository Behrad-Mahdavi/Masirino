import { runPathEngineWithTrace } from '../pathEngine';
import { buildHolland, buildGardner, buildMbti } from './fixtures';

describe('Stage 3 — MBTI Multiplicative Behavioral Filter', () => {
  test('Scenario 15: mbti = null results in mbtiMultiplier === 1.0 for all paths', () => {
    const trace = runPathEngineWithTrace(buildHolland(), buildGardner(['logical']), null, null);
    trace.stage3.forEach((item) => {
      expect(item.mbtiMultiplier).toBe(1.0);
    });
  });

  test('Scenario 16: Known MBTI profile calculates valid mbtiMultiplier', () => {
    const mbti = buildMbti('INTJ', [80, 70, 90, 60]);
    const trace = runPathEngineWithTrace(buildHolland(), buildGardner(['logical', 'spatial']), mbti, null);

    expect(trace.stage3.length).toBeGreaterThan(0);
    trace.stage3.forEach((item) => {
      expect(item.mbtiMultiplier).toBeGreaterThanOrEqual(0.1);
      expect(item.mbtiMultiplier).toBeLessThanOrEqual(1.0);
      expect(item.axisBreakdown.length).toBe(4);
    });
  });

  test('Scenario 17: certaintyPct = 0 on an axis gives axisContribution === 1.0', () => {
    const mbti = buildMbti('INTJ', [0, 50, 50, 50]);
    const trace = runPathEngineWithTrace(buildHolland(), buildGardner(['logical']), mbti, null);

    const firstPathStage3 = trace.stage3[0];
    const eiAxis = firstPathStage3.axisBreakdown.find((a) => a.axis === 'EI');

    expect(eiAxis).toBeDefined();
    expect(eiAxis!.certaintyPct).toBe(0);
    expect(eiAxis!.weightedDistance).toBe(0);
    expect(eiAxis!.axisContribution).toBe(1.0);
  });
});
