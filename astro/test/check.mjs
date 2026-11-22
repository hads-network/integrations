import { readFileSync } from "node:fs";
import { parseFragment, serializeOuter } from "parse5";
import { SLOT_TYPES, assertSlot } from "../../fixtures/compare.mjs";
const html = readFileSync(new URL("./site/dist/index.html", import.meta.url), "utf8");
const sections = {};
(function walk(n) {
  const c = n.attrs?.find((a) => a.name === "data-case");
  if (c) sections[c.value] = n.childNodes.map((x) => serializeOuter(x)).join("");
  (n.childNodes || []).forEach(walk);
})(parseFragment(html));
for (const t of SLOT_TYPES) assertSlot(sections[t], t);
assertSlot(sections["card-topic"], "card", { "data-hads-topic": "rust", "data-hads-allow-self": "" });
if (!html.includes('<script async src="https://api.hads.dev/v1/hads.js?site=EXAMPLE_KEY"></script>')) throw new Error("script tag missing");
if (!sections.custom.includes('src="https://self.example/v1/hads.js?site=K2"')) throw new Error("baseUrl not applied");
if (!sections.custom.includes("&lt;Sponsored&gt;") || !sections.custom.includes("hads-unit--inline mine")) throw new Error("attribution/class wrong");
console.log(`astro: ${SLOT_TYPES.length} slot types match snippets.ex; script/baseUrl/escaping ok`);
