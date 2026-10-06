"use client";

import React, { useState } from "react";
import { Star, Quote, CheckCircle2, MessageCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  category: string;
  verified: boolean;
  isWhatsAppReview?: boolean;
}

const whatsappScreenshots = [
  {
    id: 1,
    tabLabel: "Infant Nutrition",
    title: "Baby Weaning & Weight Gain",
    subtitle: "Mother sharing healthy infant growth",
    src: "/reviews/whatsapp-review-1.jpg",
    author: "Zaiba Shigao",
  },
  {
    id: 2,
    tabLabel: "Clinical Feedback",
    title: "Doctor's Clinical Assessment",
    subtitle: "Ayurvedic practitioner feedback on patients",
    src: "/reviews/whatsapp-review-2.jpg",
    author: "Dr. Abhi Ayur Healthcare",
  },
  {
    id: 3,
    tabLabel: "Child Wellness",
    title: "Child Growth & Immunity",
    subtitle: "Daily vitality and digestion satisfaction",
    src: "/reviews/whatsapp-review-3.jpg",
    author: "Mrs. Salma Aag",
  },
];

const reviewsData: Review[] = [
  {
    id: 1,
    name: "Zaiba Shigao",
    location: "Karnataka",
    rating: 5,
    date: "Verified WhatsApp Review",
    text: "This is a complete food for babies who have just started their liquid foods. I was so worried about what to give, but this one is so good and healthy at the same time! My baby has it every morning with no tantrums, and she has gained weight with regular intake. Very satisfied!",
    category: "Baby & Kids",
    verified: true,
    isWhatsAppReview: true,
  },
  {
    id: 2,
    name: "Dr. Abhi Ayur (Holistic Healthcare)",
    location: "Bengaluru",
    rating: 5,
    date: "Verified Practitioner Review",
    text: "One of the best nutrition powders I used in my patients. Got wonderful response with increasing appetite and reducing fatigue. Reduces mood swings in women and helps in getting good sleep. All patients who used it were very happy.",
    category: "Clinical & Digestion",
    verified: true,
    isWhatsAppReview: true,
  },
  {
    id: 3,
    name: "Mrs. Salma Aag",
    location: "Verified Buyer",
    rating: 5,
    date: "Verified WhatsApp Review",
    text: "It is an immense pleasure to share thanks for giving such a wonderful health supplement for my kid 🙏 My baby is having it without any hesitation and I am observing her steady growth. Recommending this without any doubt to every family!",
    category: "Baby & Kids",
    verified: true,
    isWhatsAppReview: true,
  },
];

const categories = ["All", ...Array.from(new Set(reviewsData.map((r) => r.category)))];

export default function ReviewsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const filteredReviews = activeCategory === "All"
    ? reviewsData
    : reviewsData.filter((r) => r.category === activeCategory);

  const currentScreenshot = whatsappScreenshots[activeScreenshotIdx];

  const handleNextScreenshot = () => {
    setActiveScreenshotIdx((prev) => (prev + 1) % whatsappScreenshots.length);
  };

  const handlePrevScreenshot = () => {
    setActiveScreenshotIdx((prev) => (prev - 1 + whatsappScreenshots.length) % whatsappScreenshots.length);
  };

  return (
    <section id="reviews" className="py-24 bg-base-200 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-100/30 filter blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-gold/5 filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeading
          className="mb-16"
          eyebrow={"Verified Customer Stories"}
          title={"Loved by 10,000+ Happy Families"}
          body={"Authentic customer messages, practitioner evaluations, and real wellness experiences from across India."}
        />

        {/* Rating Summary & Filter Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">

          {/* Left: Overall Rating Card & WhatsApp Screenshot Showcase */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Families Served */}
            <div className="bg-base-50 border border-primary-100/60 p-7 rounded-3xl shadow-sm text-center space-y-3">
              <h3 className="font-sans font-bold text-primary-900 text-base">Trusted Across India</h3>
              <span className="block text-5xl font-sans font-bold text-primary-800">10,000+</span>
              <span className="block text-xs text-foreground/60">Happy families nourished by GutVaidya</span>
              <p className="pt-3 border-t border-primary-100/60 text-[11px] text-foreground/55 leading-relaxed">
                Every review on this page is a real message from a customer or practitioner.
              </p>
            </div>

            {/* WhatsApp Experience Showcase Card */}
            <div className="bg-base-50 border border-primary-100/60 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-primary-100/60 pb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <h3 className="font-sans font-bold text-primary-900 text-sm sm:text-base">Customer WhatsApp Chats</h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#25D366] bg-[#25D366]/10 px-2.5 py-0.5 rounded-full">
                  Direct Feedback
                </span>
              </div>

              {/* Chat Title & Nav Arrows */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-primary-900 font-sans leading-tight">
                    {currentScreenshot.title}
                  </h4>
                  <p className="text-[11px] text-foreground/50">{currentScreenshot.author}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevScreenshot}
                    className="p-1.5 rounded-full hover:bg-primary-50 text-primary-800 border border-primary-100 transition-colors"
                    title="Previous Experience"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextScreenshot}
                    className="p-1.5 rounded-full hover:bg-primary-50 text-primary-800 border border-primary-100 transition-colors"
                    title="Next Experience"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Screenshot Image Frame with Click to Zoom */}
              <div
                onClick={() => setPreviewModalImg(currentScreenshot.src)}
                className="relative rounded-2xl overflow-hidden border border-primary-100/40 bg-[#efeae2] group cursor-pointer shadow-inner max-h-[380px] flex items-center justify-center"
              >
                <img
                  src={currentScreenshot.src}
                  alt={currentScreenshot.title}
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-base-50/90 text-primary-900 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-primary-700" /> Click to view full image
                  </span>
                </div>
              </div>

              {/* Category Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {whatsappScreenshots.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreenshotIdx(idx)}
                    className={`px-2 py-1.5 rounded-xl border text-[10px] font-semibold text-center transition-all truncate ${activeScreenshotIdx === idx
                        ? "bg-primary-700 text-white border-primary-700 shadow-sm"
                        : "bg-primary-50/50 text-foreground/70 border-primary-100 hover:bg-primary-100/50"
                      }`}
                  >
                    {item.tabLabel}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-foreground/55 text-center leading-relaxed italic">
                Unmodified messages received directly on our official customer care channel.
              </p>
            </div>
          </div>

          {/* Right: Interactive Filters & Reviews Grid */}
          <div className="lg:col-span-8 space-y-6">

            {/* Category Filter tabs */}
            <div className="flex flex-wrap gap-2 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 focus:outline-none ${activeCategory === cat
                      ? "bg-primary-700 border-primary-700 text-white shadow-md shadow-primary-700/10"
                      : "bg-base-50 border-primary-100 text-foreground/75 hover:border-primary-200 hover:bg-primary-50/50"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Reviews Grid */}
            <motion.div layout className="grid md:grid-cols-2 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((review) => (
                  <motion.div
                    layout
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`glass-card rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${review.isWhatsAppReview
                        ? "border-[#25D366]/40 bg-gradient-to-br from-white to-[#25D366]/5"
                        : "border-primary-100/60 bg-base-50 hover:border-accent-gold/40"
                      }`}
                  >
                    <div className="space-y-3.5">
                      {/* Rating Stars & Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                          ))}
                        </div>
                        {review.isWhatsAppReview ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full border border-[#25D366]/20">
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </span>
                        ) : (
                          <Quote className="w-4 h-4 text-accent-gold/30" />
                        )}
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    {/* Reviewer Details */}
                    <div className="mt-5 pt-3.5 border-t border-primary-100/40 flex items-center justify-between">
                      <div>
                        <h4 className="font-sans font-bold text-primary-900 text-xs sm:text-sm flex items-center gap-1.5">
                          {review.name}
                          {review.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-sans font-bold text-primary-700 bg-primary-100/80 px-1.5 py-0.2 rounded-full">
                              <CheckCircle2 className="w-2.5 h-2.5 text-primary-700" />
                              Verified
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-foreground/50 mt-0.5">
                          {review.location} • {review.date}
                        </p>
                      </div>

                      {/* Accent Category Tag */}
                      <span className="text-[10px] font-bold text-accent-gold-dark bg-accent-gold/10 px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
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

      {/* Fullscreen Screenshot Modal */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-lg max-h-[90vh] bg-base-50 rounded-3xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewModalImg}
              alt="Customer Feedback Preview"
              className="w-full h-auto max-h-[82vh] object-contain rounded-2xl"
            />
            <div className="p-3 text-center">
              <button
                onClick={() => setPreviewModalImg(null)}
                className="px-6 py-1.5 bg-primary-800 text-white text-xs font-bold rounded-full hover:bg-primary-900"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
