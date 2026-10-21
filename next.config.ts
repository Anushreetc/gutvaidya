import type { NextConfig } from "next";

// Content-Security-Policy for a Next.js + Razorpay + Supabase + Resend + Cloudinary site.
// 'unsafe-inline' on style-src is kept because Next.js and Tailwind inject inline styles;
// 'unsafe-inline' on script-src is kept because Next.js injects inline bootstrap scripts.
// Everything else is locked down to known origins.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://checkout.razorpay.com https://*.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net`,
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://*.razorpay.com https://www.google-analytics.com https://*.google-analytics.com https://connect.facebook.net https://www.facebook.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].filter(Boolean).join("; ");

// Browser security headers applied to every response
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Stop other sites from embedding this one in a frame (clickjacking); legacy backstop for CSP's frame-ancestors
  { key: "X-Frame-Options", value: "DENY" },
  // Don't let browsers guess content types
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
