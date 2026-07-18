"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Leaf, Shield, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  {
    name: "GutVaidya Health Mix",
    price: 720,
    note: "Contains 36+ handpicked traditional grains, millets, nuts, and natural herbs for daily immunity, gut health, and steady energy levels.",
    benefits: ["36+ Organic Ingredients", "Zero Added Sugar", "Rich in Soluble Fiber", "Gut-Friendly Formula"],
    badge: "Bestseller",
    image: "/product.jpeg",
  },
  {
    name: "GutVaidya Wholesome Ladoo",
    price: 540,
    note: "Delicious, nutrient-dense wellness energy sweet bites made with traditional goodness, nuts, and healthy fats. Perfectly balanced.",
    benefits: ["Rich in Proteins", "No Preservatives", "Naturally Sweetened", "Traditional Taste"],
    badge: "New Release",
    image: "/product.jpeg", // Using the same image placeholder
  },
];

export default function ProductsSection() {
  const { addToCart } = useCart();

  return (
    <section id="products" className="py-24 bg-primary-50/40 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-100/30 filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-gold/5 filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" />
            100% Natural Wellness
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900">
            Our Traditional Products
          </h2>
          <p className="text-base text-foreground/75 leading-relaxed">
            Wholesome, premium wellness blends formulated with traditional ingredients to nourish your daily routine.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              {/* Product Visual */}
              <div className="relative h-64 sm:h-80 overflow-hidden bg-primary-100/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Badge Overlay */}
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-gold text-white text-xs font-bold shadow-md">
                  <Sparkles className="w-3 h-3" />
                  {product.badge}
                </span>

                {/* Price tag overlay */}
                <span className="absolute bottom-4 right-4 bg-primary-900 text-white font-sans font-bold text-lg px-4 py-2 rounded-xl shadow-lg">
                  ₹{product.price}
                </span>
              </div>

              {/* Product Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-primary-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {product.note}
                  </p>

                  {/* Highlights checklist */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {product.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-xs text-foreground/80 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer / Actions */}
                <div className="pt-8 flex items-center justify-between border-t border-primary-100/50 mt-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50">Price (incl. Taxes)</span>
                    <span className="text-2xl font-sans font-bold text-primary-800">₹{product.price}</span>
                  </div>
                  
                  <button
                    onClick={() =>
                      addToCart({
                        name: product.name,
                        price: product.price,
                        note: product.note,
                        image: product.image,
                      })
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-primary-100/40 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
              <Leaf className="w-6 h-6 text-primary-700" />
            </div>
            <h4 className="font-serif font-semibold text-primary-800 text-sm">100% Organic Sources</h4>
            <p className="text-xs text-foreground/60">No synthetics, preservatives, or chemical additives</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
              <Shield className="w-6 h-6 text-primary-700" />
            </div>
            <h4 className="font-serif font-semibold text-primary-800 text-sm">Quality Checked</h4>
            <p className="text-xs text-foreground/60">Strict testing and hygienic production standards</p>
          </div>
          <div className="flex flex-col items-center space-y-2 col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
              <Award className="w-6 h-6 text-primary-700" />
            </div>
            <h4 className="font-serif font-semibold text-primary-800 text-sm">Traditional Recipe</h4>
            <p className="text-xs text-foreground/60">Passed down through generations of wellness care</p>
          </div>
        </div>

      </div>
    </section>
  );
}
