import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ResolvedBackend =
  | { ok: true; base: string }
  | { ok: false; detail: string };

/**
 * API_URL / BACKEND_URL تُقرأ في وقت التشغيل (مناسبة لـ Docker/Easypanel).
 * NEXT_PUBLIC_API_URL قد يُثبَّت عند npm run build فقط — في الإنتاج فضّل API_URL.
 */
function resolveBackendBase(): ResolvedBackend {
  const raw =
    process.env.API_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";
  if (raw) {
    return { ok: true, base: raw.replace(/\/$/, "") };
  }
  if (process.env.NODE_ENV !== "production") {
    return { ok: true, base: "http://127.0.0.1:8000" };
  }
  return {
    ok: false,
    detail:
      "لم يُضبط عنوان الباكند على السيرفر. أضف متغير البيئة API_URL (مثال داخل Docker/Easypanel: http://اسم-خدمة-الباكند:8000) أو BACKEND_URL، ثم أعد تشغيل حاوية الواجهة.",
  };
}

/** Pass through edge / client IP so FastAPI MaxMind still sees the shopper. */
function forwardHeaders(req: NextRequest): Headers {
  const h = new Headers();
  const names = [
    "content-type",
    "accept",
    "accept-language",
    "authorization",
    "x-forwarded-for",
    "x-forwarded-proto",
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
    "x-vercel-forwarded-for",
  ] as const;
  for (const name of names) {
    const v = req.headers.get(name);
    if (v) h.set(name, v);
  }
  return h;
}

async function proxy(
  req: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  const resolved = resolveBackendBase();
  if (!resolved.ok) {
    console.error("[api/backend] missing backend URL in production");
    return NextResponse.json({ detail: resolved.detail }, { status: 503 });
  }

  const joined = pathSegments
    .map((s) => encodeURIComponent(s))
    .join("/");
  const u = new URL(req.url);
  const target = `${resolved.base}/${joined}${u.search}`;

  const headers = forwardHeaders(req);
  const withBody = !["GET", "HEAD"].includes(req.method);

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: AbortSignal.timeout(60_000),
  };
  if (withBody) {
    init.body = await req.arrayBuffer();
  }

  let res: Response;
  try {
    res = await fetch(target, init);
  } catch (e) {
    console.error("[api/backend] proxy fetch failed:", target, e);
    return NextResponse.json(
      {
        detail:
          "تعذّر الاتصال بالباكند على العنوان المضبوط. تحقق أن خدمة FastAPI شغالة، وأن API_URL أو BACKEND_URL يشير لها (داخل الشبكة الداخلية استعمل http://اسم-الخدمة:8000 وليس localhost إن الباكند في حاوية أخرى).",
      },
      { status: 502 }
    );
  }

  const text = await res.text();
  const out = new NextResponse(text, { status: res.status });
  const ct = res.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);
  return out;
}

type RouteCtx = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, ctx: RouteCtx): Promise<NextResponse> {
  const { path } = await ctx.params;
  if (!path?.length) {
    return NextResponse.json({ detail: "مسار غير صالح" }, { status: 404 });
  }
  return proxy(req, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
