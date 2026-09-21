import React from "react";
import Link from "next/link";
import { getOrders } from "@/lib/orders";
import { Package, ChevronRight, Clock, CheckCircle2, Truck } from "lucide-react";

export default async function AccountOrdersPage() {
  const orders = await getOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
      case "packed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-primary-50 text-primary-800 border-primary-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-primary-900">Order History</h1>
        <p className="text-xs text-foreground/60 mt-0.5">
          View all your previous purchases, track shipments, and access tax receipts.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-primary-50/40 rounded-2xl border border-primary-100 p-6">
          <Package className="w-10 h-10 text-primary-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-primary-900 mb-1">No Orders Yet</h3>
          <p className="text-xs text-foreground/60 mb-4">
            You haven't placed any wellness mix orders with us yet.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2 rounded-full bg-primary-700 text-white font-semibold text-xs hover:bg-primary-800 transition-colors"
          >
            Explore Formulations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl border border-primary-100 hover:border-primary-300 transition-all hover:shadow-md bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-primary-900">
                    {order.order_number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      order.order_status
                    )}`}
                  >
                    {order.order_status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-foreground/50">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 pt-1">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-lg overflow-hidden bg-primary-50 border border-primary-100 flex-shrink-0"
                      title={item.product_name}
                    >
                      <img
                        src={item.image || "/product.jpeg"}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-[11px] text-foreground/50 font-bold">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-primary-100/60">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-foreground/40 block">Total</span>
                  <span className="text-base font-bold font-sans text-primary-900">₹{order.total}</span>
                </div>

                <Link
                  href={`/account/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary-200 text-primary-800 text-xs font-bold hover:bg-primary-50 transition-colors"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
