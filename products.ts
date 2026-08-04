/**
 * WHITE ELEGANCE 24 — Product Catalog (Shopify-shaped seed data)
 *
 * Upgraded from assets/products.js to match the rough shape of Shopify's
 * Storefront API (Product / ProductVariant / Image), so swapping this file
 * for live GraphQL responses later is a data-source swap, not a UI rebuild.
 *
 * Source of truth: White Elegance 24.xlsx, shared via the client's Drive
 * folder ("White Elegance 24 website" — spreadsheet + "White Elegance Party
 * Set" and "White Elegance co ord set" photo subfolders), 34 SKUs (Sr 1–35,
 * row 11 absent in the source sheet — not fabricated here). This replaces
 * the earlier 10-SKU seed data wholesale; several of those 10 titles/
 * descriptions turned out to be placeholder guesses that didn't match the
 * client's real copy or photos (e.g. A2 was guessed as "Blush Floral Maxi
 * Dress" — the real photo is an ivory co-ord, same style as A1).
 *
 * `hasPhoto:false`: only A27 (no photo provided yet) — kept in the array,
 * render with a labeled placeholder, never drop from the grid.
 *
 * FLAGGED FOR REVIEW (not fixed automatically — needs the source sheet
 * or client confirmation, not a guess):
 *  - A33: breaks the "A3-Color" pattern used by A3 Light Pink/Light Yellow
 *    for the same dress style in a third colorway. Carried forward from the
 *    original handoff, still unconfirmed.
 *  - A6-Jacket: shares the "A6" prefix with a completely different garment
 *    (embroidered co-ord vs. ruffle midi dress + jacket). Carried forward,
 *    still unconfirmed.
 *  - A8 is used for TWO different products in the source sheet ("White
 *    Cocktail Nights" and "White Evening Events") — internal skus below are
 *    disambiguated as A8-Cocktail / A8-Evening, but the client's real code
 *    for each needs confirming.
 *  - A15 is used for THREE different colorways (Blue / Pink / Light Pink)
 *    with no distinguishing suffix in the source sheet — internal skus
 *    disambiguated as A15-Blue / A15-Pink / A15-LightPink.
 *  - A21 is used for TWO different products ("Polka Dots" and a floral
 *    "little blue, a little bloom" midi) — internal skus disambiguated as
 *    A21-PolkaDots / A21-Bloom.
 *  - A17 ("elicate floral charm") and A19 ("abric, artistic detailing...")
 *    read as missing a leading letter in the source sheet — corrected to
 *    "Delicate" and "Fabric" here since shipping the typo verbatim to
 *    customers is worse than an obvious single-letter fix, but flagged
 *    rather than silently assumed.
 *  - A25 does not appear in the source sheet (numbering jumps A24 → A26).
 *    Not fabricated here.
 *  - Collection assignment (party-wear vs. casual-wear) is inferred from
 *    each row's own description (explicit "Co ords"/"Co-ord Set" text →
 *    casual-wear; "Party Dress"/occasion framing → party-wear; "everyday"
 *    framing → casual-wear) — not confirmed by the client. Sanity-check
 *    before launch; this was already flagged in the Phase 6 handoff.
 */

export type Collection = "party-wear" | "casual-wear";

export interface ProductVariant {
  size: string;
  sku: string;
  price: { amount: number; currencyCode: "INR" };
  /** Real inventory count isn't available yet — wire this once Shopify is live. */
  inventoryQuantity: number | null;
  available: boolean;
}

export interface ProductImage {
  url: string | null;
  /** Required even when url is null, so the placeholder still has accessible text. */
  altText: string;
}

export interface Product {
  /** Placeholder Shopify-style GID until the real store exists. */
  id: string;
  handle: string;
  title: string;
  description: string;
  collection: Collection;
  hasPhoto: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  needsReview?: string; // reason a human should double-check this entry
}

function img(url: string | null, altText: string): ProductImage {
  return { url, altText };
}

export const PRODUCTS: Product[] = [
  {
    id: "gid://placeholder/Product/A1",
    handle: "ivory-cami-maxi-skirt-coord",
    title: "Ivory Cami & Maxi Skirt Co-ord",
    description:
      "A relaxed two-piece co-ord set: loose halter/camisole-style top with a flowing, high-waisted maxi skirt.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a1.png", "Ivory Cami & Maxi Skirt Co-ord")],
    variants: [{ size: "Free Size", sku: "A1", price: { amount: 1750, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual"],
  },
  {
    id: "gid://placeholder/Product/A2",
    handle: "ivory-rosette-cami-maxi-skirt-coord",
    title: "Ivory Rosette Cami & Maxi Skirt Co-ord",
    description:
      "The same relaxed two-piece co-ord silhouette as our Ivory Cami & Maxi Skirt Co-ord, finished with a rosette strap detail.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a2.png", "Ivory Rosette Cami & Maxi Skirt Co-ord")],
    variants: [{ size: "Free Size", sku: "A2", price: { amount: 1595, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual"],
    needsReview:
      "Source sheet gives A1 and A2 the identical description text — collection/positioning as a near-duplicate of A1 (vs. a distinct style) needs client confirmation.",
  },
  {
    id: "gid://placeholder/Product/A3",
    handle: "light-pink-floral-maxi-dress-cardigan",
    title: "Light Pink Floral Maxi Dress with Cardigan",
    description: "Floral maxi dress with a ruched bodice, styled with a light pink ribbed cardigan.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a3-light-pink.png", "Light Pink Floral Maxi Dress with Cardigan")],
    variants: [{ size: "Free Size", sku: "A3", price: { amount: 2575, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["floral", "occasion", "color-family:A3"],
  },
  {
    id: "gid://placeholder/Product/A3-Yellow",
    handle: "light-yellow-floral-maxi-dress-cardigan",
    title: "Light Yellow Floral Maxi Dress with Cardigan",
    description: "Floral maxi dress with a ruched bodice, styled with a light yellow ribbed cardigan.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a3-light-yellow.png", "Light Yellow Floral Maxi Dress with Cardigan")],
    variants: [{ size: "Free Size", sku: "A3-Yellow", price: { amount: 2575, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["floral", "occasion", "color-family:A3"],
  },
  {
    id: "gid://placeholder/Product/A33",
    handle: "pink-floral-maxi-dress-cardigan",
    title: "Pink Floral Maxi Dress with Cardigan",
    description: "Floral maxi dress with a ruched bodice, styled with a pink ribbed cardigan.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a33-pink.png", "Pink Floral Maxi Dress with Cardigan")],
    variants: [{ size: "Free Size", sku: "A33", price: { amount: 2575, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["floral", "occasion", "color-family:A3"],
    needsReview: "Code breaks the A3-Color pattern used by siblings A3 and A3-Yellow — confirm against source sheet.",
  },
  {
    id: "gid://placeholder/Product/A4",
    handle: "white-long-party-dress",
    title: "White Long Party Dress",
    description: "Party Dress.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a4-white-long.png", "White Long Party Dress")],
    variants: [{ size: "Free Size", sku: "A4", price: { amount: 2100, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
  },
  {
    id: "gid://placeholder/Product/A5",
    handle: "white-long-side-cut-party-dress",
    title: "White Long Side-Cut Party Dress",
    description: "Party Dress.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a5-white-long-side-cut.png", "White Long Side-Cut Party Dress")],
    variants: [{ size: "S/M", sku: "A5", price: { amount: 2200, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
  },
  {
    id: "gid://placeholder/Product/A6",
    handle: "ivory-embroidered-blouse-pants-coord",
    title: "Ivory Embroidered Blouse & Wide-Leg Pants Co-ord",
    description: "Co-ords — embroidered kimono-sleeve blouse with wide-leg trousers.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a6-coord.png", "Ivory Embroidered Blouse & Wide-Leg Pants Co-ord")],
    variants: [{ size: "Free Size", sku: "A6", price: { amount: 2250, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual"],
  },
  {
    id: "gid://placeholder/Product/A6-Jacket",
    handle: "ivory-ruffle-midi-dress-jacket",
    title: "Ivory Ruffle Midi Dress with Jacket",
    description: "Co-ords — textured ruffle-hem midi dress with a draped open jacket.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a6-jacket.png", "Ivory Ruffle Midi Dress with Jacket")],
    variants: [{ size: "L", sku: "A6-Jacket", price: { amount: 2550, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual"],
    needsReview: "Shares the A6 prefix with a different garment (embroidered blouse+pants). Confirm this is the client's intended code.",
  },
  {
    id: "gid://placeholder/Product/A7",
    handle: "ivory-crochet-vest-lace-skirt-coord",
    title: "Ivory Crochet Vest & Lace Skirt Co-ord",
    description: "Co-ords — crochet-knit button vest with an embroidered lace-hem maxi skirt.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [
      img("/assets/images/products/a7-coord-set-alt.png", "Ivory Crochet Vest & Lace Skirt Co-ord"),
    ],
    variants: [{ size: "L", sku: "A7", price: { amount: 3110, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual"],
  },
  {
    id: "gid://placeholder/Product/A8-Cocktail",
    handle: "white-cocktail-nights-dress",
    title: "White Cocktail Nights Dress",
    description: "Party Dress.",
    collection: "party-wear",
    hasPhoto: true,
    images: [
      img("/assets/images/products/a8-cocktail-nights.png", "White Cocktail Nights Dress"),
      img("/assets/images/products/a8-cocktail-nights-back.png", "White Cocktail Nights Dress — back"),
    ],
    variants: [{ size: "Free Size", sku: "A8-Cocktail", price: { amount: 2100, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
    needsReview: "Source sheet codes this \"A8\", the same code used for \"White Evening Events\" below — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A8-Evening",
    handle: "white-evening-events-dress",
    title: "White Evening Events Dress",
    description: "Party Dress.",
    collection: "party-wear",
    hasPhoto: true,
    images: [
      img("/assets/images/products/a8-evening-events.png", "White Evening Events Dress"),
      img("/assets/images/products/a8-evening-events-back.png", "White Evening Events Dress — back"),
    ],
    variants: [{ size: "Free Size", sku: "A8-Evening", price: { amount: 2100, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
    needsReview: "Source sheet codes this \"A8\", the same code used for \"White Cocktail Nights\" above — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A9",
    handle: "white-midi-dress-matching-jacket",
    title: "White Midi Dress with Matching Jacket",
    description:
      "Meet the perfect blend of grace & sophistication: a beautifully crafted white midi dress paired with a matching jacket, designed to give you effortless luxury for every occasion.",
    collection: "party-wear",
    hasPhoto: true,
    images: [
      img("/assets/images/products/a9.png", "White Midi Dress with Matching Jacket"),
      img("/assets/images/products/a9-back.png", "White Midi Dress with Matching Jacket — back"),
    ],
    variants: [{ size: "L", sku: "A9", price: { amount: 2550, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
  },
  {
    id: "gid://placeholder/Product/A10",
    handle: "long-side-cut-dress",
    title: "Long Side-Cut Dress",
    description:
      "A silhouette that speaks confidence, grace & timeless beauty. Designed with a structured square neckline, full-length sleeves and subtle textured detailing that makes simplicity feel luxurious.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a10-long-side-cut.png", "Long Side-Cut Dress")],
    variants: [{ size: "M", sku: "A10", price: { amount: 2200, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
  },
  {
    id: "gid://placeholder/Product/A11",
    handle: "delicate-crochet-top-skirt",
    title: "Delicate Crochet Top with Skirt",
    description: "Co-ords — a delicate crochet-knit top paired with a matching skirt.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a11-delicate-crochet-skirt.png", "Delicate Crochet Top with Skirt")],
    variants: [{ size: "M", sku: "A11", price: { amount: 4100, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual"],
  },
  {
    id: "gid://placeholder/Product/A12",
    handle: "floral-line-art-coord-set",
    title: "Floral Line Art Co-ord Set",
    description:
      "Signature Floral Line Art Co-ord Set, crafted for women who love clean elegance with a modern touch.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a12-floral-line-art-coord.png", "Floral Line Art Co-ord Set")],
    variants: [{ size: "L", sku: "A12", price: { amount: 2859, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "floral"],
  },
  {
    id: "gid://placeholder/Product/A13",
    handle: "premium-floral-embroidered-coord",
    title: "Premium Floral Embroidered Co-ord",
    description:
      "Introducing our Premium Floral Embroidered Co-ord Set, made for the woman who loves comfort, confidence & timeless elegance.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a13-premium-floral-embroidered-coord.png", "Premium Floral Embroidered Co-ord")],
    variants: [{ size: "L", sku: "A13", price: { amount: 2859, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "floral"],
  },
  {
    id: "gid://placeholder/Product/A14",
    handle: "floral-embroidered-coord-set",
    title: "Floral Embroidered Co-ord Set",
    description:
      "The beauty of minimal luxury with our Floral Embroidered Co-ord Set, designed for women who believe elegance never goes out of style.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a14-floral-embroidered-coord-minimal.png", "Floral Embroidered Co-ord Set")],
    variants: [{ size: "Free Size", sku: "A14", price: { amount: 1889, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "floral"],
  },
  {
    id: "gid://placeholder/Product/A15-Blue",
    handle: "blue-crochet-net-coord-set",
    title: "Blue Crochet Net Co-ord Set",
    description:
      "Introducing our Signature Crochet Co-ord Set, crafted for women who love effortless style with timeless comfort.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a15-blue-crochet-coord.png", "Blue Crochet Net Co-ord Set")],
    variants: [{ size: "Free Size", sku: "A15-Blue", price: { amount: 2200, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "color-family:A15"],
    needsReview: "Source sheet codes all three Net Co-ord colorways (Blue/Pink/Light Pink) as plain \"A15\" — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A15-Pink",
    handle: "pink-crochet-net-coord-set",
    title: "Pink Crochet Net Co-ord Set",
    description:
      "Introducing our Signature Crochet Co-ord Set, crafted for women who love effortless style with timeless comfort.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a15-pink-crochet-coord.png", "Pink Crochet Net Co-ord Set")],
    variants: [{ size: "Free Size", sku: "A15-Pink", price: { amount: 2200, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "color-family:A15"],
    needsReview: "Source sheet codes all three Net Co-ord colorways (Blue/Pink/Light Pink) as plain \"A15\" — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A15-LightPink",
    handle: "light-pink-crochet-net-coord-set",
    title: "Light Pink Crochet Net Co-ord Set",
    description:
      "Introducing our Signature Crochet Co-ord Set, crafted for women who love effortless style with timeless comfort.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a15-light-pink-crochet-coord.png", "Light Pink Crochet Net Co-ord Set")],
    variants: [{ size: "Free Size", sku: "A15-LightPink", price: { amount: 2200, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "color-family:A15"],
    needsReview: "Source sheet codes all three Net Co-ord colorways (Blue/Pink/Light Pink) as plain \"A15\" — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A16",
    handle: "floral-sheer-shirt-coord-set",
    title: "Floral Sheer Shirt Co-ord Set",
    description:
      "Step into effortless luxury with our Embroidered Floral Sheer Shirt Co-ord Set, crafted for moments where simplicity makes a statement.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a16-floral-sheer-shirt-coord.png", "Floral Sheer Shirt Co-ord Set")],
    variants: [{ size: "L", sku: "A16", price: { amount: 3100, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["co-ord", "casual", "floral"],
  },
  {
    id: "gid://placeholder/Product/A17",
    handle: "delicate-floral-charm-dress",
    title: "Delicate Floral Charm Dress",
    description:
      "A dress made for the moments where elegance feels natural. Light, graceful & beautifully detailed with delicate floral charm.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a17-delicate-floral-charm.png", "Delicate Floral Charm Dress")],
    variants: [{ size: "Free Size", sku: "A17", price: { amount: 1895, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion", "floral"],
    needsReview: "Source sheet's code reads \"elicate floral charm\" — corrected to \"Delicate\" here as an evident missing-letter typo, not a guess at a different word.",
  },
  {
    id: "gid://placeholder/Product/A18",
    handle: "soft-flowy-silhouette-dress",
    title: "Soft Flowy Silhouette Dress",
    description: "Made for the moments where you don't just arrive, you make a statement.",
    collection: "party-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a18-soft-flowy-silhouette.png", "Soft Flowy Silhouette Dress")],
    variants: [{ size: "Free Size", sku: "A18", price: { amount: 2259, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["occasion"],
  },
  {
    id: "gid://placeholder/Product/A19",
    handle: "fabric-artistic-silhouette-dress",
    title: "Artistic Detailing Silhouette Dress",
    description:
      "Soft premium fabric, artistic detailing, and a silhouette made for those effortless everyday statements. Because elegance is always in the little details.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a19-fabric-artistic-silhouette.png", "Artistic Detailing Silhouette Dress")],
    variants: [{ size: "L", sku: "A19", price: { amount: 1550, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
    needsReview: "Source sheet's code reads \"abric, artistic detailing...\" — corrected to \"Fabric\" here as an evident missing-letter typo, not a guess at a different word.",
  },
  {
    id: "gid://placeholder/Product/A20",
    handle: "premium-knit-top",
    title: "Premium Knit Top",
    description: "Clean lines, soft comfort, and that timeless white charm. A premium knit top made for your everyday elegant moments.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a20-knit-top.png", "Premium Knit Top")],
    variants: [{ size: "M", sku: "A20", price: { amount: 1080, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual", "knitwear"],
  },
  {
    id: "gid://placeholder/Product/A21-PolkaDots",
    handle: "polka-dot-midi-dress",
    title: "Polka Dot Midi Dress",
    description: "Polka dots never go out of style. A classic look that brings elegance, confidence & a little charm to your everyday moments.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a21-polka-dots.png", "Polka Dot Midi Dress")],
    variants: [{ size: "L", sku: "A21-PolkaDots", price: { amount: 2550, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
    needsReview: "Source sheet codes this \"A21\", the same code used for the \"little blue, a little bloom\" floral midi below — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A21-Bloom",
    handle: "floral-bloom-midi-dress",
    title: "Floral Bloom Midi Dress",
    description: "Feel fresh, graceful & effortlessly beautiful in our White Elegance Floral Midi Dress.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a21-little-blue-bloom.png", "Floral Bloom Midi Dress")],
    variants: [{ size: "L", sku: "A21-Bloom", price: { amount: 1595, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual", "floral"],
    needsReview: "Source sheet codes this \"A21\", the same code used for \"Polka Dots\" above — confirm the client's real distinct codes.",
  },
  {
    id: "gid://placeholder/Product/A22",
    handle: "floral-midi-dress",
    title: "Floral Midi Dress",
    description: "Grace in every detail, beauty from every angle. A floral midi made for your everyday moments with effortless charm.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a22-floral-midi.png", "Floral Midi Dress")],
    variants: [{ size: "L", sku: "A22", price: { amount: 1699, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual", "floral"],
  },
  {
    id: "gid://placeholder/Product/A23-1",
    handle: "printed-flowy-silhouette-dress-1",
    title: "Printed Flowy Silhouette Dress",
    description:
      "Meet your everyday elegance with effortless prints and a flowy silhouette, made for every beautiful moment. A perfect blend of comfort, charm & style.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a23-1-prints-flowy-silhouette.png", "Printed Flowy Silhouette Dress")],
    variants: [{ size: "M", sku: "A23-1", price: { amount: 2539, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
  },
  {
    id: "gid://placeholder/Product/A23-2",
    handle: "printed-flowy-silhouette-dress-2",
    title: "Printed Flowy Silhouette Dress (Colorway 2)",
    description:
      "Meet your everyday elegance with effortless prints and a flowy silhouette, made for every beautiful moment. A perfect blend of comfort, charm & style.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a23-2-prints-flowy-silhouette.png", "Printed Flowy Silhouette Dress — colorway 2")],
    variants: [{ size: "M", sku: "A23-2", price: { amount: 2539, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
  },
  {
    id: "gid://placeholder/Product/A24",
    handle: "soft-details-graceful-patterns-dress",
    title: "Soft Details, Graceful Patterns Dress",
    description: "Soft details, graceful patterns, and a fit designed to move with your story.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a24-soft-details-graceful-patterns.png", "Soft Details, Graceful Patterns Dress")],
    variants: [{ size: "Free Size", sku: "A24", price: { amount: 2550, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
  },
  {
    id: "gid://placeholder/Product/A26",
    handle: "soft-grace-dress",
    title: "Soft Grace Dress",
    description: "For the mornings that start slow, the walks with no plans, and the moments where you simply feel like yourself.",
    collection: "casual-wear",
    hasPhoto: true,
    images: [img("/assets/images/products/a26-little-softness-grace.png", "Soft Grace Dress")],
    variants: [{ size: "Free Size", sku: "A26", price: { amount: 2750, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
    needsReview: "A25 does not appear in the source sheet (numbering jumps A24 → A26) — not fabricated here.",
  },
  {
    id: "gid://placeholder/Product/A27",
    handle: "pink-confidence-dress",
    title: "Pink Confidence Dress",
    description: "Sunny streets, favourite corners, random plans and that feeling of enjoying your own company.",
    collection: "casual-wear",
    hasPhoto: false,
    images: [img(null, "Pink Confidence Dress — photo coming soon")],
    variants: [{ size: "Free Size", sku: "A27", price: { amount: 3050, currencyCode: "INR" }, inventoryQuantity: null, available: true }],
    tags: ["casual"],
  },
];
