// Usage: node test/check.mjs [path-to-hugo]. Builds exampleSite and compares
// slot markup with the snippets.ex fixtures.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { parseFragment, serializeOuter } from "../../fixtures/node_modules/parse5/dist/index.js";
import { SLOT_TYPES, assertSlot } from "../../fixtures/compare.mjs";
const hugo = process.argv[2] || "hugo";
const site = new URL("../exampleSite/", import.meta.url).pathname;
const build = (env = {}) => {
  rmSync(site + "public", { recursive: true, force: true });
  return execFileSync(hugo, ["--source", site, "--destination", "public"], { env: { ...process.env, ...env }, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
};
const read = (p) => readFileSync(site + "public/" + p, "utf8");

build();
let html = read("index.html");
const sections = {};
(function walk(n) {
  const c = n.attrs?.find((a) => a.name === "data-case");
  if (c) sections[c.value] = n.childNodes.map((x) => serializeOuter(x)).join("");
  (n.childNodes || []).forEach(walk);
})(parseFragment(html));
for (const t of SLOT_TYPES) assertSlot(sections[t], t);
assertSlot(sections["card-topic"], "card", { "data-hads-topic": "go", "data-hads-allow-self": "" });
if (!sections.custom.includes("&lt;Sponsored&gt;") || !sections.custom.includes('class="hads-unit hads-unit--inline mine"')) throw new Error("custom attribution/class wrong");
if (!html.includes('<script src="https://api.hads.dev/v1/hads.js?site=EXAMPLE_KEY" async></script>')) throw new Error("script tag wrong");
assertSlot(read("post/index.html"), "teaser", { "data-hads-topic": "hugo" });

build({ HUGO_PARAMS_HADS_BASEURL: "https://self.example/", HUGO_PARAMS_HADS_SITEKEY: "a&b" });
html = read("index.html");
if (!html.includes('src="https://self.example/v1/hads.js?site=a%26b"')) throw new Error("baseUrl/siteKey override wrong: " + html.match(/<script[^>]*>/)?.[0]);

build({ HUGO_PARAMS_HADS_ENABLED: "false" });
if (read("index.html").includes("hads.js")) throw new Error("enabled=false still loads script");

rmSync(site + "public", { recursive: true, force: true });
console.log(`hugo: ${SLOT_TYPES.length} slot types + shortcode match snippets.ex; baseUrl, escaping, enabled=false ok`);
