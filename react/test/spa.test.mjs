// Runs the real engine script against React-rendered slots in happy-dom:
// initial fill, hydration over a pre-filled slot, and re-fill on route change.
import { createEnv } from "../../fixtures/embed-sim.mjs";

const env = createEnv();
Object.assign(globalThis, { window: env.window, document: env.document, IS_REACT_ACT_ENVIRONMENT: false });
const { createElement: h } = await import("react");
const { createRoot, hydrateRoot } = await import("react-dom/client");
const { renderToString } = await import("react-dom/server");
const { HadsSlot, HadsScript } = await import("../dist/index.js");
const assert = (c, m) => { if (!c) throw new Error(m); };
const errors = [];
const origError = console.error;
console.error = (...a) => { errors.push(a.join(" ")); };

// 1. Hydration: SSR html, script fills it before React hydrates.
const ssr = env.document.createElement("div");
env.document.body.appendChild(ssr);
ssr.innerHTML = renderToString(h(HadsSlot, { type: "card", refreshKey: "/a" }));
env.run();
await env.flush();
assert(ssr.querySelector("[data-hads-title]").textContent === "Ad title 1", "ssr slot not filled");
const root1 = hydrateRoot(ssr, h(HadsSlot, { type: "card", refreshKey: "/a" }), {
  onRecoverableError: (e) => errors.push(String(e)),
});
await env.flush();
assert(ssr.querySelector("[data-hads-title]").textContent === "Ad title 1", "hydration wiped the filled ad");
assert(env.serveRequests().length === 1, "unexpected requests after hydration");

// 2. Client route change with refreshKey: new element, new ad.
root1.render(h(HadsSlot, { type: "card", refreshKey: "/b" }));
await env.flush();
assert(env.serveRequests().length === 2, `route change should request a new ad, got ${env.serveRequests().length}`);
assert(ssr.querySelector("[data-hads-title]").textContent === "Ad title 2", "slot not re-filled after route change");
assert(env.serveRequests()[1].body.exclude_ad_ids.includes("ad-1"), "previous ad not excluded");

// 3. Same element kept across a 'route change' (no refreshKey): stays stale.
const div = env.document.createElement("div");
env.document.body.appendChild(div);
const root2 = createRoot(div);
root2.render(h(HadsSlot, { type: "inline" }));
await env.flush();
const before = env.serveRequests().length;
root2.render(h(HadsSlot, { type: "inline" }));
await env.flush();
assert(env.serveRequests().length === before, "re-render without key change should not refetch");

// 4. HadsScript injects one script tag.
const div2 = env.document.createElement("div");
env.document.body.appendChild(div2);
createRoot(div2).render([h(HadsScript, { key: 1, siteKey: "SK" }), h(HadsScript, { key: 2, siteKey: "SK" })]);
await env.flush();
const tags = env.document.querySelectorAll("script#hads-js");
assert(tags.length === 1 && tags[0].getAttribute("src") === "https://api.hads.dev/v1/hads.js?site=SK" && tags[0].async, "HadsScript tag wrong");

console.error = origError;
const relevant = errors.filter((e) => /hydrat|did not match|mismatch/i.test(e));
assert(relevant.length === 0, "hydration errors: " + relevant.join("\n"));
await env.close();
console.log("spa: hydration keeps filled ad; refreshKey change re-fills; no hydration errors");
process.exit(0);
