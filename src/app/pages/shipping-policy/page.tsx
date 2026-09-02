import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Shipping Policy | WHITE ELEGANCE 24",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout title="Shipping Policy" lastUpdated="September 2, 2026">
      <p>
        This Shipping Policy explains how we process and deliver orders
        placed on the White Elegance 24 website.
      </p>

      <h3>1. Shipping Availability</h3>
      <p>
        We currently ship within India. International shipping is not
        available at this time.
      </p>

      <h3>2. Order Processing</h3>
      <p>
        Orders are processed once payment is confirmed (or immediately for
        Cash on Delivery orders). Processing time before an order is handed
        to our courier partner is [PROCESSING TIME, e.g. 1–2 business days].
      </p>

      <h3>3. Estimated Delivery Timelines</h3>
      <p>
        Estimated delivery timelines are [X–Y BUSINESS DAYS] from the date
        of dispatch, depending on your delivery location. These are
        estimates only and not a guaranteed delivery date.
      </p>

      <h3>4. Shipping Charges</h3>
      <p>
        Orders of ₹5,000 and above qualify for free shipping. Orders below
        this amount are charged a shipping fee, calculated and shown at
        checkout before you complete your order.
      </p>

      <h3>5. Order Tracking</h3>
      <p>
        Once your order is dispatched, you will be able to view its status
        from your account under &ldquo;My Orders&rdquo;. Tracking details, where
        available from our courier partner, will be shared with you.
      </p>

      <h3>6. Delivery Attempts</h3>
      <p>
        Our courier partners will make [NUMBER, e.g. 2–3] delivery attempts
        to the address provided. If delivery is unsuccessful after these
        attempts, the order may be returned to us, and our support team
        will contact you to arrange a resolution.
      </p>

      <h3>7. Incorrect or Incomplete Addresses</h3>
      <p>
        Please ensure your shipping address, pincode, and contact number are
        accurate at checkout. We are not responsible for delays or
        non-delivery caused by incorrect or incomplete address information
        provided by you.
      </p>

      <h3>8. Delayed Shipments</h3>
      <p>
        While we aim to deliver within the estimated timelines, deliveries
        may occasionally be delayed due to courier delays, weather,
        regional restrictions, or other circumstances beyond our control. We
        appreciate your patience in such cases.
      </p>

      <h3>9. Damaged Packages</h3>
      <p>
        If your order arrives visibly damaged, please do not accept the
        delivery if possible, or contact us within [NUMBER, e.g. 48 hours]
        of delivery with photos of the packaging and product, so we can
        assist you promptly.
      </p>

      <h3>10. Need Help?</h3>
      <p>For any shipping-related questions, please contact us:</p>
      <ul>
        <li>Email: amruta@whiteelegance24.com</li>
        <li>Phone / WhatsApp: +91 89768 39119</li>
      </ul>
    </LegalPageLayout>
  );
}
