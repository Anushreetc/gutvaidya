"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bean, ShieldCheck, Sprout, Wheat } from "lucide-react";
import { useCart } from "../context/CartContext";
import styles from "./ReferenceLanding.module.css";
import BlendExplorer from "./BlendExplorer";
import HeroShowcase from "./HeroShowcase";
import PreparationPouch from "./PreparationPouch";
import IntroSplash from "./IntroSplash";
import { Product } from "@/types/ecommerce";
import { SEED_PRODUCTS } from "@/lib/products";
import {
  getProductOverrides,
  applyProductOverride,
  subscribeToProductUpdates,
} from "@/lib/products-client";

const preparationSteps = [
  {
    step: "01",
    title: "Mix in Pan",
    image: "/cinematic/prep-step1.jpg",
    alt: "Measuring 1 scoop GutVaidya into pan with liquid",
    text: "Add 1 scoop (25g) of GutVaidya Diet Powder into 400ml water or milk in a pan and stir to dissolve.",
  },
  {
    step: "02",
    title: "Simmer on Low Heat",
    image: "/cinematic/prep-step2.jpg",
    alt: "Simmering on low flame for 2 minutes while stirring",
    text: "Cook on a low flame for 2 minutes. Stir continuously to prevent lumps and get a smooth consistency.",
  },
  {
    step: "03",
    title: "Add Jaggery & Serve",
    image: "/cinematic/prep-step3.jpg",
    alt: "Serving nourishing warm GutVaidya bowl or drink",
    text: "Add jaggery, honey, or salt as per taste. Serve comfortably warm and savor your nourishing daily ritual.",
  },
];

const manufacturingSteps = [
  {
    num: "01",
    title: "Native Sourcing",
    image: "/cinematic/mfg-step1.jpg",
    desc: "Heritage grains handpicked from regional organic farmers.",
  },
  {
    num: "02",
    title: "Ancient Sprouting",
    image: "/cinematic/mfg-step2.jpg",
    desc: "Bio-activated germination to unlock living enzymes & nutrients.",
  },
  {
    num: "03",
    title: "Gentle Roasting",
    image: "/cinematic/mfg-step3.jpg",
    desc: "Slow-roasted on low heat to develop rich aroma & easy digestion.",
  },
  {
    num: "04",
    title: "Stone Milling",
    image: "/cinematic/mfg-step4.jpg",
    desc: "Traditional cold stone-ground to retain all fiber and vital minerals.",
  },
  {
    num: "05",
    title: "Herbal Blending",
    image: "/cinematic/mfg-step5.jpg",
    desc: "Harmoniously combined with sacred Ayurvedic herbs & warming spices.",
  },
  {
    num: "06",
    title: "Nitrogen Sealing",
    image: "/cinematic/mfg-step6.jpg",
    desc: "Pristine barrier pack flushed with nitrogen to lock in 100% freshness.",
  },
];

export default function ReferenceLanding() {
  const { cart, addToCart, setIsCartOpen } = useCart();

  // Live product state synced with admin panel
  const [product, setProduct] = useState<Product>(() => {
    const defaultProduct = SEED_PRODUCTS[0];
    if (typeof window !== "undefined") {
      const overrides = getProductOverrides();
      return applyProductOverride(defaultProduct, overrides);
    }
    return defaultProduct;
  });

  useEffect(() => {
    // 1. Immediately apply any local admin overrides from cookie/localStorage
    const overrides = getProductOverrides();
    setProduct((prev) => applyProductOverride(prev, overrides));

    // 2. Fetch live persisted product from API
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const match = data.find(
            (p) => p.slug === "gutvaidya-health-mix" || p.id === "a1111111-1111-1111-1111-111111111111"
          );
          if (match) {
            setProduct(applyProductOverride(match, getProductOverrides()));
          }
        }
      })
      .catch(() => {});

    // 3. Listen to real-time broadcasts when an admin saves changes
    const unsubscribe = subscribeToProductUpdates((latestOverrides) => {
      setProduct((prev) => applyProductOverride(prev, latestOverrides));
    });

    return unsubscribe;
  }, []);

  const handleAddToCart = () => {
    const existing = cart.find(
      (item) => item.slug === product.slug || item.id === product.id
    );
    if (!existing) {
      addToCart(
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compare_at_price: product.compare_at_price,
          image: product.main_image || "/cinematic/daily-ritual.jpeg",
          stock_quantity: product.stock_quantity,
          weight_size: product.weight_size || "500g",
        },
        1
      );
    }
    setIsCartOpen(true);
  };

  return (
    <div className={styles.landing}>
      {/* Intro overlay lives at page level (not inside the hero, which is its
          own stacking context) so it covers the navbar too. */}
      <IntroSplash />

      {/* 1. HERO: product-first showcase */}
      <HeroShowcase product={product} onAddToCart={handleAddToCart} />

      {/* 2. PRODUCT SPOTLIGHT */}
      <section id="product-spotlight" className={styles.spotlight}>
        <div className={styles.watermark} aria-hidden="true">
          GUTVAIDYA
        </div>

        <div className={styles.spotlightGrid}>
          <div className={styles.spotlightCard}>
            <img
              src={
                product.main_image && !product.main_image.includes("1791966285656.png")
                  ? product.main_image
                  : "/cinematic/daily-ritual.jpeg"
              }
              alt="GutVaidya Diet Powder Pouch"
              className={styles.spotlightImage}
              width={600}
              height={750}
              loading="lazy"
            />
          </div>

          <div className={styles.spotlightCopy}>
            <span className={styles.eyebrow}>MEET YOUR PANTRY FAVOURITE</span>
            <h2>
              GutVaidya<br />
              <em>Diet Powder</em>
            </h2>

            <div className={styles.ratingBar}>
              <span className={styles.stars}>★★★★★</span>
              <span><strong>4.9 / 5.0</strong> (500+ happy customers)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>
                <span className={styles.currencySymbol}>₹</span>
                {product.price}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <>
                  <span className={styles.originalPrice}>
                    <span className={styles.currencySymbol}>₹</span>
                    {product.compare_at_price}
                  </span>
                  <span className={styles.discountBadge}>
                    SAVE {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className={styles.spotlightDesc}>
              {product.description ||
                "Crafted as a complete nourishing meal replacement and daily wellness blend. Prepared with sprouted grains, ancient millets, nuts, and digestive Ayurvedic herbs to nurture gut flora, sustain daily vitality, and promote healthy digestion."}
            </p>

            <div className={styles.nutritionPills}>
              <span className={styles.nutritionPill}><Wheat size={15} strokeWidth={1.9} aria-hidden="true" /> 36+ Ancient Ingredients</span>
              <span className={styles.nutritionPill}><Bean size={15} strokeWidth={1.9} aria-hidden="true" /> 22g Plant Protein / 100g</span>
              <span className={styles.nutritionPill}><Sprout size={15} strokeWidth={1.9} aria-hidden="true" /> Rich In Prebiotic Fiber</span>
              <span className={styles.nutritionPill}><ShieldCheck size={15} strokeWidth={1.9} aria-hidden="true" /> 100% Preservative Free</span>
            </div>

            <div className={styles.buttonGroup} style={{ justifyContent: "flex-start" }}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
              >
                {product.stock_quantity <= 0 ? "Out of Stock" : `Add to Cart · ₹${product.price}`} <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JUST 3 SIMPLE STEPS */}
      <section id="preparation" className={styles.preparation} style={{ position: "relative", overflow: "hidden" }}>
        <PreparationPouch />
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>MAKE TIME FOR YOURSELF</span>
          <h2>
            Just 3 <em>Simple Steps</em>
          </h2>
          <p className={styles.sectionSubtitle}>
            Follow these easy steps to prepare your nourishing, warm cooked serving of GutVaidya in just 2 minutes.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {preparationSteps.map((step, idx) => (
            <motion.article
              key={step.title}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
            >
              <div className={styles.stepImageContainer}>
                <img
                  src={step.image}
                  alt={step.alt}
                  className={styles.stepImage}
                  width={400}
                  height={320}
                  loading="lazy"
                />
                <span className={styles.stepBadge}>Step {step.step}</span>
              </div>
              <div className={styles.stepBody}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4. WHAT'S IN THE BLEND: interactive ingredient wheel */}
      <BlendExplorer />

      {/* 5. BENEFITS THAT NOURISH YOU */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsGrid}>
          <div className={styles.caramelCard}>
            <div>
              <span className={styles.eyebrow}>ROOTED IN TRADITION</span>
              <h2>
                Benefits that<br />
                <em>nourish you.</em>
              </h2>
              <p>
                Every glass of GutVaidya is carefully crafted with sprouted grains, unpolished millets, and time-honored Ayurvedic botanicals for complete gut balance.
              </p>

              <ul className={styles.benefitList}>
                <li>
                  <span className={styles.checkMark}>✓</span>
                  <div><strong>Gentle Digestion & Regularity</strong> — High soluble & insoluble fiber for easy bowel movement.</div>
                </li>
                <li>
                  <span className={styles.checkMark}>✓</span>
                  <div><strong>Nourished Gut Flora</strong> — Natural prebiotics support friendly microbiome diversity.</div>
                </li>
                <li>
                  <span className={styles.checkMark}>✓</span>
                  <div><strong>Sustained Morning Energy</strong> — Low GI complex carbs prevent sugar spikes and fatigue.</div>
                </li>
                <li>
                  <span className={styles.checkMark}>✓</span>
                  <div><strong>Clean Plant Nutrition</strong> — Calcium, magnesium, and plant proteins to revitalize the body.</div>
                </li>
                <li>
                  <span className={styles.checkMark}>✓</span>
                  <div><strong>Zero Artificial Preservatives</strong> — Pure wholesome grains with no added chemicals or fillers.</div>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
              >
                {product.stock_quantity <= 0 ? "Out of Stock" : `Order Your Pouch Now · ₹${product.price}`} <span>↗</span>
              </button>
            </div>
          </div>

          <div className={styles.lifestyleCard}>
            <img
              src="/cinematic/benefits-lifestyle.jpg"
              alt="Mindful wellness with warm GutVaidya drink"
              className={styles.lifestyleImage}
              width={600}
              height={700}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. MANUFACTURING JOURNEY */}
      <section className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>FROM INGREDIENT TO POUCH</span>
          <h2>
            Six Steps to <em>Pure Wholesomeness</em>
          </h2>
          <p className={styles.sectionSubtitle}>
            We follow authentic Vedic practices with modern hygiene standards at every step.
          </p>
        </div>

        <div className={styles.timelineGrid}>
          {manufacturingSteps.map((step) => (
            <div key={step.num} className={styles.timelineCard}>
              <div className={styles.timelineImageWrapper}>
                <img
                  src={step.image}
                  alt={`${step.num} ${step.title}`}
                  className={styles.timelineImage}
                  width={320}
                  height={240}
                  loading="lazy"
                />
                <span className={styles.stepNum}>{step.num}</span>
              </div>
              <div className={styles.timelineBody}>
                <h4>{step.title}</h4>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
