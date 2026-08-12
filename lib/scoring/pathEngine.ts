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
  matchScore: number; // 0 to 100
  recommendedHighschoolTrack: string;
  universityMajors: string[];
  exampleCareers: string[];
  whyCompatible: PathEngineReasoning;
}

export interface BaseClusterResult {
  mainGroup: string[]; // e.g. ["علوم تجربی"] or ["علوم تجربی", "ادبیات و علوم‌انسانی"]
  topSubfields: string[]; // empty if theoretical, or e.g. ["شبکه و نرم‌افزار رایانه"]
}

export interface PathEngineOutput {
  completenessWarning: string | null;
  completedTestsCount: number;
  baseCluster: BaseClusterResult;
  mainPath: PathRecommendation;
  alternativePaths: PathRecommendation[]; // 3 paths in same academic family
  complementaryPaths: PathRecommendation[]; // 3 interdisciplinary / different family paths
  allRecommendedPaths: PathRecommendation[]; // All 7 paths combined
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
  if (completedTestsCount < 4) {
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
  // Stage 2: Initial Path Scoring with Gardner & Alignment Bonus
  // ---------------------------------------------------------
  const stage2Scored = PATH_DATABASE.map((path) => {
    let gardnerScore = 10;

    if (gardner && gardner.topIntelligences && gardner.topIntelligences.length > 0) {
      const rankWeights = [1.0, 0.7, 0.4];
      gardnerScore = 0;

      gardner.topIntelligences.slice(0, 3).forEach((intel, idx) => {
        const weight = rankWeights[idx] || 0.3;
        const pathIntelWeight = path.gardnerWeights[intel] || 0;
        gardnerScore += weight * pathIntelWeight * 100;
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
      alignmentBonus = 1.5; // +50% bonus
    } else if (hasMainGroupMatch) {
      alignmentBonus = 1.3; // +30% bonus
    }

    const stage2Score = gardnerScore * alignmentBonus;
    return { path, stage2Score, alignmentBonus };
  });

  // ---------------------------------------------------------
  // Stage 3: MBTI Multiplicative Personality Filter
  // ---------------------------------------------------------
  const stage3Scored = stage2Scored.map(({ path, stage2Score, alignmentBonus }) => {
    let mbtiMultiplier = 1.0;

    if (mbti && mbti.type && mbti.certaintyScores) {
      let compatibilitySum = 0;

      const letters = [
        mbti.certaintyScores.EI?.dominantLetter || mbti.type[0],
        mbti.certaintyScores.SN?.dominantLetter || mbti.type[1],
        mbti.certaintyScores.TF?.dominantLetter || mbti.type[2],
        mbti.certaintyScores.JP?.dominantLetter || mbti.type[3],
      ];

      const axes = ['EI', 'SN', 'TF', 'JP'];

      letters.forEach((letter, idx) => {
        const targetConfig = MBTI_BEHAVIORAL_TARGETS[letter];
        if (targetConfig) {
          const actualValue = path.behavioralVector[targetConfig.dimension];
          const distance = Math.abs(actualValue - targetConfig.target) / 100;
          const axisKey = axes[idx];
          const certaintyPct = mbti.certaintyScores[axisKey]?.intensityPct ?? mbti.certainty?.[axisKey] ?? 50;
          const weightedDistance = distance * (certaintyPct / 100);
          compatibilitySum += 1 - weightedDistance;
        } else {
          compatibilitySum += 1;
        }
      });

      mbtiMultiplier = Math.max(0.2, compatibilitySum / 4);
    }

    const stage3Score = stage2Score * mbtiMultiplier;
    return { path, stage3Score, mbtiMultiplier, alignmentBonus };
  });

  // ---------------------------------------------------------
  // Stage 4: DISC Multiplicative Behavioral Filter & Final Score
  // ---------------------------------------------------------
  const stage4Scored = stage3Scored.map(({ path, stage3Score, mbtiMultiplier, alignmentBonus }) => {
    let discMultiplier = 1.0;

    if (disc && disc.profile) {
      const dimensions = disc.profile.split(''); // e.g. ['I', 'D'] or ['D']
      let totalMult = 0;

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

      discMultiplier = Math.max(0.2, totalMult / dimensions.length);
    }

    const rawFinalScore = stage3Score * discMultiplier;
    return { path, rawFinalScore, mbtiMultiplier, discMultiplier, alignmentBonus };
  });

  // Normalize final scores to 0-100
  const maxRawScore = Math.max(...stage4Scored.map((s) => s.rawFinalScore), 1);
  const normalizedPaths = stage4Scored.map((item) => {
    const matchScore = Math.min(99, Math.max(50, Math.round((item.rawFinalScore / maxRawScore) * 100)));
    return { ...item, matchScore };
  });

  // Sort descending by matchScore
  normalizedPaths.sort((a, b) => b.matchScore - a.matchScore);

  // Apply Stage 4.4 Minimum Threshold (relax if fewer than 7 paths remain)
  let eligible = normalizedPaths.filter((p) => p.matchScore >= 55);
  if (eligible.length < 7) {
    eligible = normalizedPaths; // Relax threshold to ensure full 7 paths output
  }

  // ---------------------------------------------------------
  // Stage 5: Final 7-Path Assembly (1 Main + 3 Alternative + 3 Complementary)
  // ---------------------------------------------------------
  const mainPathItem = eligible[0];

  const mainPathRec = buildRecommendation(
    mainPathItem.path,
    mainPathItem.matchScore,
    baseCluster,
    gardner,
    mbti,
    disc
  );

  const mainBaseGroup = baseCluster.mainGroup[0];

  // Helper to check if a path matches the main academic group
  const matchesMainGroup = (p: PathDefinition) => p.compatibleTracks.includes(mainBaseGroup);

  // 3 Alternative Paths: Same academic family
  const alternativePool = eligible.slice(1).filter((item) => matchesMainGroup(item.path));
  const altItems = alternativePool.slice(0, 3);

  // Fallback if alternative pool has fewer than 3
  if (altItems.length < 3) {
    const remaining = eligible.slice(1).filter((item) => !altItems.includes(item));
    while (altItems.length < 3 && remaining.length > 0) {
      altItems.push(remaining.shift()!);
    }
  }

  const alternativePaths = altItems.map((item) =>
    buildRecommendation(item.path, item.matchScore, baseCluster, gardner, mbti, disc)
  );

  // 3 Complementary Paths: Interdisciplinary / Different academic track family
  const complementaryPool = eligible.slice(1).filter(
    (item) => !altItems.includes(item) && !matchesMainGroup(item.path)
  );
  const compItems = complementaryPool.slice(0, 3);

  // Fallback if complementary pool has fewer than 3
  if (compItems.length < 3) {
    const remainingComp = eligible
      .slice(1)
      .filter((item) => !altItems.includes(item) && !compItems.includes(item));
    while (compItems.length < 3 && remainingComp.length > 0) {
      compItems.push(remainingComp.shift()!);
    }
  }

  const complementaryPaths = compItems.map((item) =>
    buildRecommendation(item.path, item.matchScore, baseCluster, gardner, mbti, disc)
  );

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
  const subfieldStr = baseCluster.topSubfields.length > 0 ? ` (زیررشته‌های ${baseCluster.topSubfields.join('، ')})` : '';

  const hollandReasoning = `این مسیر با خوشه‌ی پایه تحصیلی شما در گروه ${mainGroupStr}${subfieldStr} هم‌راستایی کامل دارد.`;

  const topGardnerStr = gardner?.topIntelligences ? gardner.topIntelligences.slice(0, 2).join(' و ') : 'هوش‌های برتر تحلیلی';
  const gardnerReasoning = `توانمندی‌های روانی شما در حوزه ${topGardnerStr} پشتیبان اصلی موفقیت در این حوزه تخصصی است.`;

  const mbtiTypeStr = mbti?.type || 'متوازن';
  const mbtiReasoning = `سبک شخصیتی ${mbtiTypeStr} شما با میزان ساختار و پویایی محیطی این شغل هم‌خوانی بالا دارد.`;

  const discProfileStr = disc?.profile || 'متعادل';
  const discReasoning = `پروفایل رفتاری ${discProfileStr} الگوهای تعاملی و تصمیم‌گیری مورد نیاز این مسیر را به خوبی برآورده می‌سازد.`;

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
