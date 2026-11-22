// PHP syntax check without a PHP binary (php-parser, PHP 7.4 grammar).
// Weaker than `php -l`; run test/check.mjs where PHP is installed.
import { readdirSync, readFileSync } from "node:fs";
import PhpParser from "php-parser";
const parser = new PhpParser({ parser: { php7: true, version: "7.4", suppressErrors: false }, ast: { withPositions: true } });
const roots = [new URL("../hads/", import.meta.url).pathname, new URL("./", import.meta.url).pathname];
let n = 0;
for (const root of roots) {
  for (const f of readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".php"))) {
    parser.parseCode(readFileSync(root + f, "utf8"), f);
    n++;
  }
}
console.log(`php-parser: ${n} PHP files parse cleanly`);
