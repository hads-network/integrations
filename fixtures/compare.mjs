// Canonical DOM comparison of slot markup against the snippets.ex fixtures.
// Ignores whitespace-only text, attribute order and `attr` vs `attr=""`.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFragment } from "parse5";

const here = dirname(fileURLToPath(import.meta.url));
export const SLOT_TYPES = ["inline", "card", "row", "teaser", "rail"];

function canon(node, depth = 0) {
  if (node.nodeName === "#text") {
    const t = node.value.replace(/\s+/g, " ").trim();
    return t ? [JSON.stringify(t)] : [];
  }
  if (node.nodeName.startsWith("#")) {
    return (node.childNodes || []).flatMap((c) => canon(c, depth));
  }
  const attrs = node.attrs
    .map((a) => `${a.name}=${JSON.stringify(a.value)}`)
    .sort()
    .join(" ");
  const kids = (node.childNodes || []).flatMap((c) => canon(c, depth + 1));
  return [`<${node.tagName}${attrs ? " " + attrs : ""}>`, ...kids, `</${node.tagName}>`];
}

export function canonical(html) {
  return canon(parseFragment(html)).join("\n");
}

export function fixture(type) {
  return readFileSync(join(here, `${type}.html`), "utf8");
}

/** Find every <aside data-hads-slot> in `html` and return their outer HTML strings (in order). */
export function slots(html) {
  const out = [];
  const walk = (n) => {
    if (n.tagName === "aside" && n.attrs?.some((a) => a.name === "data-hads-slot")) out.push(n);
    (n.childNodes || []).forEach(walk);
  };
  walk(parseFragment(html));
  return out.map((n) => canon(n).join("\n"));
}

/**
 * Assert that `html` (one rendered slot, possibly wrapped) matches the fixture
 * for `type`. `extraRootAttrs` lists attributes allowed on the <aside> beyond
 * the fixture's (e.g. data-hads-topic).
 */
export function assertSlot(html, type, extraRootAttrs = {}) {
  const found = slots(html);
  if (found.length !== 1) throw new Error(`expected exactly 1 slot, found ${found.length}`);
  const frag = parseFragment(fixture(type));
  const root = frag.childNodes.find((n) => n.tagName === "aside");
  for (const [name, value] of Object.entries(extraRootAttrs)) root.attrs.push({ name, value });
  const want = canon(root);
  const got = found[0];
  if (got !== want.join("\n")) {
    throw new Error(`markup mismatch for "${type}"\n--- want\n${want.join("\n")}\n--- got\n${got}`);
  }
}
