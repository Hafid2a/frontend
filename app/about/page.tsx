"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrustBar } from "@/components/common/TrustBar";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-najd-green rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-warm-sand text-3xl font-bold font-latin">N</span>
          </div>
          <h1 className="text-stone font-bold text-4xl md:text-5xl mb-4">
            نجد علامة سعودية لروتين ليلي بسيط للبنات.
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            بدأنا من ملاحظة بسيطة: كثير من البنات يدورن على ماسك مسائي خارجي بوصف
            واضح وعبوّة مهيّأة وتجربة تسوق تفهم حياتهم المدرسية والجامعية —
            بدون خلط بين المنتج الموضَّع ومكمّلات غذائية أو وعود طبّية كبيرة على
            شاشة واحدة.
          </p>
        </motion.div>
      </section>

      <TrustBar />

      {/* Brand Story */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <h2 className="text-stone font-bold text-3xl mb-4">قصة نجد</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                نجد ليست مجرد اسم على عبوّة — هي اعتراف بأن البنات السعوديات
                يستحقّن تجربة تسويق محترمة: عربية أوّلاً، وضوح قبل الإعلان، وشرح
                لوقت النوم وحده دون ادِّعاء «علاج» كوني.
              </p>
              <p>
                نسمّيها نجد تيمّناً بالأرض اللي نشأنا عليها: أصالة بسيطة، وثقة ما
                تبنى على فلتر وحيد.
              </p>
              <p>
                كل منتج اليوم ضمن خط ليل خارجي مهيَّأ بتعليم مسائي، مع فريق دعم
                يفسِّر الأسئلة الشائعة عن المخدة والحساسية والتوصيل.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <div className="bg-charcoal rounded-card border border-white/10 p-8 text-center">
              <div className="text-6xl mb-4">🇸🇦</div>
              <h3 className="text-stone font-bold text-xl mb-2">صُنع للسوق السعودي</h3>
              <p className="text-muted text-sm">
                نفهم وقت المذاكرة وسهر المحتوى وضغط المدينة — ونشارككم نصاً
                لطيفاً عند الشراء لتقليل مخاوف COD.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-najd-green/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-stone font-bold text-3xl mb-4">مهمتنا</h2>
            <p className="text-warm-sand text-xl font-bold mb-4">
              «نعطي البنات روتين ليلي بسيط وبشرة مرتاحة صباحاً — بدون مبالغة.»
            </p>
            <p className="text-muted leading-relaxed max-w-2xl mx-auto">
              لا تعقيد، لا خطوات كثيرة. فقط منتجات تشتغل مع الحياة اليومية
              بدون أن تأخذ منك وقتاً أو جهداً.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-stone font-bold text-3xl">معايير الجودة</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "🔬",
              title: "اختيار مكونات مدروس",
              desc: "ندرس وصف كل مكون وقدرة الاستخدام المسائي عليه حيث ينطبق ذلك على منتجكم.",
            },
            {
              icon: "✅",
              title: "فحص جودة قبل الشحن",
              desc: "كل وحدة تمر بفحص دقيق قبل أن تخرج من المخزن.",
            },
            {
              icon: "📦",
              title: "تغليف احترافي",
              desc: "تغليف يحافظ على المنتج طوال رحلة التوصيل ويعكس قيمة العلامة.",
            },
            {
              icon: "💬",
              title: "دعم ما بعد الطلب",
              desc: "فريق دعم عبر واتساب لأي استفسار قبل وبعد وصول الطلب.",
            },
            {
              icon: "📍",
              title: "توصيل داخل المملكة",
              desc: "نوصّل لكل مناطق المملكة العربية السعودية خلال 2-4 أيام عمل.",
            },
            {
              icon: "💳",
              title: "دفع عند الاستلام",
              desc: "الدفع النقدي عند استلام الطلب. لا بطاقات، لا مخاطرة.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 bg-charcoal rounded-2xl p-5 border border-white/10"
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="text-stone font-bold mb-1">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof placeholder */}
      <motion.section {...fadeUp} className="py-12 bg-najd-green/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div>
              <p className="text-warm-sand font-bold text-4xl">+2,400</p>
              <p className="text-muted text-sm">طلب داخل السعودية</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block" />
            <div>
              <p className="text-warm-sand font-bold text-4xl">4.8★</p>
              <p className="text-muted text-sm">متوسط التقييم</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block" />
            <div>
              <p className="text-warm-sand font-bold text-4xl">3</p>
              <p className="text-muted text-sm">منتجات متخصصة</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeUp} className="py-16 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-stone font-bold text-3xl mb-4">
          جرب نجد اليوم
        </h2>
        <p className="text-muted mb-8">الدفع عند الاستلام. بدون مخاطرة.</p>
        <Link
          href="/products"
          className="inline-block bg-najd-green text-white px-10 py-4 rounded-btn font-bold text-lg hover:bg-najd-green/80 transition-colors"
        >
          تسوق المنتجات
        </Link>
      </motion.section>
    </div>
  );
}
