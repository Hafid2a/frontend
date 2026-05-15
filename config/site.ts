export const SITE_CONFIG = {
  name: "نجد",
  nameEn: "NAJD Official",
  /** شعار العلامة (هيدر + OG/Twitter افتراضي) */
  /** مسار جديد باش ما يبقاش الكاش يخدم على شعار قديم بنفس الاسم */
  storeProfileImage: "/najd-mark-official.png",
  storeProfileImageAlt:
    "شعار NAJD Official — حرف N هندسي داخل إطار دائري بلون ذهبي وردي على خلفية داكنة",
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
