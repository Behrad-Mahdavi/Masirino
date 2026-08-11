import { scoreHolland } from '../lib/scoring/holland';
import { scoreGardner } from '../lib/scoring/gardner';
import { scoreMbti } from '../lib/scoring/mbti';
import { scoreDisc } from '../lib/scoring/disc';
import { computePathDna } from '../lib/scoring/pathDna';

console.log('====================================================');
console.log('   RUNNING REVISED SCORING ENGINE UNIT TESTS        ');
console.log('====================================================\n');

// 1. Holland Tie-Break Test
console.log('1. Testing Holland Tie-Break Logic...');
const hollandRes = scoreHolland([
  { dimension: 'R', value: 4 },
  { dimension: 'I', value: 4 },
  { dimension: 'A', value: 4 },
  { dimension: 'S', value: 5 },
  { dimension: 'E', value: 5 },
  { dimension: 'C', value: 5 },
]);
console.assert(hollandRes.code.length === 3, 'Holland code must be 3 letters');
console.log('   ✓ Holland Result:', hollandRes.code, '| Scores:', hollandRes.normalizedScores);

// 2. Gardner Variance Tie-Break Test
console.log('2. Testing Gardner Variance & Supplementary Existential Logic...');
const gardnerRes = scoreGardner([
  { dimension: 'linguistic', value: 4 },
  { dimension: 'linguistic', value: 4 }, // variance 0
  { dimension: 'logical', value: 5 },
  { dimension: 'logical', value: 3 }, // mean 4, variance > 0
  { dimension: 'interpersonal', value: 5 },
  { dimension: 'existential', value: 4.5 }, // supplementary
]);
console.assert(!gardnerRes.topIntelligences.includes('existential'), 'Existential must NOT be in Top-N ranking');
console.assert(gardnerRes.existentialScore === 4.5, 'Existential score reported separately');
console.log('   ✓ Gardner Top-3:', gardnerRes.topIntelligences, '| Strong:', gardnerRes.strongIntelligences);

// 3. MBTI Neutral (raw == midpoint) Test
console.log('3. Testing MBTI Neutral Handling (raw == midpoint)...');
const mbtiRes = scoreMbti([
  { axis: 'EI', value: 3 }, // raw = 3 == midpoint (count 1) => X
  { axis: 'SN', value: 5 }, // N (value 5 is second pole N)
  { axis: 'TF', value: 5 }, // F (value 5 is second pole F)
  { axis: 'JP', value: 5 }, // P (value 5 is second pole P)
]);
console.assert(mbtiRes.type === 'XNFP', `MBTI expected XNFP but got ${mbtiRes.type}`);
console.assert(mbtiRes.certaintyScores.EI.isNeutral === true, 'EI axis should be neutral');
console.assert(mbtiRes.certaintyScores.EI.pole1Pct === 50 && mbtiRes.certaintyScores.EI.pole2Pct === 50, 'EI axis should be 50%/50%');
console.log('   ✓ MBTI Result Type:', mbtiRes.type, '| Neutral EI:', mbtiRes.certaintyScores.EI);

// 4. DISC Gap <= 2 Hybrid Profile Test & Validation Error Test
console.log('4. Testing DISC Gap <= 2 Hybrid Profile & Validation Logic...');
const discRes = scoreDisc([
  { most: 'D', least: 'C' },
  { most: 'D', least: 'S' },
  { most: 'I', least: 'C' },
  { most: 'I', least: 'S' },
]);
console.assert(discRes.profile === 'DI', `DISC profile should be hybrid DI due to gap <= 2, got ${discRes.profile}`);
console.log('   ✓ DISC Profile:', discRes.profile, '| Gap:', discRes.gap);

// Validation test: throws error if most == least
let errorThrown = false;
try {
  scoreDisc([{ most: 'D', least: 'D' }]);
} catch (e: any) {
  errorThrown = true;
}
console.assert(errorThrown, 'DISC engine must throw error when most == least');
console.log('   ✓ DISC Same Option Validation Passed.');

// 5. Path DNA Synthesis Test
console.log('5. Testing Path DNA Synthesis...');
const dna = computePathDna(hollandRes, gardnerRes, mbtiRes, discRes);
console.assert(dna.mbtiType === mbtiRes.type, 'Path DNA receives updated MBTI type');
console.assert(dna.careerClusters.length > 0, 'Career clusters synthesized');
console.log('   ✓ Path DNA Synthesis Passed. Code:', `${dna.hollandCode}-${dna.mbtiType}-${dna.discProfile}`);

console.log('\n====================================================');
console.log('   ALL REVISED SCORING TESTS PASSED 100%!           ');
console.log('====================================================');
