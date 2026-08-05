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
}

/*
No static products.
Everything comes from API.
*/
export const PRODUCTS: Product[] = [];