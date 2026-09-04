import type {ExperienceStage, PerformanceQuality, Vector3Tuple} from "./portfolio-types";

export type NavigationContext = "overview" | "cluster" | "node";

type NavigationProfile = {
  cameraOffset: Vector3Tuple;
  minDistance: number;
  softDistance: number;
  maxDistance: number;
  rotateSpeed: number;
  zoomSpeed: number;
};

export const navigationConfig = {
  transitionDamping: 4.6,
  reducedMotionDamping: 18,
  arrivalDistance: 0.045,
  targetArrivalDistance: 0.035,
  nodeCompositionOffset: 3.25,
  polarRange: [Math.PI * 0.2, Math.PI * 0.8] as const,
  overview: {
    cameraOffset: [0, 4, 34],
    minDistance: 16,
    softDistance: 39,
    maxDistance: 46,
    rotateSpeed: 0.48,
    zoomSpeed: 0.62,
  },
  cluster: {
    cameraOffset: [0, 2.5, 10.5],
    minDistance: 6.5,
    softDistance: 16,
    maxDistance: 20,
    rotateSpeed: 0.42,
    zoomSpeed: 0.56,
  },
  node: {
    cameraOffset: [0.5, 1.25, 7.25],
    minDistance: 4.5,
    softDistance: 9,
    maxDistance: 12,
    rotateSpeed: 0.34,
    zoomSpeed: 0.48,
  },
  worldBoundary: {
    softRadius: 48,
    hardRadius: 58,
    correctionStrength: 2.8,
  },
} satisfies Record<NavigationContext, NavigationProfile> & {
  transitionDamping: number;
  reducedMotionDamping: number;
  arrivalDistance: number;
  targetArrivalDistance: number;
  nodeCompositionOffset: number;
  polarRange: readonly [number, number];
  worldBoundary: {
    softRadius: number;
    hardRadius: number;
    correctionStrength: number;
  };
};

type FormationProfile = {
  mode: "tiles" | "dissolve";
  columns: number;
  rows: number;
  activeNodeLimit: number;
  scatter: number;
  depth: number;
  rotation: number;
};

export const imageFormationConfig = {
  fragmentsDistance: 25,
  completeDistance: 10.5,
  candidateInterval: 0.16,
  high: {
    mode: "tiles",
    columns: 8,
    rows: 10,
    activeNodeLimit: 3,
    scatter: 1.05,
    depth: 1.35,
    rotation: 0.24,
  },
  medium: {
    mode: "tiles",
    columns: 5,
    rows: 7,
    activeNodeLimit: 2,
    scatter: 0.72,
    depth: 0.82,
    rotation: 0.16,
  },
  low: {
    mode: "dissolve",
    columns: 1,
    rows: 1,
    activeNodeLimit: 1,
    scatter: 0,
    depth: 0,
    rotation: 0,
  },
} satisfies Record<PerformanceQuality, FormationProfile> & {
  fragmentsDistance: number;
  completeDistance: number;
  candidateInterval: number;
};

export function getNavigationContext(stage: ExperienceStage): NavigationContext {
  if (stage === "node-details") return "node";
  if (stage === "cluster-focus") return "cluster";
  return "overview";
}

export function getFormationProgress(distance: number): number {
  const range = imageFormationConfig.fragmentsDistance - imageFormationConfig.completeDistance;
  const linear = (imageFormationConfig.fragmentsDistance - distance) / range;
  const clamped = Math.min(1, Math.max(0, linear));
  return clamped * clamped * (3 - 2 * clamped);
}
