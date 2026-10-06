"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { SEED_PRODUCTS } from "@/lib/products";
import { Product } from "@/types/ecommerce";
import { getProductOverrides, applyProductOverrides, subscribeToProductUpdates } from "@/lib/products-client";
import { ShoppingCart, Leaf, Shield, Award, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function ProductsSection() {
  const { addToCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const overrides = getProductOverrides();
      if (Object.keys(overrides).length > 0) {
        return applyProductOverrides(SEED_PRODUCTS, overrides);
      }
    }
    return SEED_PRODUCTS;
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch live products dynamically and listen for real-time admin edits
  useEffect(() => {
    // 1. Immediately apply local overrides on mount
    const overrides = getProductOverrides();
    if (Object.keys(overrides).length > 0) {
      setProducts((prev) => applyProductOverrides(prev, overrides));
    }

    // 2. Fetch latest from API
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(applyProductOverrides(data, getProductOverrides()));
        }
      })
      .catch(() => {});

    // 3. Listen for instant broadcast updates from admin tab
    const unsubscribe = subscribeToProductUpdates((latestOverrides) => {
      setProducts((prev) => applyProductOverrides(prev, latestOverrides));
    });

    return unsubscribe;
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

      const cardWidth = scrollWidth / products.length;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(currentIndex);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardOffset = 360;
      const scrollAmount = direction === "left" ? -cardOffset : cardOffset;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth } = scrollRef.current;
      const cardWidth = scrollWidth / products.length;
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <section id="products" className="py-24 bg-primary-50/40 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-100/30 filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-gold/5 filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          className="mb-16"
          eyebrow={"100% Natural Wellness"}
          title={"Our Traditional Products"}
          body={"Wholesome, premium wellness blends formulated with traditional ingredients to nourish your daily routine."}
        />

        {/* Slider Container Wrapper */}
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Navigation side buttons */}
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={`absolute top-1/2 -translate-y-1/2 -left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center border border-primary-100 bg-white/95 text-primary-700 shadow-lg hover:text-accent-gold-dark hover:border-accent-gold hover:bg-white transition-all duration-300 focus:outline-none hidden md:flex ${
              !canScrollLeft ? "opacity-30 cursor-not-allowed" : "opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={`absolute top-1/2 -translate-y-1/2 -right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center border border-primary-100 bg-white/95 text-primary-700 shadow-lg hover:text-accent-gold-dark hover:border-accent-gold hover:bg-white transition-all duration-300 focus:outline-none hidden md:flex ${
              !canScrollRight ? "opacity-30 cursor-not-allowed" : "opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizontally scrolling track */}
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.4) }}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between flex-shrink-0 w-[290px] sm:w-[340px] md:w-[360px] snap-start"
              >
                {/* Product Visual */}
                <Link href={`/products/${product.slug}`} className="block relative h-64 sm:h-72 overflow-hidden bg-primary-100/50">
                  <img
                    src={product.main_image || (product as any).image || '/product.jpeg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Badge Overlay */}
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-gold text-white text-xs font-bold shadow-md z-10">
                    <Sparkles className="w-3 h-3" />
                    {product.badge || 'Bestseller'}
                  </span>

                  {/* Price tag overlay */}
                  <span className="absolute bottom-4 right-4 bg-primary-900 text-white font-sans font-bold text-base px-3.5 py-1.5 rounded-xl shadow-lg z-10">
                    ₹{product.price}
                  </span>
                </Link>

                {/* Product Body */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <Link href={`/products/${product.slug}`} className="block group">
                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-primary-900 leading-tight group-hover:text-accent-gold transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-3">
                      {product.short_description || (product as any).note}
                    </p>

                    {/* Highlights checklist */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary-100/30">
                      {(product.benefits || []).map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 text-[11px] sm:text-xs text-foreground/80 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />
                          <span className="truncate">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card footer / Actions */}
                  <div className="pt-6 flex items-center justify-between border-t border-primary-100/50 mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-foreground/50 uppercase tracking-wider font-semibold">Price</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-sans font-bold text-primary-800">₹{product.price}</span>
                        {product.compare_at_price && (
                          <span className="text-xs text-foreground/40 line-through">₹{product.compare_at_price}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          price: product.price,
                          compare_at_price: product.compare_at_price,
                          image: product.main_image || (product as any).image || '/product.jpeg',
                          stock_quantity: product.stock_quantity,
                          weight_size: product.weight_size || "500g",
                        })
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg focus:outline-none"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Page Indicators (Bottom Dots) */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  activeIndex === i ? "w-6 bg-primary-700" : "w-2 bg-primary-200 hover:bg-primary-350"
                }`}
                aria-label={`Go to product slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Catalog CTA */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-800 text-white font-semibold text-sm hover:bg-primary-900 transition-all shadow-md hover:shadow-lg group"
            >
              <span>Explore All Products & Formulations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Benefits strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-primary-100/40 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
              <Leaf className="w-6 h-6 text-primary-700" />
            </div>
            <h4 className="font-sans font-semibold text-primary-800 text-sm">100% Organic Sources</h4>
            <p className="text-xs text-foreground/60">No synthetics, preservatives, or chemical additives</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
              <Shield className="w-6 h-6 text-primary-700" />
            </div>
            <h4 className="font-sans font-semibold text-primary-800 text-sm">Quality Checked</h4>
            <p className="text-xs text-foreground/60">Strict testing and hygienic production standards</p>
          </div>
          <div className="flex flex-col items-center space-y-2 col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
              <Award className="w-6 h-6 text-primary-700" />
            </div>
            <h4 className="font-sans font-semibold text-primary-800 text-sm">Traditional Recipe</h4>
            <p className="text-xs text-foreground/60">Passed down through generations of wellness care</p>
          </div>
        </div>
      </div>
    </section>
  );
}
