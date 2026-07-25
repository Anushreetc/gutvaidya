"use client";

import React, { useState } from "react";
import { Star, Quote, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  category: string;
  verified: boolean;
}

const reviewsData: Review[] = [
  {
    id: 1,
    name: "Priya R.",
    location: "Bengaluru",
    rating: 5,
    date: "July 2026",
    text: "I've been using GutVaidya Health Mix for the last 3 months. My chronic acidity and bloating are completely gone. It's incredibly light on the stomach and keeps me energetic all day!",
    category: "Gut Health",
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Sandeep K.",
    location: "Mumbai",
    rating: 5,
    date: "June 2026",
    text: "As an Ayurvedic practitioner, I highly recommend GutVaidya. The sprouted grains and traditional herbs like Licorice and Shatavari are formulated in the perfect ratio. It's excellent for daily digestion.",
    category: "Acidity Relief",
    verified: true,
  },
  {
    id: 3,
    name: "Ananya M.",
    location: "Chennai",
    rating: 5,
    date: "July 2026",
    text: "Finding a healthy breakfast that doesn't cause gas was a challenge. GutVaidya is a lifesaver. My kids love it as porridge, and I've noticed a huge improvement in my digestion.",
    category: "Kids & Family",
    verified: true,
  },
  {
    id: 4,
    name: "Rajesh V.",
    location: "Hyderabad",
    rating: 5,
    date: "May 2026",
    text: "Exceptional quality. You can tell it's made in small batches. The roasted aroma of cardamom and traditional grains is wonderful. Zero added sugar and pure nutrition.",
    category: "Daily Energy",
    verified: true,
  },
  {
    id: 5,
    name: "Kavitha Nair",
    location: "Kochi",
    rating: 5,
    date: "June 2026",
    text: "After trying multiple health drinks for my daughter, I shifted to GutVaidya. It's natural, full of sprouted millets and nuts. Her bowel movements are regular and she feels much more active.",
    category: "Kids & Family",
    verified: true,
  },
  {
    id: 6,
    name: "Amit S.",
    location: "Delhi",
    rating: 5,
    date: "July 2026",
    text: "GutVaidya has been a game changer for my morning acid reflux. I drink it warm every morning, and it works better than any antacid. Highly recommend this natural formula.",
    category: "Acidity Relief",
    verified: true,
  },
];

const categories = ["All", "Gut Health", "Acidity Relief", "Daily Energy", "Kids & Family"];

export default function ReviewsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredReviews = activeCategory === "All"
    ? reviewsData
    : reviewsData.filter((r) => r.category === activeCategory);

  return (
    <section id="reviews" className="py-24 bg-primary-50/20 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-100/30 filter blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-gold/5 filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-100/80 text-primary-700 text-xs font-semibold uppercase tracking-wider border border-primary-200/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900 leading-tight">
            Loved by 1,00,000+ Happy Customers
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl mx-auto">
            See how GutVaidya is bringing digestive comfort, relief, and natural wellness into homes across India.
          </p>
        </div>

        {/* Rating Summary & Filter Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">

          {/* Left: Overall Rating Card & WhatsApp Screenshot */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-primary-100/60 p-8 rounded-3xl shadow-md text-center space-y-4">
              <h3 className="font-serif font-bold text-primary-900 text-lg">Overall Satisfaction Rating</h3>

              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-6xl font-serif font-bold text-primary-800">4.9</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
                <span className="text-xs text-foreground/60">Based on 10,480 verified reviews</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-primary-100/60">
                <div className="flex items-center text-xs gap-3">
                  <span className="w-12 text-left font-medium text-foreground/70">5 Star</span>
                  <div className="flex-1 h-2 bg-primary-50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold rounded-full w-[94%]" />
                  </div>
                  <span className="w-8 text-right font-semibold text-foreground/80">94%</span>
                </div>
                <div className="flex items-center text-xs gap-3">
                  <span className="w-12 text-left font-medium text-foreground/70">4 Star</span>
                  <div className="flex-1 h-2 bg-primary-50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold rounded-full w-[5%]" />
                  </div>
                  <span className="w-8 text-right font-semibold text-foreground/80">5%</span>
                </div>
                <div className="flex items-center text-xs gap-3">
                  <span className="w-12 text-left font-medium text-foreground/70">3 Star</span>
                  <div className="flex-1 h-2 bg-primary-50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-right font-semibold text-foreground/80">1%</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Feedback Screenshot */}
            <div className="bg-white border border-primary-100/60 p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-primary-100/60 pb-3">
                <h3 className="font-serif font-bold text-primary-900 text-base">WhatsApp Feedback</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#25D366] bg-[#25D366]/10 px-2.5 py-1 rounded-full">
                  Real Customer Chat
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-primary-100/30 bg-[#efeae2] group">
                <img
                  src="/download.png"
                  alt="WhatsApp Feedback Screenshot"
                  className="w-full h-auto block mx-auto"
                />
                <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/5 transition-colors duration-300 pointer-events-none" />
              </div>
              <p className="text-xs text-foreground/60 text-center leading-relaxed">
                Direct screenshot shared by one of our customers showing real results.
              </p>
            </div>
          </div>

          {/* Right: Interactive Filters & Reviews Grid */}
          <div className="lg:col-span-8 space-y-8">

            {/* Category Filter tabs */}
            <div className="flex flex-wrap gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 focus:outline-none ${activeCategory === cat
                      ? "bg-primary-700 border-primary-700 text-white shadow-md shadow-primary-700/10"
                      : "bg-white border-primary-100 text-foreground/75 hover:border-primary-200 hover:bg-primary-50/50"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Reviews Grid */}
            <motion.div layout className="grid md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((review) => (
                  <motion.div
                    layout
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-2xl p-6 border border-primary-100/60 hover:border-accent-gold/40 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Rating Stars & Quote Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                          ))}
                        </div>
                        <Quote className="w-5 h-5 text-accent-gold/30" />
                      </div>

                      {/* Review Text */}
                      <p className="text-sm text-foreground/85 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    {/* Reviewer Details */}
                    <div className="mt-6 pt-4 border-t border-primary-100/40 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-primary-900 text-sm flex items-center gap-1.5">
                          {review.name}
                          {review.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-bold text-primary-700 bg-primary-100/80 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-primary-700" />
                              Verified
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-foreground/50 mt-0.5">
                          {review.location} • {review.date}
                        </p>
                      </div>

                      {/* Accent Category Tag */}
                      <span className="text-[10px] font-bold text-accent-gold-dark bg-accent-gold/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {review.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
