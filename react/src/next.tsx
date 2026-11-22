"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { DEFAULT_BASE_URL, scriptUrl } from "./markup.js";
import { HadsSlot as BaseSlot, type HadsSlotProps } from "./HadsSlot.js";

export interface NextHadsScriptProps {
  siteKey: string;
  /** API origin. Default `https://api.hads.dev`. */
  baseUrl?: string;
  /** next/script strategy. Default `afterInteractive`. */
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";
}

/** Loads hads.js through next/script (deduplicated by id). */
export function HadsScript({ siteKey, baseUrl = DEFAULT_BASE_URL, strategy = "afterInteractive" }: NextHadsScriptProps) {
  return <Script id="hads-js" src={scriptUrl(siteKey, baseUrl)} strategy={strategy} />;
}

/**
 * HadsSlot that requests a new ad on every client-side route change, even when
 * it lives in a layout that Next.js keeps mounted between pages.
 */
export function HadsSlot({ refreshKey, ...props }: HadsSlotProps) {
  const pathname = usePathname();
  return <BaseSlot {...props} refreshKey={`${pathname ?? ""}|${refreshKey ?? ""}`} />;
}

export type { HadsSlotProps };
export type { HadsSlotType } from "./markup.js";
