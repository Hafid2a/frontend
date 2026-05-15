import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

/** ملف الشعار عليه هامش/خلفية كثيرة — نكبّر داخل الصندوق باش يبان الـ mark واضح */
const MARK_ZOOM = {
  sm: "scale-[1.52]",
  md: "scale-[1.68]",
  lg: "scale-[1.78]",
} as const;

export function Logo({ size = "md" }: LogoProps) {
  const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.nameEn}`;
  const s = size ?? "md";

  const box =
    s === "sm"
      ? "h-10 w-10"
      : s === "lg"
        ? "h-[4rem] w-[4rem] sm:h-[4.5rem] sm:w-[4.5rem]"
        : "h-[2.875rem] w-[2.875rem] sm:h-14 sm:w-14";

  return (
    <Link
      href="/"
      className="group flex min-w-0 max-w-full shrink-0 items-center no-underline"
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-transparent ${box}`}
      >
        <Image
          src={SITE_CONFIG.storeProfileImage}
          alt={alt}
          width={512}
          height={512}
          sizes="(max-width: 640px) 52px, 64px"
          className={`h-full w-full origin-center object-contain object-center ${MARK_ZOOM[s]}`}
          priority
        />
      </div>
    </Link>
  );
}
