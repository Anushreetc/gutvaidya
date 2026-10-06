"use client";

import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
}

const SEED_CUSTOMERS: CustomerRecord[] = [
  {
    id: "c-01",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    ordersCount: 3,
    totalSpent: 4296,
    joinedDate: "12 May 2026",
  },
  {
    id: "c-02",
    name: "Dr. Aniruddha Sen",
    email: "aniruddha@clinic.in",
    phone: "+91 94321 09876",
    ordersCount: 4,
    totalSpent: 3836,
    joinedDate: "03 June 2026",
  },
  {
    id: "c-03",
    name: "Karan Johar",
    email: "karan.johar@gmail.com",
    phone: "+91 98200 11223",
    ordersCount: 2,
    totalSpent: 1678,
    joinedDate: "28 June 2026",
  },
  {
    id: "c-04",
    name: "Kavitha Nair",
    email: "kavitha.nair@yahoo.co.in",
    phone: "+91 97455 22110",
    ordersCount: 5,
    totalSpent: 4495,
    joinedDate: "15 April 2026",
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(SEED_CUSTOMERS);
  const [search, setSearch] = useState("");

  // Replace the sample list with real customers once a database is connected
  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => {
        if (data?.live && Array.isArray(data.customers)) setCustomers(data.customers);
      })
      .catch(() => {});
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-100 bg-base-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
          />
        </div>

        <div className="text-xs text-foreground/50">
          Total Registered Customers: <strong className="text-primary-900">{customers.length}</strong>
        </div>
      </div>

      <div className="bg-base-50 rounded-3xl border border-primary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-primary-50/50 border-b border-primary-100 text-foreground/50 uppercase font-bold">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Completed Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-primary-50/20 transition-colors">
                  <td className="py-4 px-4 font-bold text-primary-900">{c.name}</td>
                  <td className="py-4 px-4 text-foreground/70">{c.email}</td>
                  <td className="py-4 px-4 text-foreground/70">{c.phone}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary-800">
                      <ShoppingBag className="w-3.5 h-3.5 text-accent-gold" />
                      {c.ordersCount} orders
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold font-sans text-primary-900">
                    ₹{c.totalSpent.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-foreground/50">{c.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
