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
  title: "نجد | عناية رجال سعودية — الدفع عند الاستلام",
  description:
    "منتجات نجد للعناية اليومية بالرجال في السعودية: حبوب الحلاقة، ترتيب اللحية، وآثار السهر. اطلب الآن والدفع عند الاستلام.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://najdofficial.com"
  ),
  openGraph: {
    title: "نجد | عناية رجال سعودية",
    description: "روتين رجال سريع. الدفع عند الاستلام داخل السعودية.",
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
