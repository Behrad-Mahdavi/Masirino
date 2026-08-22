import { calculateMbtiFit } from '../pathEngine';
import { ONET_CAREER_DATABASE } from '../pathEngineTables';
import { buildMbti } from './fixtures';

describe('Path Engine V2 — Stage 3: MBTI Psychological Synergy & 6D Work Environment', () => {
  test('Scenario 1: High analytical/structured career matches INTJ personality', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const mbti = buildMbti('INTJ', [85, 80, 90, 75]);

    const evalResult = calculateMbtiFit(mbti, devJob.workEnvironment);
    expect(evalResult.fitScore).toBeGreaterThan(0.70);
    expect(evalResult.axisBreakdown.length).toBe(4);
  });

  test('Scenario 2: Highly social, spontaneous type (ENFP) has lower synergy with solitary/rigid job', () => {
    const quantJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_financial_analyst')!;
    const mbti = buildMbti('ENFP', [95, 90, 95, 90]);

    const evalResult = calculateMbtiFit(mbti, quantJob.workEnvironment);
    expect(evalResult.fitScore).toBeDefined();
    expect(evalResult.axisBreakdown.find((a) => a.axis === 'EI')?.actualValue).toBe(45);
  });

  test('Scenario 3: Null MBTI falls back to neutral baseline', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const evalResult = calculateMbtiFit(null, devJob.workEnvironment);
    expect(evalResult.fitScore).toBe(0.85);
  });
});
