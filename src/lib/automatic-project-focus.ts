import type {ClusterId} from "./portfolio-types";

export const automaticFocusConfig = {
  sampleInterval: 100,
  dwellTime: 500,
  zoomIntentDuration: 1600,
  releaseCooldown: 900,
  maxDistance: 11.5,
  centerRadius: 0.4,
  minimumVisibleArea: 0.28,
  dominanceRatio: 2,
} as const;

export type AutomaticFocusCandidate = {
  id: string;
  cluster: ClusterId;
  distance: number;
  screenX: number;
  screenY: number;
  visibleArea: number;
};

export type AutomaticFocusProgress = {
  candidateId: string | null;
  since: number;
  sampledAt: number;
  ready: boolean;
};

export function getAutomaticFocusCandidate(
  candidates: readonly AutomaticFocusCandidate[], selectedClusterId: ClusterId | null,
): AutomaticFocusCandidate | null {
  const ranked = [...candidates].sort((a, b) => b.visibleArea - a.visibleArea);
  const [dominant, neighbor] = ranked;
  if (!dominant || (selectedClusterId && dominant.cluster !== selectedClusterId)
    || dominant.distance > automaticFocusConfig.maxDistance
    || Math.hypot(dominant.screenX, dominant.screenY) > automaticFocusConfig.centerRadius
    || dominant.visibleArea < automaticFocusConfig.minimumVisibleArea
    || (neighbor && dominant.visibleArea < neighbor.visibleArea * automaticFocusConfig.dominanceRatio)) return null;
  return dominant;
}

export function trackAutomaticFocus(
  current: AutomaticFocusProgress, candidateId: string | null, now: number,
): AutomaticFocusProgress {
  const continuous = candidateId !== null && candidateId === current.candidateId
    && now - current.sampledAt <= automaticFocusConfig.sampleInterval * 3;
  const since = continuous ? current.since : now;
  return {candidateId, since, sampledAt: now, ready: candidateId !== null && now - since >= automaticFocusConfig.dwellTime};
}
