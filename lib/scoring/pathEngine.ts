import { HollandResult } from './holland';
import { GardnerResult } from './gardner';
import { MbtiResult } from './mbti';
import { DiscResult } from './disc';
import {
  PATH_DATABASE,
  MAIN_GROUPS_VECTORS,
  TVET_INDUSTRY_SUBFIELDS,
  TVET_ARTS_SUBFIELDS,
  MainGroups,
  MBTI_BEHAVIORAL_TARGETS,
  DISC_BEHAVIORAL_TARGETS,
  PathDefinition,
  RiasecVector,
} from './pathEngineTables';

export interface PathEngineReasoning {
  hollandReasoning: string;
  gardnerReasoning: string;
  mbtiReasoning: string;
  discReasoning: string;
}

export interface PathRecommendation {
  pathId: string;
  title: string;
  category: string;
  description: string;
  matchScore: number; // 0 to 100 (Absolute & Honest)
  recommendedHighschoolTrack: string;
  universityMajors: string[];
  exampleCareers: string[];
  whyCompatible: PathEngineReasoning;
}

export interface BaseClusterResult {
  mainGroup: string[]; // e.g. ["علوم تجربی"] or ["علوم تجربی", "ادبیات و علوم‌انسانی"]
  topSubfields: string[]; // empty if theoretical, or e.g. ["تأسیسات مکانیکی"]
}

export interface PathEngineOutput {
  completenessWarning: string | null;
  completedTestsCount: number;
  baseCluster: BaseClusterResult;
  mainPath: PathRecommendation;
  alternativePaths: PathRecommendation[]; // Exactly 3 paths in same academic base cluster
  complementaryPaths: PathRecommendation[]; // Exactly 3 interdisciplinary / different family paths
  allRecommendedPaths: PathRecommendation[]; // Exactly 7 paths total (1 + 3 + 3)
  computedAt: string;
}

export interface Stage1Trace {
  groupScoresRaw: { group: string; rawScore: number }[];
  groupScoresNormalized: { group: string; score: number }[];
  groupGap: number; // فاصله‌ی امتیاز نرمال‌شده‌ی رتبه ۱ و ۲
  mainGroup: string[];
  subfieldScoresRaw: { subfield: string; rawScore: number }[] | null;
  subfieldScoresNormalized: { subfield: string; score: number }[] | null;
  subfieldGap: number | null;
  topSubfields: string[];
}

export interface Stage2Trace {
  pathId: string;
  title: string;
  gardnerScore: number;
  alignmentBonus: number;
  alignmentReason: 'subfield-match' | 'main-group-match' | 'no-match';
  stage2Score: number;
  excludedFromInitialList: boolean; // true اگر gardnerScore === 0 (طبق سند اصلی باید حذف شود)
}

export interface Stage3Trace {
  pathId: string;
  axisBreakdown: {
    axis: 'EI' | 'SN' | 'TF' | 'JP';
    dominantLetter: string;
    targetDimension: string;
    targetValue: number;
    actualValue: number;
    distance: number;
    certaintyPct: number;
    weightedDistance: number;
    axisContribution: number; // 1 - weightedDistance
  }[];
  mbtiMultiplier: number;
  stage3Score: number;
}

export interface Stage4Trace {
  pathId: string;
  dimBreakdown: {
    discLetter: string;
    targetDimension: string;
    targetValue: number;
    actualValue: number;
    distance: number;
    dimContribution: number;
  }[];
  discMultiplier: number;
  rawFinalScore: number;
}

export interface Stage4bTrace {
  maxRawScore: number;
  allPathScores: { pathId: string; rawFinalScore: number; matchScore: number }[];
  thresholdValue: number; // مثلا 15 یا 55
  eligibleCountBeforeRelax: number;
  thresholdWasRelaxed: boolean;
}

export interface Stage5Trace {
  mainPathId: string;
  alternativePool: { pathId: string; matchesMainGroup: boolean }[]; // matchesMainGroup باید همیشه true باشد
  alternativePoolFallbackTriggered: boolean;
  complementaryPool: { pathId: string; matchesMainGroup: boolean }[];
  complementaryPoolFallbackTriggered: boolean;
}

export interface PathEngineTrace {
  input: {
    hollandProvided: boolean;
    gardnerProvided: boolean;
    mbtiProvided: boolean;
    discProvided: boolean;
  };
  stage1: Stage1Trace;
  stage2: Stage2Trace[]; // طول = ۲۸ (همه‌ی مسیرهای دیتابیس)
  stage3: Stage3Trace[];
  stage4: Stage4Trace[];
  stage4b: Stage4bTrace;
  stage5: Stage5Trace;
  finalOutput: PathEngineOutput;
}

export function runPathEngine(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathEngineOutput {
  return runPathEngineWithTrace(holland, gardner, mbti, disc).finalOutput;
}

export function runPathEngineWithTrace(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathEngineTrace {
  // ---------------------------------------------------------
  // Stage 0: Data Completeness Check
  // ---------------------------------------------------------
  let completedTestsCount = 0;
  if (holland) completedTestsCount++;
  if (gardner) completedTestsCount++;
  if (mbti) completedTestsCount++;
  if (disc) completedTestsCount++;

  let completenessWarning: string | null = null;
  if (!holland) {
    completenessWarning = `آزمون رغبت‌سنجی هالند به‌عنوان پیش‌نیاز اصلی هدایت تحصیلی هنوز انجام نشده است. لطفا جهت دست‌یابی به دقت کامل، آزمون هالند را تکمیل کنید.`;
  } else if (completedTestsCount < 4) {
    completenessWarning = `این نتیجه بر اساس ${completedTestsCount} از ۴ آزمون روان‌سنجی تهیه شده است و با تکمیل باقی آزمون‌ها دقیق‌تر خواهد شد.`;
  }

  // Holland is required for Stage 1 base cluster
  const activeHolland = holland || {
    scores: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
    normalizedScores: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
    code: 'RIA',
    primaryDimension: 'R' as any,
  };

  const userRiasec = (activeHolland.normalizedScores || activeHolland.scores) as RiasecVector;

  // ---------------------------------------------------------
  // Stage 1: Base Cluster Calculation (2-Level Algorithm)
  // ---------------------------------------------------------
  const { baseCluster, trace: stage1Trace } = calculateBaseClusterWithTrace(userRiasec);

  // ---------------------------------------------------------
  // Stage 2: Initial Path Scoring & Dynamic Scale Calibration
  // ---------------------------------------------------------
  const hasGardnerData = gardner && gardner.topIntelligences && gardner.topIntelligences.length > 0;

  // Baseline scale when Gardner is omitted vs present
  const BASELINE_GARDNER_SCORE = 100;
  const MAX_THEORETICAL_SCORE = hasGardnerData ? 220 : 120;

  const stage2Trace: Stage2Trace[] = [];
  const stage2Scored = PATH_DATABASE.map((path) => {
    let gardnerScore = BASELINE_GARDNER_SCORE;

    if (hasGardnerData) {
      const rankWeights = [1.0, 0.7, 0.4];
      gardnerScore = 0;

      gardner.topIntelligences.slice(0, 3).forEach((intel, idx) => {
        const weight = rankWeights[idx] || 0.3;
        const pathIntelWeight = path.gardnerWeights[intel] || 0;
        const userIntelScore = gardner.scores?.[intel] !== undefined ? gardner.scores[intel] / 5.0 : 1.0;
        gardnerScore += weight * pathIntelWeight * userIntelScore * 100;
      });
    }

    // Base cluster alignment bonus (1.5x for exact subfield leaf match, 1.3x for main group match)
    let alignmentBonus = 1.0;
    let alignmentReason: 'subfield-match' | 'main-group-match' | 'no-match' = 'no-match';
    const pathTracks = path.compatibleTracks;

    const hasSubfieldMatch =
      baseCluster.topSubfields.length > 0 &&
      baseCluster.topSubfields.some((sub) => pathTracks.includes(sub));

    const hasMainGroupMatch = baseCluster.mainGroup.some((grp) => pathTracks.includes(grp));

    if (hasSubfieldMatch) {
      alignmentBonus = 1.5; // +50% bonus for exact leaf match
      alignmentReason = 'subfield-match';
    } else if (hasMainGroupMatch) {
      alignmentBonus = 1.3; // +30% bonus for main track match
      alignmentReason = 'main-group-match';
    }

    const stage2Score = gardnerScore * alignmentBonus;
    const excludedFromInitialList = Boolean(hasGardnerData && gardnerScore === 0);

    stage2Trace.push({
      pathId: path.id,
      title: path.title,
      gardnerScore,
      alignmentBonus,
      alignmentReason,
      stage2Score,
      excludedFromInitialList,
    });

    return { path, gardnerScore, stage2Score, alignmentBonus };
  });

  // Filter initial candidate pool to paths where gardnerScore > 0 when Gardner is available
  const candidatePool = hasGardnerData
    ? stage2Scored.filter((item) => item.gardnerScore > 0)
    : stage2Scored;

  // Fallback: if pruning cleared candidatePool (unlikely), restore full stage2Scored
  const safeCandidatePool = candidatePool.length >= 7 ? candidatePool : stage2Scored;

  // ---------------------------------------------------------
  // Stage 3: MBTI Multiplicative Personality Filter (with Safe Lookup for 'X')
  // ---------------------------------------------------------
  const stage3Trace: Stage3Trace[] = [];
  const stage3Scored = PATH_DATABASE.map((path) => {
    const stage2Item = stage2Scored.find((s) => s.path.id === path.id)!;
    let mbtiMultiplier = 1.0;
    const axisBreakdown: Stage3Trace['axisBreakdown'] = [];
    const axes: ('EI' | 'SN' | 'TF' | 'JP')[] = ['EI', 'SN', 'TF', 'JP'];

    if (mbti && mbti.type && mbti.certaintyScores) {
      let compatibilitySum = 0;

      const letters = [
        mbti.certaintyScores.EI?.dominantLetter || mbti.type[0] || 'X',
        mbti.certaintyScores.SN?.dominantLetter || mbti.type[1] || 'X',
        mbti.certaintyScores.TF?.dominantLetter || mbti.type[2] || 'X',
        mbti.certaintyScores.JP?.dominantLetter || mbti.type[3] || 'X',
      ];

      letters.forEach((letter, idx) => {
        const axisKey = axes[idx];
        const targetConfig = letter && letter !== 'X' ? MBTI_BEHAVIORAL_TARGETS[letter] : null;

        if (!targetConfig) {
          compatibilitySum += 1.0;
          axisBreakdown.push({
            axis: axisKey,
            dominantLetter: letter || 'X',
            targetDimension: '-',
            targetValue: 0,
            actualValue: 0,
            distance: 0,
            certaintyPct: 0,
            weightedDistance: 0,
            axisContribution: 1.0,
          });
        } else {
          const actualValue = path.behavioralVector[targetConfig.dimension];
          const distance = Math.abs(actualValue - targetConfig.target) / 100;
          const certaintyPct =
            mbti.certaintyScores[axisKey]?.intensityPct ?? mbti.certainty?.[axisKey] ?? 50;
          const weightedDistance = distance * (certaintyPct / 100);
          const axisContribution = 1 - weightedDistance;
          compatibilitySum += axisContribution;

          axisBreakdown.push({
            axis: axisKey,
            dominantLetter: letter,
            targetDimension: targetConfig.dimension,
            targetValue: targetConfig.target,
            actualValue,
            distance,
            certaintyPct,
            weightedDistance,
            axisContribution,
          });
        }
      });

      mbtiMultiplier = Math.max(0.1, compatibilitySum / 4);
    } else {
      axes.forEach((axisKey) => {
        axisBreakdown.push({
          axis: axisKey,
          dominantLetter: '-',
          targetDimension: '-',
          targetValue: 0,
          actualValue: 0,
          distance: 0,
          certaintyPct: 0,
          weightedDistance: 0,
          axisContribution: 1.0,
        });
      });
    }

    const stage3Score = stage2Item.stage2Score * mbtiMultiplier;

    stage3Trace.push({
      pathId: path.id,
      axisBreakdown,
      mbtiMultiplier,
      stage3Score,
    });

    return {
      path,
      gardnerScore: stage2Item.gardnerScore,
      stage2Score: stage2Item.stage2Score,
      stage3Score,
      mbtiMultiplier,
      alignmentBonus: stage2Item.alignmentBonus,
    };
  });

  // ---------------------------------------------------------
  // Stage 4: DISC Multiplicative Behavioral Filter & Absolute Scoring
  // ---------------------------------------------------------
  const stage4Trace: Stage4Trace[] = [];
  const stage4Scored = stage3Scored.map((item) => {
    const { path, stage3Score } = item;
    let discMultiplier = 1.0;
    const dimBreakdown: Stage4Trace['dimBreakdown'] = [];

    if (disc && disc.profile) {
      const dimensions = disc.profile.split('').filter((d) => d !== 'X'); // e.g. ['I', 'D']
      let totalMult = 0;

      if (dimensions.length > 0) {
        dimensions.forEach((dim) => {
          const targets = DISC_BEHAVIORAL_TARGETS[dim];
          if (targets && targets.length > 0) {
            let dimCompSum = 0;
            targets.forEach((t) => {
              const actualVal = path.behavioralVector[t.dimension];
              const dist = Math.abs(actualVal - t.target) / 100;
              const dimContribution = 1 - dist;
              dimCompSum += dimContribution;

              dimBreakdown.push({
                discLetter: dim,
                targetDimension: t.dimension,
                targetValue: t.target,
                actualValue: actualVal,
                distance: dist,
                dimContribution,
              });
            });
            totalMult += dimCompSum / targets.length;
          } else {
            totalMult += 1.0;
          }
        });
        discMultiplier = Math.max(0.1, totalMult / dimensions.length);
      }
    }

    const rawFinalScore = stage3Score * discMultiplier;

    stage4Trace.push({
      pathId: path.id,
      dimBreakdown,
      discMultiplier,
      rawFinalScore,
    });

    return { ...item, rawFinalScore, discMultiplier };
  });

  // Absolute Score Normalization against dynamic theoretical maximum
  const absoluteScoredPaths = stage4Scored.map((item) => {
    const rawPct = (item.rawFinalScore / MAX_THEORETICAL_SCORE) * 100;
    const matchScore = Math.min(99, Math.max(5, Math.round(rawPct)));
    return { ...item, matchScore };
  });

  // Sort descending by matchScore
  absoluteScoredPaths.sort((a, b) => b.matchScore - a.matchScore);

  // Apply final threshold filter (relax if total remaining paths below 7)
  const MIN_FINAL_THRESHOLD = 15;
  const eligibleBeforeRelax = absoluteScoredPaths.filter(
    (p) => (!hasGardnerData || p.gardnerScore > 0) && p.matchScore >= MIN_FINAL_THRESHOLD
  );

  const thresholdWasRelaxed = eligibleBeforeRelax.length < 7;
  const eligible = thresholdWasRelaxed
    ? (hasGardnerData ? absoluteScoredPaths.filter((p) => p.gardnerScore > 0) : absoluteScoredPaths)
    : eligibleBeforeRelax;

  const safeEligible = eligible.length >= 7 ? eligible : absoluteScoredPaths;

  const stage4bTrace: Stage4bTrace = {
    maxRawScore: MAX_THEORETICAL_SCORE,
    allPathScores: absoluteScoredPaths.map((p) => ({
      pathId: p.path.id,
      rawFinalScore: p.rawFinalScore,
      matchScore: p.matchScore,
    })),
    thresholdValue: MIN_FINAL_THRESHOLD,
    eligibleCountBeforeRelax: eligibleBeforeRelax.length,
    thresholdWasRelaxed,
  };

  // ---------------------------------------------------------
  // Stage 5: Final 7-Path Assembly (1 Main + 3 Alternative + 3 Complementary)
  // ---------------------------------------------------------
  const mainPathItem = safeEligible[0] || absoluteScoredPaths[0];

  const mainPathRec = buildRecommendation(
    mainPathItem.path,
    mainPathItem.matchScore,
    baseCluster,
    gardner,
    mbti,
    disc
  );

  const pathMatchesBaseCluster = (p: PathDefinition) => {
    const hasMainGroupOverlap = baseCluster.mainGroup.some((grp) => p.compatibleTracks.includes(grp));
    const hasSubfieldOverlap =
      baseCluster.topSubfields.length > 0 &&
      baseCluster.topSubfields.some((sub) => p.compatibleTracks.includes(sub));
    return hasMainGroupOverlap || hasSubfieldOverlap;
  };

  // Alternative Paths: Same academic base cluster family
  const altCandidates = safeEligible.slice(1).filter((item) => pathMatchesBaseCluster(item.path));
  const altItems = altCandidates.slice(0, 3);
  let alternativePoolFallbackTriggered = false;

  // Fallback: Fill remaining alternative slots from candidate pool matching base cluster or general pool
  if (altItems.length < 3) {
    alternativePoolFallbackTriggered = true;
    const pool = absoluteScoredPaths.slice(1).filter(
      (item) => item.path.id !== mainPathItem.path.id && !altItems.some((i) => i.path.id === item.path.id)
    );
    while (altItems.length < 3 && pool.length > 0) {
      altItems.push(pool.shift()!);
    }
  }

  const alternativePaths = altItems.map((item) =>
    buildRecommendation(item.path, item.matchScore, baseCluster, gardner, mbti, disc)
  );

  // Complementary Paths: Creative and Combined (Interdisciplinary) or next best paths.
  const chosenIds = new Set([mainPathItem.path.id, ...altItems.map((i) => i.path.id)]);

  const isInterdisciplinary = (p: PathDefinition) => {
    const mainGroupsCount = p.compatibleTracks.filter((t) =>
      Object.values(MainGroups).includes(t as MainGroups)
    ).length;
    return mainGroupsCount > 1;
  };

  const compCandidates = safeEligible
    .slice(1)
    .filter((item) => !chosenIds.has(item.path.id))
    .sort((a, b) => {
      const aBonus = isInterdisciplinary(a.path) ? 5 : 0;
      const bBonus = isInterdisciplinary(b.path) ? 5 : 0;
      return b.matchScore + bBonus - (a.matchScore + aBonus);
    });

  const compItems = compCandidates.slice(0, 3);
  let complementaryPoolFallbackTriggered = false;

  // Fallback: Fill remaining complementary slots if needed
  if (compItems.length < 3) {
    complementaryPoolFallbackTriggered = true;
    const compPool = absoluteScoredPaths.slice(1).filter(
      (item) => !chosenIds.has(item.path.id) && !compItems.some((i) => i.path.id === item.path.id)
    );
    while (compItems.length < 3 && compPool.length > 0) {
      compItems.push(compPool.shift()!);
    }
  }

  const complementaryPaths = compItems.map((item) =>
    buildRecommendation(item.path, item.matchScore, baseCluster, gardner, mbti, disc)
  );

  // Guaranteed exactly 7 paths array
  const allRecommendedPaths = [mainPathRec, ...alternativePaths, ...complementaryPaths];

  const finalOutput: PathEngineOutput = {
    completenessWarning,
    completedTestsCount,
    baseCluster,
    mainPath: mainPathRec,
    alternativePaths,
    complementaryPaths,
    allRecommendedPaths,
    computedAt: new Date().toISOString(),
  };

  const stage5Trace: Stage5Trace = {
    mainPathId: mainPathItem.path.id,
    alternativePool: altItems.map((item) => ({
      pathId: item.path.id,
      matchesMainGroup: pathMatchesBaseCluster(item.path),
    })),
    alternativePoolFallbackTriggered,
    complementaryPool: compItems.map((item) => ({
      pathId: item.path.id,
      matchesMainGroup: pathMatchesBaseCluster(item.path),
    })),
    complementaryPoolFallbackTriggered,
  };

  return {
    input: {
      hollandProvided: !!holland,
      gardnerProvided: !!gardner,
      mbtiProvided: !!mbti,
      discProvided: !!disc,
    },
    stage1: stage1Trace,
    stage2: stage2Trace,
    stage3: stage3Trace,
    stage4: stage4Trace,
    stage4b: stage4bTrace,
    stage5: stage5Trace,
    finalOutput,
  };
}

// ---------------------------------------------------------
// Helper: 2-Level Base Cluster Calculation (Stage 1-A & 1-B)
// ---------------------------------------------------------
export function calculateBaseClusterWithTrace(userRiasec: RiasecVector): {
  baseCluster: BaseClusterResult;
  trace: Stage1Trace;
} {
  // Stage 1-A: Evaluate 5 Main Groups
  const groupScoresRaw: { group: string; rawScore: number }[] = [];

  for (const [group, vector] of Object.entries(MAIN_GROUPS_VECTORS)) {
    let score = 0;
    for (const key of ['R', 'I', 'A', 'S', 'E', 'C'] as (keyof RiasecVector)[]) {
      score += (userRiasec[key] || 0) * (vector[key] || 0);
    }
    groupScoresRaw.push({ group, rawScore: score });
  }

  // Normalize group scores to 0-100
  const maxGroupScore = Math.max(...groupScoresRaw.map((g) => g.rawScore), 1);
  const groupScoresNormalized = groupScoresRaw.map((g) => ({
    group: g.group,
    score: Math.round((g.rawScore / maxGroupScore) * 100),
  }));

  groupScoresNormalized.sort((a, b) => b.score - a.score);

  const groupGap =
    groupScoresNormalized.length > 1
      ? groupScoresNormalized[0].score - groupScoresNormalized[1].score
      : 0;

  // Apply gap <= 10 threshold for hybrid main group
  const mainGroup: string[] = [groupScoresNormalized[0].group];
  if (groupScoresNormalized.length > 1 && groupGap <= 10) {
    mainGroup.push(groupScoresNormalized[1].group);
  }

  // Stage 1-B: Evaluate Subfields if main group contains TVET
  const topSubfields: string[] = [];
  let subfieldScoresRaw: { subfield: string; rawScore: number }[] | null = null;
  let subfieldScoresNormalized: { subfield: string; score: number }[] | null = null;
  let subfieldGap: number | null = null;

  const containsIndustry = mainGroup.includes(MainGroups.TVET_INDUSTRY);
  const containsArts = mainGroup.includes(MainGroups.TVET_ARTS);

  if (containsIndustry || containsArts) {
    subfieldScoresRaw = [];

    if (containsIndustry) {
      for (const [subfield, vector] of Object.entries(TVET_INDUSTRY_SUBFIELDS)) {
        let score = 0;
        for (const key of ['R', 'I', 'A', 'S', 'E', 'C'] as (keyof RiasecVector)[]) {
          score += (userRiasec[key] || 0) * (vector[key] || 0);
        }
        subfieldScoresRaw.push({ subfield, rawScore: score });
      }
    }

    if (containsArts) {
      for (const [subfield, vector] of Object.entries(TVET_ARTS_SUBFIELDS)) {
        let score = 0;
        for (const key of ['R', 'I', 'A', 'S', 'E', 'C'] as (keyof RiasecVector)[]) {
          score += (userRiasec[key] || 0) * (vector[key] || 0);
        }
        subfieldScoresRaw.push({ subfield, rawScore: score });
      }
    }

    const maxSubScore = Math.max(...subfieldScoresRaw.map((s) => s.rawScore), 1);
    subfieldScoresNormalized = subfieldScoresRaw.map((s) => ({
      subfield: s.subfield,
      score: Math.round((s.rawScore / maxSubScore) * 100),
    }));

    subfieldScoresNormalized.sort((a, b) => b.score - a.score);

    subfieldGap =
      subfieldScoresNormalized.length > 1
        ? subfieldScoresNormalized[0].score - subfieldScoresNormalized[1].score
        : 0;

    // Apply gap <= 8 threshold for TVET subfields
    if (subfieldScoresNormalized.length > 0) {
      topSubfields.push(subfieldScoresNormalized[0].subfield);
      if (subfieldScoresNormalized.length > 1 && subfieldGap <= 8) {
        topSubfields.push(subfieldScoresNormalized[1].subfield);
      }
    }
  }

  const baseCluster: BaseClusterResult = { mainGroup, topSubfields };
  const trace: Stage1Trace = {
    groupScoresRaw,
    groupScoresNormalized,
    groupGap,
    mainGroup,
    subfieldScoresRaw,
    subfieldScoresNormalized,
    subfieldGap,
    topSubfields,
  };

  return { baseCluster, trace };
}

export function calculateBaseCluster(userRiasec: RiasecVector): BaseClusterResult {
  return calculateBaseClusterWithTrace(userRiasec).baseCluster;
}

// ---------------------------------------------------------
// Helper: Detailed Reasoning Builder
// ---------------------------------------------------------
function buildRecommendation(
  path: PathDefinition,
  matchScore: number,
  baseCluster: BaseClusterResult,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathRecommendation {
  const mainGroupStr = baseCluster.mainGroup.join(' و ');
  const subfieldStr =
    baseCluster.topSubfields.length > 0 ? ` (زیررشته‌های ${baseCluster.topSubfields.join('، ')})` : '';

  const hollandReasoning = `این مسیر با خوشه‌ی پایه تحصیلی شما در گروه ${mainGroupStr}${subfieldStr} هم‌راستایی کامل دارد.`;

  const topGardnerStr = gardner?.topIntelligences
    ? gardner.topIntelligences.slice(0, 2).join(' و ')
    : 'هوش‌های تحلیلی و عمومی';
  const gardnerReasoning = `توانمندی‌های روانی شما در حوزه ${topGardnerStr} پشتیبان اصلی موفقیت در این حوزه تخصصی است.`;

  const mbtiTypeStr = mbti?.type || 'متوازن';
  const mbtiReasoning = `سبک شخصیتی ${mbtiTypeStr} شما با میزان ساختار و پویایی محیطی این شغل هم‌خوانی بالا دارد.`;

  const discProfileStr = disc?.profile || 'متعادل';
  const discReasoning = `پروفایل رفتاری ${discProfileStr} الگوهای تعاملی و تصمیم‌گیری مورد نیاز این مسیر را برآورده می‌سازد.`;

  return {
    pathId: path.id,
    title: path.title,
    category: path.category,
    description: path.description,
    matchScore,
    recommendedHighschoolTrack: path.recommendedHighschoolTrack,
    universityMajors: path.universityMajors,
    exampleCareers: path.exampleCareers,
    whyCompatible: {
      hollandReasoning,
      gardnerReasoning,
      mbtiReasoning,
      discReasoning,
    },
  };
}
