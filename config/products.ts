export interface ProductOffer {
  qty: number;
  priceSar: number;
  compareAtSar?: number;
  labelAr: string;
  badgeAr?: string;
}

export interface ProductReview {
  text: string;
  name: string;
  city: string;
  rating: number;
}

export interface ProductConfig {
  slug: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  shortDescAr: string;
  problemAr: string;
  heroHeadline: string;
  heroSubheading: string;
  bullets: string[];
  mechanismPoints: Array<{ title: string; desc: string }>;
  safetyNote: string;
  howToUse: Array<{ step: string; desc: string }>;
  reviews: ProductReview[];
  faqs: Array<{ q: string; a: string }>;
  crossSellSlug: string;
  upsellSlug: string;
  offers: ProductOffer[];
  defaultOfferQty: number;
}

export const PRODUCTS: ProductConfig[] = [
  {
    slug: "najd-clear",
    sku: "NAJD-CLEAR",
    nameAr: "نجد كلير",
    nameEn: "Najd Clear",
    shortDescAr: "رول الساليسيليك والجليكوليك ضد حبوب الحلاقة والشعر تحت الجلد",
    problemAr: "حبوب الحلاقة والشعر تحت الجلد",
    heroHeadline: "بعد الحلاقة، خلك نظيف مو محمّر.",
    heroSubheading:
      "نجد كلير رول يومي بالساليسيليك والجليكوليك للمناطق اللي تطلع فيها حبوب الحلاقة والشعر تحت الجلد.",
    bullets: [
      "استخدام سريع بعد الحلاقة أو قبل النوم.",
      "مخصص لمشاكل الرجال بعد الموس أو المكينة.",
      "يساعد على مظهر أنعم وأنظف مع الاستمرار.",
      "الدفع عند الاستلام داخل السعودية.",
    ],
    mechanismPoints: [
      {
        title: "حمض الساليسيليك",
        desc: "مقشر يذوب في الزيوت، يساعد على تنظيف المسام وتقليل الاحتقان.",
      },
      {
        title: "حمض الجليكوليك",
        desc: "مقشر سطحي يدعم مظهر بشرة أنعم مع الاستمرار.",
      },
      {
        title: "شكل الرول",
        desc: "تطبيق أسرع وأنظف على الرقبة والوجه والصدر.",
      },
    ],
    safetyNote:
      "يستخدم على بشرة نظيفة وجافة. لا يستخدم على الجروح المفتوحة. ابدأ 3 مرات أسبوعياً.",
    howToUse: [
      { step: "١. نظّف", desc: "اغسل المنطقة وجففها جيداً." },
      { step: "٢. طبّق", desc: "مرر الرول على المنطقة المستهدفة بحركة خفيفة." },
      { step: "٣. انتظر", desc: "دع المنتج يجف، ولا تغسله فوراً." },
    ],
    reviews: [
      {
        text: "كنت أعاني بعد كل حلاقة، بعد أسبوعين صار المنظر أهدأ بكثير.",
        name: "عبدالله",
        city: "الرياض",
        rating: 5,
      },
      {
        text: "أعجبني إن الدفع عند الاستلام والطلب ما أخذ دقيقة.",
        name: "ناصر",
        city: "الخبر",
        rating: 5,
      },
      {
        text: "منتج عملي، سريع الاستخدام قبل الخروج.",
        name: "سعد",
        city: "جدة",
        rating: 4,
      },
    ],
    faqs: [
      {
        q: "كم مرة أستخدمه؟",
        a: "ابدأ بـ 3 مرات أسبوعياً ثم زِد حسب تحمّل بشرتك.",
      },
      {
        q: "هل يناسب البشرة الحساسة؟",
        a: "ابدأ بكمية قليلة وراقب ردة فعل بشرتك.",
      },
      { q: "متى أشوف نتيجة؟", a: "مع الاستمرار خلال 2-4 أسابيع." },
    ],
    crossSellSlug: "najd-rest",
    upsellSlug: "najd-rest",
    offers: [
      { qty: 1, priceSar: 199, labelAr: "قطعة واحدة" },
      {
        qty: 2,
        priceSar: 279,
        compareAtSar: 398,
        labelAr: "قطعتين",
        badgeAr: "الأكثر اختياراً",
      },
      {
        qty: 3,
        priceSar: 349,
        compareAtSar: 597,
        labelAr: "ثلاث قطع",
        badgeAr: "أفضل قيمة",
      },
    ],
    defaultOfferQty: 2,
  },
  {
    slug: "najd-align",
    sku: "NAJD-ALIGN",
    nameAr: "نجد ألاين",
    nameEn: "Najd Align",
    shortDescAr: "فرشاة السيراميك الأيونية الحرارية ضد فوضى اللحية الكثيفة",
    problemAr: "فوضى اللحية الكثيفة",
    heroHeadline: "فوضى اللحية تعطي انطباع قبل ما تتكلم.",
    heroSubheading:
      "نجد ألاين فرشاة سيراميك حرارية للرجال تساعد على ترتيب اللحية الكثيفة وتخفيف النفشة بسرعة.",
    bullets: [
      "مناسبة للحية المتوسطة والكثيفة.",
      "حرارة موزعة عبر سطح سيراميك.",
      "تأثير أيوني لتقليل مظهر النفشة.",
      "استخدام سريع قبل الدوام أو العزيمة.",
    ],
    mechanismPoints: [
      {
        title: "تسخين السيراميك",
        desc: "توزيع أكثر اتساقاً للحرارة مقارنة بالمعدن المكشوف.",
      },
      {
        title: "التأثير الأيوني",
        desc: "يساعد على تقليل الكهرباء الساكنة ومظهر النفشة.",
      },
      {
        title: "شكل الفرشاة",
        desc: "تحكم أسهل في اتجاه اللحية وشكل الخدين والفك.",
      },
    ],
    safetyNote:
      "استخدمها على لحية جافة ونظيفة. لا تستخدمها على بشرة مبللة. ابدأ بدرجة حرارة منخفضة.",
    howToUse: [
      { step: "١. جفّف", desc: "تأكد أن لحيتك نظيفة وجافة تماماً." },
      {
        step: "٢. شغّل",
        desc: "ابدأ بأقل درجة حرارة وسخّن الجهاز 30 ثانية.",
      },
      {
        step: "٣. مشّط",
        desc: "مرر الفرشاة بحركات هادئة في اتجاه نمو اللحية.",
      },
    ],
    reviews: [
      {
        text: "اللحية عندي كثيفة وتتعبني قبل الدوام. الفرشاة رتبتها بسرعة.",
        name: "فهد",
        city: "جدة",
        rating: 5,
      },
      {
        text: "الأكثر طلباً ولا عجب، النتيجة واضحة من أول استخدام.",
        name: "خالد",
        city: "الرياض",
        rating: 5,
      },
      {
        text: "سهل الاستخدام وخفيف، مناسب للسفر.",
        name: "يوسف",
        city: "الدمام",
        rating: 4,
      },
    ],
    faqs: [
      {
        q: "هل تناسب اللحى القصيرة؟",
        a: "مصممة أساساً للحى المتوسطة والكثيفة، لكن تعمل مع القصيرة بدرجات منخفضة.",
      },
      {
        q: "كم درجة الحرارة الموصى بها؟",
        a: "ابدأ منخفضاً وزِد تدريجياً حسب كثافة لحيتك.",
      },
      {
        q: "كيف أنظف الفرشاة؟",
        a: "أزل الشعر بفرشاة صغيرة بعد كل استخدام.",
      },
    ],
    crossSellSlug: "najd-clear",
    upsellSlug: "najd-clear",
    offers: [
      { qty: 1, priceSar: 199, labelAr: "قطعة واحدة" },
      {
        qty: 2,
        priceSar: 279,
        compareAtSar: 398,
        labelAr: "قطعتين",
        badgeAr: "الأكثر اختياراً",
      },
      {
        qty: 3,
        priceSar: 349,
        compareAtSar: 597,
        labelAr: "ثلاث قطع",
        badgeAr: "أفضل قيمة",
      },
    ],
    defaultOfferQty: 2,
  },
  {
    slug: "najd-rest",
    sku: "NAJD-REST",
    nameAr: "نجد ريست",
    nameEn: "Najd Rest",
    shortDescAr: "رول الكافيين والببتيدات ضد آثار السهر والهالات",
    problemAr: "آثار السهر والهالات",
    heroHeadline: "شكلك مرهق؟ لا تخلي عيونك تقولها.",
    heroSubheading:
      "نجد ريست رول سريع بالكافيين والببتيدات لمنطقة تحت العين، مصمم لروتين رجال قبل اليوم الطويل.",
    bullets: [
      "إحساس بارد وسريع.",
      "مناسب قبل الدوام أو بعد ليلة طويلة.",
      "يساعد على مظهر أكثر انتعاشاً مع الاستمرار.",
      "حجم عملي للسيارة أو الشنطة.",
    ],
    mechanismPoints: [
      {
        title: "الكافيين",
        desc: "مكون شائع في منتجات العيون، يساعد على مظهر أكثر انتعاشاً.",
      },
      {
        title: "الببتيدات",
        desc: "تدعم مظهراً أنعم لمنطقة تحت العين مع الاستمرار.",
      },
      {
        title: "رول التطبيق",
        desc: "إحساس تبريد خفيف وتطبيق أنظف وأسرع.",
      },
    ],
    safetyNote:
      "للاستخدام الخارجي فقط. تجنب ملامسة العين مباشرة. في حال حدوث تهيج، أوقف الاستخدام.",
    howToUse: [
      {
        step: "١. ضع",
        desc: "مرر الرول أسفل العين بلطف من الداخل للخارج.",
      },
      {
        step: "٢. كرر",
        desc: "استخدمه صباحاً أو في أي وقت تحتاج مظهراً أنشط.",
      },
      { step: "٣. استمر", desc: "النتائج تظهر مع الاستخدام المنتظم." },
    ],
    reviews: [
      {
        text: "نجد ريست صار في السيارة. استخدمه قبل الاجتماعات.",
        name: "محمد",
        city: "الدمام",
        rating: 5,
      },
      {
        text: "إحساس بارد ومنعش، يساعد تبان وجهك أقل تعباً.",
        name: "عمر",
        city: "الرياض",
        rating: 5,
      },
      {
        text: "سهل الاستخدام وما يأخذ وقت.",
        name: "علي",
        city: "جدة",
        rating: 4,
      },
    ],
    faqs: [
      {
        q: "متى أستخدمه؟",
        a: "صباحاً قبل الخروج، أو بعد ليلة طويلة قبل أي مناسبة.",
      },
      { q: "هل يترك أثراً؟", a: "يجف سريعاً ولا يترك طبقة ثقيلة." },
      { q: "كم مدة الاستخدام اليومي؟", a: "أقل من دقيقة." },
    ],
    crossSellSlug: "najd-align",
    upsellSlug: "najd-align",
    offers: [
      { qty: 1, priceSar: 199, labelAr: "قطعة واحدة" },
      {
        qty: 2,
        priceSar: 279,
        compareAtSar: 398,
        labelAr: "قطعتين",
        badgeAr: "الأكثر اختياراً",
      },
      {
        qty: 3,
        priceSar: 349,
        compareAtSar: 597,
        labelAr: "ثلاث قطع",
        badgeAr: "أفضل قيمة",
      },
    ],
    defaultOfferQty: 2,
  },
];

export const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p])
);
