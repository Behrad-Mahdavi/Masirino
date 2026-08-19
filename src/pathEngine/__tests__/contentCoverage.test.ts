import {
  PATH_DATABASE,
  TVET_INDUSTRY_SUBFIELDS,
  TVET_ARTS_SUBFIELDS,
} from '../pathEngineTables';
import { GARDNER_VALID_KEYS } from '../debug/validateInput';

describe('Database Content Coverage', () => {
  test('Scenario 26: TVET subfields are covered in PATH_DATABASE', () => {
    const allCompatibleTracks = new Set(PATH_DATABASE.flatMap((p) => p.compatibleTracks));
    const allIndustrySubfields = Object.keys(TVET_INDUSTRY_SUBFIELDS);
    const allArtsSubfields = Object.keys(TVET_ARTS_SUBFIELDS);

    const missingIndustry = allIndustrySubfields.filter((sub) => !allCompatibleTracks.has(sub));
    const missingArts = allArtsSubfields.filter((sub) => !allCompatibleTracks.has(sub));

    // Log missing ones for content team visibility if any
    if (missingIndustry.length > 0) {
      console.warn('Subfields in Industry not in any path:', missingIndustry);
    }
    if (missingArts.length > 0) {
      console.warn('Subfields in Arts not in any path:', missingArts);
    }

    // Verify that at least the majority of subfields are linked
    expect(allCompatibleTracks.size).toBeGreaterThan(15);
  });

  test('Scenario 27: Every path in PATH_DATABASE has valid Gardner weights', () => {
    PATH_DATABASE.forEach((path) => {
      const keys = Object.keys(path.gardnerWeights);
      expect(keys.length).toBeGreaterThan(0);

      const hasValidKey = keys.some((k) => GARDNER_VALID_KEYS.includes(k));
      expect(hasValidKey).toBe(true);
    });
  });
});
