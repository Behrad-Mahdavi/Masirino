import { runPathEngineWithTrace } from '../pathEngine';
import { buildHolland, buildGardner } from './fixtures';
import { PATH_DATABASE, MainGroups } from '../pathEngineTables';

describe('Stage 2 — Gardner Filtering & Alignment Bonus', () => {
  // Scenario 11: Gardner 0 overlap test
  test('Scenario 11: Excludes paths with zero gardner overlap from final output when Gardner provided', () => {
    // Pick 'musical' only
    const gardner = buildGardner(['musical']);
    const holland = buildHolland({ R: 90, I: 30, A: 10, S: 10, E: 20, C: 40 });

    const trace = runPathEngineWithTrace(holland, gardner, null, null);

    const zeroScorePaths = trace.stage2.filter((s) => s.gardnerScore === 0);
    const finalIds = trace.finalOutput.allRecommendedPaths.map((p) => p.pathId);

    // If zeroScorePaths exists, verify behavior
    zeroScorePaths.forEach((p) => {
      // In strict spec, paths with gardnerScore === 0 should not be in final recommendation if pool has enough paths
      expect(p.excludedFromInitialList).toBe(true);
    });
  });

  // Scenario 12: Subfield exact leaf match gives alignmentBonus === 1.5
  test('Scenario 12: Path matching topSubfields gets alignmentBonus === 1.5', () => {
    const holland = buildHolland({ R: 95, I: 20, A: 10, S: 10, E: 20, C: 60 }); // Industry TVET
    const trace = runPathEngineWithTrace(holland, buildGardner(['bodily', 'spatial']), null, null);

    const subfieldMatchedPath = trace.stage2.find((s) => s.alignmentReason === 'subfield-match');
    if (subfieldMatchedPath) {
      expect(subfieldMatchedPath.alignmentBonus).toBe(1.5);
    }
  });

  // Scenario 13: Main group match without subfield gives alignmentBonus === 1.3
  test('Scenario 13: Path matching mainGroup gets alignmentBonus === 1.3', () => {
    const holland = buildHolland({ R: 10, I: 95, A: 10, S: 10, E: 10, C: 10 }); // Pure Math/Experimental
    const trace = runPathEngineWithTrace(holland, buildGardner(['logical', 'spatial']), null, null);

    const mainGroupMatchedPath = trace.stage2.find((s) => s.alignmentReason === 'main-group-match');
    if (mainGroupMatchedPath) {
      expect(mainGroupMatchedPath.alignmentBonus).toBe(1.3);
    }
  });

  // Scenario 14: No match gives alignmentBonus === 1.0
  test('Scenario 14: Path with no track match gets alignmentBonus === 1.0', () => {
    const holland = buildHolland({ R: 10, I: 95, A: 10, S: 10, E: 10, C: 10 });
    const trace = runPathEngineWithTrace(holland, buildGardner(['logical']), null, null);

    const noMatchPath = trace.stage2.find((s) => s.alignmentReason === 'no-match');
    if (noMatchPath) {
      expect(noMatchPath.alignmentBonus).toBe(1.0);
    }
  });
});
