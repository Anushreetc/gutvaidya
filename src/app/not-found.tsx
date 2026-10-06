import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent-gold-dark">Error 404</p>
          <h1 className="text-3xl font-serif font-bold text-primary-900">We couldn&apos;t find that page</h1>
          <p className="text-sm text-foreground/60 leading-relaxed">
            The link may be old, or the product may no longer be available. Our full range of wellness mixes is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/products" className="px-6 py-3 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm">
              Browse Products
            </Link>
            <Link href="/" className="px-6 py-3 rounded-full border border-primary-200 text-primary-800 font-bold text-sm hover:bg-primary-50">
              Go to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
