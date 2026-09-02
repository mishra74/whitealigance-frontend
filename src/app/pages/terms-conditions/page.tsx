import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | WHITE ELEGANCE 24",
};

export default function TermsConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="September 2, 2026"
    >
      <p>
        These Terms &amp; Conditions govern your use of the White Elegance
        24 website, operated by [COMPANY LEGAL NAME]. By accessing or using
        this website, you agree to be bound by these terms.
      </p>

      <h3>1. Website Usage</h3>
      <p>
        You agree to use this website only for lawful purposes and in a way
        that does not infringe the rights of, or restrict or inhibit the
        use and enjoyment of this site by, any third party.
      </p>

      <h3>2. User Responsibilities</h3>
      <p>
        You are responsible for providing accurate information when
        creating an account or placing an order, and for maintaining the
        confidentiality of your account credentials.
      </p>

      <h3>3. Product Information</h3>
      <p>
        We make every effort to display product details, colours, and
        descriptions as accurately as possible. Actual colours may vary
        slightly due to screen settings and photography.
      </p>

      <h3>4. Pricing</h3>
      <p>
        All prices are listed in Indian Rupees (₹) and are subject to
        change without prior notice. We reserve the right to correct any
        pricing errors, even after an order has been placed.
      </p>

      <h3>5. Orders</h3>
      <p>
        Placing an order constitutes an offer to purchase. We reserve the
        right to accept, cancel, or refuse any order at our discretion, for
        reasons including but not limited to product availability, errors
        in pricing or product information, or suspected fraudulent
        activity.
      </p>

      <h3>6. Payments</h3>
      <p>
        We accept payments via Razorpay (cards, UPI, net banking, and other
        supported methods) and Cash on Delivery, where available. Online
        payments are processed securely by our payment partner; we do not
        store your payment credentials.
      </p>

      <h3>7. Order Cancellation</h3>
      <p>
        Orders may be cancelled [CANCELLATION WINDOW/CONDITIONS — e.g.
        before the order is shipped]. Please contact our support team as
        soon as possible if you wish to cancel an order.
      </p>

      <h3>8. Shipping</h3>
      <p>
        Shipping timelines and charges are described in our{" "}
        <Link href="/pages/shipping-policy" className="underline">
          Shipping Policy
        </Link>
        .
      </p>

      <h3>9. Returns &amp; Refunds</h3>
      <p>
        Returns, exchanges, and refunds are governed by our{" "}
        <Link href="/pages/returns" className="underline">
          Returns &amp; Exchanges
        </Link>{" "}
        policy.
      </p>

      <h3>10. Intellectual Property</h3>
      <p>
        All content on this website, including images, text, logos, and
        designs, is the property of [COMPANY LEGAL NAME] and may not be
        reproduced, copied, or used without prior written permission.
      </p>

      <h3>11. Website Availability</h3>
      <p>
        We aim to keep this website available at all times but do not
        guarantee uninterrupted access. We may suspend or restrict access
        for maintenance or other operational reasons.
      </p>

      <h3>12. Limitation of Liability</h3>
      <p>
        To the fullest extent permitted by law, White Elegance 24 shall not
        be liable for any indirect, incidental, or consequential damages
        arising from your use of this website or products purchased through
        it.
      </p>

      <h3>13. Governing Law</h3>
      <p>
        These terms are governed by the laws of [GOVERNING LAW / JURISDICTION].
      </p>

      <h3>14. Changes to These Terms</h3>
      <p>
        We may update these Terms &amp; Conditions from time to time. Changes
        will be posted on this page with an updated &ldquo;Last updated&rdquo;
        date.
      </p>

      <h3>15. Contact Us</h3>
      <p>For any questions about these Terms &amp; Conditions, contact us:</p>
      <ul>
        <li>Email: amruta@whiteelegance24.com</li>
        <li>Phone / WhatsApp: +91 89768 39119</li>
        <li>Registered address: [REGISTERED ADDRESS]</li>
      </ul>
    </LegalPageLayout>
  );
}
