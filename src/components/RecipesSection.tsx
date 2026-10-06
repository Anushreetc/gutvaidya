"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Flame, Soup, Clock, ChefHat, CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";

const recipes = [
  {
    id: "drink",
    title: "Health Mix Drink",
    subtitle: "A quick, immune boosting and nourishing blend for your busy morning routine.",
    time: "2 mins",
    difficulty: "Easy",
    ingredients: [
      "2 tablespoons of GutVaidya Health Mix or 1 scoop (25g)",
      "2 glasses of Water (or Milk)",
      "1-2 teaspoons of Jaggery or Salt",

    ],
    steps: [
      "Take 2 tablespoons of GutVaidya Health Mix in a small bowl.",
      "Add 2 glasses of water or milk, mixing thoroughly to make a smooth paste without any lumps.",
      "Simmer on a low flame for 2 minutes and stir continously to avoid lumps.",
      "Sweeten with jaggery, honey, or raw sugar as preferred or you can add salt as per your taste."
    ],
    icon: Coffee,
  },
  {
    id: "soup",
    title: "GutVaidya Soup",
    subtitle: "A warm, savory, and fiber-rich soup to soothe and comfort your gut.",
    time: "10 mins",
    difficulty: "Easy",
    ingredients: [
      "2 tablespoons of GutVaidya Health Mix",
      "2 cups of Water or Vegetable Broth",
      "1/2 cup of finely chopped mixed vegetables (carrots, beans, peas)",
      "1/2 teaspoon of Black Pepper & Cumin powder",
      "Salt to taste",
      "1 teaspoon of Ghee or Butter",
      "Fresh Coriander leaves for garnish"
    ],
    steps: [
      "Mix 2 tablespoons of GutVaidya Health Mix in 1/2 cup of water to make a smooth, lump-free paste.",
      "Heat ghee or butter in a pan, add cumin, and sauté the chopped vegetables for 2 minutes until tender.",
      "Add the remaining water (or broth) along with salt and pepper, and bring it to a gentle boil.",
      "Slowly pour in the Health Mix paste while stirring continuously to prevent any lumps from forming.",
      "Simmer on a low flame for 3-4 minutes until the soup thickens. Garnish with fresh coriander and serve hot."
    ],
    icon: Soup,
  },
  {
    id: "dosa",
    title: "Health Mix Dosa",
    subtitle: "Healthy, crispy, and perfect for a comforting, gut-friendly meal.",
    time: "15 mins",
    difficulty: "Medium",
    ingredients: [
      "1 cup of GutVaidya Health Mix",
      "1 cup of Dosa Batter (rice-lentil mix)",
      "1/2 cup of Finely Chopped Onions & Coriander",
      "A pinch of Cumin seeds and Salt to taste",
      "Ghee or Cold-pressed oil for cooking"
    ],
    steps: [
      "Mix the GutVaidya Health Mix with the regular dosa batter until fully combined.",
      "Add a little water if needed to adjust the batter to a smooth, pourable consistency.",
      "Fold in the chopped onions, coriander leaves, cumin seeds, and a pinch of salt.",
      "Heat a cast-iron skillet (tawa) and brush it lightly with ghee or oil.",
      "Pour a ladleful of batter and spread it in a circular motion to make a thin, crispy crepe.",
      "Drizzle ghee around the edges and cook on medium heat until golden brown. Flip and cook the other side. Serve hot with coconut chutney."
    ],
    icon: Flame,
  },
  {
    id: "ladoo",
    title: "Health Mix Ladoo",
    subtitle: "A sweet treat made with traditional goodness and nutritional balance.",
    time: "20 mins",
    difficulty: "Easy-Medium",
    ingredients: [
      "2 cups of GutVaidya Health Mix",
      "3/4 cup of Melted Ghee",
      "3/4 cup of Powdered Jaggery",
      "A handful of Chopped Almonds, Cashews, and Raisins",
      "1/2 teaspoon of Cardamom powder"
    ],
    steps: [
      "Dry roast the GutVaidya Health Mix in a heavy-bottomed pan on a low flame for 4-5 minutes until aromatic.",
      "Transfer the roasted mix to a large plate and allow it to cool down to lukewarm.",
      "Add the powdered jaggery and cardamom powder, mixing them evenly with your fingertips.",
      "Heat 2 tablespoons of ghee in a pan and lightly roast the chopped nuts and raisins until golden.",
      "Pour the roasted nuts along with the remaining warm melted ghee into the mixture.",
      "Mix well and shape small portions into round, firm balls (ladoos) while still warm. Let cool and store in an airtight container."
    ],
    icon: ChefHat,
  },


];

export default function RecipesSection() {
  const [activeTab, setActiveTab] = useState(recipes[0].id);

  const activeRecipe = recipes.find((r) => r.id === activeTab) || recipes[0];
  const IconComponent = activeRecipe.icon;

  return (
    <section id="recipe" className="py-24 bg-base-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeading
          className="mb-16"
          eyebrow={"Simple & Nourishing"}
          title={"Everyday Wellness Recipes"}
          body={"Quick, delicious, and easy methods to incorporate the goodness of GutVaidya into your family\u2019s meals."}
        />

        {/* Recipe Interface Layout */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-start">

          {/* Left: Tab selectors */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-4 lg:pb-0 scrollbar-none">
            {recipes.map((recipe) => {
              const RIcon = recipe.icon;
              return (
                <button
                  key={recipe.id}
                  onClick={() => setActiveTab(recipe.id)}
                  className={`flex items-center gap-4 px-6 py-4.5 rounded-2xl text-left border transition-all flex-shrink-0 lg:flex-shrink w-auto lg:w-full focus:outline-none ${activeTab === recipe.id
                    ? "bg-primary-700 border-primary-700 text-white shadow-lg shadow-primary-700/10"
                    : "bg-base-100 border-primary-100 hover:border-primary-200 text-foreground/80"
                    }`}
                >
                  <div className={`p-2.5 rounded-xl ${activeTab === recipe.id ? "bg-base-50/10 text-white" : "bg-primary-50 text-primary-700"}`}>
                    <RIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base leading-tight">{recipe.title}</h3>
                    <p className={`text-xs mt-0.5 ${activeTab === recipe.id ? "text-white/60" : "text-foreground/50"}`}>
                      {recipe.time} • {recipe.difficulty}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Recipe details with animations */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8"
              >

                {/* Meta details */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary-100/60 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 flex items-center gap-2">
                      <IconComponent className="w-7 h-7 text-accent-gold" />
                      {activeRecipe.title}
                    </h3>
                    <p className="text-sm text-foreground/75 italic">
                      {activeRecipe.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {activeRecipe.time}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-gold/10 text-accent-gold-dark text-xs font-semibold">
                      <ChefHat className="w-3.5 h-3.5" />
                      {activeRecipe.difficulty}
                    </div>
                  </div>
                </div>

                {/* Grid: Ingredients & Preparation */}
                <div className="grid md:grid-cols-12 gap-8">

                  {/* Ingredients */}
                  <div className="md:col-span-5 space-y-4">
                    <h4 className="font-sans font-bold text-lg text-primary-800 border-l-4 border-accent-gold pl-3">
                      Ingredients
                    </h4>
                    <ul className="space-y-3">
                      {activeRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-snug">
                          <CheckCircle2 className="w-4 h-4 text-accent-gold mt-0.5 flex-shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Directions */}
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="font-sans font-bold text-lg text-primary-800 border-l-4 border-accent-gold pl-3">
                      Preparation Steps
                    </h4>
                    <ol className="space-y-4">
                      {activeRecipe.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-foreground/75 leading-relaxed">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
