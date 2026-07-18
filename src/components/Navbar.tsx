"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingBag, X, Menu, Trash2, Plus, Minus } from "lucide-react";
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
  } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Recipe", href: "#recipe" },
    { label: "About Us", href: "#about-us" },
    { label: "Blogs", href: "#blogs" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Navbar Container */}
      <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="#home" className="flex items-center gap-2 text-2xl font-serif font-bold text-primary-700 tracking-wide">
                <img src="/logo_new.jpg" alt="GutVaidya Logo" className="h-12 w-12 rounded-full object-cover border border-primary-200" />
                <span>GutVaidya</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-sans text-sm font-medium text-foreground/80 hover:text-primary-700 transition-colors relative group py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 transition-all focus:outline-none"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-foreground hover:bg-primary-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="fixed inset-x-0 top-20 z-40 md:hidden bg-[#fdfdfb]/95 backdrop-blur-md border-b border-primary-100 py-6 px-4 shadow-lg flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-foreground/90 hover:text-primary-700 transition-colors px-4 py-2 rounded-lg hover:bg-primary-50/50"
              >
                {link.label}
              </a>
            ))}
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
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#fdfdfb] shadow-2xl flex flex-col h-full border-l border-primary-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-primary-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-primary-800 flex items-center gap-2">
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

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-200">
                      <ShoppingBag className="w-8 h-8 text-primary-200" />
                    </div>
                    <div>
                      <p className="text-lg font-serif font-bold text-primary-800">Your cart is empty</p>
                      <p className="text-sm text-foreground/60 mt-1">Start adding pure wellness to your daily routine.</p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors shadow-sm"
                    >
                      Shop Products
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 rounded-xl border border-primary-100/60 bg-white/70 backdrop-blur-sm flex items-start gap-4 shadow-sm"
                    >
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-100 bg-primary-50/50 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-primary-800 truncate">{item.name}</h4>
                        <p className="text-xs text-foreground/50 line-clamp-1 mt-0.5">{item.note}</p>
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-primary-100/80 rounded-lg overflow-hidden bg-primary-50/30">
                            <button
                              onClick={() => updateQuantity(item.name, item.qty - 1)}
                              className="p-1 hover:bg-primary-100/50 text-primary-700 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-primary-800">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.name, item.qty + 1)}
                              className="p-1 hover:bg-primary-100/50 text-primary-700 transition-colors"
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
                              onClick={() => removeFromCart(item.name)}
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
                <div className="p-6 border-t border-primary-100 bg-[#f7f9f4]">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-foreground/70">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/70">
                      <span>Shipping</span>
                      <span className="text-primary-700 font-semibold">Free</span>
                    </div>
                    <hr className="border-primary-100" />
                    <div className="flex justify-between text-base font-serif font-bold text-primary-800">
                      <span>Total Amount</span>
                      <span>₹{subtotal}</span>
                    </div>
                  </div>

                  <a
                    href={`mailto:support@gutvaidya.in?subject=Order Inquiry&body=Hi GutVaidya team,%0D%0A%0D%0AI would like to place an order for:%0D%0A${cart
                      .map((i) => `- ${i.name} (Qty: ${i.qty})`)
                      .join("%0D%0A")}%0D%0A%0D%0ATotal Amount: ₹${subtotal}%0D%0A%0D%0APlease contact me with payment details.`}
                    className="block w-full text-center py-3.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md hover:shadow-lg focus:outline-none"
                  >
                    Proceed to Checkout
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
