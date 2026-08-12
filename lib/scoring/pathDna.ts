import { HollandResult } from './holland';
import { GardnerResult } from './gardner';
import { MbtiResult } from './mbti';
import { DiscResult } from './disc';
import { runPathEngine, PathEngineOutput, PathRecommendation } from './pathEngine';

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
  mainPath: PathRecommendation;
  alternativePaths: PathRecommendation[];
  complementaryPaths: PathRecommendation[];
  allRecommendedPaths: PathRecommendation[];
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
  // Execute the 5-stage Path Engine from Pathenginelogic.MD
  const engineOutput: PathEngineOutput = runPathEngine(holland, gardner, mbti, disc);

  // Map 7-path outputs to careerClusters for legacy view compatibility
  const careerClusters = engineOutput.allRecommendedPaths.map((p) => ({
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
    mainPath: engineOutput.mainPath,
    alternativePaths: engineOutput.alternativePaths,
    complementaryPaths: engineOutput.complementaryPaths,
    allRecommendedPaths: engineOutput.allRecommendedPaths,
    completenessWarning: engineOutput.completenessWarning,
    baseCluster: engineOutput.baseCluster,
    computedAt: engineOutput.computedAt,
  };
}
