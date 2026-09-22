"use client";

import React, { useState } from "react";
import { Star, Quote, CheckCircle2, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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
  isWhatsAppProof?: boolean;
}

const whatsappScreenshots = [
  {
    id: 1,
    title: "Baby Weaning & Weight Gain",
    subtitle: "Mother sharing healthy infant growth",
    src: "/reviews/whatsapp-review-1.jpg",
    author: "Zaiba Shigao",
  },
  {
    id: 2,
    title: "Doctor's Clinical Feedback",
    subtitle: "Ayurvedic practitioner feedback on patients",
    src: "/reviews/whatsapp-review-2.jpg",
    author: "Dr. Abhi Ayur Healthcare",
  },
  {
    id: 3,
    title: "Child Nutrition & Growth",
    subtitle: "Immunity and digestion satisfaction",
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
    isWhatsAppProof: true,
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
    isWhatsAppProof: true,
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
    isWhatsAppProof: true,
  },
  {
    id: 4,
    name: "Priya R.",
    location: "Bengaluru",
    rating: 5,
    date: "July 2026",
    text: "I've been using GutVaidya Health Mix for the last 3 months. My chronic acidity and bloating are completely gone. It's incredibly light on the stomach and keeps me energetic all day!",
    category: "Acidity Relief",
    verified: true,
  },
  {
    id: 5,
    name: "Dr. Sandeep K.",
    location: "Mumbai",
    rating: 5,
    date: "June 2026",
    text: "As an Ayurvedic practitioner, I highly recommend GutVaidya. The sprouted grains and traditional herbs like Licorice and Shatavari are formulated in the perfect ratio. It's excellent for daily digestion.",
    category: "Clinical & Digestion",
    verified: true,
  },
  {
    id: 6,
    name: "Rajesh V.",
    location: "Hyderabad",
    rating: 5,
    date: "May 2026",
    text: "Exceptional quality. You can tell it's made in small batches. The roasted aroma of cardamom and traditional grains is wonderful. Zero added sugar and pure nutrition.",
    category: "Daily Energy",
    verified: true,
  },
  {
    id: 7,
    name: "Kavitha Nair",
    location: "Kochi",
    rating: 5,
    date: "June 2026",
    text: "After trying multiple health drinks for my daughter, I shifted to GutVaidya. It's natural, full of sprouted millets and nuts. Her bowel movements are regular and she feels much more active.",
    category: "Baby & Kids",
    verified: true,
  },
  {
    id: 8,
    name: "Amit S.",
    location: "Delhi",
    rating: 5,
    date: "July 2026",
    text: "GutVaidya has been a game changer for my morning acid reflux. I drink it warm every morning, and it works better than any antacid. Highly recommend this natural formula.",
    category: "Acidity Relief",
    verified: true,
  },
];

const categories = ["All", "Baby & Kids", "Clinical & Digestion", "Acidity Relief", "Daily Energy"];

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
    <section id="reviews" className="py-24 bg-primary-50/20 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-100/30 filter blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-gold/5 filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-100/80 text-primary-700 text-xs font-semibold uppercase tracking-wider border border-primary-200/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            Real Customer Proof
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900 leading-tight">
            Loved by 1,00,000+ Happy Families
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl mx-auto">
            Real WhatsApp chats, practitioner feedback, and authentic experiences from homes across India.
          </p>
        </div>

        {/* Rating Summary & Filter Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">

          {/* Left: Overall Rating Card & WhatsApp Screenshot Showcase */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overall Rating Box */}
            <div className="bg-white border border-primary-100/60 p-7 rounded-3xl shadow-sm text-center space-y-4">
              <h3 className="font-serif font-bold text-primary-900 text-base">Overall Satisfaction Rating</h3>

              <div className="flex flex-col items-center justify-center space-y-1.5">
                <span className="text-5xl font-serif font-bold text-primary-800">4.9</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
                <span className="text-xs text-foreground/60">Based on 10,480 verified reviews</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-primary-100/60 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-12 text-left font-medium text-foreground/70">5 Star</span>
                  <div className="flex-1 h-2 bg-primary-50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold rounded-full w-[94%]" />
                  </div>
                  <span className="w-8 text-right font-semibold text-foreground/80">94%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 text-left font-medium text-foreground/70">4 Star</span>
                  <div className="flex-1 h-2 bg-primary-50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold rounded-full w-[5%]" />
                  </div>
                  <span className="w-8 text-right font-semibold text-foreground/80">5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 text-left font-medium text-foreground/70">3 Star</span>
                  <div className="flex-1 h-2 bg-primary-50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-right font-semibold text-foreground/80">1%</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Proof Carousel Card */}
            <div className="bg-white border border-primary-100/60 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-primary-100/60 pb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <h3 className="font-serif font-bold text-primary-900 text-sm sm:text-base">WhatsApp Reviews</h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#25D366] bg-[#25D366]/10 px-2.5 py-0.5 rounded-full">
                  100% Real
                </span>
              </div>

              {/* Chat Title & Nav Arrows */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-primary-900 font-serif leading-tight">
                    {currentScreenshot.title}
                  </h4>
                  <p className="text-[11px] text-foreground/50">{currentScreenshot.author}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevScreenshot}
                    className="p-1.5 rounded-full hover:bg-primary-50 text-primary-800 border border-primary-100 transition-colors"
                    title="Previous Review"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextScreenshot}
                    className="p-1.5 rounded-full hover:bg-primary-50 text-primary-800 border border-primary-100 transition-colors"
                    title="Next Review"
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
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-primary-900 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-primary-700" /> Click to expand
                  </span>
                </div>
              </div>

              {/* Thumbnail Selector Pills */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {whatsappScreenshots.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreenshotIdx(idx)}
                    className={`p-1.5 rounded-xl border text-[10px] font-semibold text-center transition-all ${activeScreenshotIdx === idx
                        ? "bg-primary-700 text-white border-primary-700 shadow-sm"
                        : "bg-primary-50/50 text-foreground/70 border-primary-100 hover:bg-primary-100/50"
                      }`}
                  >
                    Proof #{idx + 1}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-foreground/55 text-center leading-relaxed italic">
                Direct unmodified feedback received on our official WhatsApp support channel.
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
                      : "bg-white border-primary-100 text-foreground/75 hover:border-primary-200 hover:bg-primary-50/50"
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
                    className={`glass-card rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${review.isWhatsAppProof
                        ? "border-[#25D366]/40 bg-gradient-to-br from-white to-[#25D366]/5"
                        : "border-primary-100/60 bg-white hover:border-accent-gold/40"
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
                        {review.isWhatsAppProof ? (
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
                        <h4 className="font-serif font-bold text-primary-900 text-xs sm:text-sm flex items-center gap-1.5">
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
          <div className="relative max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewModalImg}
              alt="Expanded WhatsApp Proof"
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
