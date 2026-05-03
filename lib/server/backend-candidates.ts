import { existsSync } from "fs";
import "server-only";

export type ResolvedBackend =
  | { ok: true; candidates: string[] }
  | { ok: false; detail: string };

/** يضيف http:// إن نسيّ المستخدم البروتوكول (شائع في Easypanel). */
export function normalizeApiBase(raw: string): string {
  const s = raw.trim().replace(/\/$/, "");
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) {
    return `http://${s}`;
  }
  return s;
}

/** بعض الحاويات بدون ‎/.dockerenv — للّوج فقط */
export function isDockerEnv(): boolean {
  try {
    return existsSync("/.dockerenv");
  } catch {
    return false;
  }
}

/**
 * - API_URL / BACKEND_URL … يمكن أن تكون عدة عناوين مفصولة بفاصلة (تُجرّب بالترتيب).
 * - في الإنتاج تُضاف دائماً في الأخير: backend / api / host.docker.internal (حد أقصى تأخير طفيف إذا أول عنوان ناجح).
 */
export function resolveBackendCandidates(): ResolvedBackend {
  const seen = new Set<string>();
  const out: string[] = [];

  const pushOne = (raw?: string | null) => {
    if (!raw?.trim()) return;
    const n = normalizeApiBase(raw);
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  };

  const pushList = (raw?: string | null) => {
    if (!raw?.trim()) return;
    for (const part of raw.split(",")) {
      pushOne(part.trim());
    }
  };

  pushList(process.env.API_URL);
  pushList(process.env.BACKEND_URL);
  pushList(process.env.INTERNAL_API_URL);
  pushList(process.env.NEXT_INTERNAL_API_URL);
  pushList(process.env.NEXT_PUBLIC_API_URL);

  if (process.env.NODE_ENV !== "production") {
    if (out.length === 0) {
      pushOne("http://127.0.0.1:8000");
    }
    return { ok: true, candidates: out };
  }

  pushOne("http://backend:8000");
  pushOne("http://api:8000");
  pushOne("http://host.docker.internal:8000");

  if (out.length === 0) {
    return {
      ok: false,
      detail:
        "لم يُضبط أي عنوان باكند. أضف API_URL على خدمة الفرونت (مثال: http://اسم-خدمة-الباكند:8000 — يمكن عدة عناوين بفاصلة).",
    };
  }

  return { ok: true, candidates: out };
}
