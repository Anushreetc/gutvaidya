import { DEFAULT_SHIPPING_CONFIG } from './shipping';

// Single source for the business details shown in the footer, policy pages and product pages.
// Update here and every page follows.
export const BUSINESS = {
  brandName: 'GutVaidya',
  legalName: 'GutVaidya Health Mix',
  supportEmail: 'support@thegutvaidya.com',
  supportPhone: '+91 78928 91239',
  supportPhoneHref: 'tel:+917892891239',
  supportHours: 'Monday to Saturday, 9 AM – 6 PM IST',
  fssaiLicense: '21224172000058',
  jurisdiction: 'Bengaluru, Karnataka',
  // Required for Razorpay activation and DPDPA compliance. Replace with the
  // registered business address exactly as it appears on the FSSAI licence.
  registeredAddress: 'Abhiayur, Rajajinagar, Bengaluru, Karnataka 560010, India',
  // Optional: fill if the business is GST-registered.
  gstin: '',
  freeShippingThreshold: DEFAULT_SHIPPING_CONFIG.freeShippingThreshold,
  standardShippingFee: DEFAULT_SHIPPING_CONFIG.standardShippingFee,
  policiesLastUpdated: '18 October 2026',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61592725623923',
  instagramUrl: 'https://www.instagram.com/gutvaidya',
} as const;

export const POLICY_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Cancellation & Refunds' },
  { href: '/shipping-policy', label: 'Shipping & Delivery' },
] as const;
