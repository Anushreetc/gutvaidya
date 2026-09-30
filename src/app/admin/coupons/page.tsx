"use client";

import React, { useState, useEffect } from "react";
import { SEED_COUPONS } from "@/lib/coupons";
import { Coupon } from "@/types/ecommerce";
import { Tag, Plus, Check, X, Percent, DollarSign, Calendar } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(SEED_COUPONS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => {
        if (data?.live && Array.isArray(data.coupons)) setCoupons(data.coupons);
      })
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 10,
    minimum_order_value: 499,
    maximum_discount: 200,
    usage_limit: 500,
  });

  const handleToggle = async (coupon: Coupon) => {
    const updated = { ...coupon, active: !coupon.active };
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));

    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", coupon: updated }),
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      minimum_order_value: Number(form.minimum_order_value) || 0,
      maximum_discount: Number(form.maximum_discount) || undefined,
      usage_limit: Number(form.usage_limit) || undefined,
      used_count: 0,
      active: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setIsCreateModalOpen(false);
    setForm({
      code: "",
      discount_type: "percentage",
      discount_value: 10,
      minimum_order_value: 499,
      maximum_discount: 200,
      usage_limit: 500,
    });

    // Swap in the saved row so later toggles use the database id
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", coupon: newCoupon }),
    });
    const data = await res.json().catch(() => null);
    if (data?.coupon) {
      setCoupons((prev) => prev.map((c) => (c.id === newCoupon.id ? data.coupon : c)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-xl text-primary-900">Active Promo Codes & Discounts</h2>
          <p className="text-xs text-foreground/50">Manage promotional coupons, usage thresholds, and customer savings.</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-primary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-primary-50/50 border-b border-primary-100 text-foreground/50 uppercase font-bold">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Type & Value</th>
                <th className="py-3.5 px-4">Min. Order Value</th>
                <th className="py-3.5 px-4">Max Cap</th>
                <th className="py-3.5 px-4">Times Used</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/50">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-primary-50/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-primary-900 text-sm">
                    {c.code}
                  </td>
                  <td className="py-4 px-4 font-semibold text-emerald-700">
                    {c.discount_type === "percentage" ? `${c.discount_value}% Discount` : `₹${c.discount_value} Flat Off`}
                  </td>
                  <td className="py-4 px-4 text-foreground/70">
                    ₹{c.minimum_order_value || 0}
                  </td>
                  <td className="py-4 px-4 text-foreground/70">
                    {c.maximum_discount ? `₹${c.maximum_discount}` : "No Limit"}
                  </td>
                  <td className="py-4 px-4 text-foreground/70">
                    {c.used_count || 0} {c.usage_limit ? `/ ${c.usage_limit}` : ""}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.active
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleToggle(c)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        c.active
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {c.active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-primary-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-primary-900">
                Create Discount Coupon
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-foreground/40 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-primary-900 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. WELLNESS20"
                  className="w-full px-3 py-2 rounded-xl border border-primary-100 uppercase font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-primary-900 block mb-1">Discount Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-primary-900 block mb-1">
                    Value {form.discount_type === "percentage" ? "(%)" : "(₹)"} *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-primary-900 block mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    value={form.minimum_order_value}
                    onChange={(e) => setForm({ ...form, minimum_order_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-primary-900 block mb-1">Max Cap Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maximum_discount}
                    onChange={(e) => setForm({ ...form, maximum_discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-primary-900 block mb-1">Usage Limit (Redemptions)</label>
                <input
                  type="number"
                  value={form.usage_limit}
                  onChange={(e) => setForm({ ...form, usage_limit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-primary-200 font-bold hover:bg-primary-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold shadow-sm"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
