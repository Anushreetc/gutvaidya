import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BUSINESS.brandName} collects, uses and protects your personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      path="/privacy-policy"
      intro={`${BUSINESS.legalName} ("${BUSINESS.brandName}", "we", "us") respects your privacy. This policy explains what personal information we collect when you visit our website or buy from us, how we use it, and the choices you have.`}
    >
      <section>
        <h2>1. Information we collect</h2>
        <ul>
          <li><strong>Account details:</strong> your name, email address, phone number and password (stored securely in encrypted form) when you create an account.</li>
          <li><strong>Order details:</strong> delivery address, phone number, the products you buy and your order history.</li>
          <li><strong>Payment details:</strong> payments are processed by Razorpay. We never see or store your full card, UPI or bank credentials; we only receive a payment reference and status.</li>
          <li><strong>Messages:</strong> anything you send through our contact form, email or phone.</li>
          <li><strong>Usage data:</strong> basic device, browser and page-visit information collected through cookies and analytics tools (such as Google Analytics and Meta Pixel) to understand and improve our website.</li>
        </ul>
      </section>

      <section>
        <h2>2. How we use your information</h2>
        <ul>
          <li>To process, ship and deliver your orders and send order and delivery updates.</li>
          <li>To manage your account and respond to your questions and complaints.</li>
          <li>To prevent fraud and keep our website secure.</li>
          <li>To send offers or newsletters, only where you have agreed; you can opt out at any time.</li>
          <li>To meet our legal, tax and accounting obligations.</li>
        </ul>
      </section>

      <section>
        <h2>3. Who we share it with</h2>
        <p>We do not sell your personal information. We share it only with service providers who help us run the store, and only as much as they need:</p>
        <ul>
          <li>Payment processing (Razorpay).</li>
          <li>Courier and logistics partners, to deliver your order.</li>
          <li>Hosting, database and email providers (such as Vercel, Supabase and Resend).</li>
          <li>Government or law-enforcement authorities where required by law.</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies</h2>
        <p>We use cookies to keep you signed in, remember your cart and measure website traffic. You can block or delete cookies in your browser settings, but parts of the site (such as sign-in and checkout) may stop working.</p>
      </section>

      <section>
        <h2>5. How long we keep it</h2>
        <p>We keep account information while your account is active, and order records for as long as required by Indian tax and accounting law. You can ask us to delete your account at any time.</p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>Your data is transmitted over encrypted (HTTPS) connections and stored with access controls so that only you and authorised staff can see your orders. No system is completely secure, but we take reasonable steps to protect your information.</p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>Under the Digital Personal Data Protection Act, 2023 and other applicable Indian law, you can ask to access, correct or delete your personal information, or withdraw consent for marketing. Email <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a> and we will respond within 30 days.</p>
      </section>

      <section>
        <h2>8. Grievance Officer</h2>
        <p>
          For any question or complaint about your personal information, please contact our Grievance Officer at <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>, phone {BUSINESS.supportPhone}.
          Postal address: {BUSINESS.legalName}, {BUSINESS.registeredAddress}.
        </p>
      </section>

      <section>
        <h2>9. Children</h2>
        <p>Our website is intended for adults. Products for children should be purchased by a parent or guardian.</p>
      </section>

      <section>
        <h2>10. Changes to this policy</h2>
        <p>We may update this policy from time to time. The &quot;Last updated&quot; date above shows when it last changed.</p>
      </section>
    </PolicyPage>
  );
}
