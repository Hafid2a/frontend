const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const ASCII_DIG = "0123456789";
const EXT_ARABIC_INDIC = "۰۱۲۳۴۵۶۷۸۹";

function toAsciiDigits(s: string): string {
  let out = s;
  for (let i = 0; i < 10; i++) {
    out = out.split(ARABIC_INDIC[i]!).join(ASCII_DIG[i]!);
    out = out.split(EXT_ARABIC_INDIC[i]!).join(ASCII_DIG[i]!);
  }
  return out;
}

export function normalizeSaudiMobile(input: string): string | null {
  const stripped = input
    .trim()
    .replace(/[\u200e\u200f\ufeff\u202a-\u202e]/g, "");
  const cleaned = toAsciiDigits(stripped).replace(/[\s\-().]/g, "");
  const match = cleaned.match(/^(?:\+?966|00966|0)?(5\d{8})$/);
  if (!match) return null;
  return `+966${match[1]}`;
}

export function isValidSaudiMobile(input: string): boolean {
  return normalizeSaudiMobile(input) !== null;
}
