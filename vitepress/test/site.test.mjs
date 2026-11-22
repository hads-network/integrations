// Builds the example site with a *copied* (not linked) install of the package,
// as Vite treats it like a real dependency, then checks the rendered markup.
import { cpSync, rmSync, readFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { assertSlot, slots } from "../../fixtures/compare.mjs";
const site = new URL("./site/", import.meta.url);
const pkgDir = new URL("./node_modules/vitepress-plugin-hads/", site);
rmSync(pkgDir, { recursive: true, force: true });
mkdirSync(pkgDir, { recursive: true });
for (const f of ["package.json", "dist"]) cpSync(new URL(`../${f}`, import.meta.url), new URL(f, pkgDir), { recursive: true });
execFileSync("npx", ["--no-install", "vitepress", "build", "."], { cwd: site, stdio: "inherit" });
const html = readFileSync(new URL(".vitepress/dist/index.html", site), "utf8");
if (!/<script async src="https:\/\/api\.hads\.dev\/v1\/hads\.js\?site=EXAMPLE_KEY"><\/script>/.test(html)) throw new Error("script missing");
const pick = (t) => html.match(new RegExp(`<aside[^>]*data-hads-slot="${t}"[\\s\\S]*?</aside>`))[0];
if (slots(html).length !== 3) throw new Error(`expected 3 slots, got ${slots(html).length}`);
assertSlot(pick("card"), "card", { "data-hads-topic": "docs", "data-allow-mismatch": "" });
assertSlot(pick("rail"), "rail", { "data-allow-mismatch": "" });
assertSlot(pick("teaser"), "teaser", { "data-allow-mismatch": "" });
console.log("vitepress: script in head; doc-after card, aside-outline-after rail, Markdown teaser match snippets.ex");
