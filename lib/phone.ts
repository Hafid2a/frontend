export function normalizeSaudiMobile(input: string): string | null {
  const cleaned = input.replace(/[\s\-().]/g, "");
  const match = cleaned.match(/^(?:\+?966|00966|0)?(5\d{8})$/);
  if (!match) return null;
  return `+966${match[1]}`;
}

export function isValidSaudiMobile(input: string): boolean {
  return normalizeSaudiMobile(input) !== null;
}
