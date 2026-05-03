import type { NextConfig } from "next";

/**
 * عنوان الـ API الظاهر للكلاينت + نفس القيمة الافتراضية لـ NEXT_PUBLIC_API_URL.
 * إذا ضبطت فقط API_BASE_URL (مثل الباكند في Easypanel)، يكفي لـ npm run dev على localhost:3000.
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
