import type { NextConfig } from "next";

/**
 * البروكسي /api/backend يناسب معاينات *.easypanel.host أو عند تعيين
 * NEXT_PUBLIC_USE_API_PROXY=true صراحة. الافتراضي: اتصال مباشر من المتصفح
 * إلى NEXT_PUBLIC_API_URL (أبسط للتطوير المحلي مع باكند على 8000).
 */
function publicApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.API_BASE_URL?.trim() ||
    process.env.API_URL?.trim() ||
    "http://localhost:8000"
  );
}

function publicUseApiProxy(): string {
  const v = process.env.NEXT_PUBLIC_USE_API_PROXY?.trim().toLowerCase();
  if (v === "true" || v === "1") return "true";
  if (v === "false" || v === "0") return "false";
  return "false";
}

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/products/najd-thabat-al-khat",
        destination: "/products/face-primer",
        permanent: true,
      },
      {
        source: "/products/najd-darag-al-nahar",
        destination: "/products/face-sunscreen-spf50",
        permanent: true,
      },
      {
        source: "/products/najd-safa-al-jabha",
        destination: "/products/forehead-serum",
        permanent: true,
      },
    ];
  },
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_API_URL: publicApiBaseUrl(),
    NEXT_PUBLIC_USE_API_PROXY: publicUseApiProxy(),
  },
};

export default nextConfig;
