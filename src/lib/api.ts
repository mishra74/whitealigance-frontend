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

interface ApiProductSize {
  size: string;
  sku: string;
  qty: number;
}

interface ApiProduct {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  short_description: string |null;
  category_id: number;
  collection: Collection | null;
  sku: string;
  price: number | string;
  qty: number | null;
  status: number;
  is_featured: string;
  product_images: ApiProductImage[];
  sizes?: ApiProductSize[];
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

// The full set of sizes the admin's "Sizes & Stock" panel offers, in
// display order — kept in sync with ProductSize's backend enum.
const ALL_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"] as const;

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

    // "casual-wear" is a safe default for any legacy product that predates
    // the real admin-controlled collection field — never guess "party-wear".
    collection: product.collection ?? "casual-wear",

    hasPhoto: images.length > 0,

    images,

    // A product with at least one size configured (see admin's "Sizes &
    // Stock") always shows the full S/M/L/XL/XXL/XXXL row — sizes the admin
    // didn't check, or checked with zero stock, still appear but stay
    // unavailable (disabled), rather than just being left off the row. A
    // product with no sizes configured at all keeps the original single
    // "Free Size" variant, unchanged from before sizes existed.
    variants: product.sizes && product.sizes.length > 0
      ? ALL_SIZES.map((size) => {
          const configured = product.sizes!.find((s) => s.size === size);
          return {
            size,
            sku: configured?.sku ?? "",
            price: {
              amount: Number(product.price),
              currencyCode: "INR",
            },
            inventoryQuantity: configured?.qty ?? 0,
            available: product.status === 1 && !!configured && configured.qty > 0,
          };
        })
      : [
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
  // Party Wear/Casual Wear/search all render this list on pages already
  // marked force-dynamic — an hour-long cache here silently undid that,
  // so a newly-uploaded product could stay invisible on the storefront
  // for up to an hour after the admin added it.
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
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

/**
 * Fetches one product by slug plus its similar-products list in a single
 * request, instead of fetching the entire catalog (getApiProductByHandle)
 * and refiltering it client-side for "similar products".
 */
export async function getApiProductWithSimilar(
  handle: string
): Promise<{ product: Product; similar: Product[] } | undefined> {
  const response = await fetch(`${API_URL}/products/${handle}`, {
    cache: "no-store",
  });

  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error("Unable to fetch product");

  const json: { data: { product: ApiProduct; similar: ApiProduct[] } } =
    await response.json();

  return {
    product: normalize(json.data.product),
    similar: json.data.similar.map(normalize),
  };
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  showHome: "Yes" | "No";
}

export async function getApiCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];

  const json: { data: { categories: ApiCategory[] } } = await response.json();
  return json.data.categories.map((c) => ({
    ...c,
    image: c.image ? `${baseUrl()}/uploads/category/${c.image}` : null,
  }));
}

/* ===========================
   CMS pages (Privacy Policy, Returns, Terms, etc.)
=========================== */

export interface ApiPage {
  id: number;
  name: string;
  slug: string;
  content: string | null;
}

export async function getApiPage(slug: string): Promise<ApiPage | undefined> {
  const response = await fetch(`${API_URL}/pages/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return undefined;

  const json: { status: boolean; page: ApiPage } = await response.json();
  return json.status ? json.page : undefined;
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

export async function googleLogin(idToken: string) {
  const response = await fetch(`${API_URL}/account/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  return response.json();
}

/* ===========================
   Authenticated requests
=========================== */

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string> | undefined) ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, json };
}

export async function apiLogout() {
  return authFetch("/account/logout", { method: "POST" });
}

export async function apiUpdateProfile(data: {
  name: string;
  email: string;
  phone: string;
}) {
  return authFetch("/account/update-profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiChangePassword(data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) {
  return authFetch("/account/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ===========================
   Addresses
=========================== */

export interface ApiAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export async function apiGetAddresses() {
  return authFetch("/addresses");
}

export async function apiAddAddress(
  input: Omit<ApiAddress, "id" | "isDefault">,
  makeDefault = false
) {
  return authFetch("/addresses", {
    method: "POST",
    body: JSON.stringify({ ...input, make_default: makeDefault }),
  });
}

export async function apiUpdateAddress(
  id: string,
  input: Omit<ApiAddress, "id" | "isDefault">
) {
  return authFetch(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function apiDeleteAddress(id: string) {
  return authFetch(`/addresses/${id}`, { method: "DELETE" });
}

export async function apiSetDefaultAddress(id: string) {
  return authFetch(`/addresses/${id}/default`, { method: "POST" });
}

/* ===========================
   Wishlist
=========================== */

export async function apiGetWishlist() {
  return authFetch("/wishlist");
}

export async function apiToggleWishlist(handle: string) {
  return authFetch("/wishlist", {
    method: "POST",
    body: JSON.stringify({ handle }),
  });
}

export async function apiRemoveWishlist(handle: string) {
  return authFetch(`/wishlist/${handle}`, { method: "DELETE" });
}

/* ===========================
   Checkout
=========================== */

export interface PlaceOrderPayload {
  contact_email: string;
  contact_phone: string;
  address_id?: string;
  shipping?: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: { sku: string; qty: number }[];
  coupon_code?: string;
  notes?: string;
}

export async function apiPlaceOrder(payload: PlaceOrderPayload) {
  return authFetch("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface RazorpayOrderResponse {
  status: boolean;
  order_id?: number;
  razorpay_order_id?: string;
  razorpay_key?: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: { name: string; email: string; contact: string };
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Creates the (unpaid) order + a matching Razorpay order server-side, for
 * the caller to open the Standard Checkout modal with (checkout.js) — the
 * customer never leaves the page.
 */
export async function apiRazorpayOrder(payload: PlaceOrderPayload) {
  return authFetch("/payments/razorpay/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface RazorpayVerifyPayload {
  order_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Verifies the Standard Checkout signature server-side and marks the order
 * paid — called from the modal's success handler.
 */
export async function apiRazorpayVerify(payload: RazorpayVerifyPayload) {
  return authFetch("/payments/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiApplyCoupon(code: string, subtotal: number) {
  return authFetch("/coupons/apply", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

/* ===========================
   My Orders
=========================== */

export interface ApiOrder {
  id: number;
  subtotal: number;
  shipping: number;
  coupon_code: string | null;
  discount: number;
  grand_total: number;
  payment_status: "paid" | "not paid";
  payment_method: "cod" | "online";
  status: "pending" | "shipped" | "delivered" | "cancelled";
  shipped_date: string | null;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  notes: string | null;
  created_at: string;
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  name: string;
  size: string | null;
  qty: number;
  price: number;
  total: number;
}

export async function apiGetOrders() {
  return authFetch("/orders");
}

export async function apiGetOrder(id: string | number) {
  return authFetch(`/orders/${id}`);
}

/* ===========================
   Contact
=========================== */

export async function apiSendContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return authFetch("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}