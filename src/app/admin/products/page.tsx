"use client";

import React, { useState, useEffect } from "react";
import { SEED_PRODUCTS, SEED_CATEGORIES } from "@/lib/products";
import { Product } from "@/types/ecommerce";
import {
  Search,
  Plus,
  Edit2,
  Check,
  X,
  Sparkles,
  Package,
  AlertTriangle,
  Save,
} from "lucide-react";

import {
  getProductOverrides,
  applyProductOverrides,
  saveProductUpdate,
  subscribeToProductUpdates,
} from "@/lib/products-client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ price: number; stock: number; comparePrice: number }>({
    price: 0,
    stock: 0,
    comparePrice: 0,
  });

  // Fetch live products on mount and apply overrides
  useEffect(() => {
    // 1. Immediately apply local overrides so there is zero flash
    const overrides = getProductOverrides();
    if (Object.keys(overrides).length > 0) {
      setProducts((prev) => applyProductOverrides(prev, overrides));
    }

    // 2. Fetch latest from API
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(applyProductOverrides(data, getProductOverrides()));
        }
      })
      .catch(() => {});

    // 3. Listen for updates across tabs
    const unsubscribe = subscribeToProductUpdates((latestOverrides) => {
      setProducts((prev) => applyProductOverrides(prev, latestOverrides));
    });

    return unsubscribe;
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    price: 799,
    compare_at_price: 999,
    stock_quantity: 100,
    short_description: "",
    description: "",
    weight_size: "500g",
    badge: "New Release",
    category_id: SEED_CATEGORIES[0].id,
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({
      price: p.price,
      stock: p.stock_quantity,
      comparePrice: p.compare_at_price || p.price,
    });
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Saves to the server; on failure, tells the admin and reloads the true values
  const persistProduct = async (action: "update" | "create", product: Product): Promise<Product | null> => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, product }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      return data.product as Product;
    } catch (err: any) {
      showToast(`⚠ Could not save ${product.name}: ${err.message}`);
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => Array.isArray(data) && data.length > 0 && setProducts(data))
        .catch(() => {});
      return null;
    }
  };

  const saveEdit = async (product: Product) => {
    const updated = {
      ...product,
      price: editForm.price,
      compare_at_price: editForm.comparePrice,
      stock_quantity: editForm.stock,
    };

    // 1. Save immediately to client store & broadcast to all tabs
    saveProductUpdate(updated);

    // 2. Update local state
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    setEditingId(null);
    showToast(`✓ Updated ${updated.name} to ₹${updated.price} (Synced live to website)`);

    // 3. Persist to server API
    await persistProduct("update", updated);
  };

  const toggleFeatured = async (product: Product) => {
    const updated = { ...product, featured: !product.featured };
    saveProductUpdate(updated);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    showToast(`${updated.name} ${updated.featured ? 'featured on' : 'removed from'} homepage`);

    await persistProduct("update", updated);
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "draft" : "active";
    const updated = { ...product, status: newStatus as any };
    saveProductUpdate(updated);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    showToast(`Status changed to ${newStatus}`);

    await persistProduct("update", updated);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const created: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price: Number(newProduct.price),
      compare_at_price: Number(newProduct.compare_at_price),
      stock_quantity: Number(newProduct.stock_quantity),
      short_description: newProduct.short_description,
      description: newProduct.description || newProduct.short_description,
      weight_size: newProduct.weight_size,
      badge: newProduct.badge,
      category_id: newProduct.category_id,
      category_name: SEED_CATEGORIES.find((c) => c.id === newProduct.category_id)?.name,
      main_image: "/product.jpeg",
      images: ["/product.jpeg"],
      status: "active",
      featured: false,
      benefits: ["100% Organic", "Traditional Recipe", "Zero Added Sugar"],
      ingredients: "Sprouted ancient grains and herbs.",
      usage_instructions: "Mix 2 tablespoons in warm water or milk.",
      rating: 5.0,
      reviews_count: 1,
    };

    setProducts([created, ...products]);
    setIsAddModalOpen(false);

    // Swap the placeholder for the saved row (the database assigns the real id)
    const saved = await persistProduct("create", created);
    if (saved) {
      setProducts((prev) => prev.map((p) => (p.id === created.id ? saved : p)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {saveSuccessMsg && (
        <div className="p-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-100 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add New Formulation
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-primary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-primary-50/50 border-b border-primary-100 text-foreground/50 uppercase font-bold">
                <th className="py-3.5 px-4">Formulation</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Compare At (₹)</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/50">
              {filtered.map((p) => {
                const isEditing = editingId === p.id;
                const isLow = p.stock_quantity < 20;

                return (
                  <tr key={p.id} className="hover:bg-primary-50/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.main_image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-primary-100 flex-shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-primary-900 text-sm block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-foreground/40 font-mono">{p.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-primary-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-20 px-2 py-1 rounded border border-primary-300 text-xs font-bold"
                        />
                      ) : (
                        `₹${p.price}`
                      )}
                    </td>

                    {/* Compare price */}
                    <td className="py-4 px-4 text-foreground/50">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.comparePrice}
                          onChange={(e) =>
                            setEditForm({ ...editForm, comparePrice: Number(e.target.value) })
                          }
                          className="w-20 px-2 py-1 rounded border border-primary-300 text-xs"
                        />
                      ) : (
                        p.compare_at_price ? `₹${p.compare_at_price}` : "-"
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                          className="w-20 px-2 py-1 rounded border border-primary-300 text-xs font-bold"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLow ? "text-amber-700" : "text-primary-900"}`}>
                            {p.stock_quantity} units
                          </span>
                          {isLow && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                              Low
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === "active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          p.featured
                            ? "bg-accent-gold text-white border-accent-gold"
                            : "bg-white text-foreground/30 border-primary-200"
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => saveEdit(p)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary-200 text-primary-800 hover:bg-primary-50 font-semibold"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-primary-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-primary-900">
                Add New Traditional Formulation
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-foreground/50 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    setNewProduct({ ...newProduct, name, slug });
                  }}
                  placeholder="e.g. GutVaidya Ojas Vitality Mix"
                  className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                  SEO Slug *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  placeholder="e.g. gutvaidya-ojas-vitality-mix"
                  className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                    Compare At (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.compare_at_price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, compare_at_price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock_quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                >
                  {SEED_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-primary-900 block mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newProduct.short_description}
                  onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                  placeholder="Key benefits and summary of traditional ingredients..."
                  className="w-full px-3 py-2 rounded-xl border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-primary-200 text-xs font-bold text-foreground/70 hover:bg-primary-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold shadow-sm"
                >
                  Create Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
