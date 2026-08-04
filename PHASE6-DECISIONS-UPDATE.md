# WHITE ELEGANCE 24 — Phase 6 Decisions Update

Three previously-open items are now resolved. Update `CLAUDE.md`'s "Open
Items" section accordingly (or paste this whole block in as-is):

## Resolved

1. **Journal page — post-launch.** Not in the original 12-page sitemap, only
   the nav. Don't build the route or its IA now; remove/hide the nav link
   until it's actually scoped, rather than linking to a page that doesn't
   exist.

2. **AI size guide — smart static size chart, not a live AI feature.**
   Build a straightforward size chart component (measurements table +
   "recommended size" logic based on user-entered measurements, no ML
   service, no external API). Keep the copy calling it a "Size Guide," not
   "AI Size Guide," in the UI until/unless a real recommendation service is
   commissioned later.

3. **Consent banner — hard block by default.** No non-essential
   cookie/tracking script (GA4, Meta Pixel, Clarity, GTM-loaded tags) fires
   until the user explicitly accepts. Show the banner on first visit,
   persist the choice, and gate the analytics init calls behind that stored
   consent value — don't fire-then-ask.

## Still open (unchanged — carry forward)

- Shopify Headless store/catalog/Storefront API token setup
- Real cinematic photography/video for hero, Editorial Film, Instagram Gallery
- Empty states for Cart, Wishlist, "no search results"
- Guest checkout (already defaulted to guest-first + post-purchase account
  prompt, confirm if that should change)
- Lenis wiring for true inertia smooth-scroll
- Collection assignment (party-wear vs. casual-wear) — inferred, not
  client-confirmed (see `products.ts`)
- Two SKU-naming inconsistencies flagged directly in `products.ts`
  (`A33`, `A6-Jacket`) — needs the source spreadsheet or client to confirm

## Also included in this update: `products.ts`

Replaces `assets/products.js`. Same 10 SKUs, same real prices/photos, but
reshaped to roughly match Shopify's Storefront API (`Product` / `ProductVariant`
/ `Image` types), so the eventual swap to live Shopify data is a data-source
change, not a component rewrite. Each product now also carries a `collection`
field (party-wear/casual-wear) and, where relevant, a `needsReview` field
explaining exactly what to confirm and why — nothing was silently "fixed"
without the source data to back it up.
