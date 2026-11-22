# hads-astro

Astro components for [HADS](https://hads.dev) ad slots. Zero JS shipped by the
package; the slot is static HTML that `hads.js` fills.

## Install

```sh
npm install hads-astro
```

## Use

```astro
---
import { HadsScript, HadsSlot } from "hads-astro";
---
<html>
  <head>
    <HadsScript siteKey={import.meta.env.PUBLIC_HADS_SITE_KEY} />
  </head>
  <body>
    <article>...</article>
    <HadsSlot type="card" topic="astro" />
  </body>
</html>
```

`HadsScript` props: `siteKey` (required), `baseUrl` (default `https://api.hads.dev`).

`HadsSlot` props: `type` (`inline` default, `card`, `row`, `teaser`, `rail`;
`card` and `row` have an image), `topic`, `allowSelf`, `attribution`
(default `Ads by HADS`), `skeleton` (default `true`), `class`.

## View transitions

Put `HadsScript` in `<head>`. With `<ClientRouter />`, Astro keeps head
scripts across navigations and swaps the body; `hads.js` sees the new slot
elements and fills them. No extra code needed.

## Styling

The markup is the HTML snippet from hads.dev/docs, with class hooks
(`hads-unit`, `hads-unit--inline`, `hads-unit-attribution`,
`hads-unit-skeleton` ...). No CSS ships with this package: copy the CSS from
the docs into a global stylesheet (the slot is not scoped by Astro, so use
`:global()` or a global CSS file). Empty slots get `data-hads-empty="1"`.

## Privacy

No cookies or tracking of its own. `hads.js` is served by HADS and reports
impressions and clicks to it.

MIT licence.
