import type {PerformanceQuality, SemanticSatellite, Vector3Tuple} from "./portfolio-types";

export function getSatelliteBudget(width: number, quality: PerformanceQuality): number {
  const screenBudget = width < 720 ? 3 : width < 1180 ? 4 : 6;
  return Math.min(screenBudget, quality === "low" ? 2 : quality === "medium" ? 4 : 6);
}

export function selectSatellites(satellites: readonly SemanticSatellite[], limit: number): SemanticSatellite[] {
  return [...satellites].sort((a, b) => (b.importance ?? 0.5) - (a.importance ?? 0.5) || a.id.localeCompare(b.id)).slice(0, limit);
}

export function isSatelliteRelevant(distance: number, active: boolean, selected: boolean): boolean {
  return selected || distance < (active ? 22 : 20);
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
