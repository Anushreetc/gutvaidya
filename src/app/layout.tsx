import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "GutVaidya | Traditional Health Mix & Wellness",
  description: "Nourish your body with GutVaidya Health Mix. Made with 36+ natural ingredients to support immunity, gut health, and energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fdfdfb] text-[#1c241b]">
        {children}
      </body>
    </html>
  );
}
