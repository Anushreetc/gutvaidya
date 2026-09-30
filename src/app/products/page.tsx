"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { SEED_PRODUCTS, SEED_CATEGORIES } from "@/lib/products";
import { Product } from "@/types/ecommerce";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  ShoppingCart,
  Check,
  RotateCcw,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getProductOverrides, applyProductOverrides, subscribeToProductUpdates } from "@/lib/products-client";

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const overrides = getProductOverrides();
      if (Object.keys(overrides).length > 0) {
        return applyProductOverrides(SEED_PRODUCTS, overrides);
      }
    }
    return SEED_PRODUCTS;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1200);

  // Fetch live products on mount and listen for real-time admin edits
  useEffect(() => {
    // 1. Immediately apply local overrides
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

    // 3. Listen for real-time broadcasts
    const unsubscribe = subscribeToProductUpdates((latestOverrides) => {
      setProducts((prev) => applyProductOverrides(prev, latestOverrides));
    });

    return unsubscribe;
  }, []);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesIng = product.ingredients.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Category
      if (selectedCategory !== "all") {
        const cat = SEED_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat && product.category_id !== cat.id) return false;
      }

      // In Stock
      if (inStockOnly && product.stock_quantity <= 0) {
        return false;
      }

      // Max Price
      if (product.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      // featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy, inStockOnly, maxPrice]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
    setInStockOnly(false);
    setMaxPrice(1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow">
        {/* Page Banner */}
        <section className="relative py-16 sm:py-20 bg-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-gold filter blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-300 filter blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-accent-gold text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
              <Leaf className="w-3.5 h-3.5" />
              100% Pure Ayurvedic Nutrition
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
              Traditional Wellness Formulations
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Explore our complete range of sprouted whole grain health mixes, targeted nutrient powders, and restorative blends. Zero preservatives, handcrafted for your gut.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar Section */}
        <section className="sticky top-20 z-30 bg-[#fdfdfb]/95 backdrop-blur-md border-b border-primary-100/80 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or ingredients..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-primary-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40 hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary-700 text-white shadow-sm"
                      : "bg-primary-50 text-primary-800 hover:bg-primary-100"
                  }`}
                >
                  All Products
                </button>
                {SEED_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-primary-700 text-white shadow-sm"
                        : "bg-primary-50 text-primary-800 hover:bg-primary-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sorting & Options */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <label className="flex items-center gap-1.5 text-xs text-foreground/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-primary-200 text-primary-700 focus:ring-primary-600"
                  />
                  <span>In Stock Only</span>
                </label>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl border border-primary-100 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer shadow-sm"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs sm:text-sm text-foreground/60">
                Showing <strong className="text-primary-900 font-semibold">{filteredProducts.length}</strong> formulations
              </p>
              {(searchQuery || selectedCategory !== "all" || inStockOnly) && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs text-accent-gold-dark hover:underline font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset all filters
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-primary-50/30 rounded-3xl border border-primary-100 max-w-lg mx-auto p-8">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-primary-900 mb-2">No formulations found</h3>
                <p className="text-sm text-foreground/60 mb-6">
                  We couldn't find any products matching your selected search criteria. Try modifying your search or clearing active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const discountPercent = product.compare_at_price
                    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between"
                    >
                      {/* Visual Header */}
                      <Link href={`/products/${product.slug}`} className="block relative h-60 overflow-hidden bg-primary-50">
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />

                        {/* Badge Overlay */}
                        {product.badge && (
                          <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-gold text-white text-[11px] font-bold shadow-md z-10">
                            <Sparkles className="w-3 h-3" />
                            {product.badge}
                          </span>
                        )}

                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                          <span className="absolute top-3.5 right-3.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                            {discountPercent}% OFF
                          </span>
                        )}

                        {/* Weight pill */}
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-foreground/75 font-sans font-medium text-[11px] px-2.5 py-1 rounded-lg shadow-sm z-10">
                          {product.weight_size}
                        </span>
                      </Link>

                      {/* Card Body */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="space-y-2.5">
                          {/* Rating (only from real, approved reviews) */}
                          {product.rating && product.reviews_count ? (
                            <div className="flex items-center gap-1 text-accent-gold text-xs">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-primary-900">{product.rating}</span>
                              <span className="text-foreground/40">({product.reviews_count})</span>
                            </div>
                          ) : null}

                          <Link href={`/products/${product.slug}`} className="block group">
                            <h3 className="text-lg font-serif font-bold text-primary-900 leading-tight group-hover:text-accent-gold transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
                            {product.short_description}
                          </p>

                          {/* Quick checklist */}
                          <div className="pt-2 border-t border-primary-100/40 space-y-1">
                            {product.benefits.slice(0, 2).map((b) => (
                              <div key={b} className="flex items-center gap-1.5 text-[11px] text-foreground/75">
                                <Check className="w-3 h-3 text-accent-gold flex-shrink-0" />
                                <span className="truncate">{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-5 flex items-center justify-between border-t border-primary-100/50 mt-5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-foreground/40 block">Price</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-bold font-sans text-primary-800">
                                ₹{product.price}
                              </span>
                              {product.compare_at_price && (
                                <span className="text-xs text-foreground/40 line-through">
                                  ₹{product.compare_at_price}
                                </span>
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
                                image: product.main_image,
                                stock_quantity: product.stock_quantity,
                                weight_size: product.weight_size,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
