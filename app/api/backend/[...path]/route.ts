import { NextRequest, NextResponse } from "next/server";
import { resolveBackendCandidates } from "@/lib/server/backend-candidates";

export const runtime = "nodejs";

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
  const resolved = resolveBackendCandidates();
  if (!resolved.ok) {
    console.error("[api/backend] missing backend URL in production");
    return NextResponse.json({ detail: resolved.detail }, { status: 503 });
  }

  const joined = pathSegments
    .map((s) => encodeURIComponent(s))
    .join("/");
  const u = new URL(req.url);

  const headers = forwardHeaders(req);
  const withBody = !["GET", "HEAD"].includes(req.method);
  const bodyBuf = withBody ? await req.arrayBuffer() : null;

  let res: Response | undefined;
  let lastErr: unknown;
  for (const base of resolved.candidates) {
    const target = `${base}/${joined}${u.search}`;
    const init: RequestInit = {
      method: req.method,
      headers,
      signal: AbortSignal.timeout(60_000),
    };
    if (bodyBuf !== null) {
      init.body = bodyBuf.byteLength ? bodyBuf : undefined;
    }
    try {
      res = await fetch(target, init);
      break;
    } catch (e) {
      lastErr = e;
      console.warn("[api/backend] fetch failed for", target, e);
    }
  }

  if (!res) {
    console.error("[api/backend] all backend candidates failed", lastErr);
    return NextResponse.json(
      {
        detail:
          "تعذّر الاتصال بالباكند جرّب كل العناوين المضبوطة. تحقق من تشغيل FastAPI، ومن API_URL (مثال: http://backend:8000 داخل Docker — لا تستخدم localhost من حاوية أخرى).",
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
