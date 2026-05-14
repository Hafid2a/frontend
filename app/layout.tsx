import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";
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

const defaultShareImages = [
  {
    url: SITE_CONFIG.storeProfileImage,
    alt: SITE_CONFIG.storeProfileImageAlt,
  },
];

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | كوزميتيك للوجه تحت الإيشارب والجو — الدفع عند الاستلام`,
  description:
    `${SITE_CONFIG.name}: برايمر ثبات، واقي شمس وجه، وسيروم موضّع لخط الجبهة والإيشارب — للبنات والشابات في السعودية. عبوّة مختومة، شفافية في الوصف، والدفع عند الاستلام. مستحضرات تجميلية موضّعة فقط.`,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://najdofficial.com"
  ),
  openGraph: {
    title: `${SITE_CONFIG.name} | خط وجه للجو المحلي والإيشارب`,
    description:
      `مستحضرات وجه من ${SITE_CONFIG.name} مع توصيل داخل السعودية والدفع عند الاستلام.`,
    locale: "ar_SA",
    type: "website",
    images: defaultShareImages,
  },
  twitter: {
    card: "summary_large_image",
    images: [SITE_CONFIG.storeProfileImage],
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
