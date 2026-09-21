import Razorpay from 'razorpay';
import crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

export const razorpayInstance =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;

export async function createRazorpayOrder(
  amountInINR: number,
  receipt: string,
  notes?: Record<string, string>
) {
  // Amount in Paise (INR * 100)
  const amountInPaise = Math.round(amountInINR * 100);

  if (razorpayInstance) {
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: notes || {},
    });
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  }

  // Fallback test order generator when Razorpay credentials are not yet configured in dev
  const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: mockOrderId,
    amount: amountInPaise,
    currency: 'INR',
    receipt,
    isMock: true,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  // If running in development simulation without secret key
  if (!keySecret) {
    return orderId.startsWith('order_mock_') || signature === 'mock_sig_valid';
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}
