import type {ClusterId, PerformanceQuality, PortfolioNode, SemanticSatellite, Vector3Tuple} from "./portfolio-types";

export const projectSatelliteRadius = 5.2;
export const projectVisualSafetyMargin = 0.4;

export function getProjectVisualRadius(node: PortfolioNode): number {
  // Include the preview/summary envelope, or the orbit plus label clearance.
  return Math.max(3.4, node.satellites?.length ? projectSatelliteRadius + 0.4 : 0);
}

export type ProjectSatelliteContext = {
  nodeId: string | null;
  mode: "none" | "partial" | "full";
};

export type ProjectSatelliteCandidate = {
  id: string;
  cluster: ClusterId;
  distance: number;
  alignment: number;
  hasSatellites: boolean;
};

export function resolveProjectSatelliteContext(
  candidates: readonly ProjectSatelliteCandidate[],
  current: ProjectSatelliteContext,
  selectedNodeId: string | null,
  selectedClusterId: ClusterId | null,
): ProjectSatelliteContext {
  if (selectedNodeId) {
    const selected = candidates.find((candidate) => candidate.id === selectedNodeId && candidate.hasSatellites);
    return selected ? {nodeId: selected.id, mode: "full"} : {nodeId: null, mode: "none"};
  }
  const eligible = candidates.filter((candidate) => candidate.hasSatellites
    && (!selectedClusterId || candidate.cluster === selectedClusterId));
  // Keep the current candidate through a wider exit band to avoid boundary chatter.
  const retained = eligible.find((candidate) => candidate.id === current.nodeId
    && candidate.distance <= 16 && candidate.alignment >= 0.9);
  const nearby = retained ?? eligible
    .filter((candidate) => candidate.distance <= 14 && candidate.alignment >= 0.94)
    .sort((a, b) => (a.distance + (1 - a.alignment) * 20) - (b.distance + (1 - b.alignment) * 20))[0];
  return nearby ? {nodeId: nearby.id, mode: "partial"} : {nodeId: null, mode: "none"};
}

export function getSatelliteBudget(width: number, quality: PerformanceQuality): number {
  const screenBudget = width < 720 ? 3 : width < 1180 ? 4 : 6;
  return Math.min(screenBudget, quality === "low" ? 2 : quality === "medium" ? 4 : 6);
}

export function selectSatellites(satellites: readonly SemanticSatellite[], limit: number): SemanticSatellite[] {
  return [...satellites].sort((a, b) => (b.importance ?? 0.5) - (a.importance ?? 0.5) || a.id.localeCompare(b.id)).slice(0, limit);
}

export function getSatellitePosition(
  id: string, index: number, count: number, radius: number, time: number, reducedMotion: boolean, compact = false, verticalScale = 0.66,
): Vector3Tuple {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const orbit = reducedMotion ? 0 : time * Math.PI * 2 / 32;
  const phase = index * Math.PI * 2 / Math.max(count, 1) + orbit;
  const depth = Math.sin(phase + hash % 5) * 0.6;
  if (compact) {
    if (reducedMotion) {
      const fraction = count > 1 ? index / (count - 1) : 0.5;
      return [(fraction - 0.5) * radius, radius * (0.7 + Math.sin(fraction * Math.PI) * 0.15), 0];
    }
    return [Math.cos(phase) * radius * 0.52, Math.sin(phase) * radius * 1.05, depth];
  }
  return [Math.cos(phase) * radius, Math.sin(phase) * radius * verticalScale, depth];
}
