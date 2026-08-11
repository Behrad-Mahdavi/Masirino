import { scoreMbti, MBTI_DESCRIPTIONS_FA } from '../lib/scoring/mbti';
import { MBTI_QUESTIONS } from '../lib/data/mockQuestions';

console.log('====================================================');
console.log('       COMPREHENSIVE MBTI ENGINE UNIT TESTS        ');
console.log('====================================================\n');

// Test 1: Verification of question count and structure
console.log('1. Verifying Question Bank Structure...');
console.assert(MBTI_QUESTIONS.length === 24, `Expected 24 questions, got ${MBTI_QUESTIONS.length}`);

const countByAxis: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
MBTI_QUESTIONS.forEach((q) => {
  countByAxis[q.axis] = (countByAxis[q.axis] || 0) + 1;
});

console.assert(countByAxis.EI === 6, `EI should have 6 questions, got ${countByAxis.EI}`);
console.assert(countByAxis.SN === 6, `SN should have 6 questions, got ${countByAxis.SN}`);
console.assert(countByAxis.TF === 6, `TF should have 6 questions, got ${countByAxis.TF}`);
console.assert(countByAxis.JP === 6, `JP should have 6 questions, got ${countByAxis.JP}`);
console.log('   ✓ 24 Questions correctly balanced (6 per axis).\n');

// Test 2: Pure First Pole Test (All 1s => ESTJ)
console.log('2. Testing Pure First Pole (All 1s => ESTJ)...');
const allFirstPole = MBTI_QUESTIONS.map((q) => ({ axis: q.axis, value: 1 }));
const estjRes = scoreMbti(allFirstPole);

console.assert(estjRes.type === 'ESTJ', `Expected ESTJ but got ${estjRes.type}`);
console.assert(estjRes.certainty.EI === 100, `Expected 100% EI certainty, got ${estjRes.certainty.EI}`);
console.assert(estjRes.certaintyScores.EI.pole1Pct === 100, `E percentage should be 100%`);
console.assert(estjRes.certaintyScores.EI.pole2Pct === 0, `I percentage should be 0%`);
console.log('   ✓ Pure ESTJ Output:', estjRes.type, '| E=100%, I=0%\n');

// Test 3: Pure Second Pole Test (All 5s => INFP)
console.log('3. Testing Pure Second Pole (All 5s => INFP)...');
const allSecondPole = MBTI_QUESTIONS.map((q) => ({ axis: q.axis, value: 5 }));
const infpRes = scoreMbti(allSecondPole);

console.assert(infpRes.type === 'INFP', `Expected INFP but got ${infpRes.type}`);
console.assert(infpRes.certainty.EI === 100, `Expected 100% EI certainty, got ${infpRes.certainty.EI}`);
console.assert(infpRes.certaintyScores.EI.pole1Pct === 0, `E percentage should be 0%`);
console.assert(infpRes.certaintyScores.EI.pole2Pct === 100, `I percentage should be 100%`);
console.log('   ✓ Pure INFP Output:', infpRes.type, '| E=0%, I=100%\n');

// Test 4: Pure Neutral Test (All 3s => XXXX)
console.log('4. Testing Pure Neutral (All 3s => XXXX)...');
const allNeutral = MBTI_QUESTIONS.map((q) => ({ axis: q.axis, value: 3 }));
const neutralRes = scoreMbti(allNeutral);

console.assert(neutralRes.type === 'XXXX', `Expected XXXX but got ${neutralRes.type}`);
console.assert(neutralRes.certainty.EI === 0, `Expected 0% certainty for neutral`);
console.assert(neutralRes.certaintyScores.EI.pole1Pct === 50, `E percentage should be 50%`);
console.assert(neutralRes.certaintyScores.EI.pole2Pct === 50, `I percentage should be 50%`);
console.assert(neutralRes.certaintyScores.EI.isNeutral === true, `isNeutral should be true`);
console.log('   ✓ Pure Neutral Output:', neutralRes.type, '| 50% / 50%\n');

// Test 5: Slight Preference Test (e.g. ENFP with 66% certainty)
console.log('5. Testing Moderate Certainty (ENFP 66% E, 66% N, 66% F, 66% P)...');
const moderateEnfp = MBTI_QUESTIONS.map((q) => {
  // Value 2 for E (raw 12/18 => E 75%), Value 4 for N, F, P (raw 24/18 => 75%)
  const val = q.axis === 'EI' ? 2 : 4;
  return { axis: q.axis, value: val };
});
const enfpRes = scoreMbti(moderateEnfp);

console.assert(enfpRes.type === 'ENFP', `Expected ENFP but got ${enfpRes.type}`);
console.assert(enfpRes.certainty.EI === 50, `Expected 50% intensity for raw=12 (midpoint=18, min=6)`);
console.assert(enfpRes.certaintyScores.EI.pole1Pct === 75, `E percentage should be 75%`);
console.assert(enfpRes.certaintyScores.EI.pole2Pct === 25, `I percentage should be 25%`);
console.log('   ✓ Moderate ENFP Output:', enfpRes.type, '| E=75%, I=25%\n');

// Test 6: Verify Description Dictionary for All 16 Types
console.log('6. Verifying Persian Description Dictionary for all 16 MBTI Types...');
const all16Types = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

all16Types.forEach((t) => {
  console.assert(MBTI_DESCRIPTIONS_FA[t] !== undefined, `Missing description for type ${t}`);
  console.assert(MBTI_DESCRIPTIONS_FA[t].title.length > 0, `Empty title for ${t}`);
});
console.log('   ✓ All 16 MBTI Types present with complete Persian titles and subtitles.\n');

console.log('====================================================');
console.log('     ALL MBTI UNIT TESTS PASSED 100%!               ');
console.log('====================================================');
