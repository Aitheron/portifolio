import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

import {activateWorldItem} from "./world-interaction";

test("stops a world click before activating its item", () => {
  const events: string[] = [];

  activateWorldItem(
    {stopPropagation: () => events.push("propagation-stopped")},
    () => events.push("item-activated"),
  );

  assert.deepEqual(events, ["propagation-stopped", "item-activated"]);
});

test("keeps the project details content inside a vertical scroll container", () => {
  const styles = readFileSync("src/app/globals.css", "utf8");
  const rule = styles.match(/\.node-dialog__inner\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(rule, /(?:^|;)\s*height\s*:\s*100%/);
  assert.match(rule, /(?:^|;)\s*overflow-y\s*:\s*auto/);
});
