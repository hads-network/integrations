# vitepress-plugin-hads

[HADS](https://hads.dev) ad slots for VitePress: a `head` helper for the
script and a theme enhancement that fills the default theme's `doc-after`
and `aside-outline-after` layout slots.

## Install

```sh
npm install vitepress-plugin-hads
```

## Configure

```ts
// .vitepress/config.ts
import { defineConfig } from "vitepress";
import { hadsHead } from "vitepress-plugin-hads";

export default defineConfig({
  head: [...hadsHead({ siteKey: "YOUR_SITE_KEY" /*, baseUrl: "https://api.hads.dev" */ })],
});
```

```ts
// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import { withHads } from "vitepress-plugin-hads/theme";

export default withHads(DefaultTheme, {
  docAfter: { type: "inline" },          // default; false turns it off
  asideOutlineAfter: { type: "rail" },   // default false
  // attribution: "Ads by HADS", skeleton: true,
});
```

`withHads` also registers `<HadsSlot>` globally, so Markdown pages can use:

```md
<HadsSlot type="card" topic="vue" />
```

Props: `type` (`inline` default, `card`, `row`, `teaser`, `rail`; `card` and
`row` have an image), `topic`, `allow-self`, `attribution`, `skeleton`.

### Custom Layout

If your theme already wraps the default Layout, merge the slots yourself:

```ts
import { enhanceAppWithHads, hadsLayoutSlots } from "vitepress-plugin-hads/theme";

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { ...hadsLayoutSlots({ docAfter: { type: "card" } }), /* yours */ }),
  enhanceApp: (ctx) => enhanceAppWithHads(ctx),
};
```

## How it works

The script is `{baseUrl}/v1/hads.js?site={siteKey}`, loaded async in `<head>`.
Each slot is keyed by the route path, so client navigation mounts a fresh
element that `hads.js` fills with a new ad. The route comes from
`enhanceApp`'s router; without `withHads`/`enhanceAppWithHads` the slot still
renders but is not refreshed on navigation. The slot's children are set as
`innerHTML` and are not hydrated, so the filled ad survives hydration.

## Styling

The markup is the HTML snippet from hads.dev/docs, with class hooks
(`hads-unit`, `hads-unit--inline`, `hads-unit-attribution`,
`hads-unit-skeleton` ...). No CSS is bundled: copy the CSS from the docs into
your theme's `style.css`. Wrappers: `.hads-doc-after`,
`.hads-aside-outline-after`. Empty slots get `data-hads-empty="1"`.

## Privacy

No cookies or tracking of its own. `hads.js` is served by HADS and reports
impressions and clicks to it.

MIT licence.
