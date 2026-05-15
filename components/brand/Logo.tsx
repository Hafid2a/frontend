import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

/** ملف الشعار عليه هامش/خلفية كثيرة — نكبّر داخل الصندوق باش يبان الـ mark واضح */
const MARK_ZOOM = {
  sm: "scale-[1.62]",
  md: "scale-[1.82]",
  lg: "scale-[1.92]",
} as const;

export function Logo({ size = "md" }: LogoProps) {
  const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.nameEn}`;
  const s = size ?? "md";

  const box =
    s === "sm"
      ? "h-11 w-11"
      : s === "lg"
        ? "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20"
        : "h-[3.25rem] w-[3.25rem] sm:h-16 sm:w-16";

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
          sizes="(max-width: 640px) 56px, 72px"
          className={`h-full w-full origin-center object-contain object-center ${MARK_ZOOM[s]}`}
          priority
        />
      </div>
    </Link>
  );
}
