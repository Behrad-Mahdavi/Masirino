import { HollandResult } from './holland';
import { GardnerResult } from './gardner';
import { MbtiResult } from './mbti';
import { DiscResult } from './disc';
import {
  runPathEngineWithTrace,
  PathRecommendation,
  PathRecommendationResult,
  PathEngineOutputV2,
} from './pathEngine';

export interface PathDnaProfile {
  hollandCode: string;
  topIntelligences: string[];
  mbtiType: string;
  discProfile: string;
  careerClusters: {
    title: string;
    description: string;
    matchScore: number;
    suitableRoles: string[];
  }[];
  topCareerClusters: {
    clusterId: string;
    titleFa: string;
    titleEn: string;
    affinityScore: number;
  }[];
  mainPath: PathRecommendation;
  alternativePaths: PathRecommendation[];
  complementaryPaths: PathRecommendation[];
  allRecommendedPaths: PathRecommendation[];
  v2Basket: {
    mainPath: PathRecommendationResult;
    alternativePaths: PathRecommendationResult[];
    complementaryPaths: PathRecommendationResult[];
  };
  v2Output: PathEngineOutputV2;
  completenessWarning: string | null;
  baseCluster: {
    mainGroup: string[];
    topSubfields: string[];
  };
  computedAt: string;
}

export function computePathDna(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathDnaProfile {
  // Execute the V2 Path Engine with O*NET and 4-phase funnel
  const { finalOutput, v2Output } = runPathEngineWithTrace(holland, gardner, mbti, disc);

  // Map 7-path outputs to careerClusters for legacy view compatibility
  const careerClusters = finalOutput.allRecommendedPaths.map((p) => ({
    title: p.title,
    description: p.description,
    matchScore: p.matchScore,
    suitableRoles: p.exampleCareers,
  }));

  return {
    hollandCode: holland?.code || '---',
    topIntelligences: gardner?.topIntelligences || [],
    mbtiType: mbti?.type || '---',
    discProfile: disc?.profile || '---',
    careerClusters,
    topCareerClusters: v2Output.topCareerClusters,
    mainPath: finalOutput.mainPath,
    alternativePaths: finalOutput.alternativePaths,
    complementaryPaths: finalOutput.complementaryPaths,
    allRecommendedPaths: finalOutput.allRecommendedPaths,
    v2Basket: v2Output.basket,
    v2Output,
    completenessWarning: finalOutput.completenessWarning,
    baseCluster: finalOutput.baseCluster,
    computedAt: finalOutput.computedAt,
  };
}
