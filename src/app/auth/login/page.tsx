"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setDemoUser } = useAuth();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Return to the page that sent the user here (only same-site paths)
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
      router.refresh();
    } else {
      // In dev fallback mode
      setDemoUser("customer");
      router.push("/account");
    }
  };

  const handleDemoSignIn = (role: "customer" | "admin") => {
    setDemoUser(role);
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-primary-100 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900">
              Welcome Back
            </h1>
            <p className="text-xs text-foreground/60">
              Sign in to manage your GutVaidya orders and wellness subscriptions.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-primary-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase text-primary-900">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-accent-gold-dark hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-primary-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Access Switch (demo mode only) */}
          {!isSupabaseConfigured() && (
          <div className="pt-4 border-t border-primary-100/60 space-y-2 text-center">
            <span className="text-[11px] uppercase font-bold text-foreground/40 block">
              Quick Preview Sign-In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("customer")}
                className="py-2 px-3 rounded-xl border border-primary-200 text-xs font-semibold text-primary-800 hover:bg-primary-50 transition-colors"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("admin")}
                className="py-2 px-3 rounded-xl bg-accent-gold/15 text-accent-gold-dark text-xs font-bold hover:bg-accent-gold/25 transition-colors"
              >
                Demo Admin
              </button>
            </div>
          </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-foreground/60">
              Don't have an account yet?{" "}
              <Link href="/auth/register" className="font-bold text-primary-700 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
