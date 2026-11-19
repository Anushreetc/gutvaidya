"use client";

import React from "react";
import Navbar from "../components/Navbar";
import ReferenceLanding from "../components/ReferenceLanding";
import ProofBand from "../components/ProofBand";
import ReviewsSection from "../components/ReviewsSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import HomeReveal from "../components/HomeReveal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Core Main content */}
      <main className="flex-grow">
        {/* Cinematic product and ingredient journey (Hero, Product Spotlight, Preparation, Blend, Benefits, Manufacturing) */}
        <ReferenceLanding />

        {/* Rating, ingredient icons and headline numbers */}
        <ProofBand />

        {/* Recipes and Blogs have their own pages (/recipes, /blogs) */}

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Frequently asked questions */}
        <FAQSection />

        {/* Interactive Contact & Commitments block */}
        <ContactSection />
      </main>

      {/* Global footer */}
      <Footer />

      {/* Scroll-in entrance animations for every section below the hero */}
      <HomeReveal />
    </div>
  );
}
