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
  EnterpriseLaborInsight,
  MBTI_BEHAVIORAL_TARGETS,
  PATH_DATABASE,
  PathDefinition,
} from './pathEngineTables';

// ============================================================================
// V3 Types & Interfaces (O*NET, Dual-Score & 20D MMR Multimodal Architecture)
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
  matchScore: number; // 0 to 100 (Core PsychometricFit)
  marketViabilityScore?: number; // 0 to 100 (AI Risk, Demand Outlook, Remote-Friendliness)
  strategicScore?: number; // 0 to 100 (0.70 * PsychometricFit + 0.30 * MarketViabilityScore)
  mmrScore?: number; // 0 to 1 (Maximal Marginal Relevance score for complementary diversity)
  enterpriseInsight?: EnterpriseLaborInsight;
  metrics: {
    hollandFit: number; // 0 to 100 (Cosine similarity percentage)
    gardnerFit: number; // 0 to 100 (Cognitive suitability)
    mbtiFit: number; // 0 to 100 (Psychological synergy)
  };
  discPositioning: DiscPositioningResult;
  educationalRoadmap: {
    highSchoolTrack: string;
    universityMajors: string[];
    keyCertifications?: string[];
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
  adaptiveWeightsUsed?: {
    holland: number;
    gardner: number;
    mbti: number;
  };
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
    complementaryPaths: PathRecommendationResult[]; // Top cross-cluster / interdisciplinary matches (MMR-selected)
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

// ============================================================================
// V3 Adaptive Weighting & 20D Multimodal Vector Operations
// ============================================================================

export interface AdaptiveWeights {
  holland: number;
  gardner: number;
  mbti: number;
}

/**
 * Dynamically computes reliability weights (Confidence-Weighted Priors):
 * Holland: alpha_H = max(0.4, (Score_max - Score_min) / 100)
 * Gardner: alpha_G = max(0.4, min(1.0, variance / 1.5))
 * MBTI:    alpha_M = max(0.3, avg(Intensity_a / 100))
 * Re-normalizes over base weights [0.35, 0.35, 0.30]
 */
export function calculateAdaptiveWeights(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null
): AdaptiveWeights {
  const baseWeights = { holland: 0.35, gardner: 0.35, mbti: 0.30 };

  // Holland confidence factor (differentiation index)
  let alphaH = 0.5;
  if (holland && (holland.normalizedScores || holland.scores)) {
    const scores = Object.values(holland.normalizedScores || holland.scores || {});
    if (scores.length > 0) {
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      alphaH = Math.max(0.4, Math.min(1.0, (maxScore - minScore) / 100));
    }
  }

  // Gardner confidence factor (variance between 8 intelligences)
  let alphaG = 0.5;
  const userGardnerScores = gardner?.allScores || gardner?.scores;
  if (userGardnerScores) {
    const gVals = Object.values(userGardnerScores);
    if (gVals.length > 1) {
      const mean = gVals.reduce((a, b) => a + b, 0) / gVals.length;
      const variance = gVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gVals.length;
      alphaG = Math.max(0.4, Math.min(1.0, variance / 1.5));
    }
  }

  // MBTI confidence factor (average intensity across axes)
  let alphaM = 0.5;
  if (mbti) {
    if (mbti.certaintyScores) {
      const intensities = Object.values(mbti.certaintyScores).map((cs) => cs.intensityPct || 0);
      if (intensities.length > 0) {
        const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
        alphaM = Math.max(0.3, Math.min(1.0, avgIntensity / 100));
      }
    } else if (mbti.certainty) {
      const cVals = Object.values(mbti.certainty);
      if (cVals.length > 0) {
        const avgC = cVals.reduce((a, b) => a + b, 0) / cVals.length;
        alphaM = Math.max(0.3, Math.min(1.0, avgC / 100));
      }
    }
  }

  // Re-normalize dynamic weights
  const rawH = baseWeights.holland * alphaH;
  const rawG = baseWeights.gardner * alphaG;
  const rawM = baseWeights.mbti * alphaM;
  const sumRaw = rawH + rawG + rawM;

  return {
    holland: Number((rawH / sumRaw).toFixed(4)),
    gardner: Number((rawG / sumRaw).toFixed(4)),
    mbti: Number((rawM / sumRaw).toFixed(4)),
  };
}

/**
 * Builds a unit-length 20-dimensional Multimodal Job Embedding:
 * Block 1: 0.45 * RIASEC (6D in [0, 1])
 * Block 2: 0.35 * Gardner (8D in [0, 1])
 * Block 3: 0.20 * WorkEnvironment (6D in [0, 1])
 * Resulting vector is L2-normalized so dot-product equals exact cosine similarity in O(1).
 */
export function build20DJobEmbedding(job: CareerEntity): number[] {
  // 1. RIASEC 6D
  const riasecKeys: (keyof RiasecVector)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  const block1 = riasecKeys.map((k) => 0.45 * ((job.riasecVector[k] || 0) / 100));

  // 2. Gardner 8D
  const gardnerKeys: (keyof GardnerVector)[] = [
    'logical',
    'spatial',
    'linguistic',
    'interpersonal',
    'intrapersonal',
    'bodily',
    'musical',
    'naturalistic',
  ];
  const block2 = gardnerKeys.map((k) => 0.35 * (job.gardnerWeights[k] || 0));

  // 3. WorkEnvironment 6D
  const envKeys: (keyof JobWorkEnvironmentVector)[] = [
    'structure',
    'social',
    'autonomy',
    'pace',
    'analytical_vs_valuebased',
    'competitiveness',
  ];
  const block3 = envKeys.map((k) => 0.20 * ((job.workEnvironment[k] || 0) / 100));

  const raw20D = [...block1, ...block2, ...block3];

  // L2 Unit Normalization
  const normSq = raw20D.reduce((sum, val) => sum + val * val, 0);
  const norm = Math.sqrt(normSq);
  if (norm === 0 || !Number.isFinite(norm)) {
    return raw20D;
  }
  return raw20D.map((v) => v / norm);
}

/**
 * Fast O(1) Cosine Similarity between two L2-normalized 20D job embeddings
 */
export function calculate20DDotProduct(v1: number[], v2: number[]): number {
  let dot = 0;
  const len = Math.min(v1.length, v2.length, 20);
  for (let i = 0; i < len; i++) {
    dot += v1[i] * v2[i];
  }
  return Math.max(0.0, Math.min(1.0, dot));
}

/**
 * Calculates Market Viability Score:
 * MarketViabilityScore = round(0.40 * (100 - AutomationRisk) + 0.35 * DemandScore + 0.25 * RemoteScore)
 */
export function calculateMarketViabilityScore(insight?: EnterpriseLaborInsight): number {
  if (!insight) return 75; // Default neutral viability

  const demandMap: Record<string, number> = {
    rising: 95,
    stable: 75,
    declining: 40,
  };
  const demandScore = demandMap[insight.demandOutlook] || 75;
  const remoteScore = Math.max(0, Math.min(100, insight.remoteCompatibilityPercent ?? 60));
  const autoRisk = Math.max(0, Math.min(100, insight.automationRiskPercent ?? 35));

  const rawViability = 0.40 * (100 - autoRisk) + 0.35 * demandScore + 0.25 * remoteScore;
  return Math.round(Math.max(10, Math.min(100, rawViability)));
}

/**
 * Calculates Strategic Score (V3):
 * StrategicScore = round(0.70 * PsychometricFit + 0.30 * MarketViabilityScore)
 */
export function calculateStrategicScore(psychometricFit: number, marketViability: number): number {
  const combined = 0.70 * psychometricFit + 0.30 * marketViability;
  return Math.round(Math.max(10, Math.min(100, combined)));
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
// Main Path Engine V3 Pipeline
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

  // 2. Compute Adaptive Weights based on user certainty/differentiation
  const adaptiveWeights = calculateAdaptiveWeights(holland, gardner, mbti);

  // 3. Compute Top 3 Career Clusters Affinity
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

  // Precompute 20D embeddings for fast O(1) MMR diversity calculations
  const embeddingMap = new Map<string, number[]>();
  ONET_CAREER_DATABASE.forEach((job) => {
    embeddingMap.set(job.id, build20DJobEmbedding(job));
  });

  // 4. Process each career entity through the psychometric funnel & labor market insight
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

    // Dual-Score: Core PsychometricFit with Adaptive Dynamic Weights
    const compositeScore =
      hollandSim * adaptiveWeights.holland +
      gardnerEval.fitScore * adaptiveWeights.gardner +
      mbtiEval.fitScore * adaptiveWeights.mbti;
    const matchScore = Math.round(Math.max(0.0, Math.min(1.0, compositeScore)) * 100);

    // Dual-Score: Market Viability & Strategic Composite Score (V3)
    const marketViability = calculateMarketViabilityScore(job.enterpriseInsight);
    const strategicScore = calculateStrategicScore(matchScore, marketViability);

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
      marketViabilityScore: marketViability,
      strategicScore,
      enterpriseInsight: job.enterpriseInsight,
      metrics: {
        hollandFit: hollandFitPct,
        gardnerFit: gardnerFitPct,
        mbtiFit: mbtiFitPct,
      },
      discPositioning: discPos,
      educationalRoadmap: {
        highSchoolTrack: job.educationalTracks.highSchoolTrackSuggestions.join(' یا '),
        universityMajors: job.educationalTracks.universityMajors,
        keyCertifications: job.enterpriseInsight?.keyCertifications,
      },
      compatibilityReasoning: {
        hollandWhy,
        gardnerWhy,
        mbtiWhy,
        discWhy,
      },
    };
  });

  // Sort all careers descending by matchScore (PsychometricFit)
  evaluatedCareers.sort((a, b) => b.matchScore - a.matchScore);

  // 5. Assemble 7-Path Basket
  // 5.1 Main Path: Top #1 overall
  const mainPath = evaluatedCareers[0] || evaluatedCareers[0];
  const mainClusterId = mainPath.cluster.id;

  // 5.2 Alternative Paths (3): Top matches in the SAME cluster (or same primary RIASEC family if needed)
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

  // 5.3 Complementary Paths (3): Vector-based Maximal Marginal Relevance (MMR) with lambda = 0.65
  // in 20D Multimodal space, enforcing 3 strictly distinct clusters outside mainClusterId
  const usedJobIds = new Set([mainPath.jobId, ...alternativePaths.map((a) => a.jobId)]);
  const usedClusterIds = new Set([mainClusterId]);
  const selectedBasket20D = [
    embeddingMap.get(mainPath.jobId) || [],
    ...alternativePaths.map((a) => embeddingMap.get(a.jobId) || []),
  ];

  const complementaryPaths: PathRecommendationResult[] = [];
  const lambdaMMR = 0.65;

  // MMR Iterative Selection for 3 Complementary Paths
  for (let step = 0; step < 3; step++) {
    let bestCandidate: PathRecommendationResult | null = null;
    let bestMMR = -Infinity;

    for (const candidate of evaluatedCareers) {
      if (usedJobIds.has(candidate.jobId) || usedClusterIds.has(candidate.cluster.id)) {
        continue;
      }

      const candVec = embeddingMap.get(candidate.jobId) || [];
      // Calculate max similarity to any already-selected path in the basket
      let maxSim = 0;
      for (const selectedVec of selectedBasket20D) {
        const sim = calculate20DDotProduct(candVec, selectedVec);
        if (sim > maxSim) maxSim = sim;
      }

      // MMR Score: balance between relevance (matchScore) and diversity (1 - maxSim)
      const relevance = candidate.matchScore / 100;
      const mmrScore = lambdaMMR * relevance - (1 - lambdaMMR) * maxSim;

      if (mmrScore > bestMMR) {
        bestMMR = mmrScore;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      bestCandidate.mmrScore = Number(bestMMR.toFixed(3));
      complementaryPaths.push(bestCandidate);
      usedJobIds.add(bestCandidate.jobId);
      usedClusterIds.add(bestCandidate.cluster.id);
      selectedBasket20D.push(embeddingMap.get(bestCandidate.jobId) || []);
    } else {
      break;
    }
  }

  // Graceful Fallback Pass (if candidates with unique clusters are exhausted)
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
    adaptiveWeightsUsed: adaptiveWeights,
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
