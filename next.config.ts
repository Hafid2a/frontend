import type { NextConfig } from "next";

/**
 * عنوان الـ API للمتصفح (NEXT_PUBLIC_API_URL) — طلبات checkout مباشرة بدون بروكسي Next.
 * يكفي API_BASE_URL أو API_URL أو NEXT_PUBLIC_API_URL وقت البناء.
 */
function publicApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.API_BASE_URL?.trim() ||
    process.env.API_URL?.trim() ||
    "http://localhost:8000"
  );
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_API_URL: publicApiBaseUrl(),
  },
};

export default nextConfig;
