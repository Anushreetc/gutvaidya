"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { User, Package, MapPin, LogOut, Shield } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = [
    { label: "My Profile", href: "/account", icon: User },
    { label: "Order History", href: "/account/orders", icon: Package },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 lg:col-span-3 bg-white rounded-3xl border border-primary-100 p-6 shadow-sm space-y-6">
              {/* User Avatar Summary */}
              <div className="text-center pb-6 border-b border-primary-100">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-800 font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  {(profile?.name || user?.email || "U")[0].toUpperCase()}
                </div>
                <h2 className="font-serif font-bold text-lg text-primary-900 line-clamp-1">
                  {profile?.name || "Valued Customer"}
                </h2>
                <p className="text-xs text-foreground/50 truncate">{user?.email || "Welcome back"}</p>
                {isAdmin && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-accent-gold/20 text-accent-gold-dark text-[10px] font-bold uppercase tracking-wider">
                    Administrator
                  </span>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-primary-700 text-white shadow-sm"
                          : "text-foreground/70 hover:bg-primary-50 hover:text-primary-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-accent-gold-dark bg-accent-gold/10 hover:bg-accent-gold/20 transition-colors mt-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-8 lg:col-span-9">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
