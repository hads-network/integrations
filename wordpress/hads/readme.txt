=== HADS ===
Contributors: hads
Tags: ads, advertising, sponsors, shortcode, block
Requires at least: 6.3
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add HADS ad slots to your site with a shortcode or a block. Your theme's styles stay in charge.

== Description ==

HADS is a headless ad exchange: it sends the ad text, link and image, and your
site decides how it looks. This plugin:

* loads `hads.js` (async) on the front end once you save your site key;
* adds the `[hads_slot]` shortcode and the "HADS slot" block;
* can append a slot after single post content.

Slot types: `inline`, `card`, `row`, `teaser`, `rail`. `card` and `row` include an image.

= Shortcode =

`[hads_slot type="inline"]`

Attributes: `type` (default `inline`), `topic` (optional topical hint),
`allow_self` (`true` to allow ads from your other sites), `attribution`
(link text, default "Ads by HADS"), `class` (extra CSS classes),
`skeleton` (`false` to drop the placeholder bars).

= Styling =

Slots use the class hooks from the HADS docs (`hads-unit`, `hads-unit--inline`,
`hads-unit-attribution`, `hads-unit-skeleton` ...). The plugin ships no CSS;
copy the CSS from https://hads.dev/docs into your theme or write your own.

= External service =

This plugin loads a script from the HADS service (`https://api.hads.dev` by
default, configurable) on front-end pages once a site key is set. The script
requests ads for the slots on the page and reports impressions and clicks to
HADS. It sends the page URL and referrer. The plugin itself sets no cookies and
does no tracking of its own. The script keeps a short-lived click marker in
the browser's sessionStorage; it sets no cookies.

Terms and privacy: https://hads.dev

== Installation ==

1. Upload the `hads` folder to `/wp-content/plugins/` or install the zip from Plugins > Add New.
2. Activate the plugin.
3. Go to Settings > HADS and paste your site key.
4. Add a `[hads_slot]` shortcode or the "HADS slot" block, or turn on the automatic slot.

== Frequently Asked Questions ==

= Nothing shows up =

Check that a site key is saved and the page has a slot. Slots stay as grey
placeholders until an ad is served; if there is no ad the slot gets
`data-hads-empty="1"`, which you can hide with CSS.

== Changelog ==

= 0.1.0 =
* First release.
