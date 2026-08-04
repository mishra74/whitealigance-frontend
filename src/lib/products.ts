import type { Collection, Product } from "../../products";
import { formatINR } from "./format";
import { getApiProductByHandle, getApiProducts } from "./api";

/* Fetch all products from API */
export async function fetchProducts(): Promise<Product[]> {
  return getApiProducts();
}

export async function getProducts(): Promise<Product[]> {
  return getApiProducts();
}

/* Filter by collection */
export async function getProductsByCollection(
  collection: Collection
): Promise<Product[]> {
  const products = await getProducts();

  return products.filter(
    (product) => product.collection === collection
  );
}

/* Single product */
export async function getProductByHandle(
  handle: string
): Promise<Product | undefined> {
  return getApiProductByHandle(handle);
}

/* Collection label */
export function collectionLabel(collection: Collection): string {
  return collection === "party-wear"
    ? "Party Wear"
    : "Casual Wear";
}

/* Collection URL */
export function collectionHref(collection: Collection): string {
  return `/${collection}`;
}

/* Similar products */
export async function getSimilarProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const products = await getProducts();

  return products
    .filter(
      (item) =>
        item.collection === product.collection &&
        item.id !== product.id
    )
    .slice(0, limit);
}

/* Price */
export function formatPrice(product: Product): string {
  return formatINR(product.variants[0]?.price.amount ?? 0);
}

/* Main image */
export function productImageSrc(
  product: Product
): string | undefined {
  return product.images[0]?.url;
}

/* Gallery images */
export function productImageSrcs(
  product: Product
): { url: string; altText: string }[] {
  return product.images.map((image) => ({
    url: image.url,
    altText: image.altText,
  }));
}

/* Eyebrow */
const GENERIC_TAGS = new Set(["occasion", "casual"]);

export function productEyebrow(
  product: Product,
  fallback: string
): string {
  const tag = product.tags.find(
    (t) =>
      !GENERIC_TAGS.has(t) &&
      !t.startsWith("color-family:")
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

/* Sorting */
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
          a.variants[0].price.amount -
          b.variants[0].price.amount
      );

    case "price-desc":
      return sorted.sort(
        (a, b) =>
          b.variants[0].price.amount -
          a.variants[0].price.amount
      );

    case "name-asc":
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    default:
      return sorted;
  }
}