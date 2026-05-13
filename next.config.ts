import type { NextConfig } from "next";

/**
 * مع NEXT_PUBLIC_USE_API_PROXY الطلبات تمر عبر /api/backend (أنسب للتطوير المحلي).
 * يكفي API_BASE_URL أو NEXT_PUBLIC_API_URL وقت البناء للاتصال المباشر من المتصفح.
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
  return process.env.NODE_ENV === "development" ? "true" : "false";
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_API_URL: publicApiBaseUrl(),
    NEXT_PUBLIC_USE_API_PROXY: publicUseApiProxy(),
  },
};

export default nextConfig;
