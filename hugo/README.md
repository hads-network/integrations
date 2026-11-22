# HADS for Hugo

A theme component with two partials, `hads/script.html` and `hads/slot.html`,
and a `{{< hads >}}` shortcode for [HADS](https://hads.dev) ad slots.

## Install

As a Hugo module:

```toml
# hugo.toml
[module]
  [[module.imports]]
    path = "github.com/hads-network/integrations/hugo"
```

```sh
hugo mod get github.com/hads-network/integrations/hugo
```

Or as a theme component: copy or submodule this folder to `themes/hads` and
set `theme = ["hads", "your-theme"]`.

## Configure

```toml
[params.hads]
  siteKey = "YOUR_SITE_KEY"
  # baseUrl = "https://api.hads.dev"
  # attribution = "Ads by HADS"
  # enabled = false   # e.g. in config/development
```

## Use

In your `<head>` (usually `baseof.html` or a head partial):

```go-html-template
{{ partial "hads/script.html" . }}
```

Where the ad goes:

```go-html-template
{{ partial "hads/slot.html" "inline" }}
{{ partial "hads/slot.html" (dict "type" "card" "topic" "go" "allowSelf" true "class" "my-ad") }}
```

In Markdown:

```md
{{< hads type="teaser" topic="hugo" >}}
```

Options: `type` (`inline` default, `card`, `row`, `teaser`, `rail`; `card` and
`row` have an image), `topic`, `allowSelf`, `attribution`, `skeleton`
(default `true`), `class`.

## Styling

The markup is the HTML snippet from hads.dev/docs, with class hooks
(`hads-unit`, `hads-unit--inline`, `hads-unit-attribution`,
`hads-unit-skeleton` ...). No CSS is included; copy the CSS from the docs into
your theme. Empty slots get `data-hads-empty="1"`.

## Privacy

No cookies or tracking of its own. `hads.js` is served by HADS and reports
impressions and clicks to it.

## Example

`exampleSite/` builds with `hugo --source exampleSite`; `node test/check.mjs`
builds it and compares the markup with the snippets.

MIT licence.
