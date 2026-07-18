"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, HeartHandshake, Smile, Sparkles, ShieldCheck } from "lucide-react";

export default function AboutUsSection() {
  const stats = [
    {
      value: "100,000+",
      label: "Happy Families",
      description: "Incorporating clean nutrition into daily home habits.",
      icon: Smile,
    },
    {
      value: "36+",
      label: "Handpicked Herbs",
      description: "Carefully sourced traditional grains, dry fruits, and spices.",
      icon: Sparkles,
    },
    {
      value: "100%",
      label: "Traditional Care",
      description: "Honest recipes and micro-batch production standards.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="about-us" className="py-24 bg-primary-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-primary-100/20 filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Story Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Graphic and Card */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border border-primary-100 bg-primary-100/50 relative">
              <img
                src="/product.jpeg"
                alt="Traditional ingredients raw blend"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Glass Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute bottom-6 -right-6 md:right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-primary-100 max-w-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
                  <Heart className="w-5 h-5 fill-primary-700 text-primary-700" />
                </div>
                <h4 className="font-serif font-bold text-primary-900 text-base">Made with Love & Honesty</h4>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  We believe true health starts from a balanced gut. Every batch is blended with transparency and natural care.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right: Content Copy */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" />
              Our Wholesome Story
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900 leading-tight">
              Rooted in Ancient Wisdom,<br />Crafted for Modern Life.
            </h2>
            
            <div className="space-y-4 text-foreground/80 leading-relaxed text-base">
              <p>
                At GutVaidya, we bridge the gap between traditional food heritage and the nutritional demands of contemporary life. Our recipes are inspired by centuries-old formulation methods, focusing on holistic gut-nourishment.
              </p>
              <p>
                Every scoop of GutVaidya Health Mix contains over 36 handpicked ingredients—including sprouted grains, premium nuts, and gut-friendly spices. We carefully roast, sprout, and powder our ingredients in small batches to preserve natural micronutrients, proteins, and dietary fibers without any preservatives, artificial sugar, or colors.
              </p>
            </div>

            {/* Micro-metrics cards */}
            <div className="grid sm:grid-cols-3 gap-4 pt-6">
              {stats.map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-5 rounded-2xl border border-primary-100 bg-white shadow-sm flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 mb-4">
                      <StatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-bold text-primary-950 leading-none mb-1">
                        {stat.value}
                      </h4>
                      <p className="text-xs font-bold text-accent-gold-dark mb-2">{stat.label}</p>
                      <p className="text-[11px] text-foreground/60 leading-normal">{stat.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
