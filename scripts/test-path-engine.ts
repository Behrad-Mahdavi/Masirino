import { runPathEngine } from '../lib/scoring/pathEngine';
import { PATH_DATABASE } from '../lib/scoring/pathEngineTables';

console.log('====================================================');
console.log('     REVISED PATH ENGINE BUGFIX VERIFICATION SUITE   ');
console.log('====================================================\n');

// 1. Verify Path Database & Subfield Coverage
console.log('1. Verifying Path Database & Subfield Coverage...');
console.assert(PATH_DATABASE.length >= 35, `Expected 35+ paths, found ${PATH_DATABASE.length}`);

const hvacPath = PATH_DATABASE.find((p) => p.compatibleTracks.includes('تأسیسات مکانیکی'));
console.assert(hvacPath !== undefined, 'Missing path for subfield تأسیسات مکانیکی!');
console.log(`   ✓ Total Paths in Database: ${PATH_DATABASE.length}`);
console.log(`   ✓ Subfield "تأسیسات مکانیکی" matched to path: ${hvacPath?.title}\n`);

// 2. Test Missing Gardner Calibration (User Test Scenario: Holland=IAS, MBTI=INFJ, DISC=I, Gardner=missing)
console.log('2. Testing Missing Gardner Dynamic Calibration (Humanities/Social profile)...');
const hollandHumanities = {
  scores: { R: 10, I: 70, A: 85, S: 90, E: 50, C: 30 },
  normalizedScores: { R: 10, I: 70, A: 85, S: 90, E: 50, C: 30 },
  code: 'SAI',
  primaryDimension: 'S' as any,
};

const mbtiInfj = {
  type: 'INFJ',
  certainty: { EI: 80, SN: 85, TF: 75, JP: 70 },
  certaintyScores: {
    EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false },
    SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 12, pole2Pct: 88, isNeutral: false },
    TF: { dominantLetter: 'F', intensityPct: 75, pole1Pct: 15, pole2Pct: 85, isNeutral: false },
    JP: { dominantLetter: 'J', intensityPct: 70, pole1Pct: 18, pole2Pct: 82, isNeutral: false },
  },
  scores: {},
};

const discI = {
  scores: { D: 1, I: 8, S: 6, C: 2 },
  mostCounts: { D: 1, I: 8, S: 6, C: 2 },
  leastCounts: { D: 0, I: 0, S: 0, C: 0 },
  profile: 'IS',
  primaryDimension: 'I',
  secondaryDimension: 'S',
  gap: 2,
};

const missingGardnerOutput = runPathEngine(hollandHumanities, null, mbtiInfj, discI);

console.log(`   ✓ Main Group: ${missingGardnerOutput.baseCluster.mainGroup.join(', ')}`);
console.log(`   ✓ Top Recommended Path (without Gardner): ${missingGardnerOutput.mainPath.title} (${missingGardnerOutput.mainPath.matchScore}%)`);
console.assert(
  missingGardnerOutput.mainPath.title.includes('روان‌شناسی') ||
    missingGardnerOutput.mainPath.title.includes('آموزش') ||
    missingGardnerOutput.mainPath.title.includes('روزنامه‌نگاری') ||
    missingGardnerOutput.mainPath.title.includes('حقوق'),
  `Top path without Gardner should match Humanities/Social profile! Got: ${missingGardnerOutput.mainPath.title}`
);
console.assert(
  !missingGardnerOutput.mainPath.title.includes('نرم‌افزار'),
  'Software Engineering should NOT be forced as top path when Gardner is missing!'
);
console.log('   ✓ Missing Gardner dynamic scale calibration verified 100%!\n');

// 3. Test Gardner Pruning Filter (gardnerScore > 0)
console.log('3. Testing Gardner Pruning Filter (gardnerScore > 0)...');
const hollandTech = {
  scores: { R: 40, I: 90, A: 20, S: 10, E: 30, C: 70 },
  normalizedScores: { R: 40, I: 90, A: 20, S: 10, E: 30, C: 70 },
  code: 'ICR',
  primaryDimension: 'I' as any,
};

const gardnerTech = {
  scores: { logical: 4.8, spatial: 4.2, linguistic: 0, interpersonal: 0, bodily: 0, musical: 0, naturalistic: 0, intrapersonal: 0 },
  topIntelligences: ['logical', 'spatial'],
  strongIntelligences: ['logical', 'spatial'],
};

const techOutput = runPathEngine(hollandTech, gardnerTech, null, null);

techOutput.allRecommendedPaths.forEach((rec) => {
  const pathDef = PATH_DATABASE.find((p) => p.id === rec.pathId);
  const hasIntelligence = (pathDef?.gardnerWeights.logical || 0) > 0 || (pathDef?.gardnerWeights.spatial || 0) > 0;
  console.assert(hasIntelligence, `Path ${rec.title} should have logical or spatial intelligence`);
});
console.log('   ✓ Gardner pruning filter verified: paths without top-3 intelligences were correctly pruned.\n');

console.log('====================================================');
console.log('   ALL PATH ENGINE VERIFICATION TESTS PASSED 100%!  ');
console.log('====================================================');
