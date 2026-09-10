import assert from "node:assert/strict";
import test from "node:test";

import {clusters, getNodePosition} from "../content/clusters";
import aitheron from "../content/nodes/key-projects/aitheron";
import multiAgent from "../content/nodes/key-projects/multi-agent-tariff-intelligence";
import pnExtractor from "../content/nodes/key-projects/pn-extractor";
import llmInfrastructure from "../content/nodes/key-projects/enterprise-llm-infrastructure";
import docguard from "../content/nodes/key-projects/docguard";
import {navigationBoundaries} from "./scene-navigation";

test("career regions and project anchors leave room for orbiting context within navigable space", () => {
  for (const cluster of clusters) assert.ok(Math.hypot(...cluster.position) >= 14);
  const projects = [aitheron, multiAgent, pnExtractor, llmInfrastructure, docguard];
  const positions = projects.map((node, index) => getNodePosition(node, index, projects.length));
  positions.forEach((position, index) => {
    assert.ok(Math.hypot(...position) >= 10, "projects stay clear of the central identity's orbit");
    assert.ok(Math.hypot(...position) < navigationBoundaries.target.softRadius);
    for (const other of positions.slice(index + 1)) {
      const separation = Math.hypot(...position.map((value, axis) => value - other[axis]));
      assert.ok(separation >= 6, `${projects[index].id} has another project only ${separation.toFixed(1)} units away`);
    }
  });
});
