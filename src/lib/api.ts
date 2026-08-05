import type {
  Product,
  Collection,
  ProductImage,
} from "../../products";// export type Collection = "party-wear" | "casual-wear";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://admin.whiteelegenace24.com/api";

interface ApiProductImage {
  image: string;
}

interface ApiProduct {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  short_description: string |null;
  category_id: number;
  sku: string;
  price: number | string;
  qty: number | null;
  status: number;
  is_featured: string;
  product_images: ApiProductImage[];
}
interface ApiResponse {
  data: {
    products: ApiProduct[];
  };
}

function stripHtml(value?: string | null): string {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function baseUrl(): string {
  return API_URL.replace("/api", "");
}

function imageUrl(image?: string): string {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${baseUrl()}/uploads/product/large/${image}`;
}

function collection(category: number): Collection {
  return category === 24
    ? "party-wear"
    : "casual-wear";
}

function normalize(product: ApiProduct): Product {
  const images: ProductImage[] =
  product.product_images?.map((img) => ({
    url: imageUrl(img.image),
    altText: product.title,
  })) ?? [];

  return {
    id: String(product.id),

    handle: product.slug,

    title: product.title,

    description:
      stripHtml(product.description) ||
      stripHtml(product.short_description),

    collection: collection(product.category_id),

    hasPhoto: images.length > 0,

    images,

    variants: [
      {
        size: "Free Size",

        sku: product.sku,

        price: {
          amount: Number(product.price),
          currencyCode: "INR",
        },

        inventoryQuantity: product.qty,

        available: product.status === 1,
      },
    ],

    tags: [
      product.is_featured === "Yes"
        ? "featured"
        : "normal",
    ],
  };
}

export async function getApiProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch products");
  }

  const json: ApiResponse = await response.json();

  return json.data.products.map(normalize);
}

export async function getApiProductByHandle(
  handle: string
): Promise<Product | undefined> {
  const products = await getApiProducts();

  return products.find(
    (product) => product.handle === handle
  );
}

export async function getApiProductsByCollection(
  collectionName: Collection
): Promise<Product[]> {
  const products = await getApiProducts();

  return products.filter(
    (product) =>
      product.collection === collectionName
  );
} 
export async function login(params: { email: string; password: string }) {
  const { email, password } = params;
  console.log("Login request:", { email });

  const response = await fetch(`${API_URL}/account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();
  console.log("Login response:", json);

  return json;
}

export async function signup(params: {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const { name, phone, email, password, password_confirmation } = params;
  console.log("Signup request:", { name, phone, email });

  const response = await fetch(`${API_URL}/account/process-register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone, email, password, password_confirmation }),
  });

  const json = await response.json();
  console.log("Signup response:", json);

  return json;
}