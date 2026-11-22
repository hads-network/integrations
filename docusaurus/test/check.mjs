import { readFileSync } from "node:fs";
import { assertSlot, slots } from "../../fixtures/compare.mjs";
const read = (p) => readFileSync(new URL(`./site/build/${p}`, import.meta.url), "utf8");
const home = read("index.html");
const mdx = read("mdx-page/index.html");
if (!home.includes('<script src="https://api.hads.dev/v1/hads.js?site=EXAMPLE_KEY" async>')) throw new Error("script tag missing in <head>");
// Home: docAfter (card, topic) + tocAfter (rail).
const s = slots(home);
if (s.length !== 2) throw new Error(`home: expected 2 slots, got ${s.length}`);
const card = home.match(/<aside data-hads-slot="card"[\s\S]*?<\/aside>/)[0];
const rail = home.match(/<aside data-hads-slot="rail"[\s\S]*?<\/aside>/)[0];
assertSlot(card, "card", { "data-hads-topic": "docs" });
assertSlot(rail, "rail");
if (!/class="hads-doc-after/.test(home)) throw new Error("docAfter wrapper missing");
const teaser = mdx.match(/<aside data-hads-slot="teaser"[\s\S]*?<\/aside>/)[0];
assertSlot(teaser, "teaser");
console.log("docusaurus: script in head; docAfter card, tocAfter rail and MDX teaser match snippets.ex");
