export const SITE_CONFIG = {
  name: "نجد",
  nameEn: "NAJD",
  url: "https://najdofficial.com",
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.API_BASE_URL?.trim() ||
    process.env.API_URL?.trim() ||
    "http://localhost:8000",
  whatsapp: "https://wa.me/966XXXXXXXXX",
  trustBadges: [
    { icon: "💳", label: "الدفع عند الاستلام" },
    { icon: "🚚", label: "توصيل داخل السعودية" },
    { icon: "⚡", label: "روتين رجال سريع" },
    { icon: "💬", label: "دعم واتساب" },
  ],
};
