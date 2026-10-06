"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Lock, CheckCircle2 } from "lucide-react";

// Reached from the password-reset email (via /auth/callback, which signs the user in)
export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("The two passwords don't match.");
      return;
    }
    if (!supabase) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/account"), 1500);
  };

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-primary-100 bg-base-50 focus:outline-none focus:ring-2 focus:ring-primary-600";

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-base-50 rounded-3xl border border-primary-100 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold text-primary-900">Set a New Password</h1>
            <p className="text-xs text-foreground/60">Choose a new password for your GutVaidya account.</p>
          </div>

          {done ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold">Password updated</p>
              <p className="text-foreground/60">Taking you to your account…</p>
            </div>
          ) : !isLoading && !user ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center space-y-3">
              <p>This reset link has expired or was already used. Reset links only work once, in the same browser where you requested them.</p>
              <Link href="/auth/forgot-password" className="inline-block font-bold text-primary-700 hover:underline">
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">{errorMsg}</div>
              )}
              <div>
                <label className="text-xs font-bold uppercase text-primary-900 block mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-primary-900 block mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || isLoading}
                className="w-full py-3.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save New Password"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
