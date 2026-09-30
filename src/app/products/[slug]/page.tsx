import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';
import { getProductBySlug, getRelatedProducts, SEED_PRODUCTS } from '@/lib/products';
import { getApprovedReviews } from '@/lib/reviews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SEED_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | GutVaidya',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gutvaidya.in';
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;

  return {
    title: `${product.name} - Traditional Health Mix`,
    description: product.short_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | GutVaidya Ayurvedic Nutrition`,
      description: product.short_description,
      url: canonicalUrl,
      images: [
        {
          url: product.main_image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

import { cookies } from 'next/headers';
import { safeDecodeCookie } from '@/lib/products-client';

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Check if browser sent custom overrides in cookie
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get('gutvaidya_custom_products')?.value;
    if (cookieVal) {
      const overrides = safeDecodeCookie(cookieVal);
      const override = overrides[product.id] || overrides[product.slug];
      if (override) {
        product = {
          ...product,
          ...(override.price !== undefined ? { price: Number(override.price) } : {}),
          ...(override.compare_at_price !== undefined ? { compare_at_price: Number(override.compare_at_price) } : {}),
          ...(override.stock_quantity !== undefined ? { stock_quantity: Number(override.stock_quantity) } : {}),
          ...(override.status !== undefined ? { status: override.status } : {}),
          ...(override.featured !== undefined ? { featured: override.featured } : {}),
        };
      }
    }
  } catch (e) {}

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.slug, product.category_id),
    getApprovedReviews(product.id),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gutvaidya.in';

  // Schema.org Product Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.main_image.startsWith('http') ? product.main_image : `${siteUrl}${product.main_image}`,
    description: product.description,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'GutVaidya',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    // Only real, approved reviews; search engines penalise invented rating data
    ...(product.rating && product.reviews_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviews_count,
          },
        }
      : {}),
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-grow">
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} reviews={reviews} />
      </main>

      <Footer />
    </div>
  );
}
