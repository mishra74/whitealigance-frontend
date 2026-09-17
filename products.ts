export type Collection = "party-wear" | "casual-wear";

export interface ProductImage {
  url: string;
  altText: string;
}

export interface ProductVariant {
  size: string;
  sku: string;
  price: {
    amount: number;
    currencyCode: "INR";
  };
  inventoryQuantity: number | null;
  available: boolean;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  collection: Collection;

  hasPhoto: boolean;

  images: ProductImage[];

  variants: ProductVariant[];

  tags: string[];

  // Number of days the admin has set for delivery — null until they've set
  // one for this product (no courier integration to compute a real estimate).
  deliveryDays: number | null;
}

/*
No static products.
Everything comes from API.
*/
export const PRODUCTS: Product[] = [];