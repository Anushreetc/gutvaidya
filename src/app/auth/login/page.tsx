"use client";

import React, { useState, useEffect } from "react";
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

  // Arriving from an expired sign-up or reset link (see /auth/callback)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "link_invalid") {
      setErrorMsg("That email link has expired or was already used. Please sign in, or request a new link.");
    }
  }, []);

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
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-base-50 rounded-3xl border border-primary-100 p-8 shadow-sm space-y-6">
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

          {/* Google Sign-In */}
          {isSupabaseConfigured() && supabase && (
            <button
              type="button"
              onClick={async () => {
                setErrorMsg(null);
                const next = new URLSearchParams(window.location.search).get("next");
                const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                  next && next.startsWith("/") && !next.startsWith("//") ? next : "/account"
                )}`;
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo },
                });
                if (error) setErrorMsg(error.message);
              }}
              className="w-full py-3 rounded-full border border-primary-200 bg-base-50 hover:bg-primary-50 text-sm font-semibold text-primary-900 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          )}

          {isSupabaseConfigured() && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-primary-100" />
              <span className="text-[11px] uppercase font-bold text-foreground/40">or sign in with email</span>
              <div className="flex-1 h-px bg-primary-100" />
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-primary-100 bg-base-50 focus:outline-none focus:ring-2 focus:ring-primary-600"
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-primary-100 bg-base-50 focus:outline-none focus:ring-2 focus:ring-primary-600"
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
