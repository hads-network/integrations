# docusaurus-plugin-hads

[HADS](https://hads.dev) ad slots for Docusaurus 3. It loads `hads.js` on every
page and places a slot after each doc's content. No swizzling.

## Install

```sh
npm install docusaurus-plugin-hads
```

```js
// docusaurus.config.js
export default {
  plugins: [
    [
      "docusaurus-plugin-hads",
      {
        siteKey: "YOUR_SITE_KEY",
        // all optional:
        baseUrl: "https://api.hads.dev",
        docAfter: { type: "inline", topic: "react" }, // or false
        tocAfter: { type: "rail" },                   // default false
        attribution: "Ads by HADS",
        skeleton: true,
      },
    ],
  ],
};
```

## Options

| option | default | |
|---|---|---|
| `siteKey` | required | your HADS site key |
| `baseUrl` | `https://api.hads.dev` | API origin; the script is `{baseUrl}/v1/hads.js?site={siteKey}` |
| `docAfter` | `{ type: "inline" }` | slot after the doc content (wraps `DocItem/Footer`); `false` turns it off |
| `tocAfter` | `false` | slot under the desktop table of contents (wraps `DocItem/TOC/Desktop`) |
| `attribution` | `Ads by HADS` | attribution link text |
| `skeleton` | `true` | grey placeholder bars until the ad arrives |

Placements take `type` (`inline`, `card`, `row`, `teaser`, `rail`; `card` and
`row` have an image), `topic`, `allowSelf`.

## Slots in MDX

```mdx
import HadsSlot from '@theme/HadsSlot';

<HadsSlot type="card" topic="react" />
```

For TypeScript, add `"docusaurus-plugin-hads/theme-hads"` to `compilerOptions.types`.

## How it works

The script tag goes in `<head>` through `injectHtmlTags`. The placements are
theme components that wrap the classic theme's (`@theme-init`), so a swizzled
`DocItem/Footer` of your own still wins. Each slot is keyed by the current
path: on client navigation a new element is mounted and `hads.js` fills it
with a new ad.

## Styling

The markup is the HTML snippet from hads.dev/docs, with class hooks
(`hads-unit`, `hads-unit--inline`, `hads-unit-attribution`,
`hads-unit-skeleton` ...). No CSS is bundled: copy the CSS from the docs into
`src/css/custom.css`. Wrappers: `.hads-doc-after`, `.hads-toc-after`. Empty
slots get `data-hads-empty="1"`.

## Privacy

No cookies or tracking of its own. `hads.js` is served by HADS and reports
impressions and clicks to it.

MIT licence.
