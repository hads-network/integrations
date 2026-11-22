# hads-react

React and Next.js components for [HADS](https://hads.dev) ad slots. No runtime
dependencies; `next` is an optional peer.

## Install

```sh
npm install hads-react
```

## Next.js (App Router or Pages Router)

Use the `hads-react/next` entry. Its `HadsScript` uses `next/script`, and its
`HadsSlot` requests a new ad on every client-side route change, even when the
slot sits in a layout that stays mounted.

```tsx
// app/layout.tsx
import { HadsScript, HadsSlot } from "hads-react/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <HadsSlot type="rail" topic="javascript" />
        <HadsScript siteKey={process.env.NEXT_PUBLIC_HADS_SITE_KEY!} />
      </body>
    </html>
  );
}
```

## Plain React (Vite, CRA, Remix, ...)

```tsx
import { HadsScript, HadsSlot } from "hads-react";

<HadsScript siteKey="YOUR_SITE_KEY" />          {/* once, anywhere */}
<HadsSlot type="card" refreshKey={location.pathname} />
```

`HadsScript` adds one async `<script>` to `<head>` after mount.

## Props

`HadsScript`: `siteKey` (required), `baseUrl` (default `https://api.hads.dev`),
`id` (default `hads-js`; `next` entry: `strategy`, default `afterInteractive`).

`HadsSlot`:

| prop | default | |
|---|---|---|
| `type` | `inline` | `inline`, `card`, `row`, `teaser`, `rail` (`card`, `row` have an image) |
| `topic` | | topical hint, `data-hads-topic` |
| `allowSelf` | `false` | allow ads from your other sites, `data-hads-allow-self` |
| `attribution` | `Ads by HADS` | attribution link text |
| `skeleton` | `true` | grey placeholder bars until the ad arrives |
| `className`, `style` | | added to the `<aside>` |
| `refreshKey` | | change it to get a fresh ad (the element is remounted) |

## How it works / client navigation

`hads.js` fills each `[data-hads-slot]` element once and watches the DOM for
new ones. A slot React keeps mounted across a route change keeps its old ad,
so the component remounts the `<aside>` when `refreshKey` (or any prop)
changes. The `next` entry sets `refreshKey` to the pathname for you.

The slot's children are set with `dangerouslySetInnerHTML` and are never
re-rendered by React, because `hads.js` owns them once it loads. Hydration
over an already-filled slot is safe.

The script URL is `{baseUrl}/v1/hads.js?site={siteKey}`.

## Styling

The markup is the HTML snippet from hads.dev/docs, with class hooks
(`hads-unit`, `hads-unit--card`, `hads-unit-attribution`, `hads-unit-skeleton`
...). This package ships no CSS. Copy the CSS from the docs or style the hooks
yourself; `hads.js` keeps your classes. Empty slots get `data-hads-empty="1"`.

## Privacy

The package sets no cookies and tracks nothing itself. `hads.js` is served by
HADS and reports impressions and clicks to it.

MIT licence.
