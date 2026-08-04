# WHITE ELEGANCE 24

Luxury fashion e-commerce site — always the full brand name, never shortened,
across every page, meta title, email, and UI string.

## Status

Phases 1–5 (brand/IA, design tokens, homepage design, all 11 site pages,
component system) are designed and approved, with real product data now
integrated. **We are on Phase 6: Production Build.** No placeholder layouts —
real, working Next.js/TypeScript/Shopify code.

## Files in This Folder (read before building anything)

- `style-guide.html` — Phase 2 moodboard: colors, type, spacing, live specimens
- `tokens.css` — dev-ready CSS variables + Tailwind config mapping (source of
  truth for every color/font/spacing/motion value — don't invent new ones)
- `homepage.html` — Phase 3 working prototype, all 9 homepage sections + motion
- `pages.html` — Phase 4 working prototype, all 11 other site pages
- `component-library.html` — Phase 5 spec: every component's default/hover/
  active/disabled/error/empty states, plus the 5 named animation primitives
- `products.ts` — real product catalog (10 SKUs, Shopify-shaped types), seed
  data until the live Storefront API is connected
- `PHASE6-DECISIONS-UPDATE.md` — resolved decisions + still-open items (also
  summarized below)

These HTML files are prototypes, not final code — the visual and behavioral
source of truth. Translate them faithfully into Next.js/TypeScript/Tailwind/
Framer Motion/Lenis; don't copy-paste raw HTML into React components.

## Brand Essence

A luxury fashion label devoted exclusively to elegant white clothing for
women. Every decision reinforces confidence, purity, timeless fashion, grace,
luxury, simplicity, modern femininity, sophistication. Emotional and
cinematic, never commercial-feeling. Homepage sells emotion first; collection
pages sell product.

## Tech Stack

Next.js 15 (App Router) · React · TypeScript · Tailwind CSS · GSAP +
ScrollTrigger · Lenis smooth scroll · Framer Motion · Shopify Headless
(Storefront API) · fully responsive · accessible · Core Web Vitals optimized
· SEO optimized.

## Hard Rules

- Gold (`--soft-gold`) is a hover/active color only — never a resting fill.
- Never pure/harsh black — headings use `--charcoal` (`#2B2825`).
- `dupatta-unfold` is a one-time signature animation for the homepage hero →
  Section 2 only. Never reuse it elsewhere.
- Header is transparent/glassmorphic only over the homepage hero; solid on
  every other page. Below 1100px, collapse to hamburger + full-screen nav —
  don't let nav text wrap (this was a real shipped bug).
- Don't invent new animation patterns without adding them to
  `component-library.html`'s primitive list first.
- Contact info, verbatim wherever used: Website `www.whiteelegance24.com` ·
  Phone/WhatsApp `+91 89768 39119` · Email `amruta.nilatkar.47@gmail.com`.

## Resolved Decisions

1. **Journal page → post-launch.** Not in the original 12-page sitemap. Don't
   build its route now; hide/remove the nav link until it's actually scoped.
2. **AI size guide → smart static size chart.** Measurements table + basic
   recommended-size logic, no ML service. Label it "Size Guide" in the UI, not
   "AI Size Guide," until a real recommendation service is commissioned.
3. **Consent banner → hard block by default.** No GA4/Meta Pixel/Clarity/
   GTM-loaded tag fires until the user explicitly accepts. Gate every
   analytics init call behind stored consent — don't fire-then-ask.

## Still Open

- **Shopify Headless setup** — need a real store, catalog, collection
  handles, and Storefront API token before wiring live data. Build against
  `products.ts` as seed data until then.
- **Real photography/video** — homepage hero, Editorial Fashion Film, and
  Instagram Gallery need cinematic lifestyle shots; product images that do
  exist are studio/catalog shots only, fine for product cards and PDP but not
  a substitute for those three sections. Keep a `PlaceholderImage`
  abstraction there so real assets drop in without a rebuild.
- **Empty states** — Cart, Wishlist, and "no search results" aren't designed
  yet. Design these during their respective page builds.
- **Guest checkout** — default to guest-first with account creation prompted
  post-purchase, unless told otherwise.
- **Lenis** — not used in the HTML prototypes (native scroll + GSAP
  ScrollTrigger scrub instead, for preview reliability). Wire it properly for
  true inertia smooth-scroll in this build.
- **Collection assignment** — party-wear vs. casual-wear per product in
  `products.ts` was inferred from garment type, not client-confirmed.
- **Two SKU-naming flags in `products.ts`** — `A33` and `A6-Jacket` each carry
  a `needsReview` field explaining what to confirm against the source
  spreadsheet. Don't silently rename them.

## Analytics & Tracking Stack

GA4 full ecommerce event schema (`page_view`, `view_item`, `view_item_list`,
`add_to_wishlist`, `add_to_cart`, `remove_from_cart`, `begin_checkout`,
`add_payment_info`, `add_shipping_info`, `purchase`, `search`, `sign_up`,
`login`) · Meta Pixel + Conversions API (server-side) mirroring the same
events · Microsoft Clarity for session recordings/heatmaps · Google Tag
Manager as the single tag layer · all gated behind the consent banner above.
First-party capture: newsletter/notify-me forms into a CRM-connected list
independent of ad platforms; abandoned-cart triggers from captured
email/phone; server-side order/SKU logging for LTV/cohort views.

## How to Work

Read every file in this folder before scaffolding. Start with the Next.js
project setup + design tokens wired into Tailwind config + shared layout/
header/footer, then move page by page using `pages.html` and
`component-library.html` as the spec.
