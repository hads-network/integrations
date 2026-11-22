// Node-safe entry, for .vitepress/config. Theme code lives in "./theme".
import type { HeadConfig } from "vitepress";
import { DEFAULT_BASE_URL, scriptUrl } from "./markup.js";

export { SLOT_TYPES, DEFAULT_BASE_URL, DEFAULT_ATTRIBUTION, scriptUrl, slotHtml, type HadsSlotType } from "./markup.js";

export interface HadsHeadOptions {
  siteKey: string;
  /** API origin. Default `https://api.hads.dev`. */
  baseUrl?: string;
}

/** `head` entries for `.vitepress/config`: loads hads.js async on every page. */
export function hadsHead({ siteKey, baseUrl = DEFAULT_BASE_URL }: HadsHeadOptions): HeadConfig[] {
  if (!siteKey) throw new Error("vitepress-plugin-hads: siteKey is required");
  return [["script", { async: "", src: scriptUrl(siteKey, baseUrl) }]];
}
