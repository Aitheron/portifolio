import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

import {
  activateWorldItem,
  prioritizeWorldIntersections,
  worldInteractionPriority,
} from "./world-interaction";

type TestIntersection = {
  id: string;
  distance: number;
  object: {userData: Record<string, unknown>};
};

function intersection(
  id: string,
  distance: number,
  interactionPriority?: number,
): TestIntersection {
  return {
    id,
    distance,
    object: {
      userData: interactionPriority === undefined ? {} : {interactionPriority},
    },
  };
}

test("prioritizes a project preview over physically closer scene geometry", () => {
  const clusterPoint = intersection("cluster-point", 8.1);
  const preview = intersection(
    "project-preview",
    14.6,
    worldInteractionPriority.projectPreview,
  );

  const result = prioritizeWorldIntersections([clusterPoint, preview]);

  assert.deepEqual(result.map(({id}) => id), ["project-preview", "cluster-point"]);
});

test("keeps equal-priority intersections ordered by physical distance", () => {
  const farPreview = intersection(
    "far-preview",
    14.6,
    worldInteractionPriority.projectPreview,
  );
  const nearPreview = intersection(
    "near-preview",
    12.2,
    worldInteractionPriority.projectPreview,
  );

  const result = prioritizeWorldIntersections([farPreview, nearPreview]);

  assert.deepEqual(result.map(({id}) => id), ["near-preview", "far-preview"]);
});

test("does not mutate the raycaster intersection order", () => {
  const intersections = [
    intersection("cluster-point", 8.1),
    intersection(
      "project-preview",
      14.6,
      worldInteractionPriority.projectPreview,
    ),
  ];
  const originalOrder = intersections.map(({id}) => id);

  prioritizeWorldIntersections(intersections);

  assert.deepEqual(intersections.map(({id}) => id), originalOrder);
});

test("stops a world click before activating its item", () => {
  const events: string[] = [];

  activateWorldItem(
    {stopPropagation: () => events.push("propagation-stopped")},
    () => events.push("item-activated"),
  );

  assert.deepEqual(events, ["propagation-stopped", "item-activated"]);
});

test("opens a world item when pointer movement stays within click tolerance", () => {
  const events: string[] = [];
  const clickEvent = {
    delta: 6,
    stopPropagation: () => events.push("propagation-stopped"),
  };

  activateWorldItem(clickEvent, () => events.push("item-activated"));

  assert.deepEqual(events, ["propagation-stopped", "item-activated"]);
});

test("does not open a world item after a drag", () => {
  const events: string[] = [];
  const dragEvent = {
    delta: 12,
    stopPropagation: () => events.push("propagation-stopped"),
  };

  activateWorldItem(dragEvent, () => events.push("item-activated"));

  assert.deepEqual(events, ["propagation-stopped"]);
});

test("keeps the project details content inside a vertical scroll container", () => {
  const styles = readFileSync("src/app/globals.css", "utf8");
  const rule = styles.match(/\.node-dialog__inner\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(rule, /(?:^|;)\s*height\s*:\s*100%/);
  assert.match(rule, /(?:^|;)\s*overflow-y\s*:\s*auto/);
});
