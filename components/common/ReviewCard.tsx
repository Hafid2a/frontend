interface ReviewCardProps {
  text: string;
  name: string;
  city: string;
  rating: number;
}

export function ReviewCard({ text, name, city, rating }: ReviewCardProps) {
  const initial = name.trim().charAt(0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-warm-sand/15 bg-charcoal/85 p-5 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-najd-green/20 px-2.5 py-0.5 text-[10px] font-semibold text-warm-sand">
          مشترية مؤكدة
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-warm-sand text-sm">
              ★
            </span>
          ))}
        </div>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-stone/90">
        &ldquo;{text}&rdquo;
      </p>

      <div className="mt-5 flex items-center justify-end gap-3 border-t border-stone/5 pt-4">
        <div className="text-right">
          <p className="text-sm font-medium text-stone">{name}</p>
          <p className="text-[11px] text-muted">{city}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-najd-green text-sm font-semibold text-white shadow-sm">
          {initial}
        </div>
      </div>
    </div>
  );
}
