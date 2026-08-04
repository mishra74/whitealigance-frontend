import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | WHITE ELEGANCE 24",
  description:
    "Get in touch with WHITE ELEGANCE 24 — website, WhatsApp, and email contact details.",
};

const CONTACT_ITEMS = [
  { label: "Website", value: "www.whiteelegance24.com", href: "https://www.whiteelegance24.com" },
  { label: "Phone / WhatsApp", value: "+91 89768 39119", href: "https://wa.me/918976839119" },
  { label: "Email", value: "amruta.nilatkar.47@gmail.com", href: "mailto:amruta.nilatkar.47@gmail.com" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-14 py-16 max-[1100px]:px-8 md:py-24">
      <div className="grid gap-16 md:grid-cols-2 md:gap-20">
        <div>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
            Get in Touch
          </span>
          <h1 className="my-3.5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
            We&apos;d love to hear from you.
          </h1>

          {CONTACT_ITEMS.map((item) => (
            <div key={item.label} className="mb-8">
              <h5 className="mb-2 text-[0.68rem] uppercase tracking-[0.14em] text-muted-bronze">
                {item.label}
              </h5>
              <a
                href={item.href}
                target={item.label === "Website" ? "_blank" : undefined}
                rel={item.label === "Website" ? "noopener noreferrer" : undefined}
                className="text-[1rem] hover:text-soft-gold"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
