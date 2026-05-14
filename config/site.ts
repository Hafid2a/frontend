export const SITE_CONFIG = {
  name: "نجد",
  nameEn: "NAJD Official",
  /** صورة دائرية للشعار في الهيدر + معاينة مشاركة افتراضية (بدون تغيير الاسم) */
  storeProfileImage: "/brand-hero-logo.png",
  storeProfileImageAlt:
    "متجر نجد — لوحة لوتس وزهور على رخام، هوية بصرية للعناية والرفاهية",
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
