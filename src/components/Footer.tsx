"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, Clock, Facebook, Instagram } from "lucide-react";
import { BUSINESS, POLICY_LINKS } from "@/lib/business";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white/80 border-t border-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-primary-800">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-2xl font-serif font-bold text-white tracking-wide">
              <div className="bg-white/95 rounded-lg p-1 flex items-center justify-center shadow-sm">
                <img src="/logo_transparent.png" alt="GutVaidya Logo" className="h-7 w-auto object-contain" />
              </div>
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
                  <span className="text-xs font-mono font-bold text-accent-gold mt-1 leading-none">Lic. No. {BUSINESS.fssaiLicense}</span>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Follow us</span>
              <a
                href={BUSINESS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GutVaidya on Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent-gold hover:text-primary-900 hover:border-accent-gold transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GutVaidya on Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent-gold hover:text-primary-900 hover:border-accent-gold transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#home" className="hover:text-accent-gold transition-colors">Home</a>
              </li>
              <li>
                <a href="/products" className="hover:text-accent-gold transition-colors">All Products</a>
              </li>
              <li>
                <a href="/cart" className="hover:text-accent-gold transition-colors">Shopping Cart</a>
              </li>
              <li>
                <a href="/account/orders" className="hover:text-accent-gold transition-colors">Track Orders</a>
              </li>
              <li>
                <a href="/account" className="hover:text-accent-gold transition-colors">My Account</a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-accent-gold transition-colors">Contact Support</a>
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
                <a href="tel:+917892891239" className="hover:text-accent-gold transition-colors">
                  +91 78928 91239
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
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Store policies">
            {POLICY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
