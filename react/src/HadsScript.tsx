"use client";
import { useEffect } from "react";
import { DEFAULT_BASE_URL, scriptUrl } from "./markup.js";

export interface HadsScriptProps {
  /** Your HADS site key. */
  siteKey: string;
  /** API origin. Default `https://api.hads.dev`. */
  baseUrl?: string;
  /** DOM id used to avoid loading the script twice. Default `hads-js`. */
  id?: string;
}

/**
 * Loads `hads.js` once, client-side, by appending an async <script> to <head>.
 * Renders nothing. Safe to mount in several places; the script is added once.
 * For Next.js prefer `HadsScript` from `hads-react/next` (uses next/script).
 */
export function HadsScript({ siteKey, baseUrl = DEFAULT_BASE_URL, id = "hads-js" }: HadsScriptProps) {
  useEffect(() => {
    if (!siteKey || document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = scriptUrl(siteKey, baseUrl);
    document.head.appendChild(s);
  }, [siteKey, baseUrl, id]);
  return null;
}
