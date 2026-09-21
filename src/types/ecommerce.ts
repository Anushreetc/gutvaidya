// =========================================================
// Gut Vaidya E-Commerce Core TypeScript Interfaces
// =========================================================

export type ProductStatus = 'active' | 'draft' | 'archived';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  stock_quantity: number;
  category_id?: string;
  category_name?: string;
  main_image: string;
  images?: string[];
  status: ProductStatus;
  featured: boolean;
  benefits: string[];
  ingredients: string;
  usage_instructions: string;
  weight_size: string;
  badge?: string;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  price: number;
  compare_at_price?: number;
  image: string;
  qty: number;
  stock_quantity: number;
  weight_size?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_value?: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count?: number;
  start_date?: string;
  expiry_date?: string;
  active: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
}

export interface Address {
  id?: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address;
  subtotal: number;
  discount: number;
  shipping_charge: number;
  tax: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  coupon_code?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id?: string;
  customer_name: string;
  rating: number;
  review: string;
  approved: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at: string;
}
