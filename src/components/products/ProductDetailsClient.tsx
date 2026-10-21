"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/ecommerce";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { PublicReview } from "@/lib/reviews";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Plus,
  Minus,
  Wheat,
  Clock,
  Heart,
  MessageSquare,
  Award,
} from "lucide-react";

import { applyProductOverride, subscribeToProductUpdates } from "@/lib/products-client";
import { BUSINESS } from "@/lib/business";

interface Props {
  product: Product;
  relatedProducts: Product[];
  reviews: PublicReview[];
}

export default function ProductDetailsClient({ product: initialProduct, relatedProducts, reviews }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product>(() => applyProductOverride(initialProduct));

  useEffect(() => {
    // Apply immediate overrides
    setProduct(applyProductOverride(initialProduct));

    // Listen to real-time broadcasts
    const unsubscribe = subscribeToProductUpdates((latestOverrides) => {
      setProduct((prev) => applyProductOverride(prev, latestOverrides));
    });

    return unsubscribe;
  }, [initialProduct]);

  const [selectedImage, setSelectedImage] = useState(product.main_image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "usage" | "reviews">("benefits");

  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSending, setReviewSending] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.main_image];

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity < 20;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compare_at_price: product.compare_at_price,
        image: product.main_image,
        stock_quantity: product.stock_quantity,
        weight_size: product.weight_size,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compare_at_price: product.compare_at_price,
        image: product.main_image,
        stock_quantity: product.stock_quantity,
        weight_size: product.weight_size,
      },
      quantity
    );
    router.push("/checkout");
  };

  // Reviews are saved for admin approval; they appear on the page once approved
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewForm.rating,
          review: reviewForm.comment,
          name: reviewForm.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit your review.");
      setReviewSubmitted(true);
      setReviewForm({ name: "", rating: 5, comment: "" });
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewSending(false);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-foreground/50 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-700 transition-colors">
            Products
          </Link>
          <span>/</span>
          {product.category_name && (
            <>
              <span className="text-foreground/70">{product.category_name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-primary-900 font-semibold truncate">{product.name}</span>
        </nav>

        {/* Product Details Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[4/5] max-h-[600px] rounded-3xl overflow-hidden bg-[#14361e] border border-primary-900/20 shadow-md flex items-center justify-center p-1 sm:p-2">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300 rounded-2xl"
              />

              {product.badge && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold text-white text-xs font-bold shadow-md z-10">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {product.badge}
                </span>
              )}

              {discountPercent > 0 && (
                <span className="absolute top-3 right-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img
                        ? "border-primary-700 ring-2 ring-primary-100 scale-105"
                        : "border-primary-100/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-accent-gold-dark">
                  {product.category_name || "Wellness Formulation"}
                </span>
                {product.rating && product.reviews_count ? (
                  <div className="flex items-center gap-1.5 text-xs text-accent-gold font-bold">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? "fill-current" : "opacity-30"}`} />
                      ))}
                    </div>
                    <span className="text-primary-900">{product.rating}</span>
                    <span className="text-foreground/40">
                      ({product.reviews_count} {product.reviews_count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary-900 leading-tight">
                {product.name}
              </h1>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-foreground/75 leading-relaxed mt-3">
                {product.short_description}
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-primary-50/50 border border-primary-100/80 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-foreground/50 block">Price (Inclusive of all taxes)</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-sans font-bold text-primary-800">
                    ₹{product.price}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-base sm:text-lg text-foreground/40 line-through">
                      ₹{product.compare_at_price}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      Save ₹{product.compare_at_price! - product.price} ({discountPercent}%)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-foreground/60 block">Net Quantity</span>
                <span className="text-sm font-semibold text-primary-900">{product.weight_size}</span>
              </div>
            </div>

            {/* Stock Status Indicator */}
            <div>
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Currently Out of Stock
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  Only {product.stock_quantity} left in stock - order soon!
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  In Stock & Ready for Immediate Dispatch
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-900">Quantity</span>
                <div className="flex items-center border border-primary-200 rounded-xl overflow-hidden bg-base-50 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-bold text-primary-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 10, q + 1))}
                    disabled={quantity >= product.stock_quantity || isOutOfStock}
                    className="p-2.5 text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 border-primary-700 text-primary-800 font-bold text-sm hover:bg-primary-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 text-accent-gold" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary-100 text-center">
              <div className="p-3 rounded-2xl bg-base-50 border border-primary-100/60 shadow-sm flex flex-col items-center">
                <Truck className="w-5 h-5 text-accent-gold mb-1" />
                <span className="text-[11px] font-bold text-primary-900 leading-tight">Free Delivery</span>
                <span className="text-[10px] text-foreground/50">On orders over ₹999</span>
              </div>
              <div className="p-3 rounded-2xl bg-base-50 border border-primary-100/60 shadow-sm flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-accent-gold mb-1" />
                <span className="text-[11px] font-bold text-primary-900 leading-tight">FSSAI Certified</span>
                <span className="text-[10px] text-foreground/50">Lic. No. {BUSINESS.fssaiLicense}</span>
              </div>
              <div className="p-3 rounded-2xl bg-base-50 border border-primary-100/60 shadow-sm flex flex-col items-center">
                <Award className="w-5 h-5 text-accent-gold mb-1" />
                <span className="text-[11px] font-bold text-primary-900 leading-tight">Zero Additives</span>
                <span className="text-[10px] text-foreground/50">Traditional recipe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Sections */}
        <div className="mt-16 sm:mt-24">
          <div className="flex border-b border-primary-100 overflow-x-auto gap-4 sm:gap-8 scrollbar-none">
            {[
              { id: "benefits", label: "Ayurvedic Benefits" },
              { id: "ingredients", label: "Ingredients (36+ Whole Foods)" },
              { id: "usage", label: "How to Prepare & Use" },
              { id: "reviews", label: `Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 text-sm sm:text-base font-serif font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-800"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {/* Benefits Tab */}
            {activeTab === "benefits" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {product.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-base-50 border border-primary-100 shadow-sm flex items-start gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary-900 text-sm">{benefit}</h4>
                      <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
                        Nourishes the digestive fire (Agni), feeds healthy probiotic bacteria, and prevents acidic flareups.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ingredients Tab */}
            {activeTab === "ingredients" && (
              <div className="max-w-4xl space-y-6">
                <div className="p-6 rounded-3xl bg-primary-50/50 border border-primary-100">
                  <div className="flex items-center gap-2 mb-3 text-primary-800">
                    <Wheat className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-serif font-bold text-lg">Pure Sourced Ingredients</h3>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                    {product.ingredients}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-base-50 border border-primary-100/60 text-xs text-foreground/70 leading-relaxed">
                  <strong>Purity Guarantee:</strong> Every batch is roasted under controlled temperatures to activate essential enzymes without damaging heat-sensitive vitamins. Contains NO wheat flour fillers, NO white sugar, NO maltodextrin, NO artificial colors, and NO chemical stabilizers.
                </div>
              </div>
            )}

            {/* Usage Tab */}
            {activeTab === "usage" && (
              <div className="max-w-3xl space-y-6">
                <div className="p-6 rounded-3xl bg-base-50 border border-primary-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-primary-800">
                    <Clock className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-serif font-bold text-lg">Preparation Instructions</h3>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {product.usage_instructions}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary-100">
                    <div className="text-center p-3 rounded-xl bg-primary-50/40">
                      <span className="text-xl font-bold font-serif text-primary-800 block">Step 1</span>
                      <span className="text-xs text-foreground/70">Mix 2 spoons in water or milk</span>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-primary-50/40">
                      <span className="text-xl font-bold font-serif text-primary-800 block">Step 2</span>
                      <span className="text-xs text-foreground/70">Simmer on medium for 3-5 mins</span>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-primary-50/40">
                      <span className="text-xl font-bold font-serif text-primary-800 block">Step 3</span>
                      <span className="text-xs text-foreground/70">Add jaggery & enjoy warm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="max-w-4xl space-y-8">
                {/* Review Form */}
                <div className="p-6 sm:p-8 rounded-3xl bg-primary-50/40 border border-primary-100">
                  <h3 className="font-serif font-bold text-lg text-primary-900 mb-1">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-foreground/60 mb-6">
                    Help fellow health enthusiasts know how GutVaidya helped your wellness routine.
                  </p>

                  {reviewSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 font-semibold text-sm">
                      Thank you! Your review has been received and will appear here once our team has checked it.
                    </div>
                  ) : !user ? (
                    <div className="p-4 rounded-2xl bg-base-50 border border-primary-100 text-sm text-foreground/70">
                      Please{" "}
                      <Link href={`/auth/login?next=/products/${product.slug}`} className="font-bold text-primary-700 hover:underline">
                        sign in
                      </Link>{" "}
                      to write a review.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold uppercase text-primary-900 block mb-1">Your Name</label>
                          <input
                            type="text"
                            maxLength={80}
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            placeholder="Name to show (optional)"
                            className="w-full px-4 py-2.5 rounded-xl border border-primary-100 bg-base-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-primary-900 block mb-1">Rating</label>
                          <select
                            value={reviewForm.rating}
                            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-primary-100 bg-base-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                            <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                            <option value={2}>⭐⭐ (2 Stars - Poor)</option>
                            <option value={1}>⭐ (1 Star - Very Poor)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-primary-900 block mb-1">Your Review</label>
                        <textarea
                          required
                          minLength={10}
                          maxLength={2000}
                          rows={3}
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="How did this formulation help your digestion and energy levels?"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 bg-base-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                        />
                      </div>
                      {reviewError && (
                        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{reviewError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={reviewSending}
                        className="px-6 py-2.5 rounded-full bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50"
                      >
                        {reviewSending ? "Submitting..." : "Submit Review"}
                      </button>
                      <p className="text-[11px] text-foreground/50">Reviews are checked by our team before they appear.</p>
                    </form>
                  )}
                </div>

                {/* Reviews List (approved reviews only) */}
                <div className="space-y-4">
                  {reviews.length === 0 && (
                    <p className="text-sm text-foreground/50 text-center py-6">
                      No reviews yet. Bought this product? Be the first to share your experience.
                    </p>
                  )}
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-base-50 border border-primary-100/80 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-primary-900 text-sm">{rev.customer_name}</span>
                          {rev.verified_purchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground/40">
                          {new Date(rev.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex text-accent-gold text-xs mb-2">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed whitespace-pre-line break-words">{rev.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 sm:mt-28 pt-12 border-t border-primary-100">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">
                Complementary Formulations
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 mt-1">
                You May Also Benefit From
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between"
                >
                  <Link href={`/products/${rel.slug}`} className="block relative h-52 bg-primary-50">
                    <img src={rel.main_image} alt={rel.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 right-3 bg-primary-900 text-white font-sans font-bold text-sm px-3 py-1 rounded-xl">
                      ₹{rel.price}
                    </span>
                  </Link>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${rel.slug}`}>
                        <h4 className="font-serif font-bold text-primary-900 hover:text-accent-gold transition-colors">
                          {rel.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-foreground/60 line-clamp-2 mt-1">{rel.short_description}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-primary-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary-800">₹{rel.price}</span>
                      <Link
                        href={`/products/${rel.slug}`}
                        className="text-xs font-bold text-primary-700 hover:underline"
                      >
                        View Formulation →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
