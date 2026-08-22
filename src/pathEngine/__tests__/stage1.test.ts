import { calculateCosineSimilarity, runPathEngineV2 } from '../pathEngine';
import { ONET_CAREER_CLUSTERS, ONET_CAREER_DATABASE } from '../pathEngineTables';
import { buildHolland, buildGardner, buildMbti, buildDisc } from './fixtures';

describe('Path Engine V2 — Stage 1: Holland Cosine Similarity & Cluster Affinity', () => {
  test('Scenario 1: Identity Cosine Similarity is 1.0 (100%)', () => {
    const vecA = { R: 40, I: 88, A: 35, S: 20, E: 35, C: 65 };
    const sim = calculateCosineSimilarity(vecA, vecA);
    expect(sim).toBeCloseTo(1.0, 4);
  });

  test('Scenario 2: Orthogonal vectors return 0.0 similarity', () => {
    const vecA = { R: 100, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const vecB = { R: 0, I: 100, A: 0, S: 0, E: 0, C: 0 };
    const sim = calculateCosineSimilarity(vecA, vecB);
    expect(sim).toBeCloseTo(0.0, 4);
  });

  test('Scenario 3: Analytical/IT profile ranks IT & Software as Top 1 Cluster', () => {
    const holland = buildHolland({ R: 40, I: 95, A: 25, S: 15, E: 30, C: 75 });
    const output = runPathEngineV2(holland, null, null, null);

    expect(output.topCareerClusters.length).toBe(3);
    expect(output.topCareerClusters[0].clusterId).toBe('it_software');
    expect(output.topCareerClusters[0].affinityScore).toBeGreaterThanOrEqual(80);
  });

  test('Scenario 4: Medical profile ranks Medical/Clinical as top cluster', () => {
    const holland = buildHolland({ R: 35, I: 95, A: 20, S: 80, E: 30, C: 60 });
    const output = runPathEngineV2(holland, null, null, null);

    expect(output.topCareerClusters[0].clusterId).toBe('medical_clinical');
    expect(output.topCareerClusters[0].affinityScore).toBeGreaterThan(80);
  });

  test('Scenario 5: Artistic profile ranks Cinema/Design as top clusters', () => {
    const holland = buildHolland({ R: 20, I: 40, A: 98, S: 60, E: 60, C: 25 });
    const output = runPathEngineV2(holland, null, null, null);

    const topClusterIds = output.topCareerClusters.map((c) => c.clusterId);
    expect(topClusterIds.some((id) => ['cinema_theatre', 'arts_creative', 'design_digital_arts'].includes(id))).toBe(true);
  });
});
