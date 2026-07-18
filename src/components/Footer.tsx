"use client";

import React from "react";
import { Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white/80 border-t border-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-primary-800">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-2xl font-serif font-bold text-white tracking-wide">
              <img src="/logo.jpg" alt="GutVaidya Logo" className="h-8 w-8 rounded-full object-cover border border-primary-800" />
              <span>GutVaidya</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Honoring centuries-old wellness traditions with sprouted whole grain mixtures, organic nuts, and premium spices. Nourish your body, balance your gut, elevate your life.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="bg-white px-2 py-1 rounded-lg flex items-center justify-center">
                  <img src="/FSSAI_logo.png" alt="FSSAI Logo" className="h-6 w-auto object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold leading-none">Registered License</span>
                  <span className="text-xs font-mono font-bold text-accent-gold mt-1 leading-none">Lic. No. 21224172000058</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-accent-gold transition-colors">Home</a>
              </li>
              <li>
                <a href="#products" className="hover:text-accent-gold transition-colors">Products</a>
              </li>
              <li>
                <a href="#recipe" className="hover:text-accent-gold transition-colors">Recipes</a>
              </li>
              <li>
                <a href="#about-us" className="hover:text-accent-gold transition-colors">About Us</a>
              </li>
              <li>
                <a href="#blogs" className="hover:text-accent-gold transition-colors">Blogs</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent-gold transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Support / Contact details */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">Customer Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-gold" />
                <a href="mailto:support@gutvaidya.in" className="hover:text-accent-gold transition-colors truncate">
                  support@gutvaidya.in
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-gold" />
                <a href="tel:+919008130463" className="hover:text-accent-gold transition-colors">
                  +91 9008130463
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent-gold mt-0.5" />
                <span className="text-white/50 leading-snug">
                  Mon - Sat: 9 AM - 6 PM<br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {currentYear} GutVaidya Health Mix. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#home" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#home" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
