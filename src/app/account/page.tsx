"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { INDIAN_STATES } from "@/lib/india-states";
import { CheckCircle2, Save, AlertTriangle } from "lucide-react";

const EMPTY_FORM = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AccountProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const supabase = createClient();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load the customer's real profile and default delivery address
  useEffect(() => {
    if (!user || !profile || loaded) return;

    const load = async () => {
      let next = { ...EMPTY_FORM, name: profile.name || "", phone: profile.phone || "" };

      if (supabase) {
        const { data: address } = await supabase
          .from("addresses")
          .select("*")
          .eq("customer_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (address) {
          setAddressId(address.id);
          next = {
            ...next,
            addressLine1: address.address_line_1 || "",
            addressLine2: address.address_line_2 || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.postal_code || "",
          };
        }
      }

      setFormData(next);
      setLoaded(true);
    };
    load();
  }, [user, profile, loaded, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaved(false);

    if (!supabase || !user) {
      setErrorMsg("Saving your profile needs you to be signed in.");
      return;
    }

    const hasAddress = formData.addressLine1 || formData.city || formData.pincode;
    if (hasAddress && (!formData.addressLine1 || !formData.city || !formData.state || !/^\d{6}$/.test(formData.pincode))) {
      setErrorMsg("Please complete the address: line 1, city, state and a 6-digit PIN code.");
      return;
    }

    setSaving(true);
    try {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ name: formData.name.trim(), phone: formData.phone.trim(), updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (profileErr) throw profileErr;

      if (hasAddress) {
        const addressRow = {
          customer_id: user.id,
          name: formData.name.trim() || user.email || "Customer",
          phone: formData.phone.trim(),
          address_line_1: formData.addressLine1.trim(),
          address_line_2: formData.addressLine2.trim() || null,
          city: formData.city.trim(),
          state: formData.state.trim(),
          postal_code: formData.pincode.trim(),
          country: "India",
          is_default: true,
        };
        const { data, error: addressErr } = addressId
          ? await supabase.from("addresses").update(addressRow).eq("id", addressId).select("id").single()
          : await supabase.from("addresses").insert(addressRow).select("id").single();
        if (addressErr) throw addressErr;
        setAddressId(data.id);
      }

      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-base-50";
  const labelClass = "text-xs font-bold uppercase text-primary-900 block mb-1";

  return (
    <div className="bg-base-50 rounded-3xl border border-primary-100 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-primary-900">Personal Profile</h1>
        <p className="text-xs text-foreground/60 mt-0.5">
          Manage your personal details and default delivery address. Your saved address is filled in automatically at checkout.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!loaded ? (
        <div className="py-12 text-center text-xs text-foreground/40">Loading your details…</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Info */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || profile?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm bg-primary-50/50 text-foreground/60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  maxLength={20}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4 pt-4 border-t border-primary-100">
            <h2 className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">Default Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Address Line 1</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="House / flat number, building, street"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Area, landmark"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>PIN Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
