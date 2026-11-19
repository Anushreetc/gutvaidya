import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogsSection from "@/components/BlogsSection";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Gut health and wellness reading from GutVaidya.",
};

// Blogs live on their own page (opened from the header), not on the home page.
export default function BlogsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <BlogsSection />
      </main>
      <Footer />
    </div>
  );
}
