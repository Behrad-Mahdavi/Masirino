import { HollandResult } from './holland';
import { GardnerResult } from './gardner';
import { MbtiResult } from './mbti';
import { DiscResult } from './disc';
import {
  ONET_CAREER_DATABASE,
  ONET_CAREER_CLUSTERS,
  CareerEntity,
  RiasecVector,
  GardnerVector,
  JobWorkEnvironmentVector,
  DiscRoleMapping,
  MBTI_BEHAVIORAL_TARGETS,
  PATH_DATABASE,
  PathDefinition,
} from './pathEngineTables';

// ============================================================================
// V2 Types & Interfaces (O*NET & Multi-Dimensional Funnel Architecture)
// ============================================================================

export interface DiscPositioningResult {
  userProfile: string; // e.g. "D", "ID", "SC"
  dominantArchetype: 'D' | 'I' | 'S' | 'C';
  targetRoleTitle: string; // e.g. "معمار سیستم و لید فنی"
  workStyleGuidance: string;
  strengthsInRole: string[];
  growthAreas: string[];
}

export interface PathRecommendationResult {
  jobId: string;
  onetCode: string;
  titleFa: string;
  titleEn: string;
  cluster: {
    id: string;
    titleFa: string;
  };
  description: string;
  matchScore: number; // 0 to 100
  metrics: {
    hollandFit: number; // 0 to 100 (Cosine similarity percentage)
    gardnerFit: number; // 0 to 100 (Cognitive suitability)
    mbtiFit: number; // 0 to 100 (Psychological synergy)
  };
  discPositioning: DiscPositioningResult;
  educationalRoadmap: {
    highSchoolTrack: string;
    universityMajors: string[];
  };
  compatibilityReasoning: {
    hollandWhy: string;
    gardnerWhy: string;
    mbtiWhy: string;
    discWhy: string;
  };
}

export interface PathEngineOutputV2 {
  completenessWarning: string | null;
  completedTestsCount: number;
  userSummary: {
    hollandCode: string;
    topIntelligences: string[];
    mbtiType: string;
    discProfile: string;
  };
  topCareerClusters: {
    clusterId: string;
    titleFa: string;
    titleEn: string;
    affinityScore: number; // 0 to 100
  }[];
  basket: {
    mainPath: PathRecommendationResult;
    alternativePaths: PathRecommendationResult[]; // Top same-cluster matches
    complementaryPaths: PathRecommendationResult[]; // Top cross-cluster / interdisciplinary matches
  };
  allPathsRanked: PathRecommendationResult[];
  computedAt: string;
}

export interface PathEngineTraceV2 {
  hollandTrace: {
    userVector: RiasecVector;
    clusterAffinities: { clusterId: string; titleFa: string; cosineSim: number }[];
    top3Clusters: string[];
  };
  gardnerTrace: {
    topIntelligences: string[];
    jobFits: { jobId: string; titleFa: string; rawFit: number; normalizedFit: number }[];
  };
  mbtiTrace: {
    mbtiType: string;
    jobDistances: {
      jobId: string;
      titleFa: string;
      axes: { axis: string; dist: number; certainty: number; contribution: number }[];
      mbtiFit: number;
    }[];
  };
  discTrace: {
    discProfile: string;
    archetypeAssigned: 'D' | 'I' | 'S' | 'C';
  };
  assemblyTrace: {
    mainJobId: string;
    mainClusterId: string;
    alternativeSelectedIds: string[];
    complementarySelectedIds: string[];
  };
}

// ---------------------------------------------------------
// Backward Compatibility Legacy Interfaces
// ---------------------------------------------------------
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
  matchScore: number;
  recommendedHighschoolTrack: string;
  universityMajors: string[];
  exampleCareers: string[];
  whyCompatible: PathEngineReasoning;
}

export interface BaseClusterResult {
  mainGroup: string[];
  topSubfields: string[];
}

export interface PathEngineOutput {
  completenessWarning: string | null;
  completedTestsCount: number;
  baseCluster: BaseClusterResult;
  mainPath: PathRecommendation;
  alternativePaths: PathRecommendation[];
  complementaryPaths: PathRecommendation[];
  allRecommendedPaths: PathRecommendation[];
  computedAt: string;
}

// ============================================================================
// Core Mathematical Calculations
// ============================================================================

/**
 * Calculates Cosine Similarity between two 6-dimensional RIASEC vectors:
 * CosineSim(U, J) = (U · J) / (||U|| * ||J||)
 * Defensive: Returns 0 when either vector norm is 0 (prevents division by zero / NaN).
 * Range: [0.0, 1.0]
 */
export function calculateCosineSimilarity(u: RiasecVector, j: RiasecVector): number {
  const keys: (keyof RiasecVector)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dotProduct = 0;
  let normU = 0;
  let normJ = 0;

  for (const k of keys) {
    const valU = Math.max(0, u[k] || 0);
    const valJ = Math.max(0, j[k] || 0);
    dotProduct += valU * valJ;
    normU += valU * valU;
    normJ += valJ * valJ;
  }

  // Fallback: If either user or job norm is 0, cosine similarity is safely 0.0
  if (normU === 0 || normJ === 0) return 0.0;

  const denominator = Math.sqrt(normU) * Math.sqrt(normJ);
  if (denominator === 0 || !Number.isFinite(denominator)) return 0.0;

  const sim = dotProduct / denominator;
  return Math.max(0.0, Math.min(1.0, sim));
}

/**
 * Calculates Gardner Cognitive Suitability:
 * GardnerFit_raw = sum(WeightRank_i * W_job(intel_i) * (G_user(intel_i) / 5.0))
 * Weights for top 3: 1.0, 0.7, 0.4 (Sum = 2.1)
 *
 * Deficit Penalty:
 * deficitPenalty = sum( 0.20 * W_job(k) * (3.0 - G_user(k))/3.0 ) for all k where W_job(k) >= 0.85 and G_user(k) < 3.0
 *
 * GardnerFit_final = max(0.0, min(1.0, (GardnerFit_raw / 2.1) - deficitPenalty))
 * Range: [0.0, 1.0]
 */
export function calculateGardnerFit(
  gardner: GardnerResult | null,
  weights: GardnerVector
): { fitScore: number; rawSum: number; topUsed: string[] } {
  if (!gardner || !gardner.topIntelligences || gardner.topIntelligences.length === 0) {
    return { fitScore: 0.75, rawSum: 1.575, topUsed: [] }; // Baseline when Gardner test is absent
  }

  const rankWeights = [1.0, 0.7, 0.4];
  const topIntels = gardner.topIntelligences.slice(0, 3);
  let rawSum = 0;

  topIntels.forEach((intel, idx) => {
    const rankWeight = rankWeights[idx] || 0.3;
    const jobImportance = (weights as any)[intel] ?? 0.3;
    const userScoresSource = gardner.allScores || gardner.scores;
    const userScore = userScoresSource ? (userScoresSource as any)[intel] ?? 3.5 : 3.5;
    // Scale user score to 0.0 - 1.0
    const userScoreNormalized = Math.max(0.1, Math.min(1.0, userScore / 5.0));
    rawSum += rankWeight * jobImportance * userScoreNormalized;
  });

  const maxTheoretical = 2.1 * 1.0 * 1.0;
  const baseFit = rawSum / maxTheoretical;

  // Deficit penalty for missing high-demand job requirements:
  // Evaluated across all 8 intelligences using allScores/scores
  let deficitPenalty = 0;
  const userScoresSource = gardner.allScores || gardner.scores;
  if (userScoresSource) {
    const allGardnerKeys: (keyof GardnerVector)[] = [
      'logical',
      'spatial',
      'linguistic',
      'interpersonal',
      'intrapersonal',
      'bodily',
      'musical',
      'naturalistic',
    ];
    const penaltyWeight = 0.20;
    allGardnerKeys.forEach((k) => {
      const jobWeight = (weights as any)[k] ?? 0;
      if (jobWeight >= 0.85) {
        const uScore = (userScoresSource as any)[k] ?? 2.5;
        if (uScore < 3.0) {
          deficitPenalty += penaltyWeight * jobWeight * ((3.0 - uScore) / 3.0);
        }
      }
    });
  }

  const fitScore = Math.max(0.0, Math.min(1.0, baseFit - deficitPenalty));
  return { fitScore, rawSum, topUsed: topIntels };
}

/**
 * Calculates MBTI Psychological Synergy:
 * MBTI_Fit = 1 - 0.25 * sum((|JobValue - TargetValue| / 100) * (IntensityPct / 100))
 * Range: [0.0, 1.0]
 */
export function calculateMbtiFit(
  mbti: MbtiResult | null,
  env: JobWorkEnvironmentVector
): { fitScore: number; axisBreakdown: any[] } {
  if (!mbti || !mbti.type) {
    return { fitScore: 0.85, axisBreakdown: [] }; // Baseline when MBTI is absent
  }

  const axes: ('EI' | 'SN' | 'TF' | 'JP')[] = ['EI', 'SN', 'TF', 'JP'];
  const breakdown: any[] = [];
  let totalPenalty = 0;

  axes.forEach((axis) => {
    let dominant = '';
    let intensityPct = 80;
    let isNeutral = false;

    if (mbti.certaintyScores && mbti.certaintyScores[axis]) {
      dominant = mbti.certaintyScores[axis].dominantLetter;
      intensityPct = mbti.certaintyScores[axis].intensityPct ?? 80;
      isNeutral = !!mbti.certaintyScores[axis].isNeutral;
    } else {
      const idx = axis === 'EI' ? 0 : axis === 'SN' ? 1 : axis === 'TF' ? 2 : 3;
      dominant = mbti.type[idx] || 'E';
      intensityPct = (mbti.certainty as any)?.[axis] ?? 80;
    }

    let targetDef = MBTI_BEHAVIORAL_TARGETS[dominant];
    if (!targetDef || dominant === 'X' || isNeutral || intensityPct === 0) {
      const dimMap: Record<string, keyof JobWorkEnvironmentVector> = {
        EI: 'social',
        SN: 'structure',
        TF: 'analytical_vs_valuebased',
        JP: 'pace',
      };
      targetDef = { dimension: dimMap[axis] || 'social', target: 50 };
      intensityPct = 0; // True neutrality imposes 0 weight factor / 0 penalty
    }

    const actualVal = (env as any)[targetDef.dimension] ?? 50;
    const rawDist = Math.abs(actualVal - targetDef.target);
    // WeightFactor accurately reflects true preference intensity [0.0, 1.0] without artificial floor
    const weightFactor = Math.max(0, Math.min(1.0, intensityPct / 100));
    const axisPenalty = (rawDist / 100) * weightFactor;

    totalPenalty += axisPenalty;
    breakdown.push({
      axis,
      dominantLetter: dominant,
      targetDimension: targetDef.dimension,
      targetValue: targetDef.target,
      actualValue: actualVal,
      distance: rawDist,
      certaintyPct: intensityPct,
      contribution: Math.max(0, 1 - axisPenalty),
    });
  });

  const fitScore = Math.max(0.1, Math.min(1.0, 1 - totalPenalty / 4));
  return { fitScore, axisBreakdown: breakdown };
}

/**
 * Extracts DISC Behavioral Role Positioning inside the career
 */
export function extractDiscPositioning(
  disc: DiscResult | null,
  roles: Record<'D' | 'I' | 'S' | 'C', DiscRoleMapping>
): DiscPositioningResult {
  const profileStr = disc?.profile || 'D';
  let primaryLetter: 'D' | 'I' | 'S' | 'C' = 'D';

  const firstChar = profileStr.charAt(0).toUpperCase();
  if (['D', 'I', 'S', 'C'].includes(firstChar)) {
    primaryLetter = firstChar as any;
  }

  const role = roles[primaryLetter] || roles.D;
  return {
    userProfile: profileStr,
    dominantArchetype: primaryLetter,
    targetRoleTitle: role.roleTitle,
    workStyleGuidance: role.workStyleDescription,
    strengthsInRole: role.strengths || [],
    growthAreas: role.growthAreas || [],
  };
}

// ============================================================================
// Main Path Engine V2 Pipeline
// ============================================================================

export function runPathEngineV2(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathEngineOutputV2 {
  // 1. Prepare User RIASEC vector
  const userRiasec: RiasecVector = {
    R: holland?.normalizedScores?.R ?? holland?.scores?.R ?? 50,
    I: holland?.normalizedScores?.I ?? holland?.scores?.I ?? 50,
    A: holland?.normalizedScores?.A ?? holland?.scores?.A ?? 50,
    S: holland?.normalizedScores?.S ?? holland?.scores?.S ?? 50,
    E: holland?.normalizedScores?.E ?? holland?.scores?.E ?? 50,
    C: holland?.normalizedScores?.C ?? holland?.scores?.C ?? 50,
  };

  // 2. Compute Top 3 Career Clusters Affinity
  const clusterAffinities = Object.values(ONET_CAREER_CLUSTERS).map((cl) => {
    const sim = calculateCosineSimilarity(userRiasec, cl.typicalRiasec);
    return {
      clusterId: cl.id,
      titleFa: cl.titleFa,
      titleEn: cl.titleEn,
      affinityScore: Math.round(sim * 100),
      rawSim: sim,
    };
  });

  clusterAffinities.sort((a, b) => b.affinityScore - a.affinityScore);
  const top3Clusters = clusterAffinities.slice(0, 3);

  // 3. Process each career entity through the 4-phase psychometric funnel
  const evaluatedCareers: PathRecommendationResult[] = ONET_CAREER_DATABASE.map((job) => {
    // Phase 1: Holland Cosine Sim
    const hollandSim = calculateCosineSimilarity(userRiasec, job.riasecVector);
    const hollandFitPct = Math.round(hollandSim * 100);

    // Phase 2: Gardner Cognitive Fit
    const gardnerEval = calculateGardnerFit(gardner, job.gardnerWeights);
    const gardnerFitPct = Math.round(gardnerEval.fitScore * 100);

    // Phase 3: MBTI Psychological Synergy
    const mbtiEval = calculateMbtiFit(mbti, job.workEnvironment);
    const mbtiFitPct = Math.round(mbtiEval.fitScore * 100);

    // Phase 4: DISC Role Positioning
    const discPos = extractDiscPositioning(disc, job.discRoles);

    // Composite MatchScore Calculation with Defensive Clamping:
    // MatchScore = Math.round(Math.max(0.0, Math.min(1.0, (Holland * 0.35) + (Gardner * 0.35) + (MBTI * 0.30))) * 100)
    const compositeScore = (hollandSim * 0.35) + (gardnerEval.fitScore * 0.35) + (mbtiEval.fitScore * 0.30);
    const matchScore = Math.round(Math.max(0.0, Math.min(1.0, compositeScore)) * 100);

    // Reasoning texts
    const hollandWhy = `هم‌پوشانی رغبتی ${hollandFitPct}٪ بر اساس تطابق بردار RIASEC با کلاستر ${job.clusterTitleFa}.`;
    const gardnerWhy = `سازگاری شناختی ${gardnerFitPct}٪ با هوش‌های برتر (${gardnerEval.topUsed.join('، ') || 'عمومی'}).`;
    const mbtiWhy = `آرامش روانی ${mbtiFitPct}٪ بر اساس شاخص‌های ۶بعدی محیط کار و تیپ ${mbti?.type || 'روان‌شناختی'}.`;
    const discWhy = `نقش پیشنهادی درون‌تیمی: «${discPos.targetRoleTitle}» منطبق بر سبک رفتاری ${discPos.userProfile}.`;

    return {
      jobId: job.id,
      onetCode: job.onetCode,
      titleFa: job.titleFa,
      titleEn: job.titleEn,
      cluster: {
        id: job.clusterId,
        titleFa: job.clusterTitleFa,
      },
      description: job.descriptionFa,
      matchScore,
      metrics: {
        hollandFit: hollandFitPct,
        gardnerFit: gardnerFitPct,
        mbtiFit: mbtiFitPct,
      },
      discPositioning: discPos,
      educationalRoadmap: {
        highSchoolTrack: job.educationalTracks.highSchoolTrackSuggestions.join(' یا '),
        universityMajors: job.educationalTracks.universityMajors,
      },
      compatibilityReasoning: {
        hollandWhy,
        gardnerWhy,
        mbtiWhy,
        discWhy,
      },
    };
  });

  // Sort all careers descending by matchScore
  evaluatedCareers.sort((a, b) => b.matchScore - a.matchScore);

  // 4. Assemble 7-Path Basket
  // 4.1 Main Path: Top #1 overall
  const mainPath = evaluatedCareers[0] || evaluatedCareers[0];
  const mainClusterId = mainPath.cluster.id;

  // 4.2 Alternative Paths (3): Top matches in the SAME cluster (or same primary RIASEC family if needed)
  let sameClusterCandidates = evaluatedCareers.filter(
    (c) => c.jobId !== mainPath.jobId && c.cluster.id === mainClusterId
  );
  if (sameClusterCandidates.length < 3) {
    const additionalFamily = evaluatedCareers.filter(
      (c) => c.jobId !== mainPath.jobId && !sameClusterCandidates.some((sc) => sc.jobId === c.jobId)
    );
    sameClusterCandidates = [...sameClusterCandidates, ...additionalFamily];
  }
  const alternativePaths = sameClusterCandidates.slice(0, 3);

  // 4.3 Complementary Paths (3): Strictly 3 MUTUALLY EXCLUSIVE clusters (none from mainClusterId, none repeated)
  const usedJobIds = new Set([mainPath.jobId, ...alternativePaths.map((a) => a.jobId)]);
  const usedClusterIds = new Set([mainClusterId]);
  const complementaryPaths: PathRecommendationResult[] = [];

  // Pass 1: Strict Unique Cluster Selection (1 top job per distinct cluster)
  for (const candidate of evaluatedCareers) {
    if (complementaryPaths.length >= 3) break;
    if (!usedJobIds.has(candidate.jobId) && !usedClusterIds.has(candidate.cluster.id)) {
      complementaryPaths.push(candidate);
      usedJobIds.add(candidate.jobId);
      usedClusterIds.add(candidate.cluster.id);
    }
  }

  // Pass 2 (Graceful fallback if database has fewer than 4 total clusters):
  if (complementaryPaths.length < 3) {
    for (const candidate of evaluatedCareers) {
      if (complementaryPaths.length >= 3) break;
      if (!usedJobIds.has(candidate.jobId)) {
        complementaryPaths.push(candidate);
        usedJobIds.add(candidate.jobId);
      }
    }
  }

  // Calculate Completeness
  let completedTestsCount = 0;
  if (holland && (holland.scores || holland.normalizedScores)) completedTestsCount++;
  if (gardner && gardner.topIntelligences?.length) completedTestsCount++;
  if (mbti && mbti.type) completedTestsCount++;
  if (disc && disc.profile) completedTestsCount++;

  const completenessWarning =
    completedTestsCount < 4
      ? `این نتیجه بر اساس ${completedTestsCount} از ۴ آزمون روان‌سنجی تولید شده است و تکمیل تمامی آزمون‌ها دقت گزارش را به حداکثر می‌رساند.`
      : null;

  return {
    completenessWarning,
    completedTestsCount,
    userSummary: {
      hollandCode: holland?.code || 'RIA',
      topIntelligences: gardner?.topIntelligences || ['logical', 'spatial', 'linguistic'],
      mbtiType: mbti?.type || 'INTJ',
      discProfile: disc?.profile || 'D',
    },
    topCareerClusters: top3Clusters,
    basket: {
      mainPath,
      alternativePaths,
      complementaryPaths,
    },
    allPathsRanked: evaluatedCareers,
    computedAt: new Date().toISOString(),
  };
}

// ============================================================================
// Legacy Wrapper for Existing UI & Tests (100% Parity)
// ============================================================================

export function runPathEngineWithTrace(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): {
  finalOutput: PathEngineOutput;
  trace: any;
  v2Output: PathEngineOutputV2;
} {
  const v2 = runPathEngineV2(holland, gardner, mbti, disc);

  const convertToLegacyRec = (r: PathRecommendationResult): PathRecommendation => ({
    pathId: r.jobId,
    title: r.titleFa,
    category: r.cluster.titleFa,
    description: r.description,
    matchScore: r.matchScore,
    recommendedHighschoolTrack: r.educationalRoadmap.highSchoolTrack,
    universityMajors: r.educationalRoadmap.universityMajors,
    exampleCareers: [
      r.discPositioning.targetRoleTitle,
      ...r.discPositioning.strengthsInRole.slice(0, 2),
    ],
    whyCompatible: {
      hollandReasoning: r.compatibilityReasoning.hollandWhy,
      gardnerReasoning: r.compatibilityReasoning.gardnerWhy,
      mbtiReasoning: r.compatibilityReasoning.mbtiWhy,
      discReasoning: r.compatibilityReasoning.discWhy,
    },
  });

  const legacyMain = convertToLegacyRec(v2.basket.mainPath);
  const legacyAlts = v2.basket.alternativePaths.map(convertToLegacyRec);
  const legacyComps = v2.basket.complementaryPaths.map(convertToLegacyRec);

  const finalOutput: PathEngineOutput = {
    completenessWarning: v2.completenessWarning,
    completedTestsCount: v2.completedTestsCount,
    baseCluster: {
      mainGroup: [v2.topCareerClusters[0]?.titleFa || 'فناوری و مهندسی'],
      topSubfields: [v2.topCareerClusters[1]?.titleFa || 'طراحی و علوم'],
    },
    mainPath: legacyMain,
    alternativePaths: legacyAlts,
    complementaryPaths: legacyComps,
    allRecommendedPaths: [legacyMain, ...legacyAlts, ...legacyComps],
    computedAt: v2.computedAt,
  };

  return {
    finalOutput,
    trace: {
      v2TopClusters: v2.topCareerClusters,
      v2Summary: v2.userSummary,
    },
    v2Output: v2,
  };
}

export function runPathEngine(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathEngineOutput {
  return runPathEngineWithTrace(holland, gardner, mbti, disc).finalOutput;
}

export function calculateBaseCluster(holland: HollandResult | null): BaseClusterResult {
  const v2 = runPathEngineV2(holland, null, null, null);
  return {
    mainGroup: [v2.topCareerClusters[0]?.titleFa || 'فناوری اطلاعات و هوش مصنوعی'],
    topSubfields: [v2.topCareerClusters[1]?.titleFa || 'مهندسی و صنعت'],
  };
}

export function calculateBaseClusterWithTrace(holland: HollandResult | null) {
  const base = calculateBaseCluster(holland);
  return {
    trace: {
      groupScoresNormalized: [],
      groupGap: 15,
      mainGroup: base.mainGroup,
      topSubfields: base.topSubfields,
    },
    baseCluster: base,
  };
}
