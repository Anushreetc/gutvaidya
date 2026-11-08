"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./CinematicStory.module.css";

export default function CinematicStory(){
 const ref=useRef<HTMLElement>(null);
 const {scrollYProgress}=useScroll({target:ref,offset:["start start","end end"]});
 const background=useTransform(scrollYProgress,[0,.35,.7,1],["#103923","#234c28","#ebcb76","#f1d38a"]);
 const rotate=useTransform(scrollYProgress,[0,.45,1],[-8,0,7]);
 const x=useTransform(scrollYProgress,[0,.5,1],["0%","0%","65%"]);
 const scale=useTransform(scrollYProgress,[0,.5,1],[1,1.05,1.12]);
 const introVisibility=useTransform(scrollYProgress,p=>p<.5?"visible" as const:"hidden" as const);
 const introOpacity=useTransform(scrollYProgress,[0,.35,.6],[1,1,0]);
 const detailOpacity=useTransform(scrollYProgress,[.45,.75,1],[0,1,1]);
 const detailVisibility=useTransform(scrollYProgress,p=>p>.5?"visible" as const:"hidden" as const);
 return <section ref={ref} className={styles.story} aria-label="GutVaidya product reveal"><motion.div className={styles.stage} style={{backgroundColor:background}}>
 <div className={styles.glow}/><div className={styles.ring}/>
 <motion.div className={styles.heroWords} style={{opacity:introOpacity}}><span>Rooted in</span><em>nature.</em></motion.div>
 <motion.div className={styles.product} style={{x,rotate,scale}}><img src="/cinematic/pouch-front.jpeg" alt="GutVaidya Diet Powder, 500g actual product pouch" width="960" height="1280" fetchPriority="high"/></motion.div>
 <motion.div className={styles.introCopy} style={{opacity:introOpacity,visibility:introVisibility}}><p>GUTVAIDYA · DIET POWDER</p><h1>Whole ingredients. Your daily ritual.</h1><Link href="#preparation">Discover the journey ↓</Link></motion.div>
 <motion.div className={styles.detail} style={{opacity:detailOpacity,visibility:detailVisibility}}><p className={styles.eyebrow}>TRADITION, BROUGHT TOGETHER</p><h2>A little goodness.<br/><em>Every day.</em></h2><p>Meet GutVaidya Diet Powder. Explore the blend, discover how it is made, and find your everyday ritual.</p><Link className={styles.button} href="/products/gutvaidya-health-mix">Explore Diet Powder ↗</Link><Link className={styles.processLink} href="#preparation">From grain to goodness ↓</Link></motion.div>
 <span className={styles.bottom}>SCROLL TO EXPLORE</span><Link className={styles.skip} href="#products">Shop collection ↗</Link>
 </motion.div></section>;
}
