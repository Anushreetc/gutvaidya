"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, CheckCircle2, Save } from "lucide-react";

export default function AccountProfilePage() {
  const { profile, user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "Priya Sharma",
    phone: profile?.phone || "+91 98765 43210",
    addressLine1: "402, Green Lotus Apartments, Indiranagar",
    addressLine2: "100 Feet Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-primary-900">Personal Profile</h1>
        <p className="text-xs text-foreground/60 mt-0.5">
          Manage your personal details and default delivery address.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || profile?.email || "customer@example.com"}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm bg-primary-50/50 text-foreground/60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="space-y-4 pt-4 border-t border-primary-100">
          <h2 className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">
            Default Delivery Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </form>
    </div>
  );
}
