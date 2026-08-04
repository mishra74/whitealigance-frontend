

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getBaseUrl(): string {
  return API_URL.replace(/\/api\/?$/, "");
}

function buildImageUrl(filename?: string | null): string | undefined {
  if (!filename) return undefined;

  if (/^https?:\/\//i.test(filename)) {
    return filename;
  }

  const url = `${getBaseUrl()}/uploads/product/large/${filename}`;

  console.log("Image URL:", url);

  return url;
}

function inferCollection(product: Record<string, unknown>): Collection {
  const haystack = [
    typeof product.title === "string" ? product.title : "",
    typeof product.description === "string" ? product.description : "",
    typeof product.short_description === "string" ? product.short_description : "",
    typeof product.slug === "string" ? product.slug : "",
  ]
    .join(" ")
    .toLowerCase();

  if (/party|gown|cocktail|evening|festive|bridal|occasion/.test(haystack)) {
    return "party-wear";
  }

  if (/casual|office|daily|suit|coord|co-ord|kurta|lounge/.test(haystack)) {
    return "casual-wear";
  }

  return "casual-wear";
}

function normalizeApiProduct(product: Record<string, unknown>): Product {
  const title =
    typeof product.title === "string"
      ? product.title
      : "Untitled Product";

  const handle =
    typeof product.slug === "string" && product.slug
      ? product.slug
      : `product-${product.id}`;

  const description = stripHtml(
    typeof product.description === "string"
      ? product.description
      : typeof product.short_description === "string"
      ? product.short_description
      : title
  );

  const price = Number(product.price ?? 0);

  const qty = Number(product.qty ?? 0);

  const imagesArray = Array.isArray(product["product_images"])
    ? (product["product_images"] as Array<Record<string, unknown>>)
    : [];

  const images = imagesArray
    .map((img) => {
      const filename =
        typeof img.image === "string"
          ? img.image
          : undefined;

      if (!filename) return null;

      return {
        url: buildImageUrl(filename)!,
        altText: title,
      };
    })
    .filter(
      (
        image
      ): image is {
        url: string;
        altText: string;
      } => image !== null
    );

  return {
    id: String(product.id ?? handle),

    handle,

    title,

    description,

    collection: inferCollection(product),

    hasPhoto: images.length > 0,

    images,

    variants: [
      {
        size: "Standard",

        sku:
          typeof product.sku === "string"
            ? product.sku
            : String(product.id ?? handle),

        price: {
          amount: Number.isFinite(price) ? price : 0,
          currencyCode: "INR",
        },

        inventoryQuantity: Number.isFinite(qty)
          ? qty
          : null,

        available: Number(product.status ?? 1) === 1,
      },
    ],

    tags: [
      inferCollection(product),
      String(product.is_featured).toLowerCase() === "yes"
        ? "featured"
        : "",
    ].filter(Boolean),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    const payload = await response.json();

    console.log("Payload", payload);

    const products = Array.isArray(payload?.data?.products)
      ? payload.data.products
      : [];

    return products.map((item: Record<string, unknown>) =>
      normalizeApiProduct(item)
    );
  } catch (err) {
    console.error(err);
    return PRODUCTS;
  }
}

export async function getApiProducts() {
  return getProducts();
}

export async function getApiProductsByCollection(collection: Collection) {
  const products = await getProducts();
  return products.filter((product: Product) => product.collection === collection);
}

export async function getApiProductByHandle(handle: string) {
  const products = await getProducts();
  return products.find((product: Product) => product.handle === handle);
}

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }

  return response.json();
}

export async function apiPost(endpoint: string, body: unknown) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}