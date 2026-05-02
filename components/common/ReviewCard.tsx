interface ReviewCardProps {
  text: string;
  name: string;
  city: string;
  rating: number;
}

export function ReviewCard({ text, name, city, rating }: ReviewCardProps) {
  return (
    <div className="bg-charcoal rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-warm-sand text-sm">
            ★
          </span>
        ))}
      </div>
      <p className="text-stone/90 text-sm leading-relaxed">"{text}"</p>
      <p className="text-muted text-xs mt-3">
        — {name}، {city}
      </p>
    </div>
  );
}
