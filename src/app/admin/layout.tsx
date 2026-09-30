"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  MessageSquare,
  Star,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, isAdmin, isLoading, setDemoUser } = useAuth();

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    { label: "Orders & Shipments", href: "/admin/orders", icon: ShoppingCart },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: Tag },
    { label: "Product Reviews", href: "/admin/reviews", icon: Star },
    { label: "Messages & Queries", href: "/admin/messages", icon: MessageSquare },
  ];

  // Wait for the session and the profile (which carries the role) before deciding,
  // otherwise real admins briefly see the access gate
  if (isLoading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-[#f7f9f4] flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-foreground/50">
          <span className="w-4 h-4 rounded-full border-2 border-primary-200 border-t-primary-700 animate-spin" />
          Checking admin access…
        </div>
      </div>
    );
  }

  // If user is not admin, show secure access gate with developer preview switch
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7f9f4] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-primary-100 p-8 shadow-md text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-primary-900">
            Admin Access Required
          </h1>

          <p className="text-xs text-foreground/60 leading-relaxed">
            The GutVaidya administration panel is restricted to verified administrators with role-based access.
          </p>

          <div className="pt-2 space-y-3">
            {isSupabaseConfigured() ? (
              <Link
                href="/auth/login?next=/admin"
                className="w-full py-3.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-accent-gold" />
                Sign In with an Administrator Account
              </Link>
            ) : (
              <button
                onClick={() => setDemoUser("admin")}
                className="w-full py-3.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-accent-gold" />
                Sign In as Administrator (Demo Preview)
              </button>
            )}

            <Link
              href="/"
              className="block w-full py-2.5 text-xs text-foreground/60 hover:text-primary-700 font-semibold"
            >
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f4] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-primary-900 text-white flex-shrink-0 flex flex-col justify-between border-r border-primary-800">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-primary-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-serif font-bold text-white tracking-wide">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full border border-primary-700 object-cover" />
              <span>GutVaidya</span>
            </Link>
            <span className="px-2 py-0.5 rounded-full bg-accent-gold/20 text-accent-gold text-[10px] font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary-700 text-white shadow-sm border border-primary-600/50"
                      : "text-white/70 hover:bg-primary-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-accent-gold" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary-800/80 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary-800/40 text-xs">
            <div className="w-7 h-7 rounded-full bg-accent-gold/30 text-accent-gold font-bold flex items-center justify-center">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{profile?.name || "Admin"}</p>
              <p className="text-[10px] text-white/50 truncate">{user?.email || "admin@gutvaidya.in"}</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-primary-800/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Visit Live Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-primary-100 flex items-center justify-between px-6 sm:px-8">
          <h2 className="font-serif font-bold text-lg text-primary-900">
            {navItems.find((i) => i.href === pathname)?.label || "Admin Console"}
          </h2>
          <div className="flex items-center gap-3 text-xs text-foreground/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Production System Online</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}
