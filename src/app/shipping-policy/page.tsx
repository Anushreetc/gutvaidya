import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: `Delivery charges, timelines and tracking for ${BUSINESS.brandName} orders across India.`,
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping & Delivery Policy"
      path="/shipping-policy"
      intro={`${BUSINESS.brandName} delivers across India through trusted courier partners. Here is what to expect after you place an order.`}
    >
      <section>
        <h2>1. Shipping charges</h2>
        <ul>
          <li><strong>Free shipping</strong> on orders of ₹{BUSINESS.freeShippingThreshold} or more (after discounts).</li>
          <li>A flat shipping fee of <strong>₹{BUSINESS.standardShippingFee}</strong> applies to orders below ₹{BUSINESS.freeShippingThreshold}.</li>
          <li>The exact charge is always shown at checkout before you pay.</li>
        </ul>
      </section>

      <section>
        <h2>2. Processing and delivery time</h2>
        <ul>
          <li>Orders are packed and dispatched within <strong>1–2 business days</strong> of payment (orders are not dispatched on Sundays or public holidays).</li>
          <li>Delivery usually takes <strong>3–7 business days</strong> after dispatch, depending on your location. Remote areas may take longer.</li>
          <li>These are estimates; courier delays caused by weather, strikes or other events outside our control can occur.</li>
        </ul>
      </section>

      <section>
        <h2>3. Tracking your order</h2>
        <p>You will receive an email when your order is confirmed and whenever its status changes (packed, shipped, out for delivery, delivered). Signed-in customers can also track orders under <a href="/account/orders">My Account → Order History</a>.</p>
      </section>

      <section>
        <h2>4. Delivery areas</h2>
        <p>We currently ship within India only. If your PIN code is not serviceable by our courier partners, we will contact you and refund your order in full.</p>
      </section>

      <section>
        <h2>5. Failed delivery</h2>
        <p>Please make sure your address and phone number are correct. If a delivery fails because of incorrect details or the recipient being unavailable after repeated attempts, the courier returns the parcel to us. We will then re-ship it (shipping charges may apply) or refund the order value minus shipping charges.</p>
      </section>

      <section>
        <h2>6. Damaged parcels</h2>
        <p>If the parcel looks damaged or tampered with at delivery, please note it with the courier and contact us within 48 hours. See our <a href="/refund-policy">Cancellation &amp; Refund Policy</a> for replacements and refunds.</p>
      </section>
    </PolicyPage>
  );
}
