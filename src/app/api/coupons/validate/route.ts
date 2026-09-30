import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  // Stops bots from guessing coupon codes
  const limited = await rateLimit(req, 'coupon', 30, 600);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Coupon code is required.' },
        { status: 400 }
      );
    }

    const result = await validateCoupon(String(code), Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Coupon validation error', error);
    return NextResponse.json(
      { valid: false, message: 'Failed to validate coupon.' },
      { status: 500 }
    );
  }
}
