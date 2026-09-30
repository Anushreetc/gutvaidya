import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: `How to cancel a ${BUSINESS.brandName} order, and when you are eligible for a replacement or refund.`,
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation & Refund Policy"
      path="/refund-policy"
      intro="We want you to be happy with every order. Because our products are food items, we cannot accept returns of opened products for hygiene and safety reasons, but we will always make things right if your order arrives damaged, defective or incorrect."
    >
      <section>
        <h2>1. Cancelling an order</h2>
        <ul>
          <li>You can cancel free of charge <strong>before your order is shipped</strong>. Contact us by email or phone with your order number.</li>
          <li>Once an order has been shipped it cannot be cancelled, but you may refuse delivery; the refund will then be the order value minus shipping charges.</li>
          <li>We may cancel an order if a product is out of stock, the delivery address is not serviceable, or payment verification fails. You will receive a full refund.</li>
        </ul>
      </section>

      <section>
        <h2>2. Damaged, defective or wrong products</h2>
        <p>If your order arrives damaged, tampered with, expired, or with the wrong item:</p>
        <ul>
          <li>Contact us within <strong>48 hours of delivery</strong> at <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a> or {BUSINESS.supportPhone}.</li>
          <li>Share your order number and clear photos of the product, packaging and shipping label. An unboxing video helps us resolve claims faster.</li>
          <li>Keep the product unopened (if the seal is intact) until we confirm.</li>
        </ul>
        <p>Once verified, we will send a free replacement or issue a full refund, whichever you prefer.</p>
      </section>

      <section>
        <h2>3. What is not eligible</h2>
        <ul>
          <li>Opened or used products, unless they are defective.</li>
          <li>Returns because of a change of mind, taste preference or expected results not being achieved.</li>
          <li>Claims raised more than 48 hours after delivery.</li>
        </ul>
      </section>

      <section>
        <h2>4. How refunds are paid</h2>
        <ul>
          <li>Approved refunds are initiated within <strong>2 business days</strong> of approval (or of cancellation).</li>
          <li>Refunds go back to your original payment method through Razorpay. Depending on your bank, it takes <strong>5–7 business days</strong> to appear in your account.</li>
          <li>We do not charge any fee for refunds on damaged, defective or wrong products.</li>
        </ul>
      </section>
    </PolicyPage>
  );
}
