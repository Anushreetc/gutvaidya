"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    appliedCoupon,
    discountAmount,
    shippingCharge,
    finalTotal,
    freeShippingRemaining,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);

    const result = await applyCouponCode(couponInput);
    setCouponLoading(false);

    if (result.success) {
      setCouponMessage({ type: "success", text: result.message });
      setCouponInput("");
    } else {
      setCouponMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary-900">
              Your Wholesome Cart
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1">
              Review your natural wellness formulations before proceeding to secure checkout.
            </p>
          </div>

          {cart.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-20 bg-base-50 rounded-3xl border border-primary-100/80 max-w-xl mx-auto p-8 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-primary-300 mx-auto mb-5">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-primary-900 mb-2">Your Cart is Empty</h2>
              <p className="text-sm text-foreground/60 mb-8 max-w-md mx-auto">
                Looks like you haven't added any traditional health mixes to your routine yet. Start nourishing your gut today.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-all shadow-md hover:shadow-lg"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Cart Content Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left: Items List */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Delivery Meter */}
                <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100 flex items-center justify-between text-xs sm:text-sm">
                  {freeShippingRemaining === 0 ? (
                    <div className="flex items-center gap-2 text-primary-800 font-semibold">
                      <Truck className="w-4 h-4 text-accent-gold" />
                      <span>You've unlocked <strong>FREE Standard Shipping</strong>!</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                      <span className="text-foreground/75">
                        Add items worth <strong>₹{freeShippingRemaining}</strong> more to qualify for <strong>FREE Delivery</strong>
                      </span>
                      <Link href="/products" className="text-xs font-bold text-accent-gold-dark hover:underline whitespace-nowrap">
                        + Add Formulations
                      </Link>
                    </div>
                  )}
                </div>

                {/* Items Card List */}
                <div className="bg-base-50 rounded-3xl border border-primary-100 shadow-sm overflow-hidden divide-y divide-primary-100/60">
                  {cart.map((item) => (
                    <div key={item.id || item.slug} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary-50 border border-primary-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif font-bold text-base sm:text-lg text-primary-900 hover:text-accent-gold transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-foreground/50 mt-0.5">
                          Net Wt: {item.weight_size || "500g"} • ₹{item.price} each
                        </p>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-primary-100 rounded-xl overflow-hidden bg-primary-50/40">
                          <button
                            onClick={() => updateQuantity(item.id || item.slug, item.qty - 1)}
                            className="p-2 hover:bg-primary-100/50 text-primary-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-xs font-bold text-primary-900">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id || item.slug, item.qty + 1)}
                            className="p-2 hover:bg-primary-100/50 text-primary-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="font-sans font-bold text-base sm:text-lg text-primary-900 min-w-[70px] text-right">
                          ₹{item.price * item.qty}
                        </span>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.id || item.slug)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Link
                    href="/products"
                    className="text-xs font-bold text-primary-700 hover:underline inline-flex items-center gap-1"
                  >
                    ← Continue Shopping
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-xs text-foreground/50 hover:text-red-600 transition-colors"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

              {/* Right: Order Summary & Coupon Input */}
              <div className="lg:col-span-4 space-y-6">
                {/* Coupon Box */}
                <div className="p-6 rounded-3xl bg-base-50 border border-primary-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-primary-900">
                    <Tag className="w-4 h-4 text-accent-gold" />
                    <h3 className="font-serif font-bold text-sm">Have a Coupon Code?</h3>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-800 text-sm block">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-emerald-700">
                          {appliedCoupon.discount_type === "percentage"
                            ? `${appliedCoupon.discount_value}% Discount Applied`
                            : `₹${appliedCoupon.discount_value} Discount Applied`}
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="e.g. GUTHEALTH10"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-primary-100 text-xs font-mono uppercase bg-base-50 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <button
                          type="submit"
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-5 py-2.5 rounded-xl bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors disabled:opacity-50"
                        >
                          {couponLoading ? "..." : "Apply"}
                        </button>
                      </div>

                      {couponMessage && (
                        <p
                          className={`text-xs flex items-center gap-1 mt-2 ${
                            couponMessage.type === "success" ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {couponMessage.type === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                          <span>{couponMessage.text}</span>
                        </p>
                      )}

                      <p className="text-[11px] text-foreground/40 pt-1">
                        Try <strong>GUTHEALTH10</strong> for 10% off or <strong>WELCOME50</strong>.
                      </p>
                    </form>
                  )}
                </div>

                {/* Summary Box */}
                <div className="p-6 rounded-3xl bg-base-50 border border-primary-100 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-lg text-primary-900 border-b border-primary-100 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-foreground/70">
                      <span>Subtotal</span>
                      <span className="font-semibold text-primary-900">₹{subtotal}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Coupon Savings</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-foreground/70">
                      <span>Estimated Shipping</span>
                      <span className={shippingCharge === 0 ? "text-primary-700 font-semibold" : "font-semibold"}>
                        {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-foreground/50">
                      <span>Taxes & GST</span>
                      <span>Included in Price</span>
                    </div>

                    <hr className="border-primary-100" />

                    <div className="flex justify-between text-lg font-serif font-bold text-primary-900">
                      <span>Total Amount</span>
                      <span className="font-sans">₹{finalTotal}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full text-center py-4 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none"
                  >
                    Proceed to Checkout • ₹{finalTotal}
                  </Link>

                  <div className="pt-2 text-center flex items-center justify-center gap-2 text-xs text-foreground/50">
                    <ShieldCheck className="w-4 h-4 text-accent-gold" />
                    <span>Secure 256-Bit Encrypted Razorpay Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
