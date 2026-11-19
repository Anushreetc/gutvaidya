import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipesSection from "@/components/RecipesSection";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Ways to prepare GutVaidya Diet Powder: drinks, soups, dosa and ladoo.",
};

// Recipes live on their own page (opened from the header), not on the home page.
export default function RecipesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <RecipesSection />
      </main>
      <Footer />
    </div>
  );
}
