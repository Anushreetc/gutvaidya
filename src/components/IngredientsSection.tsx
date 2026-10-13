"use client";

import React, { useState } from "react";
import { Wheat, Leaf, Flame, Zap, Sprout, Flower2, Info, X, ChevronRight, Activity, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface IngredientDetail {
  name: string;
  ayurvedicBenefit: string;
  description: string;
  gutBenefit: string;
}

interface IngredientCategory {
  title: string;
  tagline: string;
  icon: React.ComponentType<any>;
  imagePath: string;
  summary: string;
  items: IngredientDetail[];
}

export default function IngredientsSection() {
  const [activeTab, setActiveTab] = useState("Millets");
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDetail | null>(null);

  const ingredientCategories: IngredientCategory[] = [
    {
      title: "Millets",
      tagline: "Ancient Grains for Gut Strength",
      icon: Wheat,
      imagePath: "/images/ingredients/millets.png",
      summary: "Millets are gluten-free, highly alkaline, and rich in prebiotic fibers that feed beneficial gut bacteria, improve bowel movement, and ease digestion.",
      items: [
        {
          name: "Ragi (Finger Millet)",
          ayurvedicBenefit: "Cooling & Deeply Nourishing",
          description: "An exceptionally rich source of calcium, iron, and dietary fiber.",
          gutBenefit: "Contains prebiotic fibers that slow digestion, prevent blood sugar spikes, and nurture healthy microflora in the gut.",
        },
        {
          name: "Foxtail Millet",
          ayurvedicBenefit: "Balances Kapha & Pitta",
          description: "Packed with protein and complex low-glycemic carbohydrates.",
          gutBenefit: "Gluten-free and extremely easy on the stomach, helping to soothe and heal irritated intestinal walls.",
        },
        {
          name: "Barnyard Millet",
          ayurvedicBenefit: "Light & Highly Digestible",
          description: "High in digestible protein and contains the lowest carbohydrate content among all millets.",
          gutBenefit: "Its high soluble fiber content prevents bloating, acid reflux, and supports smooth daily digestive function.",
        },
        {
          name: "Kodo Millet",
          ayurvedicBenefit: "Detoxifying & Balancing",
          description: "Loaded with polyphenols and boasts extremely high antioxidant activity.",
          gutBenefit: "Calms inflammation in the gastrointestinal tract and helps combat harmful gut pathogens.",
        },
        {
          name: "Browntop Millet",
          ayurvedicBenefit: "Colon Cleansing & Energizing",
          description: "Contains an abundance of dietary fiber and essential minerals.",
          gutBenefit: "Acts as a natural sweep for the colon, preventing toxic buildup and helping to relieve chronic constipation.",
        },
      ],
    },
    {
      title: "Plant Based Protein",
      tagline: "Digestible Protein for Tissue Repair",
      icon: Leaf,
      imagePath: "/images/ingredients/proteins.png",
      summary: "Carefully selected and split pulses that provide essential amino acids for mucosal lining repair, processed to be light and easy to assimilate without causing gas.",
      items: [
        {
          name: "Green Gram (Mung Bean)",
          ayurvedicBenefit: "Most Digestible Legume (Sattvic)",
          description: "Exceptionally high in clean plant protein, vitamins, and minerals.",
          gutBenefit: "Extremely gentle on the digestive tract, does not produce flatulence, and helps repair damaged gut tissues.",
        },
        {
          name: "Black Gram (Urad)",
          ayurvedicBenefit: "Strengthening & Vata-Pacifying",
          description: "Rich in iron, folic acid, and soluble dietary fibers.",
          gutBenefit: "Lubricates the mucosal lining of the intestines and enhances the muscular strength of the GI tract.",
        },
        {
          name: "Bengal Gram (Chana)",
          ayurvedicBenefit: "Sustained Digestible Energy",
          description: "Excellent source of plant protein with a very low glycemic index.",
          gutBenefit: "Feeds butyrate-producing gut bacteria, which helps promote overall colon health and reduce systemic inflammation.",
        },
        {
          name: "Pigeonpea (Toor)",
          ayurvedicBenefit: "Balances Pitta & Kapha",
          description: "High in dietary fiber, protein, and essential amino acids.",
          gutBenefit: "Easily digestible when paired with traditional carminative spices, supporting regular bowel motions.",
        },
        {
          name: "Soyabean",
          ayurvedicBenefit: "Complete Amino Acid Profile",
          description: "A complete protein containing all nine essential amino acids.",
          gutBenefit: "Supports healthy gut microbiome diversity and supplies the raw materials for cellular repair of the intestinal wall.",
        },
      ],
    },
    {
      title: "Spices",
      tagline: "Kindling the Digestive Fire (Agni)",
      icon: Flame,
      imagePath: "/images/ingredients/spices.png",
      summary: "A traditional blend of carminative spices that stimulate salivary enzymes, improve nutrient absorption, and relieve gas, bloating, and acidity.",
      items: [
        {
          name: "Cumin (Jeera)",
          ayurvedicBenefit: "Kindles Agni Without Overheating",
          description: "A traditional digestive stimulant packed with thymol and antioxidants.",
          gutBenefit: "Enhances the release of bile and pancreatic enzymes, preventing gas formation and cramping in the small intestine.",
        },
        {
          name: "Fennel (Saunf)",
          ayurvedicBenefit: "Cooling & Soothing Carminative",
          description: "A sweet, aromatic spice known for anti-spasmodic effects.",
          gutBenefit: "Relaxes the smooth muscles of the digestive tract, instantly relieving bloating, cramps, and acid reflux.",
        },
        {
          name: "Ajwain (Carom Seeds)",
          ayurvedicBenefit: "Destroys Digestive Toxins (Ama)",
          description: "Rich in thymol, giving it strong antibacterial and antifungal properties.",
          gutBenefit: "Relieves indigestion, severe flatulence, and spasmodic stomach pain almost instantly by stimulating gut juices.",
        },
      ],
    },
    {
      title: "Natural Energy Sources",
      tagline: "Clean Fuel for Digestive Comfort",
      icon: Zap,
      imagePath: "/images/ingredients/energy.png",
      summary: "Easily digestible carbohydrates that provide sustained cellular energy without taxing a delicate digestive system or causing heavy fatigue.",
      items: [
        {
          name: "Red Rice",
          ayurvedicBenefit: "Nourishing & Blood-Purifying",
          description: "Rich in anthocyanins (antioxidants) and essential B-vitamins.",
          gutBenefit: "Highly digestible, soothing to the stomach lining, and helps reduce inflammation in the gut wall.",
        },
        {
          name: "Broken Wheat (Dalia)",
          ayurvedicBenefit: "Sustaining & Rejuvenating",
          description: "Whole wheat cracked into small, easy-to-cook pieces, retaining all fiber.",
          gutBenefit: "Provides slow-release energy and bulks the stool, promoting healthy peristalsis and regular clearance.",
        },
        {
          name: "Sabudana (Tapioca)",
          ayurvedicBenefit: "Instant Cooling Energy",
          description: "Pure starch pearls sourced from the cassava root.",
          gutBenefit: "Extremely light and easy to digest, it forms a soothing, protective gel over irritated stomach linings.",
        },
      ],
    },
    {
      title: "Seeds",
      tagline: "Lubricants & Fiber Powerhouses",
      icon: Sprout,
      imagePath: "/images/ingredients/seeds.png",
      summary: "Powerhouses of omega-3 fatty acids and soluble mucilage that lubricate the digestive tract and maintain healthy transit times.",
      items: [
        {
          name: "Flaxseed",
          ayurvedicBenefit: "Lubricating & Vata-Pacifying",
          description: "Rich source of lignans, soluble fiber, and plant-based Omega-3s.",
          gutBenefit: "Forms a soothing gel when combined with water, lubricating the bowel and easing chronic constipation.",
        },
        {
          name: "Sesame Seeds",
          ayurvedicBenefit: "Warm, Nourishing & Grounding",
          description: "High in calcium, magnesium, and healthy fats.",
          gutBenefit: "Nourishes the colon tissues and supports the growth of beneficial gut microflora.",
        },
      ],
    },
    {
      title: "Natural Herbs",
      tagline: "Ayurvedic Adaptogens for Gut-Brain Axis",
      icon: Flower2,
      imagePath: "/images/ingredients/herbs.png",
      summary: "A legendary collection of therapeutic herbs that heal the mucosal lining, reduce stress-induced gut issues, and balance the microbiome.",
      items: [
        {
          name: "Ashwagandha",
          ayurvedicBenefit: "Powerful Rasayana (Rejuvenator)",
          description: "Renowned adaptogen that helps the body cope with physical and mental stress.",
          gutBenefit: "Calms the gut-brain axis, reducing stress-induced gut sensitivity, IBS flares, and inflammation.",
        },
        {
          name: "Shatavari",
          ayurvedicBenefit: "Cooling & Mucosal Protective",
          description: "Nutritive tonic with strong cooling and anti-inflammatory properties.",
          gutBenefit: "Protects and heals the mucosal lining of the stomach and duodenum, relieving hyperacidity.",
        },
        {
          name: "Kapikacchu",
          ayurvedicBenefit: "Calms Vata & Supports Nerves",
          description: "A natural source of L-DOPA, supporting dopamine production.",
          gutBenefit: "Strengthens the enteric nervous system of the gut, improving peristaltic movement and coordination.",
        },
        {
          name: "Safed Musli",
          ayurvedicBenefit: "Nourishing & Immunity Booster",
          description: "Valued for its adaptogenic and nutritive tonic qualities.",
          gutBenefit: "Aids in tissue regeneration of the intestinal lining and acts as a mild prebiotic for beneficial gut microbes.",
        },
        {
          name: "Brahmi",
          ayurvedicBenefit: "Calms the Enteric Nervous System",
          description: "A premier brain tonic that relaxes the central nervous system.",
          gutBenefit: "Combats nervous indigestion, reducing spasms and bloating caused by anxiety and mental fatigue.",
        },
        {
          name: "Licorice (Mulethi)",
          ayurvedicBenefit: "Sweet, Cooling & Demulcent",
          description: "Traditional herb containing glycyrrhizin, which soothes irritated tissues.",
          gutBenefit: "Coats the stomach lining to protect against acid, healing ulcers and reducing heartburn.",
        },
        {
          name: "Trikatu",
          ayurvedicBenefit: "Ignites Digestive Fire & Clears Toxins",
          description: "A classic Ayurvedic blend of Ginger, Black Pepper, and Long Pepper.",
          gutBenefit: "Stimulates gastric secretions, speeds up sluggish digestion, and improves nutrient bioavailability.",
        },
        {
          name: "Triphala",
          ayurvedicBenefit: "Universal Colon Regulator",
          description: "A synergy of three fruits: Amalaki, Bibhitaki, and Haritaki.",
          gutBenefit: "Gently detoxifies the colon, regulates bowel movements, and repairs intestinal tissues without habit-forming effects.",
        },
        {
          name: "Moringa",
          ayurvedicBenefit: "Highly Anti-inflammatory",
          description: "Superfood packed with iron, vitamins, and active bio-compounds.",
          gutBenefit: "Inhibits growth of harmful pathogens while providing anti-inflammatory relief to the gut wall.",
        },
      ],
    },
  ];

  const activeCategory = ingredientCategories.find((cat) => cat.title === activeTab) || ingredientCategories[0];
  const ActiveIcon = activeCategory.icon;

  return (
    <section id="ingredients" className="py-24 bg-base-100 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary-50/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeading
          className="mb-16"
          eyebrow={"Nature's Bounty"}
          title={"Our Wholesome Ingredients"}
          body={"Carefully selected from nature, each ingredient in GutVaidya brings its own unique traditional wellness benefits."}
        />

        {/* Main Explorer Panel */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Category Tabs */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
            {ingredientCategories.map((category) => {
              const TabIcon = category.icon;
              const isSelected = activeTab === category.title;
              return (
                <button
                  key={category.title}
                  onClick={() => setActiveTab(category.title)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-left border transition-all duration-300 flex-shrink-0 lg:flex-shrink-0 snap-center w-[260px] lg:w-full focus:outline-none relative group overflow-hidden ${isSelected
                    ? "bg-primary-700 border-primary-700 text-white shadow-xl shadow-primary-700/10"
                    : "bg-base-50/80 border-primary-100/60 hover:border-primary-200 hover:bg-base-50 text-foreground/80 hover:shadow-md"
                    }`}
                >
                  {/* Subtle active background glow decoration */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className={`p-3 rounded-xl transition-colors ${isSelected ? "bg-base-50/10 text-white" : "bg-primary-50 text-primary-700 group-hover:bg-primary-100"
                    }`}>
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-sans font-bold text-base leading-tight">
                      {category.title}
                    </h3>
                    <p className={`text-xs mt-0.5 truncate ${isSelected ? "text-white/70" : "text-foreground/50"
                      }`}>
                      {category.tagline}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-50 transition-transform ${isSelected ? "translate-x-0.5 text-white" : "group-hover:translate-x-0.5 text-foreground/50"
                    }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Display Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-8"
              >
                {/* Category Hero Banner */}
                <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden shadow-lg border border-primary-100/50 group bg-primary-900">
                  <img
                    src={activeCategory.imagePath}
                    alt={activeCategory.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/65 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white space-y-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent-gold/20 text-accent-gold-light text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-accent-gold/30">
                      {activeCategory.tagline}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight flex items-center gap-2.5">
                      <ActiveIcon className="w-6 h-6 text-accent-gold" />
                      {activeCategory.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-2xl font-light">
                      {activeCategory.summary}
                    </p>
                  </div>
                </div>

                {/* Grid of Ingredient Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCategory.items.map((ingredient) => (
                    <motion.div
                      key={ingredient.name}
                      onClick={() => setSelectedIngredient(ingredient)}
                      className="glass-card rounded-2xl p-5 border border-primary-100/60 hover:border-accent-gold/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary-100/10 group flex flex-col justify-between"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-lg font-sans font-bold text-primary-900 leading-snug group-hover:text-accent-gold-dark transition-colors">
                            {ingredient.name}
                          </h4>
                          <span className="p-1.5 rounded-full bg-primary-50 text-primary-75 group-hover:bg-accent-gold/10 group-hover:text-accent-gold-dark transition-colors">
                            <Info className="w-4 h-4" />
                          </span>
                        </div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-accent-gold-dark bg-accent-gold/10 px-2 py-0.5 rounded-md mt-2">
                          {ingredient.ayurvedicBenefit}
                        </span>
                        <p className="text-xs text-foreground/70 mt-3 line-clamp-2 leading-relaxed">
                          {ingredient.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 group-hover:text-accent-gold-dark mt-4 transition-colors">
                        View Gut Healing Action
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Detail Modal Popover */}
      <AnimatePresence>
        {selectedIngredient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIngredient(null)}
              className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-base-50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-primary-100 z-10 overflow-hidden"
            >
              {/* Blur accent glow decorations inside modal */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary-50/50 blur-2xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-accent-gold/5 blur-2xl -z-10" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedIngredient(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-50 text-foreground/50 hover:text-foreground transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-gold-dark px-2.5 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 inline-block">
                    {selectedIngredient.ayurvedicBenefit}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 mt-3.5">
                    {selectedIngredient.name}
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent-gold" />
                      Traditional Ayurvedic Profile
                    </h4>
                    <p className="text-sm text-foreground/85 leading-relaxed pl-6">
                      {selectedIngredient.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-accent-gold" />
                      Gut Healing Action
                    </h4>
                    <p className="text-sm text-foreground/85 leading-relaxed pl-6 border-l-2 border-primary-100">
                      {selectedIngredient.gutBenefit}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedIngredient(null)}
                    className="w-full py-3 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm transition-colors shadow-lg shadow-primary-700/10 focus:outline-none"
                  >
                    Close Explorer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
