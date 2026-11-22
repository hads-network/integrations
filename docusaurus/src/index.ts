import path from "path";
import type { LoadContext, Plugin } from "@docusaurus/types";
import { scriptUrl } from "./markup";
import { normalizeOptions, type NormalizedOptions, type PluginOptions } from "./options";

export type { PluginOptions, NormalizedOptions, SlotPlacement } from "./options";

export default function pluginHads(_context: LoadContext, options: PluginOptions): Plugin<void> {
  const opts: NormalizedOptions = normalizeOptions(options);
  return {
    name: "docusaurus-plugin-hads",

    // Theme components: @theme/HadsSlot, plus wrappers around
    // DocItem/Footer and DocItem/TOC/Desktop (no swizzling needed).
    getThemePath() {
      return path.resolve(__dirname, "./theme");
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, "../src/theme");
    },

    async contentLoaded({ actions }) {
      actions.setGlobalData(opts);
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "script",
            attributes: { src: scriptUrl(opts.siteKey, opts.baseUrl), async: true },
          },
        ],
      };
    },
  };
}

export function validateOptions({ options }: { options: Partial<PluginOptions> }) {
  normalizeOptions(options);
  return { ...options, id: options.id ?? "default" };
}
