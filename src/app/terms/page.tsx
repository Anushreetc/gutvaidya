import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using the ${BUSINESS.brandName} website and buying our products.`,
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      path="/terms"
      intro={`These terms apply to your use of the ${BUSINESS.brandName} website and to every purchase you make from ${BUSINESS.legalName}. By using the website or placing an order, you agree to them.`}
    >
      <section>
        <h2>1. About us</h2>
        <p>
          {BUSINESS.legalName} sells Ayurvedic nutrition and health-mix products in India.
          Our food products are manufactured and sold under FSSAI Licence No. {BUSINESS.fssaiLicense}.
          {BUSINESS.gstin ? ` GSTIN: ${BUSINESS.gstin}.` : ''}
        </p>
        <p>
          <strong>Registered address:</strong> {BUSINESS.registeredAddress}.<br />
          <strong>Contact:</strong> <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>, {BUSINESS.supportPhone} ({BUSINESS.supportHours}).
        </p>
      </section>

      <section>
        <h2>2. Your account</h2>
        <ul>
          <li>You must be at least 18 years old to create an account and place orders.</li>
          <li>Please give accurate name, contact and delivery details. We are not responsible for failed deliveries caused by incorrect details.</li>
          <li>Keep your password confidential. You are responsible for activity on your account.</li>
        </ul>
      </section>

      <section>
        <h2>3. Products and health information</h2>
        <ul>
          <li>Our products are food and nutritional supplements. They are <strong>not medicines</strong> and are not intended to diagnose, treat, cure or prevent any disease.</li>
          <li>Information on this website is for general wellness purposes and is not medical advice. If you are pregnant, nursing, taking medication or have a medical condition, consult your doctor before use.</li>
          <li>Please read the ingredient list for allergens before buying. Individual results may vary.</li>
          <li>Product photos are for illustration; packaging may vary slightly.</li>
        </ul>
      </section>

      <section>
        <h2>4. Prices and payment</h2>
        <ul>
          <li>All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. Shipping charges, if any, are shown at checkout.</li>
          <li>Payments are processed securely by Razorpay (cards, UPI, net banking and wallets). An order is confirmed only after payment succeeds.</li>
          <li>We may change prices at any time, but the price you pay is the one shown at checkout when you place your order.</li>
          <li>If a product is listed at an obviously wrong price because of an error, or goes out of stock, we may cancel the order and refund you in full.</li>
        </ul>
      </section>

      <section>
        <h2>5. Coupons and offers</h2>
        <p>Coupons are subject to their stated minimum order value, discount cap, usage limit and validity. Only one coupon applies per order, and coupons have no cash value.</p>
      </section>

      <section>
        <h2>6. Shipping, cancellations and refunds</h2>
        <p>
          Delivery is covered by our <Link href="/shipping-policy">Shipping &amp; Delivery Policy</Link>, and cancellations,
          returns and refunds by our <Link href="/refund-policy">Cancellation &amp; Refund Policy</Link>. Both form part of these terms.
        </p>
      </section>

      <section>
        <h2>7. Acceptable use</h2>
        <p>Do not misuse the website: no attempts to disrupt it, access other people&apos;s accounts or data, place fraudulent orders, or copy our content, images or brand for commercial use without permission.</p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>To the extent permitted by law, our total liability for any order is limited to the amount you paid for that order. We are not liable for indirect losses, or for delays caused by events outside our control such as natural disasters, strikes or courier disruptions.</p>
      </section>

      <section>
        <h2>9. Governing law</h2>
        <p>These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts at {BUSINESS.jurisdiction}.</p>
      </section>

      <section>
        <h2>10. Changes</h2>
        <p>We may update these terms from time to time. The version on this page when you place an order applies to that order.</p>
      </section>
    </PolicyPage>
  );
}
