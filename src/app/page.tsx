"use client";

import React from "react";
import Navbar from "../components/Navbar";
import ReferenceLanding from "../components/ReferenceLanding";
import ProofBand from "../components/ProofBand";
import ComparisonSection from "../components/ComparisonSection";
import RecipesSection from "../components/RecipesSection";
import ReviewsSection from "../components/ReviewsSection";
import BlogsSection from "../components/BlogsSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Core Main content */}
      <main className="flex-grow">
        {/* Cinematic product and ingredient journey (Hero, Product Spotlight at ₹899, Preparation, Blend, Benefits, Manufacturing) */}
        <ReferenceLanding />

        {/* Rating, ingredient icons and headline numbers */}
        <ProofBand />

        {/* A shelf of ingredients vs one pouch, plus trust badges */}
        <ComparisonSection />

        {/* Recipes Tabs Showcase */}
        <RecipesSection />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Blogs and Educational Wellness posts */}
        <BlogsSection />

        {/* Frequently asked questions */}
        <FAQSection />

        {/* Interactive Contact & Commitments block */}
        <ContactSection />
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
