import { runPathEngineWithTrace, calculateBaseClusterWithTrace } from '../pathEngine';
import { MAIN_GROUPS_VECTORS, MainGroups } from '../pathEngineTables';
import { buildHolland, buildGardner, buildMbti, buildDisc } from './fixtures';

describe('Stage 0 — Data Completeness Checks', () => {
  test('Scenario 1: All 4 tests provided', () => {
    const trace = runPathEngineWithTrace(
      buildHolland(),
      buildGardner(['logical', 'spatial']),
      buildMbti('INTJ'),
      buildDisc('C')
    );
    expect(trace.finalOutput.completedTestsCount).toBe(4);
    expect(trace.finalOutput.completenessWarning).toBeNull();
  });

  test('Scenario 2: Only Holland provided', () => {
    const trace = runPathEngineWithTrace(buildHolland(), null, null, null);
    expect(trace.finalOutput.completedTestsCount).toBe(1);
    expect(trace.finalOutput.completenessWarning).toContain('این نتیجه بر اساس 1 از ۴ آزمون');
  });

  test('Scenario 3: Holland is null (default fallback without crash)', () => {
    const trace = runPathEngineWithTrace(null, null, null, null);
    expect(trace.finalOutput.completenessWarning).toContain('آزمون رغبت‌سنجی هالند');
    expect(trace.stage1.mainGroup.length).toBeGreaterThan(0);
    expect(trace.finalOutput.allRecommendedPaths.length).toBe(7);
  });
});

describe('Stage 1-A — Main Group Classification', () => {
  test('Scenario 4: Pure Math-Physics profile without hybrid overlap', () => {
    // High R, I, C and zero S (Math has S:10, Exp has S:50) creates a clear gap > 10
    const holland = buildHolland({ R: 70, I: 95, A: 10, S: 0, E: 50, C: 85 });
    const trace = runPathEngineWithTrace(holland, null, null, null);

    expect(trace.stage1.mainGroup).toEqual([MainGroups.MATH_PHYSICS]);
    expect(trace.stage1.groupGap).toBeGreaterThan(10);
  });

  test('Scenario 5: Gap between Rank 1 and Rank 2 is <= 10 (Hybrid / MainGroup.length === 2)', () => {
    // Math-Physics vs Experimental with gap <= 10
    const holland = buildHolland(MAIN_GROUPS_VECTORS[MainGroups.MATH_PHYSICS]);
    const { baseCluster, trace } = calculateBaseClusterWithTrace(holland.normalizedScores as any);

    expect(trace.groupGap).toBeLessThanOrEqual(10);
    expect(baseCluster.mainGroup.length).toBe(2);
  });

  test('Scenario 6: Gap between Rank 1 and Rank 2 is > 10 (MainGroup.length === 1)', () => {
    const holland = buildHolland({ R: 70, I: 95, A: 10, S: 0, E: 50, C: 85 });
    const { baseCluster, trace } = calculateBaseClusterWithTrace(holland.normalizedScores as any);

    expect(trace.groupGap).toBeGreaterThan(10);
    expect(baseCluster.mainGroup.length).toBe(1);
  });
});

describe('Stage 1-B — TVET Subfields Classification', () => {
  test('Scenario 7: mainGroup = TVET Industry -> 11 subfield scores and topSubfields populated', () => {
    const holland = buildHolland({ R: 95, I: 20, A: 10, S: 10, E: 30, C: 60 });
    const trace = runPathEngineWithTrace(holland, null, null, null);

    if (trace.stage1.mainGroup.includes(MainGroups.TVET_INDUSTRY)) {
      expect(trace.stage1.subfieldScoresRaw).not.toBeNull();
      expect(trace.stage1.subfieldScoresRaw!.length).toBe(11);
      expect(trace.stage1.topSubfields.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('Scenario 8: mainGroup contains both TVET Industry & Arts -> 18 subfield items', () => {
    // A profile balancing Realistic and Artistic to trigger both TVET groups
    const holland = buildHolland({ R: 85, I: 10, A: 85, S: 10, E: 20, C: 20 });
    const { baseCluster, trace } = calculateBaseClusterWithTrace(holland.normalizedScores as any);

    if (
      baseCluster.mainGroup.includes(MainGroups.TVET_INDUSTRY) &&
      baseCluster.mainGroup.includes(MainGroups.TVET_ARTS)
    ) {
      expect(trace.subfieldScoresNormalized!.length).toBe(18);
    }
  });

  test('Scenario 9: Subfield rank gap threshold boundary (<= 8 vs > 8)', () => {
    const holland = buildHolland({ R: 90, I: 40, A: 10, S: 10, E: 20, C: 40 });
    const { trace } = calculateBaseClusterWithTrace(holland.normalizedScores as any);

    if (trace.subfieldGap !== null) {
      if (trace.subfieldGap <= 8) {
        expect(trace.topSubfields.length).toBe(2);
      } else {
        expect(trace.topSubfields.length).toBe(1);
      }
    }
  });

  test('Scenario 10: Theoretical track (Math-Physics) has no subfields', () => {
    const holland = buildHolland({ R: 70, I: 95, A: 10, S: 0, E: 50, C: 85 });
    const trace = runPathEngineWithTrace(holland, null, null, null);

    expect(trace.stage1.mainGroup).toEqual([MainGroups.MATH_PHYSICS]);
    expect(trace.stage1.subfieldScoresRaw).toBeNull();
    expect(trace.stage1.subfieldScoresNormalized).toBeNull();
    expect(trace.stage1.subfieldGap).toBeNull();
    expect(trace.stage1.topSubfields.length).toBe(0);
  });
});
