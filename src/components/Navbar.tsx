"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, X, Menu, Trash2, Plus, Minus, User, ArrowRight, Truck, Tag, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartCount,
    subtotal,
    discountAmount,
    shippingCharge,
    finalTotal,
    freeShippingRemaining,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const [drawerCouponInput, setDrawerCouponInput] = useState("");
  const [drawerCouponLoading, setDrawerCouponLoading] = useState(false);
  const [drawerCouponMsg, setDrawerCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApplyDrawerCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerCouponInput.trim()) return;
    setDrawerCouponLoading(true);
    setDrawerCouponMsg(null);
    const result = await applyCouponCode(drawerCouponInput);
    setDrawerCouponLoading(false);
    if (result.success) {
      setDrawerCouponMsg({ type: "success", text: result.message });
      setDrawerCouponInput("");
    } else {
      setDrawerCouponMsg({ type: "error", text: result.message });
    }
  };

  const handleApplyQuickDrawerCoupon = async (code: string) => {
    setDrawerCouponLoading(true);
    setDrawerCouponMsg(null);
    const result = await applyCouponCode(code);
    setDrawerCouponLoading(false);
    if (result.success) {
      setDrawerCouponMsg({ type: "success", text: result.message });
      setDrawerCouponInput("");
    } else {
      setDrawerCouponMsg({ type: "error", text: result.message });
    }
  };

  const { user, profile, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Our Blend", href: "/#blend-story" },
    { label: "Recipes", href: "/#recipe" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Blogs", href: "/#blogs" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      {/* Navbar Container */}
      <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-13 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-serif font-bold text-primary-700 tracking-wide hover:opacity-90 transition-opacity">
                <img
                  src="/logo_transparent.png"
                  alt="GutVaidya Logo"
                  className="h-7 sm:h-8 w-auto object-contain drop-shadow-sm"
                />
                <span className="leading-none">GutVaidya</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-xs sm:text-sm font-medium text-foreground/80 hover:text-primary-700 transition-colors relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Admin Dashboard Pill (Visible for Admins) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 font-sans text-[11px] sm:text-xs font-bold transition-all shadow-sm"
                  title="Open Admin Dashboard"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-700 flex-shrink-0" />
                  <span className="hidden xs:inline">Admin</span>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {/* Account button */}
              <Link
                href={user ? "/account" : "/auth/login"}
                className="relative p-1.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 transition-all focus:outline-none"
                aria-label="My Account"
                title={user ? `Account (${profile?.name || user.email})` : "Login / Account"}
              >
                <User className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                {user && (
                  <span className={`absolute top-0 right-0 w-2 h-2 rounded-full ring-2 ring-white ${isAdmin ? "bg-amber-500" : "bg-emerald-500"}`} />
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 transition-all focus:outline-none"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-accent-gold text-[9px] font-bold text-white shadow-sm ring-2 ring-white px-0.5">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-foreground hover:bg-primary-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-12 sm:top-13 z-40 md:hidden bg-base-100/95 backdrop-blur-md border-b border-primary-100 py-5 px-4 shadow-lg flex flex-col gap-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-foreground/90 hover:text-primary-700 transition-colors px-4 py-2.5 rounded-lg hover:bg-primary-50/50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-primary-100 flex flex-col gap-2">
              <Link
                href={user ? "/account" : "/auth/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-primary-700 px-4 py-2 rounded-lg bg-primary-50 flex items-center justify-between"
              >
                <span>{user ? "My Account & Orders" : "Sign In / Register"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-accent-gold-dark px-4 py-2 rounded-lg bg-accent-gold/10 flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Slider Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Slider Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-base-100 shadow-2xl flex flex-col h-full border-l border-primary-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-primary-100 flex items-center justify-between">
                <h2 className="text-xl font-sans font-bold text-primary-800 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-accent-gold" />
                  Your Wholesome Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-foreground/60 hover:text-foreground hover:bg-primary-50 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Free Shipping Meter */}
              {cart.length > 0 && (
                <div className="px-6 py-3 bg-primary-50/70 border-b border-primary-100/60 text-xs">
                  {freeShippingRemaining === 0 ? (
                    <div className="flex items-center gap-1.5 text-primary-800 font-semibold">
                      <Truck className="w-4 h-4 text-accent-gold" />
                      <span>Congratulations! You qualified for <strong>FREE Delivery</strong>!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-foreground/75">
                      <span>Add <strong>₹{freeShippingRemaining}</strong> more for <strong>FREE Delivery</strong></span>
                      <span className="text-accent-gold font-bold">Standard: ₹60</span>
                    </div>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-200">
                      <ShoppingBag className="w-8 h-8 text-primary-200" />
                    </div>
                    <div>
                      <p className="text-lg font-sans font-bold text-primary-800">Your cart is empty</p>
                      <p className="text-sm text-foreground/60 mt-1">Start adding pure wellness to your daily routine.</p>
                    </div>
                    <Link
                      href="/products"
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors shadow-sm"
                    >
                      Shop Products
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id || item.slug}
                      className="p-4 rounded-xl border border-primary-100/60 bg-base-50/70 backdrop-blur-sm flex items-start gap-4 shadow-sm"
                    >
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-100 bg-primary-50/50 flex-shrink-0">
                          <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-sans font-bold text-primary-800 truncate block hover:text-accent-gold transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-foreground/50 mt-0.5">₹{item.price} each</p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-primary-100/80 rounded-lg overflow-hidden bg-primary-50/30">
                            <button
                              onClick={() => updateQuantity(item.id || item.slug, item.qty - 1)}
                              className="p-1 hover:bg-primary-100/50 text-primary-700 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-primary-800">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id || item.slug, item.qty + 1)}
                              className="p-1 hover:bg-primary-100/50 text-primary-700 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {/* Price */}
                          <div className="flex items-center gap-3">
                            <span className="font-sans font-semibold text-primary-800">
                              ₹{item.price * item.qty}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id || item.slug)}
                              className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-primary-100 bg-base-100 space-y-3.5">
                  {/* Coupon Option in Drawer */}
                  <div className="rounded-2xl border border-primary-100/80 bg-base-50 p-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between text-xs bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="font-mono font-bold text-emerald-800 text-xs">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-[10px] bg-emerald-600 text-white font-semibold px-1.5 py-0.5 rounded">
                              Applied
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">
                            {appliedCoupon.discount_type === "percentage"
                              ? `${appliedCoupon.discount_value}% Discount Applied`
                              : `₹${appliedCoupon.discount_value} OFF Applied`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {/* 1-Click Welcome Coupon Offer */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[11px] text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                                WELCOME100
                              </span>
                              <span className="text-xs font-bold text-emerald-900">Save ₹100</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 block mt-0.5">
                              Flat ₹100 OFF on your order
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyQuickDrawerCoupon("WELCOME100")}
                            disabled={drawerCouponLoading}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                          >
                            {drawerCouponLoading ? "..." : "Apply"}
                          </button>
                        </div>

                        {/* Custom Code Input */}
                        <form onSubmit={handleApplyDrawerCoupon} className="space-y-1.5">
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={drawerCouponInput}
                              onChange={(e) => setDrawerCouponInput(e.target.value.toUpperCase())}
                              placeholder="Or enter coupon code"
                              className="flex-1 px-3 py-1.5 rounded-lg border border-primary-200 text-xs font-mono uppercase bg-white focus:outline-none focus:ring-1 focus:ring-primary-600"
                            />
                            <button
                              type="submit"
                              disabled={drawerCouponLoading || !drawerCouponInput.trim()}
                              className="px-3.5 py-1.5 rounded-lg bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors disabled:opacity-50"
                            >
                              {drawerCouponLoading ? "..." : "Apply"}
                            </button>
                          </div>
                          {drawerCouponMsg && (
                            <p className={`text-[10px] ${drawerCouponMsg.type === "success" ? "text-emerald-700 font-medium" : "text-red-600"}`}>
                              {drawerCouponMsg.text}
                            </p>
                          )}
                        </form>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm pt-1">
                    <div className="flex justify-between text-foreground/70">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Coupon Discount ({appliedCoupon?.code})</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground/70">
                      <span>Shipping</span>
                      <span className={shippingCharge === 0 ? "text-primary-700 font-semibold" : ""}>
                        {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                      </span>
                    </div>
                    <hr className="border-primary-100" />
                    <div className="flex justify-between text-base font-sans font-bold text-primary-800">
                      <span>Total Amount</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full text-center py-3.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md hover:shadow-lg focus:outline-none"
                    >
                      Proceed to Checkout • ₹{finalTotal}
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full text-center py-2 rounded-full border border-primary-200 text-primary-800 font-semibold text-xs hover:bg-primary-50 transition-colors"
                    >
                      View Full Cart
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
