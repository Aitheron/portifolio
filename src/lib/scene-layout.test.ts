import assert from "node:assert/strict";
import test from "node:test";

import {clusters, getNodePosition} from "../content/clusters";
import exampleData from "../content/projects/example-project.json";
import {navigationBoundaries} from "./scene-navigation";
import {getProjectVisualRadius, projectVisualSafetyMargin} from "./satellite-layout";

import {portfolioNodeSchema} from "./portfolio-schema";

test("career regions and project anchors leave room for orbiting context within navigable space", () => {
  for (const cluster of clusters) assert.ok(Math.hypot(...cluster.position) >= 14);
  // Five synthetic entries preserve the crowded-scene regression independently of demo content.
  const projects = ["project-a", "project-b", "project-c", "project-d", "project-e"].map((id, index) =>
    portfolioNodeSchema.parse({...exampleData, id, slug: id, importance: index === 0 ? "flagship" : index === 4 ? "secondary" : "primary"}),
  );
  const positions = projects.map((node, index) => getNodePosition(node, index, projects.length));
  positions.forEach((position, index) => {
    assert.ok(Math.hypot(...position) >= 10, "projects stay clear of the central identity's orbit");
    assert.ok(Math.hypot(...position) < navigationBoundaries.target.softRadius);
    for (let otherIndex = index + 1; otherIndex < positions.length; otherIndex += 1) {
      // The cluster uses an elliptical plane, as do the desktop semantic orbits.
      const separation = Math.hypot(...position.map((value, axis) => (value - positions[otherIndex][axis]) / (axis === 1 ? 0.65 : 1)));
      const required = getProjectVisualRadius(projects[index]) + getProjectVisualRadius(projects[otherIndex]) + projectVisualSafetyMargin;
      assert.ok(separation >= required, `${projects[index].id} needs ${required.toFixed(1)} units of visual clearance, got ${separation.toFixed(1)}`);
    }
  });
});
