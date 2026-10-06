"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, EyeOff, Trash2, MessageSquareText } from "lucide-react";

interface AdminReview {
  id: string;
  product_name?: string;
  customer_name: string;
  rating: number;
  review: string;
  approved: boolean;
  verified_purchase: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.reviews)) setReviews(data.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const act = async (id: string, action: "approve" | "hide" | "delete") => {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      if (!res.ok) return;
      setReviews((prev) =>
        action === "delete"
          ? prev.filter((r) => r.id !== id)
          : prev.map((r) => (r.id === id ? { ...r, approved: action === "approve" } : r))
      );
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  };

  const pendingCount = reviews.filter((r) => !r.approved).length;
  const shown = reviews.filter((r) => (filter === "all" ? true : filter === "pending" ? !r.approved : r.approved));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary-900">Product Reviews</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Customer reviews stay hidden until you approve them. Only approved reviews count towards a product&apos;s star rating.
          </p>
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border capitalize ${
                filter === f ? "bg-primary-700 text-white border-primary-700" : "border-primary-200 text-primary-800 hover:bg-primary-50"
              }`}
            >
              {f === "pending" ? `Awaiting approval (${pendingCount})` : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-50 rounded-3xl border border-primary-100 shadow-sm divide-y divide-primary-100/60">
        {loading ? (
          <div className="p-12 text-center text-xs text-foreground/40">Loading reviews...</div>
        ) : shown.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <MessageSquareText className="w-10 h-10 text-primary-300 mx-auto" />
            <p className="text-sm text-foreground/50">
              {filter === "pending" ? "No reviews waiting for approval." : "No reviews yet."}
            </p>
          </div>
        ) : (
          shown.map((r) => (
            <div key={r.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif font-bold text-primary-900 text-sm">{r.customer_name}</span>
                  {r.verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      r.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.approved ? "Live" : "Hidden"}
                  </span>
                </div>
                <div className="text-xs text-foreground/50">
                  {r.product_name || "Unknown product"} ·{" "}
                  {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <div className="flex text-accent-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line break-words">{r.review}</p>
              </div>

              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                {r.approved ? (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => act(r.id, "hide")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary-200 text-primary-800 text-xs font-bold hover:bg-primary-50 disabled:opacity-50"
                  >
                    <EyeOff className="w-3.5 h-3.5" /> Hide
                  </button>
                ) : (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => act(r.id, "approve")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-700 text-white text-xs font-bold hover:bg-primary-800 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {confirmDeleteId === r.id ? (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => act(r.id, "delete")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Confirm delete
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
