import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const circleSize =
    size === "sm"
      ? "w-8 h-8 text-sm"
      : size === "lg"
        ? "w-12 h-12 text-xl"
        : "w-10 h-10 text-base";

  return (
    <Link href="/" className="flex items-center gap-2 no-underline group">
      <div
        className={`${circleSize} rounded-full bg-najd-green flex items-center justify-center flex-shrink-0`}
      >
        <span className="font-bold text-warm-sand font-latin">N</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-stone font-bold text-xl font-arabic">نجد</span>
        <span className="text-muted text-xs font-latin tracking-widest">NAJD</span>
      </div>
    </Link>
  );
}
