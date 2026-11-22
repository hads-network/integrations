import { DEFAULT_BASE_URL, isSlotType, type HadsSlotType } from "./markup";

export interface SlotPlacement {
  type?: HadsSlotType;
  topic?: string;
  allowSelf?: boolean;
}

export interface PluginOptions {
  /** Your HADS site key (required). */
  siteKey: string;
  /** API origin. Default `https://api.hads.dev`. */
  baseUrl?: string;
  /** Slot rendered after each doc's content (DocItem footer). `false` disables. Default `{ type: "inline" }`. */
  docAfter?: SlotPlacement | false;
  /** Slot rendered under the desktop table of contents. `false` disables. Default `false`. */
  tocAfter?: SlotPlacement | false;
  /** Attribution link text. Default "Ads by HADS". */
  attribution?: string;
  /** Render skeleton placeholders. Default true. */
  skeleton?: boolean;
  id?: string;
}

export interface NormalizedOptions {
  siteKey: string;
  baseUrl: string;
  docAfter: SlotPlacement | false;
  tocAfter: SlotPlacement | false;
  attribution?: string;
  skeleton: boolean;
}

function placement(name: string, value: unknown, fallback: SlotPlacement | false): SlotPlacement | false {
  if (value === undefined) return fallback;
  if (value === false) return false;
  if (typeof value !== "object" || value === null) {
    throw new Error(`docusaurus-plugin-hads: "${name}" must be an object or false`);
  }
  const p = value as SlotPlacement;
  if (p.type !== undefined && !isSlotType(p.type)) {
    throw new Error(`docusaurus-plugin-hads: "${name}.type" must be one of inline, card, row, teaser, rail`);
  }
  return { type: p.type ?? "inline", topic: p.topic, allowSelf: !!p.allowSelf };
}

export function normalizeOptions(options: Partial<PluginOptions>): NormalizedOptions {
  if (!options || typeof options.siteKey !== "string" || !options.siteKey.trim()) {
    throw new Error('docusaurus-plugin-hads: the "siteKey" option is required');
  }
  return {
    siteKey: options.siteKey.trim(),
    baseUrl: options.baseUrl || DEFAULT_BASE_URL,
    docAfter: placement("docAfter", options.docAfter, { type: "inline" }),
    tocAfter: placement("tocAfter", options.tocAfter, false),
    attribution: options.attribution,
    skeleton: options.skeleton !== false,
  };
}
