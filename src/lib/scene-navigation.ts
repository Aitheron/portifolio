export type ElasticBoundary = {
  correctionStrength: number;
  hardRadius: number;
  softRadius: number;
};

export const focusReleaseDistance = {node: 14, cluster: 24} as const;

export function shouldReleaseFocus(
  stage: string, distance: number, zoomingOut: boolean, arriving: boolean,
): boolean {
  if (!zoomingOut || arriving) return false;
  if (stage === "node-focus" || stage === "identity-focus") return distance >= focusReleaseDistance.node;
  if (stage === "cluster-focus") return distance >= focusReleaseDistance.cluster;
  return false;
}

export const navigationBoundaries = {
  camera: {
    softRadius: 64,
    hardRadius: 78,
    correctionStrength: 2.8,
  },
  target: {
    softRadius: 32,
    hardRadius: 40,
    correctionStrength: 3.4,
  },
} satisfies Record<"camera" | "target", ElasticBoundary>;

export function resolveElasticBoundaryRadius(
  distance: number,
  boundary: ElasticBoundary,
  delta: number,
): number {
  if (distance <= boundary.softRadius) return distance;

  const clampedDistance = Math.min(distance, boundary.hardRadius);
  const range = Math.max(boundary.hardRadius - boundary.softRadius, Number.EPSILON);
  const excessRatio = Math.min(
    1,
    (clampedDistance - boundary.softRadius) / range,
  );
  const correction = 1 - Math.exp(-boundary.correctionStrength * excessRatio * delta);

  return clampedDistance + (boundary.softRadius - clampedDistance) * correction;
}
