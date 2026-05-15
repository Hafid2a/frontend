import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.nameEn}`;

  /** شعار مربّع/دائري (شفاف) — أبعاد عرض مناسبة للهاتف والديسكتوب */
  const box =
    size === "sm"
      ? "h-8 w-8"
      : size === "lg"
        ? "h-[3.25rem] w-[3.25rem] sm:h-14 sm:w-14"
        : "h-10 w-10 sm:h-11 sm:w-11";

  return (
    <Link
      href="/"
      className="group flex min-w-0 max-w-full shrink-0 items-center no-underline"
    >
      <div className={`relative shrink-0 ${box}`}>
        <Image
          src={SITE_CONFIG.storeProfileImage}
          alt={alt}
          width={512}
          height={512}
          sizes="(max-width: 640px) 40px, 44px"
          className="h-full w-full object-contain object-center"
          priority
        />
      </div>
    </Link>
  );
}
