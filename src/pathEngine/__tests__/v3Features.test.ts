import {
  calculateAdaptiveWeights,
  build20DJobEmbedding,
  calculate20DDotProduct,
  calculateMarketViabilityScore,
  calculateStrategicScore,
  runPathEngineV2,
} from '../../../lib/scoring/pathEngine';
import { ONET_CAREER_DATABASE } from '../../../lib/scoring/pathEngineTables';
import { HollandResult } from '../../../lib/scoring/holland';
import { GardnerResult } from '../../../lib/scoring/gardner';
import { MbtiResult } from '../../../lib/scoring/mbti';

describe('PathEngine V3 — Advanced Features (Adaptive Weights, 20D MMR & Dual-Scores)', () => {
  test('V3.1: Adaptive Dynamic Weights calculation with confidence priors', () => {
    // High Holland differentiation, high Gardner variance, high MBTI intensity
    const holland = {
      normalizedScores: { R: 95, I: 20, A: 15, S: 10, E: 20, C: 30 }, // max - min = 85 -> alphaH = 0.85
    } as unknown as HollandResult;

    const gardner = {
      allScores: { logical: 5.0, spatial: 4.8, linguistic: 2.0, interpersonal: 1.5, intrapersonal: 4.5, bodily: 1.0, musical: 1.0, naturalistic: 1.0 },
    } as unknown as GardnerResult;

    const mbti = {
      type: 'INTJ',
      certaintyScores: {
        EI: { dominantLetter: 'I', intensityPct: 90 },
        SN: { dominantLetter: 'N', intensityPct: 85 },
        TF: { dominantLetter: 'T', intensityPct: 95 },
        JP: { dominantLetter: 'J', intensityPct: 80 },
      },
    } as unknown as MbtiResult;

    const weights = calculateAdaptiveWeights(holland, gardner, mbti);

    expect(weights.holland).toBeGreaterThan(0);
    expect(weights.gardner).toBeGreaterThan(0);
    expect(weights.mbti).toBeGreaterThan(0);

    const sum = weights.holland + weights.gardner + weights.mbti;
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
  });

  test('V3.2: Missing tests stability in Adaptive Weights', () => {
    const weights = calculateAdaptiveWeights(null, null, null);

    expect(weights.holland).toBeCloseTo(0.35, 1);
    expect(weights.gardner).toBeCloseTo(0.35, 1);
    expect(weights.mbti).toBeCloseTo(0.30, 1);
    expect(weights.holland + weights.gardner + weights.mbti).toBeCloseTo(1.0, 2);
  });

  test('V3.3: 20D Multimodal embedding generation and L2 Unit Normalization', () => {
    const job = ONET_CAREER_DATABASE[0];
    const embedding = build20DJobEmbedding(job);

    expect(embedding.length).toBe(20);

    // L2 norm must equal 1.0
    const normSq = embedding.reduce((sum, v) => sum + v * v, 0);
    const norm = Math.sqrt(normSq);
    expect(norm).toBeCloseTo(1.0, 3);
  });

  test('V3.4: Fast O(1) Dot Product Cosine Similarity between 20D job embeddings', () => {
    const job1 = ONET_CAREER_DATABASE[0];
    const job2 = ONET_CAREER_DATABASE[1];

    const v1 = build20DJobEmbedding(job1);
    const v2 = build20DJobEmbedding(job2);

    const simSelf = calculate20DDotProduct(v1, v1);
    expect(simSelf).toBeCloseTo(1.0, 3);

    const simOther = calculate20DDotProduct(v1, v2);
    expect(simOther).toBeGreaterThanOrEqual(0.0);
    expect(simOther).toBeLessThanOrEqual(1.0);
  });

  test('V3.5: Market Viability Score and Strategic Score calculation', () => {
    const insight = {
      demandOutlook: 'rising' as const,
      automationRiskPercent: 15,
      remoteCompatibilityPercent: 85,
      salaryBandTomanMonthly: { entry: 25000000, mid: 50000000, senior: 90000000 },
      globalRelevance: 'global' as const,
    };

    const marketViability = calculateMarketViabilityScore(insight);
    expect(marketViability).toBeGreaterThan(70);

    const psychometricFit = 90;
    const strategicScore = calculateStrategicScore(psychometricFit, marketViability);

    expect(strategicScore).toBeGreaterThanOrEqual(psychometricFit * 0.7);
    expect(strategicScore).toBeLessThanOrEqual(100);
  });

  test('V3.6: MMR Score and Diversity in 7-Path Basket Complementary Selection', () => {
    const holland = {
      normalizedScores: { R: 40, I: 92, A: 30, S: 20, E: 35, C: 70 },
    } as unknown as HollandResult;

    const output = runPathEngineV2(holland, null, null, null);

    expect(output.adaptiveWeightsUsed).toBeDefined();
    expect(output.basket.complementaryPaths.length).toBe(3);

    // Each complementary path should have mmrScore assigned and belong to distinct clusters
    const compClusters = new Set<string>();
    output.basket.complementaryPaths.forEach((cp) => {
      expect(cp.marketViabilityScore).toBeDefined();
      expect(cp.strategicScore).toBeDefined();
      expect(cp.mmrScore).toBeDefined();
      expect(cp.cluster.id).not.toBe(output.basket.mainPath.cluster.id);
      expect(compClusters.has(cp.cluster.id)).toBe(false);
      compClusters.add(cp.cluster.id);
    });

    expect(compClusters.size).toBe(3);
  });
});
