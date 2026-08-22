import { ONET_CAREER_CLUSTERS, ONET_CAREER_DATABASE } from '../pathEngineTables';

describe('O*NET Database Integrity & Psychometric Coverage', () => {
  test('Scenario 1: 20 Standard O*NET Macro Clusters are defined', () => {
    const clusterKeys = Object.keys(ONET_CAREER_CLUSTERS);
    expect(clusterKeys.length).toBe(20);
  });

  test('Scenario 2: Every O*NET career has valid RIASEC, Gardner, Environment vectors and 4 DISC roles', () => {
    expect(ONET_CAREER_DATABASE.length).toBeGreaterThan(0);

    ONET_CAREER_DATABASE.forEach((job) => {
      // 1. RIASEC
      expect(job.riasecVector.R).toBeGreaterThanOrEqual(0);
      expect(job.riasecVector.I).toBeGreaterThanOrEqual(0);
      expect(job.riasecVector.A).toBeGreaterThanOrEqual(0);
      expect(job.riasecVector.S).toBeGreaterThanOrEqual(0);
      expect(job.riasecVector.E).toBeGreaterThanOrEqual(0);
      expect(job.riasecVector.C).toBeGreaterThanOrEqual(0);

      // 2. Gardner
      expect(job.gardnerWeights.logical).toBeDefined();
      expect(job.gardnerWeights.spatial).toBeDefined();
      expect(job.gardnerWeights.linguistic).toBeDefined();

      // 3. Work Environment 6D
      expect(job.workEnvironment.structure).toBeGreaterThanOrEqual(0);
      expect(job.workEnvironment.social).toBeGreaterThanOrEqual(0);
      expect(job.workEnvironment.autonomy).toBeGreaterThanOrEqual(0);
      expect(job.workEnvironment.pace).toBeGreaterThanOrEqual(0);
      expect(job.workEnvironment.analytical_vs_valuebased).toBeGreaterThanOrEqual(0);
      expect(job.workEnvironment.competitiveness).toBeGreaterThanOrEqual(0);

      // 4. DISC Roles (D, I, S, C)
      expect(job.discRoles.D.roleTitle).toBeTruthy();
      expect(job.discRoles.I.roleTitle).toBeTruthy();
      expect(job.discRoles.S.roleTitle).toBeTruthy();
      expect(job.discRoles.C.roleTitle).toBeTruthy();
    });
  });
});
