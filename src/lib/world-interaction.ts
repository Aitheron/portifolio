type PropagationEvent = {
  delta?: number;
  stopPropagation: () => void;
};

type WorldIntersection = {
  distance: number;
  object: {userData: Record<string, unknown>};
};

const clickMovementTolerance = 6;

export const worldInteractionPriority = {
  default: 0,
  projectPreview: 100,
} as const;

function getInteractionPriority(intersection: WorldIntersection) {
  const priority = intersection.object.userData.interactionPriority;
  return typeof priority === "number"
    ? priority
    : worldInteractionPriority.default;
}

export function prioritizeWorldIntersections<T extends WorldIntersection>(
  intersections: readonly T[],
): T[] {
  return [...intersections].sort((left, right) => (
    getInteractionPriority(right) - getInteractionPriority(left)
    || left.distance - right.distance
  ));
}

export function activateWorldItem(
  event: PropagationEvent,
  activate: () => void,
) {
  event.stopPropagation();
  if (event.delta !== undefined && event.delta > clickMovementTolerance) return;
  activate();
}
