"use client";

import React from "react";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import IngredientsSection from "../components/IngredientsSection";
import ProductsSection from "../components/ProductsSection";
import RecipesSection from "../components/RecipesSection";
import AboutUsSection from "../components/AboutUsSection";
import BlogsSection from "../components/BlogsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar />

        {/* Core Main content */}
        <main className="flex-grow">
          {/* Hero Carousel Banner Section */}
          <HeroSection />

          {/* Ingredients Breakdown */}
          <IngredientsSection />

          {/* Products Catalogue */}
          <ProductsSection />

          {/* Recipes Tabs Showcase */}
          <RecipesSection />

          {/* About us / Story block */}
          <AboutUsSection />

          {/* Blogs and Educational Wellness posts */}
          <BlogsSection />

          {/* Interactive Contact & Commitments block */}
          <ContactSection />
        </main>

        {/* Global footer */}
        <Footer />
      </div>
    </CartProvider>
  );
}
