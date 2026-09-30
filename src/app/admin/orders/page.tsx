"use client";

import React, { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/ecommerce";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // With a database connected, show real orders; otherwise keep the sample orders below
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data?.live && Array.isArray(data.orders)) setOrders(data.orders);
      })
      .catch(() => {});

    setOrders((prev) => (prev.length > 0 ? prev : [
      {
        id: "ord-seed-001",
        order_number: "GV-849201",
        customer_name: "Priya Sharma",
        customer_email: "priya.sharma@example.com",
        customer_phone: "+91 98765 43210",
        shipping_address: {
          name: "Priya Sharma",
          phone: "+91 98765 43210",
          address_line_1: "402, Green Lotus Apartments, Indiranagar",
          address_line_2: "100 Feet Road",
          city: "Bengaluru",
          state: "Karnataka",
          postal_code: "560038",
          country: "India",
        },
        subtotal: 1698,
        discount: 100,
        shipping_charge: 0,
        tax: 0,
        total: 1598,
        payment_status: "paid",
        order_status: "delivered",
        razorpay_order_id: "order_test_849201",
        razorpay_payment_id: "pay_test_849201",
        coupon_code: "FESTIVE100",
        items: [
          {
            product_id: "p1",
            product_name: "GutVaidya Health Mix",
            quantity: 1,
            unit_price: 799,
            total_price: 799,
            image: "/product.jpeg",
          },
          {
            product_id: "p2",
            product_name: "GutVaidya Baal Vit",
            quantity: 1,
            unit_price: 899,
            total_price: 899,
            image: "/product.jpeg",
          },
        ],
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "ord-seed-002",
        order_number: "GV-912403",
        customer_name: "Dr. Aniruddha Sen",
        customer_email: "aniruddha@clinic.in",
        customer_phone: "+91 94321 09876",
        shipping_address: {
          name: "Dr. Aniruddha Sen",
          phone: "+91 94321 09876",
          address_line_1: "78, Lake View Road, Salt Lake Sector 1",
          city: "Kolkata",
          state: "West Bengal",
          postal_code: "700064",
          country: "India",
        },
        subtotal: 899,
        discount: 0,
        shipping_charge: 60,
        tax: 0,
        total: 959,
        payment_status: "paid",
        order_status: "shipped",
        razorpay_order_id: "order_test_912403",
        razorpay_payment_id: "pay_test_912403",
        items: [
          {
            product_id: "p6",
            product_name: "GutVaidya Gluco Care",
            quantity: 1,
            unit_price: 899,
            total_price: 899,
            image: "/product.jpeg",
          },
        ],
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: "ord-seed-003",
        order_number: "GV-994112",
        customer_name: "Karan Johar",
        customer_email: "karan.johar@gmail.com",
        customer_phone: "+91 98200 11223",
        shipping_address: {
          name: "Karan Johar",
          phone: "+91 98200 11223",
          address_line_1: "B-12, Sagar Samrat, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          postal_code: "400050",
          country: "India",
        },
        subtotal: 799,
        discount: 80,
        shipping_charge: 60,
        tax: 0,
        total: 779,
        payment_status: "paid",
        order_status: "processing",
        razorpay_order_id: "order_test_994112",
        razorpay_payment_id: "pay_test_994112",
        coupon_code: "GUTHEALTH10",
        items: [
          {
            product_id: "p1",
            product_name: "GutVaidya Health Mix",
            quantity: 1,
            unit_price: 799,
            total_price: 799,
            image: "/product.jpeg",
          },
        ],
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ]));
    setLoading(false);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
    );

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, order_status: newStatus });
    }

    try {
      await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (e) {
      console.error("Status update error", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedStatus !== "all" && o.order_status !== selectedStatus) return false;
    return true;
  });

  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-100 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === "all"
                ? "bg-primary-700 text-white"
                : "bg-white border border-primary-100 text-foreground/70 hover:bg-primary-50"
            }`}
          >
            All Orders ({orders.length})
          </button>
          {["processing", "shipped", "delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-colors ${
                selectedStatus === st
                  ? "bg-primary-700 text-white"
                  : "bg-white border border-primary-100 text-foreground/70 hover:bg-primary-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-primary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-primary-50/50 border-b border-primary-100 text-foreground/50 uppercase font-bold">
                <th className="py-3.5 px-4">Order Reference</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status & Dispatch Tracker</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-primary-50/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-primary-900">
                    {order.order_number}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-primary-900 block">{order.customer_name}</span>
                    <span className="text-[11px] text-foreground/50">{order.customer_email}</span>
                  </td>
                  <td className="py-4 px-4 text-foreground/60 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-4 font-bold font-sans text-primary-900">
                    ₹{order.total}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.payment_status === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                      title={order.payment_status === "pending" ? "Checkout started but payment not received (yet)" : undefined}
                    >
                      {order.payment_status === "pending" ? "awaiting payment" : order.payment_status}
                    </span>
                  </td>
                  {/* Status Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={order.order_status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="px-2.5 py-1 rounded-lg border border-primary-200 bg-white font-bold text-primary-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 uppercase tracking-wide cursor-pointer"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setActiveOrder(order)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary-200 text-primary-800 font-semibold hover:bg-primary-50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-primary-100 pb-4">
              <div>
                <span className="text-xs uppercase text-foreground/50 font-bold block">
                  Order Details
                </span>
                <h3 className="font-serif font-bold text-xl text-primary-900">
                  #{activeOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1 rounded-full text-foreground/40 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-primary-50/50 space-y-1">
                <span className="font-bold text-accent-gold-dark uppercase block mb-1">
                  Customer
                </span>
                <p className="font-bold text-primary-900">{activeOrder.customer_name}</p>
                <p className="flex items-center gap-1.5 text-foreground/70">
                  <Mail className="w-3 h-3 text-accent-gold" />
                  {activeOrder.customer_email}
                </p>
                <p className="flex items-center gap-1.5 text-foreground/70">
                  <Phone className="w-3 h-3 text-accent-gold" />
                  {activeOrder.customer_phone}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary-50/50 space-y-1">
                <span className="font-bold text-accent-gold-dark uppercase block mb-1">
                  Delivery Address
                </span>
                <p className="text-foreground/80 leading-relaxed">
                  {activeOrder.shipping_address.address_line_1}
                  {activeOrder.shipping_address.address_line_2 && `, ${activeOrder.shipping_address.address_line_2}`}
                  <br />
                  {activeOrder.shipping_address.city}, {activeOrder.shipping_address.state} - {activeOrder.shipping_address.postal_code}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-primary-900 block">
                Order Items ({activeOrder.items.length})
              </span>
              <div className="divide-y divide-primary-100 border-y border-primary-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-primary-900">{item.product_name}</strong>
                      <span className="text-foreground/50 block">Qty: {item.quantity} × ₹{item.unit_price}</span>
                    </div>
                    <span className="font-bold font-sans text-primary-900">₹{item.total_price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl bg-primary-50/50 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{activeOrder.subtotal}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({activeOrder.coupon_code}):</span>
                  <span>-₹{activeOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{activeOrder.shipping_charge === 0 ? "FREE" : `₹${activeOrder.shipping_charge}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-primary-900 pt-2 border-t border-primary-100">
                <span>Total Amount:</span>
                <span>₹{activeOrder.total}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveOrder(null)}
                className="px-6 py-2.5 rounded-full bg-primary-700 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
