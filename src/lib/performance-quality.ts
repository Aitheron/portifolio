import type {NodeRevealState, PerformanceQuality} from "./portfolio-types";

export const nodeRevealDistance = {
  signal: 45,
  identity: 25,
  preview: 15,
  interaction: 16,
  hysteresis: 1.25,
} as const;

export const qualitySettings: Record<
  PerformanceQuality,
  {dpr: [number, number]; backgroundParticles: number; clusterParticles: number}
> = {
  high: {dpr: [1, 1.5], backgroundParticles: 520, clusterParticles: 72},
  medium: {dpr: [1, 1.25], backgroundParticles: 300, clusterParticles: 46},
  low: {dpr: [0.85, 1], backgroundParticles: 150, clusterParticles: 24},
};

type NavigatorWithMemory = Navigator & {deviceMemory?: number};

export function detectPerformanceQuality(reducedMotion: boolean): PerformanceQuality {
  if (reducedMotion) return "low";

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as NavigatorWithMemory).deviceMemory;
  const compactViewport = window.innerWidth < 720;

  if (compactViewport || coarsePointer || (memory !== undefined && memory <= 4)) {
    return "low";
  }

  if (window.innerWidth < 1180 || (memory !== undefined && memory <= 8)) {
    return "medium";
  }

  return "high";
}

export function getRevealState(
  distance: number,
  currentState: NodeRevealState,
  selected: boolean,
): NodeRevealState {
  if (selected) return "selected";

  const hysteresis = nodeRevealDistance.hysteresis;
  if (currentState === "preview" && distance <= nodeRevealDistance.preview + hysteresis) {
    return "preview";
  }
  if (currentState === "identity" && distance <= nodeRevealDistance.identity + hysteresis) {
    return distance <= nodeRevealDistance.preview ? "preview" : "identity";
  }
  if (distance <= nodeRevealDistance.preview) return "preview";
  if (distance <= nodeRevealDistance.identity) return "identity";
  return "signal";
}
