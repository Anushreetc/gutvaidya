import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByIdOrNumber } from "@/lib/orders";
import { getCurrentUser, isUserAdmin } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "processing", label: "Processing & Blending" },
  { key: "packed", label: "Quality Sealed" },
  { key: "shipped", label: "In Transit" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getOrderByIdOrNumber(orderId);

  if (!order) {
    notFound();
  }

  // Only the customer who placed the order (or an admin) may view it
  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    const ownsOrder =
      !!user &&
      (order.customer_id === user.id ||
        order.customer_email.toLowerCase() === (user.email || "").toLowerCase());
    if (!user || (!ownsOrder && !(await isUserAdmin(user.id)))) {
      notFound();
    }
  }

  // Determine current active step index in the tracker
  const getActiveStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 0;
      case "processing":
        return 1;
      case "packed":
        return 2;
      case "shipped":
        return 3;
      case "out_for_delivery":
        return 4;
      case "delivered":
        return 5;
      default:
        return 0;
    }
  };

  const currentStep = getActiveStepIndex(order.order_status);

  return (
    <div className="bg-base-50 rounded-3xl border border-primary-100 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-100 pb-6">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-primary-700 hover:underline font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Orders
          </Link>
          <h1 className="text-2xl font-serif font-bold text-primary-900 flex items-center gap-2">
            <span>Order <span className="font-mono font-bold text-xl tracking-tight">#{order.order_number}</span></span>
          </h1>
          <p className="text-xs text-foreground/50 mt-0.5">
            Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            {order.order_status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="p-6 rounded-2xl bg-primary-50/50 border border-primary-100">
        <h3 className="font-serif font-bold text-sm text-primary-900 mb-6">Delivery Progress</h3>
        <div className="relative flex flex-col md:flex-row justify-between gap-4">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.key}
                className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 flex-1 relative"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                    isCompleted
                      ? "bg-primary-700 text-white shadow-sm ring-4 ring-primary-100"
                      : "bg-base-50 border border-primary-200 text-foreground/40"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isCurrent ? "text-primary-800" : isCompleted ? "text-foreground/80" : "text-foreground/40"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-base text-primary-900 border-b border-primary-100 pb-2">
          Ordered Formulations ({order.items.length})
        </h3>
        <div className="divide-y divide-primary-100/60">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary-50 border border-primary-100 flex-shrink-0">
                  <img
                    src={item.image || "/product.jpeg"}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary-900 text-sm sm:text-base">
                    {item.product_name}
                  </h4>
                  <p className="text-xs text-foreground/50">
                    Quantity: {item.quantity} × ₹{item.unit_price}
                  </p>
                </div>
              </div>
              <span className="font-sans font-bold text-primary-900 text-sm sm:text-base">
                ₹{item.total_price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Info Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-primary-100">
        {/* Delivery Address */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">
            Shipping Information
          </h4>
          <div className="p-4 rounded-2xl bg-base-50 border border-primary-100 text-xs text-foreground/80 leading-relaxed">
            <strong className="text-primary-900 block text-sm">{order.shipping_address.name}</strong>
            <p className="mt-1">
              {order.shipping_address.address_line_1}
              {order.shipping_address.address_line_2 ? `, ${order.shipping_address.address_line_2}` : ""}
              <br />
              {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
              <br />
              Phone: {order.shipping_address.phone}
            </p>
          </div>
        </div>

        {/* Payment & Invoice breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold text-accent-gold-dark tracking-wider">
            Payment Summary
          </h4>
          <div className="p-4 rounded-2xl bg-base-50 border border-primary-100 space-y-2 text-xs">
            <div className="flex justify-between text-foreground/70">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.coupon_code || "Coupon"})</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-foreground/70">
              <span>Shipping Fee</span>
              <span>{order.shipping_charge === 0 ? "FREE" : `₹${order.shipping_charge}`}</span>
            </div>
            <hr className="border-primary-100" />
            <div className="flex justify-between font-serif font-bold text-base text-primary-900">
              <span>Total Paid</span>
              <span className="font-sans">₹{order.total}</span>
            </div>
            <div className="pt-2 text-[10px] text-foreground/40 flex items-center justify-between">
              <span>Payment ID: {order.razorpay_payment_id || "N/A"}</span>
              <span className="text-emerald-700 font-semibold">Paid via Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
