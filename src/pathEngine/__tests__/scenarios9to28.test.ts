import { runPathEngineV2, calculateCosineSimilarity, calculateGardnerFit, calculateMbtiFit, extractDiscPositioning } from '../../../lib/scoring/pathEngine';
import { HollandResult } from '../../../lib/scoring/holland';
import { GardnerResult } from '../../../lib/scoring/gardner';
import { MbtiResult } from '../../../lib/scoring/mbti';
import { DiscResult } from '../../../lib/scoring/disc';

describe('Path Engine V2 — Rigorous Scenarios 9 to 28 (Edge Cases, Baselines & Stress Tests)', () => {
  // 9. تست خط پایه کامل: هر ۴ تست null
  test('Scenario 9: Complete Baseline Test — All 4 tests are null', () => {
    const output = runPathEngineV2(null, null, null, null);

    expect(output.completedTestsCount).toBe(0);
    expect(output.completenessWarning).not.toBeNull();
    expect(output.completenessWarning).toContain('0 از ۴');
    expect(output.basket.mainPath).toBeDefined();
    expect(output.basket.alternativePaths.length).toBe(3);
    expect(output.basket.complementaryPaths.length).toBe(3);
    expect(output.basket.mainPath.matchScore).toBeGreaterThan(0);
  });

  // 10. تنها Holland پر شده، بقیه null
  test('Scenario 10: Single test present (Holland only, others null)', () => {
    const holland = {
      normalizedScores: { R: 88, I: 40, A: 15, S: 15, E: 30, C: 55 },
    } as unknown as HollandResult;

    const output = runPathEngineV2(holland, null, null, null);

    expect(output.completedTestsCount).toBe(1);
    expect(output.completenessWarning).toContain('1 از ۴');
    expect(output.basket.mainPath.matchScore).toBeGreaterThan(0);
  });

  // 11. بردار هولند صفر مطلق (baseline صفر)
  test('Scenario 11: Absolute Zero Holland Vector — Cosine similarity division-by-zero safety', () => {
    const holland = {
      normalizedScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
    } as unknown as HollandResult;

    const sim = calculateCosineSimilarity({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }, { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 });
    expect(sim).toBe(0);
    expect(Number.isNaN(sim)).toBe(false);

    const output = runPathEngineV2(holland, null, null, null);
    expect(output.basket.mainPath.matchScore).toBeGreaterThan(0);
    expect(Number.isNaN(output.basket.mainPath.matchScore)).toBe(false);
  });

  // 12. Gardner با topIntelligences خالی ولی object موجوده
  test('Scenario 12: Empty topIntelligences in Gardner object falls back to fitScore=0.75', () => {
    const holland = {
      normalizedScores: { R: 40, I: 88, A: 35, S: 15, E: 30, C: 70 },
    } as unknown as HollandResult;
    const gardner = { topIntelligences: [], scores: {} } as unknown as GardnerResult;

    const output = runPathEngineV2(holland, gardner, null, null);
    expect(output.completedTestsCount).toBe(1); // empty topIntelligences doesn't count as complete gardner
    expect(output.basket.mainPath.metrics.gardnerFit).toBe(75); // Baseline 75%
  });

  // 13. Gardner با topIntelligences پر ولی scores غایب
  test('Scenario 13: Gardner topIntelligences provided but scores absent — Fallback userScore=3.5', () => {
    const gardner = {
      topIntelligences: ['logical', 'spatial', 'linguistic'],
    } as unknown as GardnerResult;

    const evalResult = calculateGardnerFit(gardner, {
      logical: 0.95,
      spatial: 0.6,
      linguistic: 0.4,
      bodily: 0.1,
      musical: 0.1,
      interpersonal: 0.4,
      intrapersonal: 0.6,
      naturalistic: 0.1,
    });

    expect(evalResult.fitScore).toBeGreaterThan(0);
    expect(evalResult.topUsed).toEqual(['logical', 'spatial', 'linguistic']);
  });

  // 14. Gardner با نمرات حداکثری (۵ از ۵) روی هوش‌هایی که وزنشان در شغل صفر یا ناچیز است
  test('Scenario 14: Gardner max scores on irrelevant job intelligences limits fitScore', () => {
    const gardner = {
      topIntelligences: ['musical', 'bodily', 'naturalistic'],
      scores: { musical: 5, bodily: 5, naturalistic: 5 },
    } as unknown as GardnerResult;

    // Software job where musical/bodily/naturalistic importance is 0.1
    const evalResult = calculateGardnerFit(gardner, {
      logical: 0.95,
      spatial: 0.6,
      linguistic: 0.4,
      bodily: 0.1,
      musical: 0.1,
      interpersonal: 0.4,
      intrapersonal: 0.6,
      naturalistic: 0.1,
    });

    expect(evalResult.fitScore).toBeLessThan(0.35); // Strongly restricted by low job weights
  });

  // 15. MBTI با isNeutral=true روی همه محورها
  test('Scenario 15: MBTI with isNeutral=true on all axes — Neutral fallback to target=50', () => {
    const mbti = {
      type: 'XXXX',
      certaintyScores: {
        EI: { dominantLetter: 'X', intensityPct: 0, isNeutral: true },
        SN: { dominantLetter: 'X', intensityPct: 0, isNeutral: true },
        TF: { dominantLetter: 'X', intensityPct: 0, isNeutral: true },
        JP: { dominantLetter: 'X', intensityPct: 0, isNeutral: true },
      },
    } as unknown as MbtiResult;

    const evalResult = calculateMbtiFit(mbti, {
      structure: 70,
      social: 40,
      autonomy: 80,
      pace: 80,
      analytical_vs_valuebased: 92,
      competitiveness: 60,
    });

    expect(evalResult.fitScore).toBeGreaterThan(0.7);
    expect(evalResult.axisBreakdown.every((a) => a.targetValue === 50)).toBe(true);
  });

  // 16. MBTI با قطعیت ۱۰۰٪ در تضاد کامل با محیط کار
  test('Scenario 16: MBTI 100% certainty in total contradiction with work environment', () => {
    const holland = {
      normalizedScores: { R: 95, I: 20, A: 10, S: 10, E: 15, C: 30 },
    } as unknown as HollandResult;
    const mbti = {
      type: 'ENFP',
      certaintyScores: {
        EI: { dominantLetter: 'E', intensityPct: 100 },
        SN: { dominantLetter: 'N', intensityPct: 100 },
        TF: { dominantLetter: 'F', intensityPct: 100 },
        JP: { dominantLetter: 'P', intensityPct: 100 },
      },
    } as unknown as MbtiResult;

    const output = runPathEngineV2(holland, null, mbti, null);
    expect(output.completedTestsCount).toBe(2);
    expect(output.basket.mainPath.metrics.mbtiFit).toBeGreaterThanOrEqual(10); // Clamped at min 0.1
  });

  // 17. MBTI با قطعیت خیلی پایین (۱٪)
  test('Scenario 17: MBTI with very low certainty (1%) respects weightFactor floor of 0.5', () => {
    const mbti = {
      type: 'ISTJ',
      certaintyScores: {
        EI: { dominantLetter: 'I', intensityPct: 1 },
        SN: { dominantLetter: 'S', intensityPct: 1 },
        TF: { dominantLetter: 'T', intensityPct: 1 },
        JP: { dominantLetter: 'J', intensityPct: 1 },
      },
    } as unknown as MbtiResult;

    const evalResult = calculateMbtiFit(mbti, {
      structure: 50,
      social: 50,
      autonomy: 50,
      pace: 50,
      analytical_vs_valuebased: 50,
      competitiveness: 50,
    });

    expect(evalResult.fitScore).toBeGreaterThan(0);
    expect(evalResult.axisBreakdown.every((a) => a.certaintyPct === 1)).toBe(true);
  });

  // 18. DISC با پروفایل خالی
  test('Scenario 18: DISC with empty profile string defaults safely to dominant archetype D', () => {
    const disc = { profile: '' } as unknown as DiscResult;
    const pos = extractDiscPositioning(disc, {
      D: { roleTitle: 'لید', archetype: 'D', workStyleDescription: '', strengths: [], growthAreas: [] },
      I: { roleTitle: 'رابط', archetype: 'I', workStyleDescription: '', strengths: [], growthAreas: [] },
      S: { roleTitle: 'پشتیبان', archetype: 'S', workStyleDescription: '', strengths: [], growthAreas: [] },
      C: { roleTitle: 'تحلیل‌گر', archetype: 'C', workStyleDescription: '', strengths: [], growthAreas: [] },
    });

    expect(pos.dominantArchetype).toBe('D');
    expect(pos.targetRoleTitle).toBe('لید');
  });

  // 19. DISC با پروفایل ترکیبی "IC"
  test('Scenario 19: DISC with composite profile "IC" extracts primary archetype "I"', () => {
    const disc = { profile: 'IC' } as unknown as DiscResult;
    const pos = extractDiscPositioning(disc, {
      D: { roleTitle: 'مدیر', archetype: 'D', workStyleDescription: '', strengths: [], growthAreas: [] },
      I: { roleTitle: 'توسعه‌دهنده ارتباطات', archetype: 'I', workStyleDescription: '', strengths: [], growthAreas: [] },
      S: { roleTitle: 'نگهدارنده', archetype: 'S', workStyleDescription: '', strengths: [], growthAreas: [] },
      C: { roleTitle: 'معمار', archetype: 'C', workStyleDescription: '', strengths: [], growthAreas: [] },
    });

    expect(pos.dominantArchetype).toBe('I');
    expect(pos.targetRoleTitle).toBe('توسعه‌دهنده ارتباطات');
  });

  // 20. DISC با حرف نامعتبر
  test('Scenario 20: DISC with non-DISC characters defaults safely to D', () => {
    const disc = { profile: 'X-blend-45%' } as unknown as DiscResult;
    const pos = extractDiscPositioning(disc, {
      D: { roleTitle: 'لید فنی', archetype: 'D', workStyleDescription: '', strengths: [], growthAreas: [] },
      I: { roleTitle: 'رابط', archetype: 'I', workStyleDescription: '', strengths: [], growthAreas: [] },
      S: { roleTitle: 'پشتیبان', archetype: 'S', workStyleDescription: '', strengths: [], growthAreas: [] },
      C: { roleTitle: 'معمار', archetype: 'C', workStyleDescription: '', strengths: [], growthAreas: [] },
    });

    expect(pos.dominantArchetype).toBe('D');
    expect(pos.targetRoleTitle).toBe('لید فنی');
  });

  // 21. تمام ۴ تست با نتایج کاملاً همسو (تست سقف نمره بالا)
  test('Scenario 21: Complete 4-test alignment reaches high MatchScore ceiling', () => {
    const holland = { normalizedScores: { R: 40, I: 88, A: 35, S: 15, E: 30, C: 70 } } as unknown as HollandResult;
    const gardner = {
      topIntelligences: ['logical', 'spatial', 'intrapersonal'],
      scores: { logical: 5, spatial: 4.5, intrapersonal: 4 },
    } as unknown as GardnerResult;
    const mbti = {
      type: 'INTJ',
      certaintyScores: {
        EI: { dominantLetter: 'I', intensityPct: 90 },
        SN: { dominantLetter: 'N', intensityPct: 85 },
        TF: { dominantLetter: 'T', intensityPct: 92 },
        JP: { dominantLetter: 'J', intensityPct: 88 },
      },
    } as unknown as MbtiResult;
    const disc = { profile: 'C' } as unknown as DiscResult;

    const output = runPathEngineV2(holland, gardner, mbti, disc);

    expect(output.completedTestsCount).toBe(4);
    expect(output.completenessWarning).toBeNull();
    expect(output.basket.mainPath.matchScore).toBeGreaterThanOrEqual(80);
    expect(['onet_soft_dev', 'onet_ai_data_scientist', 'onet_data_engineer']).toContain(output.basket.mainPath.jobId);
  });

  // 22. تضاد کامل بین Holland و Gardner (هولند فنی، گاردنر هنری/بدنی)
  test('Scenario 22: Conflict between technical Holland and musical/bodily Gardner', () => {
    const holland = { normalizedScores: { R: 90, I: 85, A: 10, S: 10, E: 20, C: 60 } } as unknown as HollandResult;
    const gardner = {
      topIntelligences: ['musical', 'bodily', 'interpersonal'],
      scores: { musical: 5, bodily: 4.8, interpersonal: 4.5 },
    } as unknown as GardnerResult;

    const output = runPathEngineV2(holland, gardner, null, null);
    expect(output.basket.mainPath).toBeDefined();
    expect(output.basket.complementaryPaths.length).toBe(3);
  });

  // 23. کلاستری با کمتر از ۳ شغل همرده
  test('Scenario 23: Cluster fallback when same-cluster candidates are fewer than 3', () => {
    const holland = { normalizedScores: { R: 70, I: 85, A: 20, S: 15, E: 35, C: 55 } } as unknown as HollandResult;
    const output = runPathEngineV2(holland, null, null, null);

    expect(output.basket.alternativePaths.length).toBe(3);
    expect(output.basket.complementaryPaths.length).toBe(3);
  });

  // 24. عدم تطابق بین کد Holland ادعایی و بردار واقعی
  test('Scenario 24: Holland code in summary preserves claimed code string without breaking cosine calculations', () => {
    const holland = {
      code: 'SEA',
      normalizedScores: { R: 95, I: 20, A: 10, S: 10, E: 15, C: 30 },
    } as unknown as HollandResult;

    const output = runPathEngineV2(holland, null, null, null);
    expect(output.userSummary.hollandCode).toBe('SEA');
    expect(output.basket.mainPath.matchScore).toBeGreaterThan(0);
  });

  // 25. Gardner با هوش تکراری در topIntelligences
  test('Scenario 25: Gardner with duplicated intelligence in topIntelligences', () => {
    const gardner = {
      topIntelligences: ['logical', 'logical', 'spatial'],
      scores: { logical: 5, spatial: 4 },
    } as unknown as GardnerResult;

    const output = runPathEngineV2(null, gardner, null, null);
    expect(output.basket.mainPath.matchScore).toBeGreaterThan(0);
    expect(Number.isNaN(output.basket.mainPath.matchScore)).toBe(false);
  });

  // 26. مقادیر خارج از بازه مجاز در بردار هولند
  test('Scenario 26: Out-of-bounds values in Holland normalized vector', () => {
    const holland = {
      normalizedScores: { R: 150, I: 200, A: -20, S: 0, E: 50, C: 50 },
    } as unknown as HollandResult;

    const output = runPathEngineV2(holland, null, null, null);
    expect(output.basket.mainPath.matchScore).toBeGreaterThanOrEqual(10);
    expect(output.basket.mainPath.matchScore).toBeLessThanOrEqual(100);
  });

  // 27. تناقض کامل بین DISC و MBTI
  test('Scenario 27: Tension between DISC Supportive (S) and competitive ENTJ MBTI', () => {
    const holland = { normalizedScores: { R: 15, I: 75, A: 15, S: 25, E: 70, C: 95 } } as unknown as HollandResult;
    const mbti = {
      type: 'ENTJ',
      certaintyScores: {
        EI: { dominantLetter: 'E', intensityPct: 90 },
        SN: { dominantLetter: 'N', intensityPct: 80 },
        TF: { dominantLetter: 'T', intensityPct: 95 },
        JP: { dominantLetter: 'J', intensityPct: 85 },
      },
    } as unknown as MbtiResult;
    const disc = { profile: 'S' } as unknown as DiscResult;

    const output = runPathEngineV2(holland, null, mbti, disc);
    expect(output.basket.mainPath.discPositioning.dominantArchetype).toBe('S');
    expect(output.basket.mainPath.metrics.mbtiFit).toBeGreaterThan(0);
  });

  // 28. استرس تست نهایی: تمام ۴ آزمون کامل اما با تعارض درونی شدید
  test('Scenario 28: Full 4-test pipeline internal stress test with contradictory signals', () => {
    const holland = { normalizedScores: { R: 10, I: 20, A: 96, S: 30, E: 25, C: 20 } } as unknown as HollandResult;
    const gardner = {
      topIntelligences: ['logical', 'logical', 'linguistic'],
      scores: { logical: 5, linguistic: 4 },
    } as unknown as GardnerResult;
    const mbti = {
      type: 'INFP',
      certaintyScores: {
        EI: { dominantLetter: 'I', intensityPct: 70 },
        SN: { dominantLetter: 'N', intensityPct: 60 },
        TF: { dominantLetter: 'F', intensityPct: 75 },
        JP: { dominantLetter: 'P', intensityPct: 55 },
      },
    } as unknown as MbtiResult;
    const disc = { profile: 'D' } as unknown as DiscResult;

    const output = runPathEngineV2(holland, gardner, mbti, disc);

    expect(output.completedTestsCount).toBe(4);
    expect(output.completenessWarning).toBeNull();
    expect(output.basket.mainPath).toBeDefined();
    expect(output.basket.alternativePaths.length).toBe(3);
    expect(output.basket.complementaryPaths.length).toBe(3);
    expect(output.basket.mainPath.matchScore).toBeGreaterThanOrEqual(10);
    expect(output.basket.mainPath.matchScore).toBeLessThanOrEqual(100);
  });
});
