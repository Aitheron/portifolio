import assert from "node:assert/strict";
import test from "node:test";

import {getAutomaticFocusCandidate, trackAutomaticFocus} from "./automatic-project-focus";
import type {AutomaticFocusCandidate, AutomaticFocusProgress} from "./automatic-project-focus";

const project: AutomaticFocusCandidate = {
  id: "project", cluster: "key-projects", distance: 10.5,
  screenX: 0.05, screenY: 0.1, visibleArea: 0.55,
};
const idle: AutomaticFocusProgress = {candidateId: null, since: 0, sampledAt: 0, ready: false};

test("automatic focus requires a close, centered project occupying a substantial screen region", () => {
  assert.equal(getAutomaticFocusCandidate([project], null)?.id, project.id);
  for (const values of [{distance: 15}, {screenX: 0.65}, {screenY: -0.65}, {visibleArea: 0.12}]) {
    assert.equal(getAutomaticFocusCandidate([{...project, ...values}], null), null);
  }
  assert.equal(getAutomaticFocusCandidate([project], "education-research"), null);
});

test("two competing projects block automatic focus even if only one is near the screen center", () => {
  const neighbor = {...project, id: "neighbor", screenX: 0.7, visibleArea: 0.35};
  assert.equal(getAutomaticFocusCandidate([project, neighbor], null), null);
  assert.equal(getAutomaticFocusCandidate([project, {...neighbor, visibleArea: 0.15}], null)?.id, project.id);
  // A project from another cluster still counts as visual competition.
  assert.equal(getAutomaticFocusCandidate([project, {...neighbor, cluster: "education-research"}], "key-projects"), null);
});

test("dominance must persist; a passing candidate or candidate switch cannot acquire focus", () => {
  let state = trackAutomaticFocus(idle, "project", 1000);
  for (const now of [1100, 1200, 1300, 1400]) {
    state = trackAutomaticFocus(state, "project", now);
    assert.equal(state.ready, false);
  }
  assert.equal(trackAutomaticFocus(state, "project", 1500).ready, true);
  assert.equal(trackAutomaticFocus(state, "neighbor", 1500).ready, false);
  const interrupted = trackAutomaticFocus(state, null, 1450);
  assert.equal(trackAutomaticFocus(interrupted, "project", 1500).ready, false);
});

test("a suspended tab or stale sampling interval restarts the dwell", () => {
  const state = trackAutomaticFocus(idle, "project", 1000);
  assert.equal(trackAutomaticFocus(state, "project", 5000).ready, false);
});
