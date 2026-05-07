import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { PixelProvider } from "@/components/tracking/PixelProvider";

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-var",
  display: "swap",
});

const latinFont = Inter({
  subsets: ["latin"],
  variable: "--font-latin-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نجد | ماسكات ليلية للوجه للبنات — الدفع عند الاستلام",
  description:
    "نجد: ماسكات وعناية مسائية للوجه للبنات والشابات في السعودية — عبوّة مختومة، شفافية في الاستخدام الليلي، والدفع عند الاستلام. مستحضرات تجميلية موضّعة فقط.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://najdofficial.com"
  ),
  openGraph: {
    title: "نجد | روتين ليلي للعناية بالبشرة",
    description:
      "ماسكات مسائية من نجد مع توصيل داخل السعودية والدفع عند الاستلام.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabicFont.variable} ${latinFont.variable}`}
    >
      <body className="font-medium">
        <Providers>
          <PixelProvider />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
