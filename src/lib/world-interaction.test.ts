import assert from "node:assert/strict";
import test from "node:test";

import {activateHtmlWorldControl} from "./world-interaction";

test("stops a label click before activating its world item", () => {
  const events: string[] = [];

  activateHtmlWorldControl(
    {stopPropagation: () => events.push("propagation-stopped")},
    () => events.push("item-activated"),
  );

  assert.deepEqual(events, ["propagation-stopped", "item-activated"]);
});
