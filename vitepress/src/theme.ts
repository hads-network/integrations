// Client/theme entry, for .vitepress/theme/index.ts.
import { defineComponent, h, inject, type PropType, type Component, type InjectionKey } from "vue";
// Types only: importing vitepress at runtime breaks SSR when this package is
// externalized, so the route comes from enhanceApp's router via provide().
import type { EnhanceAppContext, Theme } from "vitepress";
import { slotClass, slotInnerHtml, type HadsSlotType } from "./markup.js";

export type { HadsSlotType } from "./markup.js";

const ROUTE_KEY: InjectionKey<{ path: string }> = Symbol("hads-route");

/**
 * Registers <HadsSlot> globally and gives it the router's reactive route.
 * `withHads` calls this; call it yourself from a custom `enhanceApp`.
 */
export function enhanceAppWithHads({ app, router }: Pick<EnhanceAppContext, "app" | "router">): void {
  app.provide(ROUTE_KEY, router.route);
  app.component("HadsSlot", HadsSlot);
}

/**
 * <HadsSlot type="inline" topic="..." />. Re-keyed on route change, so client
 * navigation mounts a fresh element that hads.js fills with a new ad.
 */
export const HadsSlot = defineComponent({
  name: "HadsSlot",
  props: {
    type: { type: String as PropType<HadsSlotType>, default: "inline" },
    topic: { type: String, default: undefined },
    allowSelf: { type: Boolean, default: false },
    attribution: { type: String, default: undefined },
    skeleton: { type: Boolean, default: true },
  },
  setup(props) {
    const route = inject(ROUTE_KEY, { path: "" });
    return () =>
      h("aside", {
        key: [route.path, props.type, props.topic, props.allowSelf, props.attribution, props.skeleton].join("|"),
        "data-hads-slot": props.type,
        "data-hads-topic": props.topic || undefined,
        "data-hads-allow-self": props.allowSelf ? "" : undefined,
        class: slotClass(props.type),
        // hads.js fills these children and adds state attributes, possibly
        // before hydration; Vue does not hydrate innerHTML children.
        "data-allow-mismatch": "",
        innerHTML: slotInnerHtml(props.type, { attribution: props.attribution, skeleton: props.skeleton }),
      });
  },
});

export interface SlotPlacement {
  type?: HadsSlotType;
  topic?: string;
  allowSelf?: boolean;
}

export interface HadsThemeOptions {
  /** Slot after each doc page's content (`doc-after`). Default `{ type: "inline" }`; `false` disables. */
  docAfter?: SlotPlacement | false;
  /** Slot under the outline in the right aside (`aside-outline-after`). Default `false`. */
  asideOutlineAfter?: SlotPlacement | false;
  /** Attribution link text. Default "Ads by HADS". */
  attribution?: string;
  /** Render skeleton placeholders. Default true. */
  skeleton?: boolean;
}

/** Layout slot functions, for themes that already wrap the default Layout. */
export function hadsLayoutSlots(opts: HadsThemeOptions = {}): Record<string, () => ReturnType<typeof h>> {
  const slots: Record<string, () => ReturnType<typeof h>> = {};
  const add = (name: string, p: SlotPlacement | false | undefined, wrapClass: string) => {
    if (!p) return;
    slots[name] = () =>
      h("div", { class: wrapClass }, [
        h(HadsSlot, {
          type: p.type ?? "inline",
          topic: p.topic,
          allowSelf: !!p.allowSelf,
          attribution: opts.attribution,
          skeleton: opts.skeleton !== false,
        }),
      ]);
  };
  add("doc-after", opts.docAfter === undefined ? { type: "inline" } : opts.docAfter, "hads-doc-after");
  add("aside-outline-after", opts.asideOutlineAfter, "hads-aside-outline-after");
  return slots;
}

/**
 * Wraps a theme (usually `vitepress/theme`'s DefaultTheme): adds HADS slots
 * to its Layout and registers <HadsSlot> globally for Markdown pages.
 */
export function withHads(theme: Theme, opts: HadsThemeOptions = {}): Theme {
  const Base = theme.Layout as Component;
  const slots = hadsLayoutSlots(opts);
  return {
    ...theme,
    Layout: () => h(Base, null, slots),
    enhanceApp(ctx) {
      enhanceAppWithHads(ctx);
      return theme.enhanceApp?.(ctx);
    },
  };
}
