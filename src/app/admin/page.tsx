import React from "react";
import Link from "next/link";
import { getOrders } from "@/lib/orders";
import { requireAdminPage } from "@/lib/supabase/auth";
import { getProducts } from "@/lib/products";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// Per-request: shows private order data for the signed-in user
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // The admin layout's gate runs in the browser; this stops the order data being sent at all
  await requireAdminPage();

  // Unpaid checkouts are saved as pending orders; they are not sales
  const orders = await getOrders({ paidOnly: true });
  const products = await getProducts();

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock_quantity < 20);

  const kpis = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      subtitle: "Lifetime verified sales",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: orders.length,
      subtitle: "Paid & processing orders",
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Active Products",
      value: products.length,
      subtitle: "7 traditional formulations",
      icon: Package,
      color: "text-primary-700 bg-primary-50",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockProducts.length,
      subtitle: "Items below 20 units",
      icon: AlertTriangle,
      color: lowStockProducts.length > 0 ? "text-amber-600 bg-amber-50" : "text-foreground/40 bg-gray-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-6 rounded-3xl bg-base-50 border border-primary-100 shadow-sm flex items-start justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                  {kpi.title}
                </span>
                <span className="text-2xl sm:text-3xl font-sans font-bold text-primary-900 block tabular-nums tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-xs text-foreground/50 mt-1 block">{kpi.subtitle}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">Low Stock Inventory Notice</h4>
              <p className="text-xs text-amber-700">
                {lowStockProducts.map((p) => `${p.name} (${p.stock_quantity} left)`).join(", ")}
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors whitespace-nowrap text-center"
          >
            Update Inventory
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-base-50 rounded-3xl border border-primary-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-primary-100 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary-900">Recent Customer Orders</h3>
            <p className="text-xs text-foreground/50">Latest transactions received across all channels.</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-primary-100/60 text-foreground/40 uppercase font-bold">
                <th className="py-3 px-2">Order #</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/40">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-primary-50/30 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-primary-900">
                    {order.order_number}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="font-bold text-primary-900 block">{order.customer_name}</span>
                    <span className="text-[10px] text-foreground/50">{order.customer_email}</span>
                  </td>
                  <td className="py-3.5 px-2 text-foreground/60">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-3.5 px-2 font-semibold text-foreground/75">
                    {order.items.length} items
                  </td>
                  <td className="py-3.5 px-2 font-bold font-sans text-primary-900">
                    ₹{order.total}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {order.order_status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-primary-700 hover:underline font-semibold"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
