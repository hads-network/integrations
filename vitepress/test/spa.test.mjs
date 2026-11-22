// Real engine script + Vue SSR/hydration in happy-dom: the pre-filled slot
// survives hydration, and a route change re-mounts and re-fills it.
import { createEnv } from "../../fixtures/embed-sim.mjs";
const env = createEnv();
Object.assign(globalThis, { window: env.window, document: env.document });
for (const k of ["SVGElement", "HTMLElement", "Element", "Node", "MathMLElement", "Text", "Comment"]) if (env.window[k]) globalThis[k] = env.window[k];
const { createSSRApp, h, reactive, nextTick } = await import("vue");
const { renderToString } = await import("vue/server-renderer");
const { HadsSlot, enhanceAppWithHads } = await import("../dist/theme.js");
const assert = (c, m) => { if (!c) throw new Error(m); };
const warnings = [];
console.warn = (...a) => warnings.push(a.join(" "));
console.error = (...a) => warnings.push(a.join(" "));

const route = reactive({ path: "/a" });
const make = () => {
  const app = createSSRApp({ render: () => h("div", [h(HadsSlot, { type: "row", topic: "vue" })]) });
  enhanceAppWithHads({ app, router: { route } });
  return app;
};
const root = env.document.createElement("div");
root.id = "app";
env.document.body.appendChild(root);
root.innerHTML = await renderToString(make());
env.run();
await env.flush();
assert(root.querySelector("[data-hads-title]").textContent === "Ad title 1", "not filled");
make().mount(root);
await env.flush();
assert(root.querySelector("[data-hads-title]").textContent === "Ad title 1", "hydration wiped ad");
route.path = "/b";
await nextTick();
await env.flush();
assert(env.serveRequests().length === 2, `expected 2 serve requests, got ${env.serveRequests().length}`);
assert(root.querySelector("[data-hads-title]").textContent === "Ad title 2", "not re-filled after route change");
const bad = warnings.filter((w) => /mismatch/i.test(w));
assert(!bad.length, bad.join("\n"));
await env.close();
console.log("spa: hydration keeps filled ad; route change re-fills; no mismatch warnings");
process.exit(0);
