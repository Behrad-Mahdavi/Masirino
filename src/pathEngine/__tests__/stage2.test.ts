import { calculateGardnerFit, runPathEngineV2 } from '../pathEngine';
import { ONET_CAREER_DATABASE } from '../pathEngineTables';
import { buildGardner } from './fixtures';

describe('Path Engine V2 — Stage 2: Gardner Cognitive Suitability (No Artificial Track Bonus)', () => {
  test('Scenario 1: Perfect match on high-weight job intelligences yields high fit score', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const gardner = buildGardner(['logical', 'spatial', 'intrapersonal']);
    gardner.scores = { logical: 5.0, spatial: 5.0, intrapersonal: 5.0 } as any;

    const evalResult = calculateGardnerFit(gardner, devJob.gardnerWeights);
    expect(evalResult.fitScore).toBeGreaterThan(0.65);
    expect(evalResult.topUsed).toEqual(['logical', 'spatial', 'intrapersonal']);
  });

  test('Scenario 2: Completely mismatching intelligences yields low cognitive fit score', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    // Soft dev requires logical (0.95), spatial (0.6). Testing with bodily, musical, naturalistic (all 0.1):
    const gardner = buildGardner(['musical', 'bodily', 'naturalistic']);
    gardner.scores = { musical: 4.0, bodily: 4.0, naturalistic: 4.0 } as any;

    const evalResult = calculateGardnerFit(gardner, devJob.gardnerWeights);
    expect(evalResult.fitScore).toBeLessThan(0.25);
  });

  test('Scenario 3: Null Gardner gracefully falls back to neutral baseline without throwing', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const evalResult = calculateGardnerFit(null, devJob.gardnerWeights);
    expect(evalResult.fitScore).toBe(0.75);
  });
});
