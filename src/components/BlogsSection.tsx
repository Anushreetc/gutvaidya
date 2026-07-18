"use client";

import React, { useState } from "react";
import { BookOpen, Calendar, Clock, ArrowRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "The Gut-Brain Connection: Why Wellness Starts Inside",
    summary: "Understand how your digestive tract communicating directly with your nervous system affects daily mood, energy levels, and long-term cognitive clarity.",
    content: "Did you know that over 90% of serotonin—the happy hormone—is produced in your gut? The gut is often called our 'second brain' due to the enteric nervous system containing millions of neurons. Choosing foods that support gut flora, like prebiotic grains, spices, and fermented foods, stabilizes energy, boosts focus, and strengthens natural immunity. Sprouted grains, cardamom, and ginger help optimize this digestion process.",
    date: "July 12, 2026",
    readTime: "4 mins read",
    author: "Dr. Vaidya Raman",
    tag: "Gut Health",
  },
  {
    id: 2,
    title: "Sprouting Grains: How It Multiplies Nutrition Value",
    summary: "Discover why sprouted grains are significantly easier to digest and provide twice the micronutrients compared to unsprouted varieties.",
    content: "Sprouting is nature's way of unlocking the dormant power of a seed. During sprouting, the seed releases enzymes that break down starch and phytates (which usually bind nutrients and block absorption). This makes essential minerals like Iron, Zinc, Calcium, and Magnesium highly bioavailable. It also increases soluble fiber and reduces heavy starch, meaning your body gets more nourishment with less digestive load.",
    date: "July 08, 2026",
    readTime: "5 mins read",
    author: "Nutritionist Sneha",
    tag: "Traditional Science",
  },
  {
    id: 3,
    title: "Whole Grains vs. Synthetic Nutritional Supplements",
    summary: "An honest comparison between natural food synergy and lab-isolated synthetic vitamins. Why real food is always superior.",
    content: "Our bodies have evolved to recognize nutrients in their natural context—surrounded by co-factors, enzymes, and mineral networks. When you isolate vitamins (like ascorbic acid vs. a whole alma extract), the body doesn't absorb or synthesize them as efficiently. A complete food like GutVaidya provides a matrix of 36+ ingredients working in synergy, providing natural dietary fibers, fats, and minerals that support metabolic health sustainably.",
    date: "June 28, 2026",
    readTime: "6 mins read",
    author: "Wellness Expert K.",
    tag: "Clean Eating",
  },
];

export default function BlogsSection() {
  const [selectedBlog, setSelectedBlog] = useState<typeof blogs[0] | null>(null);

  return (
    <section id="blogs" className="py-24 bg-[#fdfdfb] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Wholesome Wisdom
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900">
            Wellness & Nutrition Blogs
          </h2>
          <p className="text-base text-foreground/75 leading-relaxed">
            Read expert-backed articles on traditional nutrition, gut biome science, and leading a healthy lifestyle.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-foreground/50">
                  <span className="flex items-center gap-1.5 font-medium text-accent-gold-dark">
                    <Sparkles className="w-3 h-3" />
                    {blog.tag}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.date}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif font-bold text-primary-900 line-clamp-2 leading-snug">
                  {blog.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed">
                  {blog.summary}
                </p>
              </div>

              {/* Card Footer / CTA */}
              <div className="pt-6 border-t border-primary-100/40 mt-6 flex items-center justify-between">
                <span className="text-xs text-foreground/50 font-medium">By {blog.author}</span>
                <button
                  onClick={() => setSelectedBlog(blog)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-850 hover:gap-2 transition-all focus:outline-none"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Article Detail Modal Overlay */}
      <AnimatePresence>
        {selectedBlog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Modal Body */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative bg-[#fdfdfb] max-w-2xl w-full rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-primary-100/60 max-h-[85vh] overflow-y-auto space-y-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-foreground/60 hover:text-foreground hover:bg-primary-50 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Tag & Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/50 pt-2">
                  <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold uppercase tracking-wider">
                    {selectedBlog.tag}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedBlog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedBlog.readTime}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 leading-tight">
                  {selectedBlog.title}
                </h3>

                {/* Author Info */}
                <div className="flex items-center gap-2 border-b border-primary-100/50 pb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-xs font-bold font-serif">
                    {selectedBlog.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-950">{selectedBlog.author}</p>
                    <p className="text-[10px] text-foreground/55">Expert Contributor</p>
                  </div>
                </div>

                {/* Article Content */}
                <div className="text-sm sm:text-base text-foreground/80 leading-relaxed space-y-4 font-sans">
                  <p className="font-semibold text-primary-950">{selectedBlog.summary}</p>
                  <p>{selectedBlog.content}</p>
                  <p>
                    A wholesome diet combined with active routines form the bedrock of gut health. Choosing unrefined grains over industrial flours is the single most effective step you can take today to support cellular regeneration and digestive comfort.
                  </p>
                </div>

                {/* Close action */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="px-6 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm transition-colors focus:outline-none"
                  >
                    Close Article
                  </button>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
