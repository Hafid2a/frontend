import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PRODUCT_MAP } from "@/config/products";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://najdofficial.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCT_MAP[slug];
  if (!product) {
    return { title: "منتج | نجد" };
  }

  const title = `${product.nameAr} | نجد`;
  const description = product.shortDescAr;

  const ogImages =
    product.imageSrc != null
      ? [
          {
            url: new URL(product.imageSrc, siteUrl).toString(),
            alt: product.imageAlt ?? product.nameAr,
          },
        ]
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "ar_SA",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default function ProductSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
