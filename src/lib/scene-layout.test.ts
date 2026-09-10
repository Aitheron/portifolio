import assert from "node:assert/strict";
import test from "node:test";

import {clusters, getNodePosition} from "../content/clusters";
import aitheron from "../content/nodes/key-projects/aitheron";
import multiAgent from "../content/nodes/key-projects/multi-agent-tariff-intelligence";
import pnExtractor from "../content/nodes/key-projects/pn-extractor";
import llmInfrastructure from "../content/nodes/key-projects/enterprise-llm-infrastructure";
import docguard from "../content/nodes/key-projects/docguard";
import {navigationBoundaries} from "./scene-navigation";
import {getProjectVisualRadius, projectVisualSafetyMargin} from "./satellite-layout";

test("career regions and project anchors leave room for orbiting context within navigable space", () => {
  for (const cluster of clusters) assert.ok(Math.hypot(...cluster.position) >= 14);
  const projects = [aitheron, multiAgent, pnExtractor, llmInfrastructure, docguard];
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
