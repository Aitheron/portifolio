export type ElasticBoundary = {
  correctionStrength: number;
  hardRadius: number;
  softRadius: number;
};

export const navigationBoundaries = {
  camera: {
    softRadius: 48,
    hardRadius: 58,
    correctionStrength: 2.8,
  },
  target: {
    softRadius: 22,
    hardRadius: 28,
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
