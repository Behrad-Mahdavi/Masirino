import { extractDiscPositioning, runPathEngineV2 } from '../pathEngine';
import { ONET_CAREER_DATABASE } from '../pathEngineTables';
import { buildHolland, buildGardner, buildMbti, buildDisc } from './fixtures';

describe('Path Engine V2 — Stage 4: DISC Behavioral In-Role Positioning & MatchScore', () => {
  test('Scenario 1: Profile D maps to strategic leadership / Tech Lead role in software', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const disc = buildDisc('D');

    const pos = extractDiscPositioning(disc, devJob.discRoles);
    expect(pos.dominantArchetype).toBe('D');
    expect(pos.targetRoleTitle).toContain('معمار سیستم و لید فنی');
    expect(pos.strengthsInRole.length).toBeGreaterThan(0);
  });

  test('Scenario 2: Profile I maps to advocacy/communication in software', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const disc = buildDisc('I');

    const pos = extractDiscPositioning(disc, devJob.discRoles);
    expect(pos.dominantArchetype).toBe('I');
    expect(pos.targetRoleTitle).toContain('توسعه‌دهنده ارتباط با محصول');
  });

  test('Scenario 3: Profile C maps to security/quality/algorithms in software', () => {
    const devJob = ONET_CAREER_DATABASE.find((j) => j.id === 'onet_soft_dev')!;
    const disc = buildDisc('C');

    const pos = extractDiscPositioning(disc, devJob.discRoles);
    expect(pos.dominantArchetype).toBe('C');
    expect(pos.targetRoleTitle).toContain('امنیت، کیفیت و الگوریتم');
  });

  test('Scenario 4: DISC does not artificially suppress MatchScore (MatchScore in 0-100%)', () => {
    const outputD = runPathEngineV2(buildHolland(), buildGardner(), buildMbti('INTJ'), buildDisc('D'));
    const outputC = runPathEngineV2(buildHolland(), buildGardner(), buildMbti('INTJ'), buildDisc('C'));

    expect(outputD.basket.mainPath.matchScore).toBeGreaterThan(0);
    expect(outputD.basket.mainPath.matchScore).toBeLessThanOrEqual(100);
    expect(outputC.basket.mainPath.matchScore).toBeGreaterThan(0);
  });
});
