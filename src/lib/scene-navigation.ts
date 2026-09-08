export type ElasticBoundary = {
  correctionStrength: number;
  hardRadius: number;
  softRadius: number;
};

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
