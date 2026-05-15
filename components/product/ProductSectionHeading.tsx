interface ProductSectionHeadingProps {
  eyebrowEn: string;
  titleAr: string;
  subtitleAr?: string;
  align?: "center" | "right";
}

/** عنوان قسم بأسلوب المتاجر الاحترافية (خط إنجليزي صغير + عنوان عربي). */
export function ProductSectionHeading({
  eyebrowEn,
  titleAr,
  subtitleAr,
  align = "center",
}: ProductSectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-right";

  return (
    <div className={`mb-10 ${alignClass}`}>
      <p
        className="mb-2 font-latin text-[11px] font-semibold uppercase tracking-[0.22em] text-najd-green"
        dir="ltr"
      >
        {eyebrowEn}
      </p>
      <h2 className="text-balance text-3xl font-bold leading-snug text-stone md:text-[2rem]">
        {titleAr}
      </h2>
      {subtitleAr ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          {subtitleAr}
        </p>
      ) : null}
    </div>
  );
}
