"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { INDIAN_STATES } from "@/lib/india-states";
import { Address } from "@/types/ecommerce";
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, appliedCoupon, discountAmount, shippingCharge, tax, finalTotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fill in the signed-in customer's details and saved address, without overwriting
  // anything they have already typed
  useEffect(() => {
    if (!profile || !user) return;

    setCustomerInfo((prev) => ({
      name: prev.name || profile.name || "",
      email: prev.email || user.email || profile.email || "",
      phone: prev.phone || profile.phone || "",
    }));

    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("addresses")
      .select("*")
      .eq("customer_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setAddress((prev) =>
          prev.address_line_1
            ? prev
            : {
                ...prev,
                name: prev.name || data?.name || profile.name || "",
                phone: prev.phone || data?.phone || profile.phone || "",
                address_line_1: data?.address_line_1 || "",
                address_line_2: data?.address_line_2 || "",
                city: data?.city || "",
                state: data?.state || "",
                postal_code: data?.postal_code || "",
              }
        );
      });
  }, [profile, user]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add products to checkout.");
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setErrorMessage("Please fill in your full name, email, and phone number.");
      return;
    }

    if (!address.address_line_1 || !address.city || !address.state || !address.postal_code) {
      setErrorMessage("Please complete your delivery address with City, State and PIN Code.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Request server to calculate verified totals and create Razorpay Order
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          couponCode: appliedCoupon?.code,
          notes,
          customerInfo: {
            ...customerInfo,
            id: user?.id,
          },
          shippingAddress: {
            ...address,
            name: address.name || customerInfo.name,
            phone: address.phone || customerInfo.phone,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize order.");
      }

      // 2. Check if we are running in simulated development mode
      if (data.isMock || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        // Instant simulated checkout for developer verification
        const verifyRes = await fetch("/api/checkout/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: "mock_sig_valid",
            orderNumber: data.orderNumber,
            customerInfo: { ...customerInfo, id: user?.id },
            shippingAddress: address,
            items: cart,
            breakdown: data.breakdown,
            couponCode: appliedCoupon?.code,
            notes,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          clearCart();
          router.push(`/order-confirmation?order_id=${verifyData.orderId}`);
          return;
        } else {
          throw new Error(verifyData.error || "Verification failed");
        }
      }

      // 3. Live Razorpay Standard Checkout SDK
      const options = {
        key: data.keyId,
        amount: data.amountInPaise,
        currency: data.currency,
        name: "GutVaidya",
        description: `Order #${data.orderNumber} - Traditional Health Mix`,
        image: `${window.location.origin}/logo.jpg`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#1f4f16",
        },
        handler: async function (response: any) {
          try {
            // 4. Client verifies response server-side ONLY
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderNumber: data.orderNumber,
                customerInfo: { ...customerInfo, id: user?.id },
                shippingAddress: address,
                items: cart,
                breakdown: data.breakdown,
                couponCode: appliedCoupon?.code,
                notes,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              router.push(`/order-confirmation?order_id=${verifyData.orderId}`);
            } else {
              setErrorMessage(verifyData.error || "Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err: any) {
            setErrorMessage("Error verifying payment signature.");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        setErrorMessage(`Payment failed: ${response.error.description || "Transaction declined."}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      {/* Razorpay Standard Checkout SDK script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Checkout Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-primary-900">
              Secure Checkout
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1">
              Please enter your delivery details to complete your order.
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-primary-100 max-w-md mx-auto p-8 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <h2 className="font-serif font-bold text-xl text-primary-900 mb-2">Your Cart is Empty</h2>
              <p className="text-xs text-foreground/60 mb-6">
                You must have items in your cart to proceed to checkout.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors shadow-sm"
              >
                Shop Formulations
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePay}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Customer & Address Form */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-primary-100 shadow-sm space-y-4">
                    <h2 className="font-serif font-bold text-lg text-primary-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">
                        1
                      </span>
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, name: e.target.value });
                            setAddress({ ...address, name: e.target.value });
                          }}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Email Address (for order updates) *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Mobile Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, phone: e.target.value });
                            setAddress({ ...address, phone: e.target.value });
                          }}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-primary-100 shadow-sm space-y-4">
                    <h2 className="font-serif font-bold text-lg text-primary-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">
                        2
                      </span>
                      Delivery Address
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Flat / House No. / Building Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={address.address_line_1}
                          onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })}
                          placeholder="e.g. Flat 302, Ashoka Enclave"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Street / Locality / Landmark
                        </label>
                        <input
                          type="text"
                          value={address.address_line_2 || ""}
                          onChange={(e) => setAddress({ ...address, address_line_2: e.target.value })}
                          placeholder="e.g. Near Indiranagar Metro Station"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          State *
                        </label>
                        <select
                          required
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        >
                          <option value="" disabled>
                            Select state
                          </option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          PIN Code (6 digits) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          pattern="[0-9]{6}"
                          value={address.postal_code}
                          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                          placeholder="560038"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="India"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm bg-primary-50/50 text-foreground/70 cursor-not-allowed"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-primary-900 block mb-1">
                          Delivery Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Leave package with building security"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Order Breakdown & Payment Button */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-primary-100 shadow-sm space-y-6 sticky top-28">
                    <h2 className="font-serif font-bold text-lg text-primary-900 border-b border-primary-100 pb-3">
                      Order Summary
                    </h2>

                    {/* Cart item snapshots */}
                    <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-primary-100/50 scrollbar-none">
                      {cart.map((item) => (
                        <div key={item.id || item.slug} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-50 border border-primary-100 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-serif font-bold text-primary-900 block line-clamp-1">
                                {item.name}
                              </span>
                              <span className="text-foreground/50">
                                Qty: {item.qty} × ₹{item.price}
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-primary-900">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-primary-100">
                      <div className="flex justify-between text-foreground/70">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-primary-900">₹{subtotal}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Coupon Discount ({appliedCoupon?.code})</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-foreground/70">
                        <span>Shipping Fee</span>
                        <span className={shippingCharge === 0 ? "text-primary-700 font-bold" : "font-semibold"}>
                          {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px] text-foreground/50">
                        <span>Taxes & Processing</span>
                        <span>Included</span>
                      </div>

                      <hr className="border-primary-100" />

                      <div className="flex justify-between text-base sm:text-lg font-serif font-bold text-primary-900">
                        <span>Total Payable</span>
                        <span className="font-sans">₹{finalTotal}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span>Connecting to Secure Gateway...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay Securely via Razorpay • ₹{finalTotal}
                        </>
                      )}
                    </button>

                    <div className="space-y-2 pt-2 text-[11px] text-foreground/50 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-accent-gold" />
                        <span>Supports UPI, Cards, NetBanking, & Wallets</span>
                      </div>
                      <p>
                        Your payment information is encrypted and processed directly by Razorpay.
                      </p>
                      <p>
                        By placing this order you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-primary-700">Terms</Link>,{" "}
                        <Link href="/refund-policy" className="underline hover:text-primary-700">Refund</Link> and{" "}
                        <Link href="/shipping-policy" className="underline hover:text-primary-700">Shipping</Link> policies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
