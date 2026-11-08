"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Link from "next/link";
import styles from "./ManufacturingJourney.module.css";

const steps = [
  {name:"Sourced.",label:"WHOLE INGREDIENTS",text:"Whole grains, dals and seeds. The beginning of the GutVaidya journey."},
  {name:"Measured.",label:"EVERY INGREDIENT",text:"Ingredients are measured before they come together in the blend."},
  {name:"Mixed.",label:"BROUGHT TOGETHER",text:"The measured ingredients come together, ready for the next stage."},
  {name:"Dried & roasted.",label:"TIME & WARMTH",text:"The blend moves through drying and roasting before milling."},
  {name:"Milled.",label:"FROM GRAIN TO POWDER",text:"Prepared ingredients are milled into the Diet Powder blend."},
  {name:"Packed.",label:"THE FINISHED POUCH",text:"Filled into the GutVaidya pouch. Ready to become part of your daily ritual."},
];

function ProcessScene({step,progress}:{step:number;progress:number}){
  const arm = step===2 ? Math.sin(progress*Math.PI*5)*12 : step===5 ? -22-progress*12 : -8+Math.sin(progress*Math.PI*2)*8;
  return <svg viewBox="0 0 900 620" className={styles.scene} role="img" aria-label={`Illustrated manufacturing stage: ${steps[step].name}`}>
    <circle cx="510" cy="310" r="260" fill="#82a532" opacity=".18"/><circle cx="530" cy="310" r="200" fill="#a4b83b" opacity=".12"/>
    <path d="M0 550 Q250 460 480 530 T900 510 V620 H0Z" fill="#163e23"/>
    <g opacity=".7"><path d="M58 530 Q40 400 80 335 M80 530 Q120 420 100 370" fill="none" stroke="#a9bf62" strokeWidth="5"/>{[0,1,2,3].map(i=><g key={i}><ellipse cx="69" cy={370+i*34} rx="10" ry="22" fill="#bbca71" transform={`rotate(-35 69 ${370+i*34})`}/><ellipse cx="93" cy={390+i*32} rx="10" ry="22" fill="#819c46" transform={`rotate(40 93 ${390+i*32})`}/></g>)}</g>
    {/* The same artisan stays in place as the equipment and actions change. */}
    <g transform="translate(190 115)">
      <path d="M60 287 L55 421 M112 287 L125 421" stroke="#a98a52" strokeWidth="34" strokeLinecap="round"/>
      <path d="M43 425 H77 M110 425 H146" stroke="#173b29" strokeWidth="18" strokeLinecap="round"/>
      <path d="M40 115 Q85 96 130 115 L143 265 Q87 292 26 267Z" fill="#f0ecd4"/>
      <path d="M58 118 L113 118 L132 282 Q85 300 37 283Z" fill="#255a36" stroke="#c1cba0" strokeWidth="3"/>
      <path d="M61 117 L67 76 M110 117 L104 78" stroke="#d7cf9c" strokeWidth="8"/>
      <rect x="67" y="205" width="40" height="43" rx="4" fill="#64934a"/><text x="87" y="236" textAnchor="middle" fontFamily="Georgia" fontSize="32" fill="#e4c76b">g</text>
      <path d="M39 128 L21 208 L48 248" stroke="#e9b681" strokeWidth="22" fill="none" strokeLinecap="round"/>
      <g transform={`rotate(${arm} 125 130)`}><path d="M125 130 L175 173 L248 172" fill="none" stroke="#efbe88" strokeWidth="24" strokeLinecap="round"/><circle cx="247" cy="172" r="14" fill="#efbe88"/>
      {step===2 && <path d="M246 168 L283 299" stroke="#c5a16b" strokeWidth="10" strokeLinecap="round"/>}
      {step===5 && <g transform="translate(230 170) rotate(35)"><path d="M-20 -30 H35 V28 H-20Z" fill="#f1e5b2"/><path d="M35 -20 Q60 -20 54 8 H35" fill="none" stroke="#e5d9a9" strokeWidth="7"/></g>}
      </g>
      <rect x="68" y="73" width="35" height="45" rx="13" fill="#dda473"/>
      <ellipse cx="87" cy="48" rx="40" ry="49" fill="#f0bd87"/>
      <path d="M48 40 Q40 -10 90 -10 Q130 -10 128 37 L114 18 H60Z" fill="#293927"/>
      <path d="M47 26 Q85 10 130 25" stroke="#e4c65c" strokeWidth="13"/>
      <circle cx="99" cy="46" r="3" fill="#323a28"/><path d="M112 55 L119 64 H110 M97 78 Q107 84 116 76" fill="none" stroke="#9b5d44" strokeWidth="3" strokeLinecap="round"/>
    </g>
    {step===0 && <g><path d="M450 415 L470 520 H710 L730 415Z" fill="#bb8f45"/><ellipse cx="590" cy="415" rx="140" ry="42" fill="#ddbb73"/>{Array.from({length:70},(_,i)=><ellipse key={i} cx={480+(i*37)%220} cy={390+(i*13)%40} rx="7" ry="4" transform={`rotate(${i*19} ${480+(i*37)%220} ${390+(i*13)%40})`} fill={i%3===0?"#d9cc83":i%3===1?"#826637":"#e5b55c"}/>)}</g>}
    {step===1 && <g><rect x="455" y="471" width="290" height="48" rx="8" fill="#e6cf87"/><rect x="555" y="482" width="85" height="24" rx="3" fill="#21492d"/><text x="598" y="499" textAnchor="middle" fill="#e5dc9d" fontFamily="monospace" fontSize="14">MEASURE</text><path d="M475 360 Q490 472 600 472 Q710 472 725 360Z" fill="#a9bfac"/><ellipse cx="600" cy="360" rx="125" ry="26" fill="#d5d9bb"/>{Array.from({length:24},(_,i)=><ellipse key={i} cx={550+(i*23)%100} cy={240+(i*19+progress*200)%115} rx="5" ry="3" fill="#e2bc68"/>)}</g>}
    {step===2 && <g><path d="M440 370 H740 L710 495 Q590 545 470 495Z" fill="#c5d0b7"/><ellipse cx="590" cy="370" rx="150" ry="35" fill="#8b9f7b"/><ellipse cx="590" cy="370" rx="133" ry="23" fill="#d6b66b"/>{[0,1,2].map(i=><ellipse key={i} cx={590+Math.sin(progress*14+i)*60} cy={368+Math.cos(progress*14+i)*10} rx="30" ry="6" fill="none" stroke="#94733c" strokeWidth="2"/>)}</g>}
    {step===3 && <g><circle cx="720" cy="100" r="44" fill="#e7ca58"/>{Array.from({length:10},(_,i)=><path key={i} d="M720 32 V16" transform={`rotate(${i*36+progress*20} 720 100)`} stroke="#e7ca58" strokeWidth="5" strokeLinecap="round"/>)}<path d="M430 425 L740 425 L780 485 H405Z" fill="#c59a51"/><path d="M420 486 H770 M445 486 V545 M738 486 V545" fill="none" stroke="#e0c180" strokeWidth="12"/>{Array.from({length:48},(_,i)=><ellipse key={i} cx={445+(i*37)%280} cy={434+(i*13)%40} rx="5" ry="3" fill={i%2?"#8e6b32":"#e3cd87"}/>)}{[480,570,660].map((x,i)=><path key={x} d={`M${x} 401 Q${x-20} 370 ${x} 340 T${x+Math.sin(progress*8+i)*12} 290`} fill="none" stroke="#e0e1ad" opacity=".35" strokeWidth="4"/>)}</g>}
    {step===4 && <g><path d="M485 200 H725 L680 290 H530Z" fill="#d7d6ad"/><rect x="530" y="290" width="150" height="130" rx="20" fill="#87a987"/><circle cx="605" cy="351" r="43" fill="#244e31"/><g transform={`rotate(${progress*720} 605 351)`}><path d="M605 317 V385 M571 351 H639" stroke="#c6d1a3" strokeWidth="12"/></g><path d="M590 419 V457" stroke="#e2dbad" strokeWidth="26"/><path d="M525 490 Q600 525 680 490" stroke="#d5b26d" strokeWidth="35" fill="none"/>{Array.from({length:16},(_,i)=><circle key={i} cx={588+(i*7)%30} cy={443+(i*7+progress*180)%50} r="3" fill="#e8d094"/>)}</g>}
    {step===5 && <g><path d="M460 487 H760 M490 487 V550 M730 487 V550" fill="none" stroke="#c6a45f" strokeWidth="14"/><path d="M550 298 H679 L696 480 H533Z" fill="#e9e0bb" stroke="#c6bb8b" strokeWidth="3"/><rect x="548" y="343" width="132" height="95" rx="5" fill="#245233"/><text x="614" y="383" fill="#d6c976" textAnchor="middle" fontSize="40" fontFamily="Georgia">g</text><text x="614" y="407" fill="#f4edc9" textAnchor="middle" fontSize="12">GUTVAIDYA</text><text x="614" y="425" fill="#f4edc9" textAnchor="middle" fontSize="9">DIET POWDER</text>{Array.from({length:18},(_,i)=><circle key={i} cx={570+(i*13)%60} cy={245+(i*11+progress*150)%55} r="3" fill="#e7cd88"/>)}</g>}
  </svg>;
}

export default function ManufacturingJourney(){
 const target=useRef<HTMLElement>(null); const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target,offset:["start start","end end"]});
 const [frame,setFrame]=useState({step:0,local:0});
 useMotionValueEvent(scrollYProgress,"change",p=>{if(reduced)return;const x=Math.min(p*6,5.999);setFrame({step:Math.floor(x),local:x%1});});
 function go(i:number){setFrame({step:i,local:.5});if(!reduced&&target.current){const top=target.current.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+(target.current.offsetHeight-window.innerHeight)*(i+.35)/6,behavior:"instant"});}}
 return <><section id="preparation" ref={target} className={`${styles.journey} ${reduced?styles.reduced:""}`}>
 <div className={styles.stage}><div className={styles.heading}><p>THE GUTVAIDYA PROCESS</p><h2>From grain <em>to goodness.</em></h2></div>
 <div className={styles.layout}><div className={styles.copy}><span className={styles.number}>0{frame.step+1}</span><p className={styles.eyebrow}>{steps[frame.step].label}</p><h3>{steps[frame.step].name}</h3><p>{steps[frame.step].text}</p><Link href="#products">Explore the collection ↗</Link></div><ProcessScene step={frame.step} progress={reduced?.5:frame.local}/></div>
 <nav className={styles.chapters} aria-label="Manufacturing stages">{steps.map((s,i)=><button key={s.name} onClick={()=>go(i)} className={i===frame.step?styles.active:""} aria-current={i===frame.step?"step":undefined}><span>0{i+1}</span>{s.name}</button>)}</nav>
 <motion.div className={styles.progress} style={{scaleX:scrollYProgress}}/>
 </div></section>
 <section id="pack-directions" className={styles.pack}><img src="/cinematic/daily-ritual.jpeg" alt="GutVaidya Diet Powder daily ritual" width="1122" height="1402" loading="lazy"/><div><p className={styles.eyebrow}>YOUR EVERYDAY RITUAL</p><h2>Made with care.<br/>Ready for you.</h2><p>Explore Diet Powder and read the ingredients, nutrition, allergen advice and preparation directions on your pack.</p><a href="/cinematic/pouch-back.jpeg" target="_blank" rel="noopener noreferrer">Read the actual pack directions ↗</a><Link href="/products/gutvaidya-health-mix">Discover Diet Powder →</Link></div></section></>;
}
