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

function isDockerEnv(): boolean {
  try {
    return existsSync("/.dockerenv");
  } catch {
    return false;
  }
}

/**
 * جمع عناوين الباكند: متغيرات البيئة أولاً، ثم في Docker أسماء الخدمات الشائعة
 * (تُجرّب بالترتيب — إن كان API_URL=localhost بالغلط ما زال http://backend:8000 يُجرَب بعده).
 */
export function resolveBackendCandidates(): ResolvedBackend {
  const seen = new Set<string>();
  const out: string[] = [];

  const push = (raw?: string | null) => {
    if (!raw?.trim()) return;
    const n = normalizeApiBase(raw);
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  };

  push(process.env.API_URL);
  push(process.env.BACKEND_URL);
  push(process.env.INTERNAL_API_URL);
  push(process.env.NEXT_INTERNAL_API_URL);
  push(process.env.NEXT_PUBLIC_API_URL);

  if (isDockerEnv()) {
    push("http://backend:8000");
    push("http://api:8000");
  }

  if (process.env.NODE_ENV !== "production") {
    if (out.length === 0) {
      push("http://127.0.0.1:8000");
    }
    return { ok: true, candidates: out };
  }

  if (out.length === 0) {
    return {
      ok: false,
      detail:
        "لم يُضبط عنوان الباكند. أضف API_URL أو BACKEND_URL (مثال داخل Docker: http://backend:8000) وأعد تشغيل حاوية الواجهة.",
    };
  }

  return { ok: true, candidates: out };
}
