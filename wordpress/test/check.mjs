// Usage: node test/check.mjs [php-binary]. Needs PHP (not available on the
// machine this was written on). Lints every PHP file, renders slots through
// test/render.php with WordPress stubs, compares with snippets.ex fixtures.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { SLOT_TYPES, assertSlot } from "../../fixtures/compare.mjs";
const php = process.argv[2] || "php";
const here = new URL(".", import.meta.url).pathname;
const plugin = new URL("../hads/", import.meta.url).pathname;
const phpFiles = readdirSync(plugin, { recursive: true }).filter((f) => f.endsWith(".php")).map((f) => plugin + f);
for (const f of [...phpFiles, here + "render.php"]) execFileSync(php, ["-l", f], { stdio: "inherit" });
const out = JSON.parse(execFileSync(php, [here + "render.php"], { encoding: "utf8" }));
for (const t of SLOT_TYPES) assertSlot(out[t], t);
assertSlot(out["card-topic"], "card", { "data-hads-topic": "wp", "data-hads-allow-self": "" });
assertSlot(out.block, "row", { "data-hads-topic": "b" });
assertSlot(out.bogus, "inline");
if (!out.custom.includes("&lt;Sponsored&gt;") || !out.custom.includes('class="hads-unit hads-unit--inline mine x"')) throw new Error("custom: " + out.custom);
const s = out.sanitized;
if (s.site_key !== "abcd" || s.base_url !== "https://api.hads.dev" || s.auto_insert !== "" || s.auto_type !== "inline") throw new Error("sanitize: " + JSON.stringify(s));
if (out.script_url !== "https://self.example/v1/hads.js?site=K%201") throw new Error(out.script_url);
console.log(`wordpress: php -l ok; ${SLOT_TYPES.length} slot types + block match snippets.ex; escaping, sanitizing, script URL ok`);
