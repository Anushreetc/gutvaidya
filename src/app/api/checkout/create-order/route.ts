import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';
import { validateCoupon } from '@/lib/coupons';
import { calculateShipping } from '@/lib/shipping';
import { createRazorpayOrder } from '@/lib/razorpay';
import { Product } from '@/types/ecommerce';

import { safeDecodeCookie } from '@/lib/products-client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, couponCode, shippingAddress, customerInfo } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.name || !customerInfo.phone) {
      return NextResponse.json(
        { error: 'Customer name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.address_line_1 || !shippingAddress.city || !shippingAddress.postal_code) {
      return NextResponse.json(
        { error: 'Valid delivery address is required.' },
        { status: 400 }
      );
    }

    // 1. Fetch real products from server to verify prices and stock
    let allProducts = await getProducts();

    try {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/gutvaidya_custom_products=([^;]+)/);
      if (match && match[1]) {
        const overrides = safeDecodeCookie(match[1]);
        allProducts = allProducts.map((p) => {
          const override = overrides[p.id] || overrides[p.slug];
          if (!override) return p;
          return {
            ...p,
            ...(override.price !== undefined ? { price: Number(override.price) } : {}),
            ...(override.stock_quantity !== undefined ? { stock_quantity: Number(override.stock_quantity) } : {}),
          };
        });
      }
    } catch (e) {}

    const verifiedItems: { product: Product; qty: number; unitPrice: number; totalPrice: number }[] = [];

    for (const item of items) {
      const dbProduct = allProducts.find(
        (p) => p.id === item.id || p.slug === item.slug || p.name === item.name
      );

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product '${item.name || item.slug}' is no longer available.` },
          { status: 400 }
        );
      }

      if (dbProduct.stock_quantity < item.qty) {
        return NextResponse.json(
          {
            error: `Only ${dbProduct.stock_quantity} units of '${dbProduct.name}' available in stock.`,
          },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Number(item.qty) || 1);
      const unitPrice = dbProduct.price;
      const totalPrice = unitPrice * qty;

      verifiedItems.push({
        product: dbProduct,
        qty,
        unitPrice,
        totalPrice,
      });
    }

    // 2. Server-side calculation of subtotal
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // 3. Server-side coupon verification
    let discount = 0;
    let appliedCode = '';
    if (couponCode) {
      const couponValidation = await validateCoupon(couponCode, subtotal);
      if (couponValidation.valid) {
        discount = couponValidation.discountAmount;
        appliedCode = couponValidation.coupon?.code || '';
      }
    }

    // 4. Server-side shipping fee calculation
    const shipping = calculateShipping(Math.max(0, subtotal - discount));
    const total = Math.max(0, subtotal - discount + shipping.shippingCharge + shipping.tax);

    // 5. Generate human-readable order number
    const orderNumber = `GV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 6. Create Razorpay order on server
    const rzpOrder = await createRazorpayOrder(total, orderNumber, {
      customer_email: customerInfo.email,
      customer_name: customerInfo.name,
      order_number: orderNumber,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      amountInPaise: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isMock: (rzpOrder as any).isMock || false,
      breakdown: {
        subtotal,
        discount,
        couponCode: appliedCode,
        shippingCharge: shipping.shippingCharge,
        tax: shipping.tax,
        total,
      },
    });
  } catch (err: any) {
    console.error('Create order error', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout order.' },
      { status: 500 }
    );
  }
}
