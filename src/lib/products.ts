export type { Collection, Product } from "../../products";
import type { Collection, Product } from "../../products";

import { formatINR } from "./format";
import {
  getApiProducts,
  getApiProductByHandle,
} from "./api";

/* ===========================
   Product APIs
=========================== */

export async function fetchProducts(): Promise<Product[]> {
  return getApiProducts();
}

export async function getProducts(): Promise<Product[]> {
  return await getApiProducts();
}

export async function getProductsByCollection(
  collection: Collection
): Promise<Product[]> {
  const products = await getApiProducts();

  return products.filter(
    (product) => product.collection === collection
  );
}

export async function getProductByHandle(
  handle: string
): Promise<Product | undefined> {
return getApiProductByHandle(handle);}

/* ===========================
   Collection
=========================== */

export function collectionLabel(collection: Collection): string {
  switch (collection) {
    case "party-wear":
      return "Party Wear";

    case "casual-wear":
      return "Casual Wear";

    default:
      return "";
  }
}

export function collectionHref(collection: Collection): string {
  return `/${collection}`;
}

/* ===========================
   Similar Products
=========================== */

export async function getSimilarProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const products = await getApiProducts();

  return products
    .filter(
      (item) =>
        item.collection === product.collection &&
        item.id !== product.id
    )
    .slice(0, limit);
}

/* ===========================
   Price
=========================== */

export function formatPrice(product: Product): string {
  return formatINR(
    product.variants?.[0]?.price?.amount ?? 0
  );
}

/* ===========================
   Images
=========================== */

export function productImageSrc(
  product: Product
): string | undefined {
  if (!product.hasPhoto) return undefined;

  return product.images?.[0]?.url ?? undefined;
}

export function productImageSrcs(
  product: Product
): { url: string; altText: string }[] {
  if (!product.hasPhoto) return [];

  return product.images
    .filter((image) => image.url !== null)
    .map((image) => ({
      url: image.url!,
      altText: image.altText,
    }));
}

/* ===========================
   Eyebrow
=========================== */

const GENERIC_TAGS = new Set([
  "occasion",
  "casual",
  "featured",
]);

export function productEyebrow(
  product: Product,
  fallback: string
): string {
  const tag = product.tags.find(
    (tag) =>
      !GENERIC_TAGS.has(tag) &&
      !tag.startsWith("color-family:")
  );

  if (!tag) return fallback;

  return tag
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/* ===========================
   Sorting
=========================== */

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export const SORT_OPTIONS: {
  value: SortKey;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Sort: Featured",
  },
  {
    value: "name-asc",
    label: "Name: A to Z",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
];

export function sortProducts(
  products: Product[],
  sort: SortKey
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) =>
          (a.variants?.[0]?.price?.amount ?? 0) -
          (b.variants?.[0]?.price?.amount ?? 0)
      );

    case "price-desc":
      return sorted.sort(
        (a, b) =>
          (b.variants?.[0]?.price?.amount ?? 0) -
          (a.variants?.[0]?.price?.amount ?? 0)
      );

    case "name-asc":
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    default:
      return sorted;
  }
}