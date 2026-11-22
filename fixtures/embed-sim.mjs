// Loads the real HADS embed script (extracted from engine/lib/engine/embed.ex,
// read-only) into a happy-dom window with a mocked fetch, so integrations can
// check that their slots get filled and re-filled on client navigation.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Window } from "happy-dom";

const EMBED_EX = new URL("../../engine/lib/engine/embed.ex", import.meta.url);

let cached = null;
/**
 * The script exactly as the engine serves it: evaluates Engine.Embed.script/1
 * with Elixir (Jason stubbed) so heredoc escape handling matches production.
 * The API base is http://127.0.0.1:4100 (engine default) unless HADS_PUBLIC_BASE is set.
 */
export function embedSource() {
  if (cached) return cached;
  const stub = 'defmodule Jason do; def encode!(x) when is_binary(x), do: inspect(x); end';
  cached = execFileSync("elixir", [
    "-e", stub,
    "-r", fileURLToPath(EMBED_EX),
    "-e", 'IO.write(Engine.Embed.script(%{token: "tok", id: "sid", site_key: "SITE"}))',
  ], { encoding: "utf8" });
  return cached;
}

/** Returns { window, document, requests, run(), flush(), close() }. */
export function createEnv(html = "<!doctype html><html><head></head><body></body></html>") {
  const window = new Window({ url: "https://site.example/page" });
  window.document.write(html);
  const requests = [];
  let n = 0;
  window.fetch = async (url, init) => {
    const body = JSON.parse(init.body || "{}");
    requests.push({ url: String(url), body });
    n += 1;
    const payload = String(url).endsWith("/v1/session/serve")
      ? {
          impression_id: `imp-${n}`,
          ad: {
            id: `ad-${n}`,
            title: `Ad title ${n}`,
            body: `Ad body ${n}`,
            url: `https://adv.example/${n}`,
            image_url: `https://img.example/${n}.png`,
            advertiser_domain: "adv.example",
          },
        }
      : {};
    return { ok: true, status: 200, json: async () => payload };
  };
  return {
    window,
    document: window.document,
    requests,
    serveRequests: () => requests.filter((r) => r.url.endsWith("/v1/session/serve")),
    run() {
      window.eval(embedSource());
    },
    async flush(ms = 120) {
      // scan debounce is 32ms; serve requests are queued one at a time
      for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, ms / 6));
    },
    async close() {
      await window.happyDOM.abort();
      window.close();
    },
  };
}
