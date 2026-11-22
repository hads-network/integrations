# HADS integrations

| folder | package | registry |
|---|---|---|
| `astro/` | `hads-astro` | npm |
| `react/` | `hads-react` (+ `hads-react/next`) | npm |
| `docusaurus/` | `docusaurus-plugin-hads` | npm |
| `vitepress/` | `vitepress-plugin-hads` | npm |
| `hugo/` | Hugo module `github.com/hads-network/integrations/hugo` | git tag |
| `wordpress/hads/` | WordPress plugin `hads` | wordpress.org SVN |

`fixtures/` holds the reference slot markup generated from
`website/lib/website_web/docs/snippets.ex`, a DOM comparator, the canonical
`markup.ts` (copied into the JS packages by `fixtures/sync-markup.sh`) and
`embed-sim.mjs`, which runs the real engine script (`Engine.Embed.script/1`,
evaluated with Elixir) in happy-dom for client-navigation tests.

Run tests: `npm install` in `fixtures/` first, then `npm install && npm test`
in each JS package; `node hugo/test/check.mjs [hugo]`;
`node wordpress/test/check.mjs [php]` (needs PHP) or `npm test` in `wordpress/`.

Regenerate fixtures after changing the snippets:

```sh
cd fixtures && elixir -r ../../website/lib/website_web/docs/snippets.ex \
  -e 'for t <- ~w(inline card row teaser rail), do: File.write!("#{t}.html", WebsiteWeb.Docs.Snippets.html(t, "Ad", "Ads by HADS") <> "\n")'
```
