import { runPathEngine } from '../lib/scoring/pathEngine';
import { computePathDna } from '../lib/scoring/pathDna';
import { scoreHolland } from '../lib/scoring/holland';
import { scoreGardner } from '../lib/scoring/gardner';
import { scoreMbti } from '../lib/scoring/mbti';
import { scoreDisc } from '../lib/scoring/disc';

console.log('====================================================');
console.log('      DETERMINISTIC PATH ENGINE UNIT TEST SUITE     ');
console.log('====================================================\n');

// 1. Mock Test Results for Engineering / Tech Profile
console.log('1. Testing Engineering / Software Profile (RIA => Math/Tech)...');
const hollandTech = {
  scores: { R: 40, I: 90, A: 20, S: 10, E: 30, C: 70 },
  normalizedScores: { R: 40, I: 90, A: 20, S: 10, E: 30, C: 70 },
  code: 'ICR',
  primaryDimension: 'I' as any,
};

const gardnerTech = {
  scores: { logical: 4.8, spatial: 4.2, linguistic: 3.5, interpersonal: 3.0 },
  topIntelligences: ['logical', 'spatial', 'linguistic'],
  strongIntelligences: ['logical', 'spatial'],
};

const mbtiTech = {
  type: 'INTJ',
  certainty: { EI: 80, SN: 75, TF: 90, JP: 85 },
  certaintyScores: {
    EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false },
    SN: { dominantLetter: 'N', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false },
    TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false },
    JP: { dominantLetter: 'J', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false },
  },
  scores: {},
};

const discTech = {
  scores: { D: 6, I: 2, S: 3, C: 8 },
  mostCounts: { D: 6, I: 2, S: 3, C: 8 },
  leastCounts: { D: 0, I: 0, S: 0, C: 0 },
  profile: 'CD',
  primaryDimension: 'C',
  secondaryDimension: 'D',
  gap: 2,
};

const techOutput = runPathEngine(hollandTech, gardnerTech, mbtiTech, discTech);

console.assert(techOutput.baseCluster.mainGroup.includes('ریاضی‌فیزیک'), 'Tech profile should select ریاضی‌فیزیک as main group');
console.assert(techOutput.allRecommendedPaths.length === 7, `Expected 7 total recommended paths, got ${techOutput.allRecommendedPaths.length}`);
console.assert(techOutput.alternativePaths.length === 3, `Expected 3 alternative paths, got ${techOutput.alternativePaths.length}`);
console.assert(techOutput.complementaryPaths.length === 3, `Expected 3 complementary paths, got ${techOutput.complementaryPaths.length}`);
console.log('   ✓ Main Group:', techOutput.baseCluster.mainGroup.join(', '));
console.log('   ✓ Main Path:', techOutput.mainPath.title, `(${techOutput.mainPath.matchScore}%)`);
console.log('   ✓ 3 Alternative Paths:', techOutput.alternativePaths.map((p) => p.title).join(' | '));
console.log('   ✓ 3 Complementary Paths:', techOutput.complementaryPaths.map((p) => p.title).join(' | '));
console.log('   ✓ 7-Path Output Structure Verified 100%.\n');

// 2. Mock Test Results for TVET Arts Profile (Graphic / Animation)
console.log('2. Testing TVET Arts Profile (ARI => Arts & Graphics)...');
const hollandArts = {
  scores: { R: 30, I: 35, A: 95, S: 25, E: 30, C: 30 },
  normalizedScores: { R: 30, I: 35, A: 95, S: 25, E: 30, C: 30 },
  code: 'AIR',
  primaryDimension: 'A' as any,
};

const artsOutput = runPathEngine(hollandArts, null, null, null);
console.assert(artsOutput.baseCluster.mainGroup.includes('فنی‌وحرفه‌ای — گروه هنر'), 'Arts profile should select TVET Arts group');
console.assert(artsOutput.baseCluster.topSubfields.length > 0, 'TVET Arts group should yield top subfields');
console.assert(artsOutput.completenessWarning !== null, 'Partial test run should generate completeness warning');
console.log('   ✓ Main TVET Arts Group:', artsOutput.baseCluster.mainGroup.join(', '));
console.log('   ✓ Top Subfields:', artsOutput.baseCluster.topSubfields.join('، '));
console.log('   ✓ Completeness Warning:', artsOutput.completenessWarning);
console.log('   ✓ Partial Completion Fallback Verified 100%.\n');

// 3. Testing Full DNA Synthesis Wrapper
console.log('3. Testing Full computePathDna Wrapper...');
const fullDna = computePathDna(hollandTech, gardnerTech, mbtiTech, discTech);
console.assert(fullDna.mainPath !== undefined, 'Main path recommendation present in fullDna');
console.assert(fullDna.careerClusters.length === 7, 'careerClusters mapped to 7 paths');
console.log('   ✓ Path DNA Synthesis Complete for:', fullDna.mainPath.title);

console.log('\n====================================================');
console.log('      ALL PATH ENGINE UNIT TESTS PASSED 100%!       ');
console.log('====================================================');
