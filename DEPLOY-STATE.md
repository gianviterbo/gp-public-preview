# GP Public Preview — deployment state

**Status:** LIVE on production (gadgetpilipinas.net) — v1.0.0, active.
Deployed: 2026-09-08 (PH) after Gian's "Proceed".

## Swap 2026-09-08 — upstream → fork
- Removed upstream `public-post-preview` 3.1.2 (deactivate → DELETE via REST; its
  uninstall hook wiped only option `public_post_preview`, as expected).
- Deployed fork `gp-public-preview` 1.0.0 (7/7 files → random dir
  `gp-public-preview-WOOOdsJJ` → normalized to canonical).
- Activation tightened `public_post_preview_expiration_time` 48 → **24** (default
  hours for new links). Nonce window fixed at 168h in code; per-link lifetime is
  enforced by the fork's own gate.
- **Continuity:** TCL draft #212385 (only registered preview) re-registered with
  `gp_ppp_started` = its post_modified (05:39 UTC) + `gp_ppp_hours` = 42 →
  expires 2026-09-09 23:39 UTC = **Wed Sep 10 ~07:40 AM PH** (as promised pre-swap).
- Verified: plugin active 1.0.0; preview URL
  `/?p=212385&preview=1&_ppp=…` → HTTP 200 + draft title served.

## Features (fork adds over DS 3.1.2)
- Per-post `gp_ppp_hours` (1–168, meta; default from Settings → Reading).
- `gp_ppp_started` stamp on enable + on "regenerate" → old links die instantly.
- Front gate inside `is_public_preview_available()`: 403
  "This preview link has expired…" once lifetime passes; fallback start =
  post_modified_gmt → post_modified → now (zero-gmt hardened).
- Block editor: "Public preview" panel (hours + save/regenerate + copy link +
  expiry hint, `js/gp-editor.js`). Classic editor: fields in submit box.
- New slug `gp-public-preview` (auto-update safe); text domain + option keys
  preserved from upstream; meta REST-registered for editors/admins.
- Harness E2E matrix passed (fresh 200 / 20h@24h 200 / 26h@24h 403 /
  26h@72h 200 / legacy no-meta 200).

## Rollback (one step)
- Deploy pristine upstream: `/data/workspace/gp-public-preview/rollback/upstream-public-post-preview/`
  (or zip `rollback/public-post-preview-3.1.2-upstream.zip`) via
  `hosting_deployWordpressPlugin`, slug `public-post-preview`. Options are shared
  (`public_post_preview`, `public_post_preview_expiration_time`) so registrations
  survive; fork meta (`gp_ppp_hours`, `gp_ppp_started`) becomes inert.
- Pre-swap snapshot: `rollback/prod-state-before-swap.json`.

## Source of truth
- GitHub: `gianviterbo/gp-public-preview` (main) — repo root = plugin source.
- Build/deploy dir: `/data/workspace/gp-public-preview/build/gp-public-preview/`
- Zip: `gp-public-preview-1.0.0.zip`
- Editors may need a hard refresh of the post editor to load the new panel JS.
