# Gut Vaidya — Launch Checklist

Everything that must be true before pointing a real customer at thegutvaidya.com.

## 1. Razorpay (payments)

- [ ] In Razorpay Dashboard, complete KYC and activate **Live Mode**.
- [ ] Generate **Live API keys** (Settings → API Keys).
- [ ] In Vercel → Project → Settings → Environment Variables (Production), set:
  - `RAZORPAY_KEY_ID` = `rzp_live_...`
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_live_...` (same value)
  - `RAZORPAY_KEY_SECRET` = live secret
- [ ] Register a webhook in Razorpay Dashboard → Settings → Webhooks:
  - URL: `https://www.thegutvaidya.com/api/razorpay/webhook`
  - Events: `payment.captured`, `order.paid`
  - Set the webhook secret and copy the same value into Vercel env
    `RAZORPAY_WEBHOOK_SECRET`.

## 2. Supabase (database & auth)

- [ ] Confirm these migrations have run against **production** Supabase (SQL editor):
  - `supabase/schema.sql`
  - `supabase/migrations/20260930_launch_fixes.sql`
  - `supabase/migrations/20260930_security_advisor.sql`
- [ ] Sign up on the live site with the admin email (so a `profiles` row exists).
- [ ] Edit `supabase/migrations/20261018_promote_admin.sql`, replace
  `REPLACE_ME@thegutvaidya.com` with the real email, run it in the SQL editor.
- [ ] In Supabase → Auth → URL Configuration:
  - Site URL: `https://www.thegutvaidya.com`
  - Additional redirect URLs: `https://www.thegutvaidya.com/auth/callback`,
    `https://thegutvaidya.com/auth/callback`
- [ ] In Supabase → Auth → Providers → Email: enable **Captcha protection**
  (hCaptcha or Turnstile) to stop credential stuffing / signup bots.
- [ ] In Vercel env, confirm `SUPABASE_SERVICE_ROLE_KEY` is **not** exposed to
  Preview deploys that aren't gated.

## 3. Resend (transactional email)

- [ ] In Resend Dashboard, verify the domain `thegutvaidya.com` (add the SPF,
  DKIM, and DMARC DNS records shown there).
- [ ] Confirm `RESEND_FROM_EMAIL` (e.g. `Gut Vaidya <orders@thegutvaidya.com>`)
  uses the verified domain.
- [ ] Send one test order and confirm the confirmation email actually arrives
  (check spam folder too).

## 4. Vercel environment variables (Production scope)

Confirm all of these are set in Vercel → Project → Settings → Environment
Variables (Production). Preview/Dev values should be separate test keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `NEXT_PUBLIC_SITE_URL` = `https://www.thegutvaidya.com`
- (optional) `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
- (optional) `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## 5. DNS & SSL

- [ ] `thegutvaidya.com` and `www.thegutvaidya.com` both point to Vercel
  (apex via A record to `76.76.21.21`, `www` as CNAME to `cname.vercel-dns.com`).
- [ ] One is set as the primary domain; the other 301-redirects to it in Vercel
  → Project → Settings → Domains.
- [ ] SSL certificate is issued (automatic in Vercel) and HTTPS is forced.

## 6. Legal pages

- [ ] `/privacy-policy`, `/refund-policy`, `/shipping-policy`, `/terms` all
  contain final copy specific to Gut Vaidya (not placeholder text).
- [ ] All four links are reachable from the footer on every page — required by
  Razorpay for an activated merchant.

## 7. Pre-launch smoke test (on the live URL)

- [ ] Place one real ₹1 order with a live card → payment succeeds → order
  confirmation email arrives.
- [ ] Order shows up in `/admin/orders` with `payment_status = paid` and the
  product's `stock_quantity` has decremented by the quantity ordered.
- [ ] Kill the browser tab the moment Razorpay returns success → the webhook
  still marks the order paid (watch Vercel logs for the "Webhook recovered
  order" line).
- [ ] Sign up a brand-new account → cannot reach `/admin`; `profiles.role` is
  `customer`.
- [ ] Submit a product review while signed in → appears unapproved in
  `/admin/reviews`; approving makes it visible on the storefront.
- [ ] Hammer the contact form 6× in an hour from one IP → the 6th gets a 429.
- [ ] `curl -sI https://www.thegutvaidya.com | grep -i content-security` →
  the response includes the full CSP header.
- [ ] View page source on a product page → no `SUPABASE_SERVICE_ROLE_KEY` and
  no `RAZORPAY_KEY_SECRET` anywhere.

## 8. Nice-to-haves (ok to defer)

- [ ] Set up a Supabase daily DB backup (Settings → Database → Backups).
- [ ] Add Sentry or Vercel Observability for error alerting.
- [ ] Point a status / uptime monitor at `/` and `/api/products`.
- [ ] Delete the stale `out/` directory and
  `src/components/HeroSection.carousel.backup.tsx` once you're sure you
  don't need them.
