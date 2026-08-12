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

export function runPathEngine(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathEngineOutput {
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
  const baseCluster = calculateBaseCluster(userRiasec);

  // ---------------------------------------------------------
  // Stage 2: Initial Path Scoring & Dynamic Scale Calibration
  // ---------------------------------------------------------
  const hasGardnerData = gardner && gardner.topIntelligences && gardner.topIntelligences.length > 0;

  // Baseline scale when Gardner is omitted vs present
  const BASELINE_GARDNER_SCORE = 100;
  const MAX_THEORETICAL_SCORE = hasGardnerData ? 220 : 120;

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
    const pathTracks = path.compatibleTracks;

    const hasSubfieldMatch =
      baseCluster.topSubfields.length > 0 &&
      baseCluster.topSubfields.some((sub) => pathTracks.includes(sub));

    const hasMainGroupMatch = baseCluster.mainGroup.some((grp) => pathTracks.includes(grp));

    if (hasSubfieldMatch) {
      alignmentBonus = 1.5; // +50% bonus for exact leaf match
    } else if (hasMainGroupMatch) {
      alignmentBonus = 1.3; // +30% bonus for main track match
    }

    const stage2Score = gardnerScore * alignmentBonus;
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
  const stage3Scored = safeCandidatePool.map(({ path, gardnerScore, stage2Score, alignmentBonus }) => {
    let mbtiMultiplier = 1.0;

    if (mbti && mbti.type && mbti.certaintyScores) {
      let compatibilitySum = 0;

      const letters = [
        mbti.certaintyScores.EI?.dominantLetter || mbti.type[0] || 'X',
        mbti.certaintyScores.SN?.dominantLetter || mbti.type[1] || 'X',
        mbti.certaintyScores.TF?.dominantLetter || mbti.type[2] || 'X',
        mbti.certaintyScores.JP?.dominantLetter || mbti.type[3] || 'X',
      ];

      const axes = ['EI', 'SN', 'TF', 'JP'];

      letters.forEach((letter, idx) => {
        // Safe Lookup: If letter is neutral 'X' or not in dictionary, default compatibility = 1.0
        if (!letter || letter === 'X' || !MBTI_BEHAVIORAL_TARGETS[letter]) {
          compatibilitySum += 1.0;
        } else {
          const targetConfig = MBTI_BEHAVIORAL_TARGETS[letter];
          const actualValue = path.behavioralVector[targetConfig.dimension];
          const distance = Math.abs(actualValue - targetConfig.target) / 100;
          const axisKey = axes[idx];
          const certaintyPct = mbti.certaintyScores[axisKey]?.intensityPct ?? mbti.certainty?.[axisKey] ?? 50;
          const weightedDistance = distance * (certaintyPct / 100);
          compatibilitySum += 1 - weightedDistance;
        }
      });

      mbtiMultiplier = Math.max(0.1, compatibilitySum / 4);
    }

    const stage3Score = stage2Score * mbtiMultiplier;
    return { path, gardnerScore, stage3Score, mbtiMultiplier, alignmentBonus };
  });

  // ---------------------------------------------------------
  // Stage 4: DISC Multiplicative Behavioral Filter & Absolute Scoring
  // ---------------------------------------------------------
  const stage4Scored = stage3Scored.map(
    ({ path, gardnerScore, stage3Score, mbtiMultiplier, alignmentBonus }) => {
      let discMultiplier = 1.0;

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
                dimCompSum += 1 - dist;
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
      return { path, rawFinalScore, gardnerScore, mbtiMultiplier, discMultiplier, alignmentBonus };
    }
  );

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
  let eligible = absoluteScoredPaths.filter((p) => p.matchScore >= MIN_FINAL_THRESHOLD);

  if (eligible.length < 7) {
    eligible = absoluteScoredPaths;
  }

  // ---------------------------------------------------------
  // Stage 5: Final 7-Path Assembly (1 Main + 3 Alternative + 3 Complementary)
  // Array Bounds & Fallback Guarantee: Always return exactly 7 paths!
  // ---------------------------------------------------------
  const mainPathItem = eligible[0] || absoluteScoredPaths[0];

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
  const altCandidates = eligible.slice(1).filter((item) => pathMatchesBaseCluster(item.path));
  const altItems = altCandidates.slice(0, 3);

  // Fallback: Fill remaining alternative slots from candidate pool matching base cluster or general pool
  if (altItems.length < 3) {
    const pool = absoluteScoredPaths.slice(1).filter((item) => item.path.id !== mainPathItem.path.id && !altItems.includes(item));
    while (altItems.length < 3 && pool.length > 0) {
      altItems.push(pool.shift()!);
    }
  }

  const alternativePaths = altItems.map((item) =>
    buildRecommendation(item.path, item.matchScore, baseCluster, gardner, mbti, disc)
  );

  // Complementary Paths: Interdisciplinary / Different academic track family
  const chosenIds = new Set([mainPathItem.path.id, ...altItems.map((i) => i.path.id)]);

  const compCandidates = eligible
    .slice(1)
    .filter((item) => !chosenIds.has(item.path.id) && !pathMatchesBaseCluster(item.path));

  const compItems = compCandidates.slice(0, 3);

  // Fallback: Fill remaining complementary slots if needed
  if (compItems.length < 3) {
    const compPool = absoluteScoredPaths.slice(1).filter((item) => !chosenIds.has(item.path.id) && !compItems.includes(item));
    while (compItems.length < 3 && compPool.length > 0) {
      compItems.push(compPool.shift()!);
    }
  }

  const complementaryPaths = compItems.map((item) =>
    buildRecommendation(item.path, item.matchScore, baseCluster, gardner, mbti, disc)
  );

  // Guaranteed exactly 7 paths array
  const allRecommendedPaths = [mainPathRec, ...alternativePaths, ...complementaryPaths];

  return {
    completenessWarning,
    completedTestsCount,
    baseCluster,
    mainPath: mainPathRec,
    alternativePaths,
    complementaryPaths,
    allRecommendedPaths,
    computedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------
// Helper: 2-Level Base Cluster Calculation (Stage 1-A & 1-B)
// ---------------------------------------------------------
function calculateBaseCluster(userRiasec: RiasecVector): BaseClusterResult {
  // Stage 1-A: Evaluate 5 Main Groups
  const groupScores: { group: string; score: number }[] = [];

  for (const [group, vector] of Object.entries(MAIN_GROUPS_VECTORS)) {
    let score = 0;
    for (const key of ['R', 'I', 'A', 'S', 'E', 'C'] as (keyof RiasecVector)[]) {
      score += (userRiasec[key] || 0) * (vector[key] || 0);
    }
    groupScores.push({ group, score });
  }

  // Normalize group scores to 0-100
  const maxGroupScore = Math.max(...groupScores.map((g) => g.score), 1);
  groupScores.forEach((g) => {
    g.score = Math.round((g.score / maxGroupScore) * 100);
  });

  groupScores.sort((a, b) => b.score - a.score);

  // Apply gap <= 10 threshold for hybrid main group
  const mainGroup: string[] = [groupScores[0].group];
  if (groupScores.length > 1 && groupScores[0].score - groupScores[1].score <= 10) {
    mainGroup.push(groupScores[1].group);
  }

  // Stage 1-B: Evaluate Subfields if main group contains TVET
  const topSubfields: string[] = [];

  const containsIndustry = mainGroup.includes(MainGroups.TVET_INDUSTRY);
  const containsArts = mainGroup.includes(MainGroups.TVET_ARTS);

  if (containsIndustry || containsArts) {
    const subfieldScores: { subfield: string; score: number }[] = [];

    if (containsIndustry) {
      for (const [subfield, vector] of Object.entries(TVET_INDUSTRY_SUBFIELDS)) {
        let score = 0;
        for (const key of ['R', 'I', 'A', 'S', 'E', 'C'] as (keyof RiasecVector)[]) {
          score += (userRiasec[key] || 0) * (vector[key] || 0);
        }
        subfieldScores.push({ subfield, score });
      }
    }

    if (containsArts) {
      for (const [subfield, vector] of Object.entries(TVET_ARTS_SUBFIELDS)) {
        let score = 0;
        for (const key of ['R', 'I', 'A', 'S', 'E', 'C'] as (keyof RiasecVector)[]) {
          score += (userRiasec[key] || 0) * (vector[key] || 0);
        }
        subfieldScores.push({ subfield, score });
      }
    }

    const maxSubScore = Math.max(...subfieldScores.map((s) => s.score), 1);
    subfieldScores.forEach((s) => {
      s.score = Math.round((s.score / maxSubScore) * 100);
    });

    subfieldScores.sort((a, b) => b.score - a.score);

    // Apply gap <= 8 threshold for TVET subfields
    if (subfieldScores.length > 0) {
      topSubfields.push(subfieldScores[0].subfield);
      if (subfieldScores.length > 1 && subfieldScores[0].score - subfieldScores[1].score <= 8) {
        topSubfields.push(subfieldScores[1].subfield);
      }
    }
  }

  return { mainGroup, topSubfields };
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
