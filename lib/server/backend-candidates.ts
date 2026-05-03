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

const defaultInternalPort = () =>
  (process.env.API_INTERNAL_PORT || "8000").trim() || "8000";

/**
 * في الإنتاج: عناوين الشبكة الداخلية (Docker / Easypanel) **قبل** https العام —
 * غالباً https://api... من داخل الحاوية يفشل (DNS IPv6 / جدار) بينما http://backend:8000 ينجح.
 *
 * API_INTERNAL_URLS: قائمة مفصولة بفاصلة، مثال: http://backend:8000,http://اسم-الخدمة:8000
 */
function pushStandardInternalCandidates(
  pushOne: (raw?: string | null) => void,
  pushList: (raw?: string | null) => void
): void {
  pushList(process.env.API_INTERNAL_URLS);

  const p = defaultInternalPort();
  for (const h of ["backend", "api", "najd-backend", "najd_backend"]) {
    pushOne(`http://${h}:${p}`);
  }
  pushOne(`http://host.docker.internal:${p}`);
}

/**
 * - API_URL / API_BASE_URL … فاصلة = عدة عناوين.
 * - الإنتاج: داخلي أولاً (انظر pushStandardInternalCandidates) ثم متغيراتك.
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

  if (process.env.NODE_ENV === "production") {
    if (process.env.API_PROXY_INTERNAL_FIRST !== "0") {
      pushStandardInternalCandidates(pushOne, pushList);
    }
  }

  pushList(process.env.API_URL);
  pushList(process.env.API_BASE_URL);
  pushList(process.env.BACKEND_URL);
  pushList(process.env.INTERNAL_API_URL);
  pushList(process.env.NEXT_INTERNAL_API_URL);
  pushList(process.env.NEXT_PUBLIC_API_URL);

  if (process.env.NODE_ENV === "production") {
    if (process.env.API_PROXY_INTERNAL_FIRST === "0") {
      pushStandardInternalCandidates(pushOne, pushList);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (out.length === 0) {
      pushOne("http://127.0.0.1:8000");
    }
    return { ok: true, candidates: out };
  }

  if (out.length === 0) {
    return {
      ok: false,
      detail:
        "لم يُضبط أي عنوان باكند. أضف API_URL أو API_BASE_URL أو NEXT_PUBLIC_API_URL على خدمة الفرونت (مثال محلي: http://127.0.0.1:8000 — يمكن عدة عناوين بفاصلة).",
    };
  }

  return { ok: true, candidates: out };
}
