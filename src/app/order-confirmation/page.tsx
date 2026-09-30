import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderByIdOrNumber } from '@/lib/orders';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{
    order_id?: string;
  }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const { order_id } = await searchParams;
  // Only accept the unguessable order UUID here; order numbers are sequential-looking
  const isUuid = !!order_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order_id);
  const order = order_id && (isUuid || !isSupabaseConfigured()) ? await getOrderByIdOrNumber(order_id) : null;

  // Compute estimated delivery window (3 to 5 business days)
  const deliveryStart = new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const deliveryEnd = new Date(Date.now() + 86400000 * 5).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Banner */}
          <div className="text-center bg-white rounded-3xl border border-primary-100 p-8 sm:p-12 shadow-sm mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Payment Verified & Confirmed
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary-900 mb-2">
              Order Placed Successfully!
            </h1>

            <p className="text-xs sm:text-sm text-foreground/70 max-w-md mx-auto">
              Thank you for trusting GutVaidya. We are carefully preparing your freshly roasted health mix with 36+ natural ingredients.
            </p>

            {order && (
              <div className="mt-6 inline-block bg-primary-50/60 border border-primary-100/80 rounded-2xl px-6 py-3">
                <span className="text-xs uppercase text-foreground/50 block font-bold">Order Number</span>
                <span className="text-lg font-mono font-bold text-primary-900">{order.order_number}</span>
              </div>
            )}
          </div>

          {/* Delivery & Summary Details */}
          {order ? (
            <div className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Estimated Delivery Banner */}
              <div className="p-4 rounded-2xl bg-primary-50/60 border border-primary-100 flex items-center gap-3">
                <Truck className="w-6 h-6 text-accent-gold flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-sm text-primary-900">Estimated Delivery</h3>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    Expected between <strong>{deliveryStart}</strong> and <strong>{deliveryEnd}</strong>.
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-primary-900 border-b border-primary-100 pb-2">
                  Purchased Items ({order.items.length})
                </h3>

                <div className="divide-y divide-primary-100/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-50 border border-primary-100 flex-shrink-0">
                          <img src={item.image || '/product.jpeg'} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <strong className="font-serif font-bold text-primary-900 block">
                            {item.product_name}
                          </strong>
                          <span className="text-foreground/50 text-xs">
                            Qty: {item.quantity} × ₹{item.unit_price}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-primary-900">₹{item.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-4 border-t border-primary-100 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({order.coupon_code || 'Coupon'})</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping Fee</span>
                  <span>{order.shipping_charge === 0 ? 'FREE' : `₹${order.shipping_charge}`}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-base text-primary-900 pt-2 border-t border-primary-100">
                  <span>Total Paid</span>
                  <span className="font-sans">₹{order.total}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="pt-4 border-t border-primary-100">
                <h4 className="text-xs uppercase tracking-wider font-bold text-primary-900 mb-2">
                  Delivery Details
                </h4>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  <strong>{order.shipping_address.name}</strong> ({order.shipping_address.phone})<br />
                  {order.shipping_address.address_line_1}, {order.shipping_address.address_line_2 || ''}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/account/orders"
                  className="flex-1 text-center py-3 rounded-full bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors shadow-sm"
                >
                  View Order in My Account
                </Link>
                <Link
                  href="/products"
                  className="flex-1 text-center py-3 rounded-full border border-primary-200 text-primary-800 font-semibold text-xs hover:bg-primary-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
