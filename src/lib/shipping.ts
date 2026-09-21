// =========================================================
// Modular Shipping Rules & Configuration
// =========================================================

export interface ShippingConfig {
  freeShippingThreshold: number; // in INR
  standardShippingFee: number;   // in INR
  expressShippingFee: number;    // in INR
  taxRate: number;               // 0.00 to 1.00 (e.g., 0.05 for 5% GST if applicable)
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 999, // Orders over ₹999 get free shipping
  standardShippingFee: 60,    // Standard shipping ₹60
  expressShippingFee: 120,    // Express shipping ₹120
  taxRate: 0.0,               // Prices are all-inclusive
};

export interface ShippingCalculation {
  subtotal: number;
  shippingCharge: number;
  tax: number;
  isFreeShipping: number; // remaining amount to qualify, or 0 if qualified
}

export function calculateShipping(
  subtotal: number,
  config: ShippingConfig = DEFAULT_SHIPPING_CONFIG
): ShippingCalculation {
  const isFree = subtotal >= config.freeShippingThreshold;
  const shippingCharge = subtotal > 0 ? (isFree ? 0 : config.standardShippingFee) : 0;
  const remainingForFree = Math.max(0, config.freeShippingThreshold - subtotal);
  const tax = Math.round(subtotal * config.taxRate * 100) / 100;

  return {
    subtotal,
    shippingCharge,
    tax,
    isFreeShipping: remainingForFree,
  };
}
