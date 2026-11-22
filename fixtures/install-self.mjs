// Copies a package (package.json plus its "files") into an example site's node_modules,
// so the site resolves it the way an installed dependency is resolved, not through a symlink.
// usage: node fixtures/install-self.mjs <package dir> <site dir>
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const [pkgArg, siteArg] = process.argv.slice(2);
const pkgDir = resolve(pkgArg);
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const target = join(resolve(siteArg), "node_modules", pkg.name);

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const f of ["package.json", "README.md", "LICENSE", ...(pkg.files || [])]) {
  const from = join(pkgDir, f);
  if (existsSync(from)) cpSync(from, join(target, f), { recursive: true });
}

console.log(`installed ${pkg.name} into ${target}`);
