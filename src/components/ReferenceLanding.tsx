"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "../context/CartContext";
import styles from "./ReferenceLanding.module.css";
import { Product } from "@/types/ecommerce";
import { SEED_PRODUCTS } from "@/lib/products";
import {
  getProductOverrides,
  applyProductOverride,
  subscribeToProductUpdates,
} from "@/lib/products-client";

const ingredientTabs = [
  {
    name: "Millets",
    image: "millets",
    description: "Sprouted ancient millets packed with iron, slow-release fiber, and essential minerals to boost digestion and sustain daily morning energy.",
  },
  {
    name: "Pulses",
    image: "proteins",
    description: "Sprouted native pulses and lentils delivering 22g clean plant protein per 100g, supporting muscle repair and wholesome meal balance.",
  },
  {
    name: "Herbs & Roots",
    image: "herbs",
    description: "Time-tested Ayurvedic herbs that soothe gut lining, relieve bloating, and support natural metabolic balance.",
  },
  {
    name: "Ancient Seeds",
    image: "seeds",
    description: "Flax and chia seeds delivering healthy plant omega-3s, soluble fiber, and lasting vitality throughout the day.",
  },
  {
    name: "Aromatic Spices",
    image: "spices",
    description: "Ginger, cardamom, and warming botanicals to ignite Agni (digestive fire) and enhance nutrient absorption.",
  },
];

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
  const heroRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
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

  // Scroll animations for the hero bowl
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bowlRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const bowlScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bowlY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className={styles.landing}>
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className={styles.eyebrow}>Everyday Nutrition · A Blend of 36+ Millets & Herbs</span>
          <h1>
            A little tradition.<br />
            A <em>wholesome</em> new beginning.
          </h1>
          <p className={styles.heroSubtitle}>
            Rediscover the power of ancient sprouted millets, native seeds, and Ayurvedic herbs in your daily diet powder ritual.
          </p>

          <div className={styles.buttonGroup}>
            <Link className={styles.primaryButton} href="/products/gutvaidya-health-mix">
              Discover Diet Powder <span>↗</span>
            </Link>
            <a className={styles.secondaryButton} href="#preparation">
              How to Prepare ↓
            </a>
          </div>
        </motion.div>

        {/* Hero Bowl & Floating Badges */}
        <div className={styles.heroBowlContainer}>
          <div className={styles.glowRing} />

          <motion.div
            className={styles.bowlWrapper}
            style={{ rotate: bowlRotate, scale: bowlScale, y: bowlY }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/cinematic/hero-bowl.jpg"
              alt="Scalloped glass bowl with GutVaidya diet powder"
              className={styles.bowlImage}
              width={500}
              height={500}
            />
          </motion.div>

          {/* Badges floating around bowl */}
          <motion.div
            className={`${styles.badge} ${styles.badgeTopLeft}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className={styles.badgeIcon}>🌿</span> 100% Natural & Organic
          </motion.div>

          <motion.div
            className={`${styles.badge} ${styles.badgeTopRight}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className={styles.badgeIcon}>💪</span> High Fiber & Protein
          </motion.div>

          <motion.div
            className={`${styles.badge} ${styles.badgeBottomLeft}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className={styles.badgeIcon}>🌾</span> Sprouted Ragi & Millets
          </motion.div>

          <motion.div
            className={`${styles.badge} ${styles.badgeBottomRight}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <span className={styles.badgeIcon}>✨</span> Zero Added Sugar
          </motion.div>
        </div>

        <a className={styles.scrollHint} href="#product-spotlight">
          SCROLL TO EXPLORE <span>↓</span>
        </a>
      </section>

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
              <span className={styles.nutritionPill}>🌾 36+ Ancient Ingredients</span>
              <span className={styles.nutritionPill}>💪 22g Plant Protein / 100g</span>
              <span className={styles.nutritionPill}>🌱 Rich In Prebiotic Fiber</span>
              <span className={styles.nutritionPill}>🍃 100% Preservative Free</span>
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
              <a
                className={styles.secondaryButton}
                href="/cinematic/pouch-back.jpeg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inspect Pack Details ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JUST 3 SIMPLE STEPS */}
      <section id="preparation" className={styles.preparation}>
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

      {/* 4. MIXTURE OF MILLETS & GRAINS */}
      <section className={styles.ingredientSection} id="blend-story">
        <div className={styles.sectionHeader} style={{ marginBottom: 20 }}>
          <span className={styles.eyebrow}>A PANTRY OF POSSIBILITIES</span>
          <h2>
            Goodness in <em>the Blend</em>
          </h2>
        </div>

        {/* Interactive Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Explore ingredients">
          {ingredientTabs.map((item, i) => (
            <button
              key={item.name}
              id={`blend-tab-${i}`}
              role="tab"
              aria-selected={activeTab === i}
              aria-controls="blend-panel"
              tabIndex={activeTab === i ? 0 : -1}
              className={`${styles.tabButton} ${activeTab === i ? styles.selected : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div id="blend-panel" role="tabpanel" aria-labelledby={`blend-tab-${activeTab}`} className={styles.ingredientDisplay}>
          <p className={styles.ingredientText}>{ingredientTabs[activeTab].description}</p>

          <motion.div
            key={activeTab}
            className={styles.ingredientBowlStage}
            initial={{ opacity: 0.5, scale: 0.94, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <img
              src={`/images/ingredients/${ingredientTabs[activeTab].image}.png`}
              alt={ingredientTabs[activeTab].name}
              className={styles.ingredientBowlImage}
              width={520}
              height={520}
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

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
              >
                Order Your Pouch Now · ₹799 <span>↗</span>
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
