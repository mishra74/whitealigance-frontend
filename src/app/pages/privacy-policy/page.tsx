import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | WHITE ELEGANCE 24",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="September 2, 2026">
      <p>
        This Privacy Policy explains how [COMPANY LEGAL NAME] (&ldquo;White
        Elegance 24&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;) collects, uses, and protects the information you
        share with us when you visit our website or place an order with us.
        By using this website, you agree to the practices described below.
      </p>

      <h3>1. Information We Collect</h3>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Personal information</strong> — your name, shipping and
          billing address, and other details you provide when creating an
          account or placing an order.
        </li>
        <li>
          <strong>Contact information</strong> — your email address and phone
          number, used to communicate about your orders and account.
        </li>
        <li>
          <strong>Order and payment information</strong> — the products you
          purchase, order value, and payment status. Payments are processed
          by our payment partner, Razorpay; we do not store your card, UPI,
          or net-banking credentials on our servers.
        </li>
        <li>
          <strong>Website usage information</strong> — pages you visit,
          products you view, and general device/browser information,
          collected to help us understand and improve the site.
        </li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process, fulfil, and deliver your orders</li>
        <li>Communicate with you about your orders, account, or enquiries</li>
        <li>Maintain and improve our website and product catalogue</li>
        <li>Prevent fraud and keep our services secure</li>
        <li>Send marketing communications, where you have opted in</li>
      </ul>

      <h3>3. Cookies</h3>
      <p>
        Our website may use cookies and similar technologies to keep you
        signed in, remember items in your cart, and understand how the site
        is used. You can control or disable cookies through your browser
        settings; doing so may affect some site features.
      </p>

      <h3>4. Data Protection</h3>
      <p>
        We take reasonable technical and organisational measures to protect
        your personal information from unauthorised access, loss, or misuse.
        No method of transmission or storage over the internet is completely
        secure, and we cannot guarantee absolute security.
      </p>

      <h3>5. Third-Party Services</h3>
      <p>
        We work with trusted third parties to operate our business,
        including payment processing (Razorpay) and shipping/courier
        partners for order delivery. These providers only receive the
        information necessary to perform their services and are expected to
        handle it responsibly.
      </p>

      <h3>6. Payment Information</h3>
      <p>
        All online payments on this website are processed securely through
        Razorpay. White Elegance 24 does not collect or store your full
        card, UPI, or bank account details at any point during checkout.
      </p>

      <h3>7. Marketing Communications</h3>
      <p>
        If you have opted in, we may send you emails or messages about new
        collections, offers, or updates. You can unsubscribe or opt out of
        marketing communications at any time by contacting us using the
        details below.
      </p>

      <h3>8. Data Retention</h3>
      <p>
        We retain personal information for as long as necessary to fulfil
        the purposes described in this policy, or as required by applicable
        law, after which it is deleted or anonymised.
      </p>

      <h3>9. Your Rights</h3>
      <p>
        You may request access to, correction of, or deletion of your
        personal information, subject to applicable law. To exercise these
        rights, please contact us using the details below.
      </p>

      <h3>10. Contact Us</h3>
      <p>
        If you have any questions about this Privacy Policy or how your
        information is handled, please reach out to us:
      </p>
      <ul>
        <li>Email: amruta@whiteelegance24.com</li>
        <li>Phone / WhatsApp: +91 89768 39119</li>
        <li>Registered address: [REGISTERED ADDRESS]</li>
      </ul>
    </LegalPageLayout>
  );
}
