=== GP Public Preview ===
Contributors: gadgetpilipinas
Tags: preview, draft, share, link, public, posts
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Shareable, time-limited preview links for unpublished posts. Fork of DS Public Post Preview with per-link lifetimes, one-click refresh and an enforced expiry gate.

== Description ==

GP Public Preview is a fork of the popular **Public Post Preview** plugin by Dominik
Schilling (GPLv2+), built for Gadget Pilipinas. It keeps the familiar workflow —
tick "Enable public preview" on a draft and share the link — and adds granular
control over how long each link lives:

* **Per-link lifetime** — set the number of hours a preview link stays valid
  (1-168). Default is 24h and is configurable under *Settings → Reading*.
* **Enforced expiry** — once the lifetime is up, visitors get a clear
  "This preview link has expired" page (HTTP 403). No more links that linger
  forever on drafts.
* **One-click regenerate** — stamp a fresh start time so old shared copies die
  immediately, then copy the new link.
* Works in both the **block editor** (a "Public preview" panel in the document
  settings sidebar) and the **classic editor**.
* Previews keep working only while the post is unpublished: publishing or
  trashing the post automatically disables the preview and redirects to the
  live post.

State is stored in the same options the original plugin used
(`public_post_preview`, `public_post_preview_expiration_time`) plus two new
per-post meta keys (`gp_ppp_hours`, `gp_ppp_started`), so existing registrations
and workflows survive the switch.

== Installation ==

1. Upload the `gp-public-preview` folder to `/wp-content/plugins/` (or install
   the zip), then activate.
2. Activation sets the default lifetime to 24h if it was still the upstream
   default of 48h.
3. On any draft, enable "Public preview" and set the hours you want.

The slug is `gp-public-preview` on purpose: WordPress.org auto-updates can never
overwrite this fork with the upstream plugin.

== Frequently Asked Questions ==

= How long does a shared link live? =

Default 24 hours (settings). Each post can override with 1-168 hours. A link
dies at its lifetime mark even if the draft stays unpublished.

= What happens when a link expires? =

Visitors see "This preview link has expired. Please ask the author to share a
fresh link." with HTTP 403. The author reopens the post, presses
"Save & regenerate link", and shares the new URL.

= Does publishing kill the preview? =

Yes — publishing or trashing the post disables the preview (upstream
behaviour). Visitors then get redirected to the live post.

== Changelog ==

= 1.0.0 =
* Fork of Public Post Preview 3.1.2 (DS) → GP Public Preview.
* Per-post link lifetime (1-168h, default from Settings → Reading, tightened to 24h).
* Enforced front-end expiry gate (403 with a clear message).
* Regenerate/refresh action in classic + block editor; old links die instantly.
* Block editor "Public preview" panel with hours, regenerate and copy-ready link.
* New slug `gp-public-preview`; upstream options/text-domain preserved.

== Upgrade Notice ==

= 1.0.0 =
Replace the upstream "Public Post Preview" plugin. Deactivate and remove it
first, then activate GP Public Preview. Existing preview registrations are kept
(options are shared); the one behaviour change is the default lifetime of 24h.

== Credits ==

Original plugin **Public Post Preview** by Dominik Schilling (DS) —
https://wordpress.org/plugins/public-post-preview/ — GPLv2 or later.
Fork maintained by Gadget Pilipinas (https://www.gadgetpilipinas.net/).
