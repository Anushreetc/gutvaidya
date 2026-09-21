import { Coupon, CouponValidationResult } from '@/types/ecommerce';
import { createAdminClient } from './supabase/admin';

// Fallback seed coupons when database credentials are not yet set
export const SEED_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'GUTHEALTH10',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_order_value: 500,
    maximum_discount: 200,
    usage_limit: 1000,
    used_count: 14,
    active: true,
  },
  {
    id: 'c2',
    code: 'WELCOME50',
    discount_type: 'fixed',
    discount_value: 50,
    minimum_order_value: 499,
    maximum_discount: 50,
    usage_limit: 500,
    used_count: 32,
    active: true,
  },
  {
    id: 'c3',
    code: 'FESTIVE100',
    discount_type: 'fixed',
    discount_value: 100,
    minimum_order_value: 1200,
    maximum_discount: 100,
    usage_limit: 200,
    used_count: 5,
    active: true,
  },
];

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) {
    return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  let coupon: Coupon | null = null;
  const adminClient = createAdminClient();

  if (adminClient) {
    const { data, error } = await adminClient
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (!error && data) {
      coupon = data as Coupon;
    }
  }

  // Fallback to in-memory seed coupons if Supabase is offline/not configured
  if (!coupon) {
    coupon = SEED_COUPONS.find((c) => c.code === normalizedCode) || null;
  }

  if (!coupon) {
    return { valid: false, discountAmount: 0, message: 'Invalid coupon code.' };
  }

  if (!coupon.active) {
    return { valid: false, discountAmount: 0, message: 'This coupon is no longer active.' };
  }

  // Check Expiry Date
  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return { valid: false, discountAmount: 0, message: 'This coupon has expired.' };
  }

  // Check Usage Limit
  if (coupon.usage_limit && (coupon.used_count || 0) >= coupon.usage_limit) {
    return { valid: false, discountAmount: 0, message: 'Coupon usage limit has been reached.' };
  }

  // Check Minimum Order Value
  if (coupon.minimum_order_value && subtotal < coupon.minimum_order_value) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order value of ₹${coupon.minimum_order_value} required for this coupon.`,
    };
  }

  // Calculate Discount Amount
  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = (subtotal * coupon.discount_value) / 100;
    if (coupon.maximum_discount && discountAmount > coupon.maximum_discount) {
      discountAmount = coupon.maximum_discount;
    }
  } else if (coupon.discount_type === 'fixed') {
    discountAmount = Math.min(coupon.discount_value, subtotal);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Coupon '${coupon.code}' applied successfully!`,
  };
}
