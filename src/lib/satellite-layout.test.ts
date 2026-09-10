import assert from "node:assert/strict";
import test from "node:test";
import {getSatelliteBudget, getSatellitePosition, selectSatellites, isSatelliteRelevant} from "./satellite-layout";

test("satellite density respects the smaller screen and quality budget", () => {
  assert.equal(getSatelliteBudget(1440, "high"), 6);
  assert.equal(getSatelliteBudget(768, "high"), 4);
  assert.equal(getSatelliteBudget(320, "high"), 3);
  assert.equal(getSatelliteBudget(1440, "low"), 2);
});

test("satellites have stable positions, and reduced motion stops orbit", () => {
  assert.deepEqual(getSatellitePosition("research", 0, 6, 4, 0, true), getSatellitePosition("research", 0, 6, 4, 100, true));
  assert.notDeepEqual(getSatellitePosition("research", 0, 6, 4, 0, false), getSatellitePosition("research", 0, 6, 4, 100, false));
});

test("satellites visibly travel around their owner and complete a continuous orbit", () => {
  for (const compact of [false, true]) {
    const start = getSatellitePosition("research", 0, 6, 4, 0, false, compact);
    const quarter = getSatellitePosition("research", 0, 6, 4, 8, false, compact);
    const half = getSatellitePosition("research", 0, 6, 4, 16, false, compact);
    const full = getSatellitePosition("research", 0, 6, 4, 32, false, compact);
    assert.ok(quarter[1] > 2, "visibly reaches the top of the orbit");
    assert.ok(half[0] < -2, "travels to the opposite side of the owner");
    start.forEach((value, axis) => assert.ok(Math.abs(value - full[axis]) < 0.001));
  }
});

test("compact orbits keep horizontal margins throughout a full revolution", () => {
  for (let time = 0; time <= 32; time += 0.5) {
    for (let index = 0; index < 3; index += 1) {
      const [x, y] = getSatellitePosition("context", index, 3, 3.6, time, false, true);
      assert.ok(Math.abs(x) < 2.1);
      assert.ok(Math.abs(y) <= 3.8);
    }
  }
});

test("reduced-motion phone labels remain visible above the cover, including the two-label budget", () => {
  for (const count of [2, 3]) {
    for (let index = 0; index < count; index += 1) {
      const point = getSatellitePosition("context", index, count, 4.2, 0, true, true);
      assert.ok(point[1] >= 2.8);
      assert.deepEqual(point, getSatellitePosition("context", index, count, 4.2, 10, true, true));
    }
  }
});

test("important context wins without changing or sorting the source data", () => {
  const label = {pt: "Contexto", en: "Context"};
  const input = [{id: "low", type: "concept" as const, label, importance: 0.1}, {id: "high", type: "concept" as const, label, importance: 1}];
  assert.equal(selectSatellites(input, 1)[0].id, "high");
  assert.equal(input[0].id, "low");
});

test("satellite relevance uses hysteresis and selected priority", () => {
  assert.equal(isSatelliteRelevant(50, false, false), false);
  assert.equal(isSatelliteRelevant(50, false, true), true);
  assert.equal(isSatelliteRelevant(21, true, false), true);
  assert.equal(isSatelliteRelevant(21, false, false), false);
});
