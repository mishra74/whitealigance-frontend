import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Returns & Exchanges | WHITE ELEGANCE 24",
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout
      title="Returns & Exchanges"
      lastUpdated="September 2, 2026"
    >
      <p>
        We want you to love your White Elegance 24 pieces. This policy
        explains how returns and exchanges work if something isn&apos;t
        right.
      </p>

      <h3>1. Return Eligibility</h3>
      <p>
        Items are eligible for return within [NUMBER, e.g. 7 days] of
        delivery, provided they meet the product condition requirements
        below.
      </p>

      <h3>2. Exchange Eligibility</h3>
      <p>
        Exchanges (for a different size, where available) can be requested
        within the same [NUMBER, e.g. 7-day] window, subject to stock
        availability for the requested size.
      </p>

      <h3>3. Product Condition</h3>
      <p>
        Returned or exchanged items must be unused, unwashed, unaltered, and
        in their original condition with all original tags and packaging
        intact.
      </p>

      <h3>4. Non-Returnable Items</h3>
      <p>
        Certain items may not be eligible for return or exchange, including
        items marked as final sale, altered/customised pieces, and items
        returned outside the eligible window or without original tags.
      </p>

      <h3>5. How to Initiate a Return or Exchange</h3>
      <p>
        To start a return or exchange, contact our support team with your
        order number and reason for return. We will guide you through the
        next steps, including pickup or drop-off arrangements where
        applicable.
      </p>

      <h3>6. Refund Process</h3>
      <p>
        Once the returned item is received and inspected, we will notify
        you of the approval status of your refund.
      </p>

      <h3>7. Refund Timeline</h3>
      <p>
        Approved refunds are processed within [NUMBER, e.g. 5–7 business
        days] to your original payment method. For Cash on Delivery orders,
        refunds will be processed via [REFUND METHOD, e.g. bank transfer]
        after you share the required details.
      </p>

      <h3>8. Return Shipping Charges</h3>
      <p>
        [RETURN SHIPPING CHARGE DETAILS — e.g. who bears the cost of return
        shipping in each case].
      </p>

      <h3>9. Damaged or Incorrect Products</h3>
      <p>
        If you receive a damaged, defective, or incorrect product, please
        contact us within [NUMBER, e.g. 48 hours] of delivery with photos of
        the product and packaging, and we will arrange a replacement or
        refund at no additional cost to you.
      </p>

      <h3>10. Need Help?</h3>
      <p>For any return or exchange requests, please contact us:</p>
      <ul>
        <li>Email: amruta@whiteelegance24.com</li>
        <li>Phone / WhatsApp: +91 89768 39119</li>
      </ul>
    </LegalPageLayout>
  );
}
