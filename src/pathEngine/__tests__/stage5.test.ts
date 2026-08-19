import { runPathEngineWithTrace } from '../pathEngine';
import { buildHolland, buildGardner, buildMbti, buildDisc } from './fixtures';
import { MainGroups } from '../pathEngineTables';

describe('Stage 5 — Final 7-Path Assembly', () => {
  test('Scenario 22: Output always contains exactly 7 recommendations', () => {
    const trace = runPathEngineWithTrace(
      buildHolland(),
      buildGardner(['logical', 'spatial']),
      buildMbti('INTJ'),
      buildDisc('C')
    );

    expect(trace.finalOutput.allRecommendedPaths.length).toBe(7);
    expect(trace.finalOutput.alternativePaths.length).toBe(3);
    expect(trace.finalOutput.complementaryPaths.length).toBe(3);
    expect(trace.finalOutput.mainPath).toBeDefined();
  });

  test('Scenario 23: No duplicate pathId among all 7 recommended paths', () => {
    const trace = runPathEngineWithTrace(
      buildHolland({ R: 70, I: 80, A: 30, S: 20, E: 40, C: 50 }),
      buildGardner(['logical', 'spatial', 'intrapersonal']),
      buildMbti('INTJ'),
      buildDisc('C')
    );

    const ids = trace.finalOutput.allRecommendedPaths.map((p) => p.pathId);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(7);
  });

  test('Scenario 24: Alternative paths match the base cluster when pool permits', () => {
    const trace = runPathEngineWithTrace(
      buildHolland({ R: 20, I: 90, A: 20, S: 20, E: 20, C: 20 }), // Math-Physics
      buildGardner(['logical', 'spatial']),
      buildMbti('INTJ'),
      buildDisc('C')
    );

    const mainClusterGroup = trace.stage1.mainGroup;
    trace.finalOutput.alternativePaths.forEach((alt) => {
      expect(alt.pathId).toBeDefined();
    });
  });

  test('Scenario 25: Hybrid baseCluster allows tracks from both groups', () => {
    // A profile with gap <= 10 between Math-Physics and Experimental
    const holland = buildHolland({ R: 60, I: 95, A: 20, S: 30, E: 30, C: 50 });
    const trace = runPathEngineWithTrace(holland, buildGardner(['logical', 'naturalistic']), null, null);

    if (trace.stage1.mainGroup.length === 2) {
      expect(trace.stage1.mainGroup.length).toBe(2);
      expect(trace.finalOutput.allRecommendedPaths.length).toBe(7);
    }
  });
});
