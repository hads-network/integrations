// HADS slot markup. Mirrors the "HTML" snippets in
// website/lib/website_web/docs/snippets.ex. This file is copied verbatim into
// each JS integration (see fixtures/sync-markup.sh); edit it here.

export const SLOT_TYPES = ["inline", "card", "row", "teaser", "rail"] as const;
export type HadsSlotType = (typeof SLOT_TYPES)[number];

export const DEFAULT_BASE_URL = "https://api.hads.dev";
export const DEFAULT_ATTRIBUTION = "Ads by HADS";

export interface SlotMarkupOptions {
  /** Text of the attribution link. Default "Ads by HADS". */
  attribution?: string;
  /** Render the grey skeleton placeholders the script replaces. Default true. */
  skeleton?: boolean;
}

export function isSlotType(value: unknown): value is HadsSlotType {
  return typeof value === "string" && (SLOT_TYPES as readonly string[]).includes(value);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** `https://api.hads.dev/v1/hads.js?site=KEY` */
export function scriptUrl(siteKey: string, baseUrl: string = DEFAULT_BASE_URL): string {
  const base = String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  return `${base}/v1/hads.js?site=${encodeURIComponent(siteKey)}`;
}

/** Root `<aside>` class list for a slot type. */
export function slotClass(type: HadsSlotType): string {
  return `hads-unit hads-unit--${type}`;
}

/** Inner HTML of a slot `<aside>` (everything between the tags). */
export function slotInnerHtml(type: HadsSlotType, opts: SlotMarkupOptions = {}): string {
  const label = escapeHtml(opts.attribution ?? DEFAULT_ATTRIBUTION);
  const sk = opts.skeleton !== false;
  const title = sk
    ? '<span class="hads-unit-skeleton hads-unit-skeleton--title" aria-hidden="true"></span>'
    : "";
  const text = sk
    ? '<span class="hads-unit-skeleton hads-unit-skeleton--text" aria-hidden="true"></span>' +
      '<span class="hads-unit-skeleton hads-unit-skeleton--text hads-unit-skeleton--text-short" aria-hidden="true"></span>'
    : "";
  const attribution = `<a data-hads-attribution class="hads-unit-attribution">${label}</a>`;
  const img = '<img data-hads-image alt="" />';
  const strong = `<strong data-hads-title>${title}</strong>`;
  const p = `<p data-hads-text>${text}</p>`;
  const url = "<a data-hads-url></a>";

  switch (type) {
    case "card":
      return attribution + img + strong + p + url;
    case "row":
      return img + `<div class="hads-unit-body">${attribution}${strong}${p}${url}</div>`;
    case "teaser":
      return attribution + `<a data-hads-url>${strong}</a>` + p;
    case "rail":
    case "inline":
    default:
      return attribution + strong + p + url;
  }
}

export interface SlotAttrOptions {
  topic?: string;
  allowSelf?: boolean;
}

/** Full `<aside>` HTML string for a slot. */
export function slotHtml(
  type: HadsSlotType,
  opts: SlotMarkupOptions & SlotAttrOptions & { className?: string } = {},
): string {
  const cls = [slotClass(type), opts.className].filter(Boolean).join(" ");
  let attrs = `data-hads-slot="${type}" class="${escapeHtml(cls)}"`;
  if (opts.topic) attrs += ` data-hads-topic="${escapeHtml(opts.topic)}"`;
  if (opts.allowSelf) attrs += " data-hads-allow-self";
  return `<aside ${attrs}>${slotInnerHtml(type, opts)}</aside>`;
}
