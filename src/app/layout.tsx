import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Analytics from "@/components/Analytics";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thegutvaidya.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GutVaidya | Traditional Health Mix & Wholesome Wellness",
    template: "%s | GutVaidya",
  },
  description:
    "Nourish your body with GutVaidya Health Mix. Formulated with 36+ natural sprouted grains, millets, nuts, and Ayurvedic herbs to nurture gut flora, immunity, and daily energy.",
  keywords: [
    "Gut health mix",
    "Ayurvedic health mix",
    "Sprouted millets porridge",
    "Traditional wellness India",
    "Natural gut flora supplement",
    "Sattu health drink",
    "GutVaidya",
  ],
  authors: [{ name: "GutVaidya Wellness" }],
  creator: "GutVaidya",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "GutVaidya",
    title: "GutVaidya | Traditional Health Mix & Wellness",
    description:
      "Formulated with 36+ natural sprouted grains, ancient millets, and Ayurvedic herbs for pure daily gut health.",
    images: [
      {
        url: "/gutvaidya_banner1.png",
        width: 1200,
        height: 630,
        alt: "GutVaidya Traditional Health Mix",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GutVaidya | Traditional Health Mix & Wellness",
    description:
      "Formulated with 36+ natural sprouted grains, ancient millets, and Ayurvedic herbs.",
    images: ["/gutvaidya_banner1.png"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-base-100 text-foreground">
        <AuthProvider>
          <CartProvider>
            {children}
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
