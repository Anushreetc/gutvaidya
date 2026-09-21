"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Coupon } from "@/types/ecommerce";
import { calculateShipping, DEFAULT_SHIPPING_CONFIG } from "@/lib/shipping";

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, "qty">, quantity?: number) => void;
  removeFromCart: (idOrSlug: string) => void;
  updateQuantity: (idOrSlug: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  shippingCharge: number;
  tax: number;
  finalTotal: number;
  freeShippingRemaining: number;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Initialize cart and coupon from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gutvaidya_cart_v2");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Migration from v1 cart if present
        const oldCart = localStorage.getItem("gutvaidya_cart");
        if (oldCart) {
          const parsed = JSON.parse(oldCart);
          if (Array.isArray(parsed)) {
            setCart(
              parsed.map((item: any, idx: number) => ({
                id: item.id || `legacy-${idx}`,
                slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                name: item.name,
                price: Number(item.price),
                image: item.image || "/product.jpeg",
                qty: item.qty || 1,
                stock_quantity: 100,
                weight_size: "500g",
              }))
            );
          }
        }
      }

      const savedCoupon = localStorage.getItem("gutvaidya_applied_coupon");
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setAppliedCoupon(parsed.coupon);
        setDiscountAmount(parsed.discountAmount);
      }
    } catch (e) {
      console.error("Error reading cart from localStorage", e);
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    try {
      localStorage.setItem("gutvaidya_cart_v2", JSON.stringify(cart));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  }, [cart]);

  // Recalculate discount whenever subtotal or coupon changes
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    if (!appliedCoupon) {
      setDiscountAmount(0);
      return;
    }

    if (appliedCoupon.minimum_order_value && subtotal < appliedCoupon.minimum_order_value) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      localStorage.removeItem("gutvaidya_applied_coupon");
      return;
    }

    let discount = 0;
    if (appliedCoupon.discount_type === "percentage") {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.maximum_discount && discount > appliedCoupon.maximum_discount) {
        discount = appliedCoupon.maximum_discount;
      }
    } else if (appliedCoupon.discount_type === "fixed") {
      discount = Math.min(appliedCoupon.discount_value, subtotal);
    }

    discount = Math.round(discount * 100) / 100;
    setDiscountAmount(discount);

    localStorage.setItem(
      "gutvaidya_applied_coupon",
      JSON.stringify({ coupon: appliedCoupon, discountAmount: discount })
    );
  }, [subtotal, appliedCoupon]);

  const shippingCalc = calculateShipping(Math.max(0, subtotal - discountAmount));
  const shippingCharge = subtotal > 0 ? shippingCalc.shippingCharge : 0;
  const tax = shippingCalc.tax;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge + tax);
  const freeShippingRemaining = shippingCalc.isFreeShipping;
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  const addToCart = (item: Omit<CartItem, "qty">, quantity = 1) => {
    setCart((prevCart) => {
      const matchIndex = prevCart.findIndex(
        (i) => i.id === item.id || i.slug === item.slug || i.name === item.name
      );

      if (matchIndex > -1) {
        const existing = prevCart[matchIndex];
        const newQty = Math.min(
          existing.qty + quantity,
          item.stock_quantity || 99
        );
        const updated = [...prevCart];
        updated[matchIndex] = { ...existing, qty: newQty };
        return updated;
      }

      return [
        ...prevCart,
        {
          ...item,
          qty: Math.min(quantity, item.stock_quantity || 99),
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (idOrSlug: string) => {
    setCart((prevCart) =>
      prevCart.filter((i) => i.id !== idOrSlug && i.slug !== idOrSlug && i.name !== idOrSlug)
    );
  };

  const updateQuantity = (idOrSlug: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(idOrSlug);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === idOrSlug || item.slug === idOrSlug || item.name === idOrSlug) {
          const clampedQty = Math.min(qty, item.stock_quantity || 99);
          return { ...item, qty: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem("gutvaidya_cart_v2");
    localStorage.removeItem("gutvaidya_applied_coupon");
  };

  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();

      if (data.valid && data.coupon) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        return { success: true, message: data.message || "Coupon applied!" };
      } else {
        return { success: false, message: data.message || "Invalid coupon code." };
      }
    } catch (e) {
      return { success: false, message: "Unable to validate coupon right now." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem("gutvaidya_applied_coupon");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        appliedCoupon,
        discountAmount,
        shippingCharge,
        tax,
        finalTotal,
        freeShippingRemaining,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
