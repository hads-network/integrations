import { createEnv } from "./embed-sim.mjs";
import { fixture } from "./compare.mjs";
const env = createEnv(`<!doctype html><html><head></head><body>${fixture("card")}</body></html>`);
env.run();
await env.flush();
const aside = env.document.querySelector("aside");
console.log("serve requests:", env.serveRequests().length, "bound:", aside.getAttribute("data-hads-bound"), "title:", aside.querySelector("[data-hads-title]").textContent);
// dynamic insert
const div = env.document.createElement("div");
div.innerHTML = fixture("inline");
env.document.body.appendChild(div);
await env.flush();
console.log("after dynamic insert serve requests:", env.serveRequests().length, "HADS.scan:", typeof env.window.HADS.scan);
await env.close();
