"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  name: string;
  price: number; // raw number for calculations, e.g., 720
  qty: number;
  note: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (name: string) => void;
  updateQuantity: (name: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("gutvaidya_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("gutvaidya_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === item.name);
      if (existingItem) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
    setIsCartOpen(true); // Auto-open cart drawer on addition
  };

  const removeFromCart = (name: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.name !== name));
  };

  const updateQuantity = (name: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(name);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.name === name ? { ...i, qty } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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
