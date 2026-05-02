"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { normalizeSaudiMobile } from "@/lib/phone";
import { SITE_CONFIG } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().refine(
    (v) => normalizeSaudiMobile(v) !== null,
    "رقم جوال سعودي غير صحيح"
  ),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactForm = z.infer<typeof contactSchema>;

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
};

const CONTACT_FAQS = [
  {
    q: "كم يستغرق التوصيل؟",
    a: "2-4 أيام عمل داخل المملكة العربية السعودية.",
  },
  {
    q: "هل يمكن تغيير العنوان بعد الطلب؟",
    a: "نعم، تواصل معنا عبر واتساب وسنحاول تعديله قبل الشحن.",
  },
  {
    q: "ماذا لو لم أكن موجوداً وقت التوصيل؟",
    a: "سيتواصل معك مندوب التوصيل لتحديد موعد مناسب.",
  },
  {
    q: "هل يمكن إلغاء الطلب؟",
    a: "نعم، قبل الشحن. تواصل معنا على واتساب فوراً.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    // In production, send to API
    await new Promise((r) => setTimeout(r, 800));
    console.log("Contact form:", data);
    setSubmitted(true);
    reset();
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-stone font-bold text-4xl md:text-5xl mb-4">
            تحتاج مساعدة؟
            <br />
            <span className="text-warm-sand">فريق نجد قريب.</span>
          </h1>
          <p className="text-muted text-lg">
            واتساب هو أسرع طريقة للوصول إلينا.
          </p>
        </motion.div>
      </section>

      {/* WhatsApp CTA */}
      <motion.section {...fadeUp} className="max-w-4xl mx-auto px-4 mb-16">
        <a
          href={SITE_CONFIG.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 bg-success/20 border border-success/40 rounded-card p-6 hover:bg-success/30 transition-colors group"
        >
          <div className="w-14 h-14 bg-success rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl">💬</span>
          </div>
          <div>
            <h2 className="text-stone font-bold text-xl">
              تواصل معنا على واتساب
            </h2>
            <p className="text-muted text-sm">
              أسرع رد. متاحون خلال ساعات الدوام.
            </p>
          </div>
          <span className="text-success text-2xl group-hover:translate-x-1 transition-transform mr-auto">
            ←
          </span>
        </a>
      </motion.section>

      {/* Contact Form */}
      <section className="py-8 max-w-2xl mx-auto px-4 mb-16">
        <motion.div {...fadeUp}>
          <h2 className="text-stone font-bold text-2xl mb-6 text-center">
            أو اترك لنا رسالة
          </h2>

          {submitted ? (
            <div className="bg-success/20 border border-success/30 rounded-card p-8 text-center">
              <span className="text-4xl block mb-3">✅</span>
              <h3 className="text-stone font-bold text-xl mb-2">
                وصلت رسالتك!
              </h3>
              <p className="text-muted">سيتواصل معك فريق نجد قريباً.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-warm-sand text-sm hover:underline"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-charcoal rounded-card border border-white/10 p-6 space-y-4"
            >
              <div>
                <label className="block text-stone text-sm mb-1.5 font-medium">
                  الاسم
                </label>
                <input
                  {...register("name")}
                  placeholder="اسمك الكريم"
                  className="w-full bg-deep-night border border-white/20 rounded-xl px-4 py-3 text-stone placeholder-muted focus:outline-none focus:border-warm-sand transition-colors text-right"
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-stone text-sm mb-1.5 font-medium">
                  رقم الجوال
                </label>
                <input
                  {...register("phone")}
                  placeholder="05XXXXXXXX"
                  type="tel"
                  dir="ltr"
                  className="w-full bg-deep-night border border-white/20 rounded-xl px-4 py-3 text-stone placeholder-muted focus:outline-none focus:border-warm-sand transition-colors text-right"
                />
                {errors.phone && (
                  <p className="text-error text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-stone text-sm mb-1.5 font-medium">
                  الرسالة
                </label>
                <textarea
                  {...register("message")}
                  placeholder="كيف نقدر نساعدك؟"
                  rows={4}
                  className="w-full bg-deep-night border border-white/20 rounded-xl px-4 py-3 text-stone placeholder-muted focus:outline-none focus:border-warm-sand transition-colors text-right resize-none"
                />
                {errors.message && (
                  <p className="text-error text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-najd-green text-white py-4 rounded-btn font-bold hover:bg-najd-green/80 disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-najd-green/5">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-stone font-bold text-2xl">أسئلة التوصيل والإلغاء</h2>
          </motion.div>
          <div className="space-y-4">
            {CONTACT_FAQS.map((faq, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="bg-charcoal rounded-2xl border border-white/10 p-5"
              >
                <h3 className="text-stone font-bold text-sm mb-2">{faq.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery expectations */}
      <motion.section {...fadeUp} className="py-12 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-stone font-bold text-2xl mb-6">
          توقعات التوصيل
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "📦", label: "تحضير الطلب", time: "1 يوم عمل" },
            { icon: "🚚", label: "الشحن والتوصيل", time: "1-3 أيام" },
            { icon: "📞", label: "تأكيد الاستلام", time: "عند التسليم" },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-charcoal rounded-2xl border border-white/10 p-4 text-center"
            >
              <span className="text-3xl block mb-2">{step.icon}</span>
              <p className="text-stone text-xs font-semibold mb-1">
                {step.label}
              </p>
              <p className="text-warm-sand text-xs">{step.time}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
