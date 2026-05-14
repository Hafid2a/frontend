import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const circleSize =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-11 w-11 text-lg sm:h-12 sm:w-12 sm:text-xl"
        : "h-9 w-9 text-sm sm:h-10 sm:w-10 sm:text-base";

  return (
    <Link
      href="/"
      className="group flex min-w-0 max-w-full items-center gap-1.5 sm:gap-2 no-underline"
    >
      <div
        className={`${circleSize} flex shrink-0 items-center justify-center rounded-full bg-najd-green`}
      >
        <span className="font-bold font-latin text-white">N</span>
      </div>
      <div className="min-w-0 text-end leading-none">
        <span className="block truncate font-arabic text-[1.05rem] font-bold text-stone sm:text-lg md:text-xl">
          {SITE_CONFIG.name}
        </span>
        <span
          className="mt-1 block font-latin text-[clamp(9px,2.8vw,11px)] font-medium leading-none tracking-wide text-muted sm:mt-1.5 sm:text-[11px] md:text-xs"
          dir="ltr"
          translate="no"
        >
          {SITE_CONFIG.nameEn}
        </span>
      </div>
    </Link>
  );
}
