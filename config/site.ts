export const SITE_CONFIG = {
  name: "نجد",
  nameEn: "NAJD Official",
  /** شعار العلامة (هيدر + OG/Twitter افتراضي) — وردي/ماجنتا على خلفية سوداء */
  storeProfileImage: "/najd-brand-mark.png",
  storeProfileImageAlt:
    "شعار NAJD Official — حرف N هندسي داخل إطار دائري، نص NAJD OFFICIAL بوردي على خلفية سوداء",
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
    { icon: "🧴", label: "وجه تحت الإيشارب والجو" },
    { icon: "💬", label: "دعم واتساب" },
  ],
};
