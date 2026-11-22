// Server-render every slot type and compare with snippets.ex fixtures.
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SLOT_TYPES, assertSlot } from "../../fixtures/compare.mjs";
import { HadsSlot, HadsScript, scriptUrl } from "../dist/index.js";

for (const type of SLOT_TYPES) {
  assertSlot(renderToStaticMarkup(h(HadsSlot, { type })), type);
}
assertSlot(
  renderToStaticMarkup(h(HadsSlot, { type: "card", topic: "rust", allowSelf: true })),
  "card",
  { "data-hads-topic": "rust", "data-hads-allow-self": "" },
);
if (renderToStaticMarkup(h(HadsScript, { siteKey: "k" })) !== "") throw new Error("HadsScript should render nothing on the server");
const u = scriptUrl("a b", "https://self.example/");
if (u !== "https://self.example/v1/hads.js?site=a%20b") throw new Error(u);
if (!renderToStaticMarkup(h(HadsSlot, { attribution: "<x>" })).includes("&lt;x&gt;")) throw new Error("attribution not escaped");
console.log(`render: ${SLOT_TYPES.length} slot types match snippets.ex`);
