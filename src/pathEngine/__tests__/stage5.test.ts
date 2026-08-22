import { runPathEngineV2 } from '../pathEngine';
import { buildHolland, buildGardner, buildMbti, buildDisc } from './fixtures';

describe('Path Engine V2 — Stage 5: 7-Path Basket Assembler', () => {
  test('Scenario 1: Basket contains exactly 1 Main + 3 Alternative + 3 Complementary (7 paths)', () => {
    const output = runPathEngineV2(
      buildHolland({ R: 40, I: 92, A: 30, S: 20, E: 35, C: 70 }),
      buildGardner(['logical', 'spatial', 'intrapersonal']),
      buildMbti('INTJ'),
      buildDisc('C')
    );

    expect(output.basket.mainPath).toBeDefined();
    expect(output.basket.alternativePaths.length).toBe(3);
    expect(output.basket.complementaryPaths.length).toBe(3);
  });

  test('Scenario 2: Main path has the highest match score', () => {
    const output = runPathEngineV2(
      buildHolland({ R: 40, I: 92, A: 30, S: 20, E: 35, C: 70 }),
      buildGardner(['logical', 'spatial', 'intrapersonal']),
      buildMbti('INTJ'),
      buildDisc('C')
    );

    const mainScore = output.basket.mainPath.matchScore;
    output.basket.alternativePaths.forEach((alt) => {
      expect(mainScore).toBeGreaterThanOrEqual(alt.matchScore);
    });
  });

  test('Scenario 3: Complementary paths explore strictly distinct cross-cluster opportunities (3 unique clusters, none from main cluster)', () => {
    const output = runPathEngineV2(
      buildHolland({ R: 40, I: 92, A: 30, S: 20, E: 35, C: 70 }),
      buildGardner(['logical', 'spatial', 'intrapersonal']),
      buildMbti('INTJ'),
      buildDisc('C')
    );

    const mainClusterId = output.basket.mainPath.cluster.id;
    expect(output.basket.complementaryPaths.length).toBe(3);

    const compClusterIds = output.basket.complementaryPaths.map((p) => p.cluster.id);
    const uniqueCompClusters = new Set(compClusterIds);

    // Assert strictly 3 unique clusters among complementary paths
    expect(uniqueCompClusters.size).toBe(3);

    // Assert none of the complementary paths is from the main cluster
    expect(uniqueCompClusters.has(mainClusterId)).toBe(false);

    // Assert none of the complementary paths matches the main path jobId
    output.basket.complementaryPaths.forEach((comp) => {
      expect(comp.jobId).not.toBe(output.basket.mainPath.jobId);
    });
  });
});
