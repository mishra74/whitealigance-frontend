import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>WHITE ELEGANCE 24</div>
          <p className={styles.blurb}>
            A luxury fashion label devoted exclusively to elegant white
            clothing for women.
          </p>
        </div>

        <div className={styles.col}>
          <h5 className={styles.colTitle}>Shop</h5>
          <Link href="/party-wear">Party Wear</Link>
          <Link href="/casual-wear">Casual Wear</Link>
          <a href="#">New Arrivals</a>
        </div>

        <div className={styles.col}>
          <h5 className={styles.colTitle}>Company</h5>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className={styles.col}>
          <h5 className={styles.colTitle}>Contact</h5>
          <a href="https://www.whiteelegance24.com" target="_blank" rel="noopener noreferrer">
            www.whiteelegance24.com
          </a>
          <a href="https://wa.me/918976839119" target="_blank" rel="noopener noreferrer">
            +91 89768 39119 (WhatsApp)
          </a>
          <a href="mailto:amruta@whiteelegance24.com">
            amruta@whiteelegance24.com
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} WHITE ELEGANCE 24. All rights reserved.</span>
        <span>
          <Link href="/pages/privacy-policy">Privacy Policy</Link> ·{" "}
          <Link href="/pages/shipping-policy">Shipping</Link> ·{" "}
          <Link href="/pages/returns">Returns</Link> ·{" "}
          <Link href="/pages/terms-conditions">Terms &amp; Conditions</Link>
        </span>
      </div>
    </footer>
  );
}
