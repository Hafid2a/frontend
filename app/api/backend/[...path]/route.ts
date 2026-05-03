import { NextRequest, NextResponse } from "next/server";
import { resolveBackendCandidates } from "@/lib/server/backend-candidates";

export const runtime = "nodejs";

/** مهلة لكل مرشّح (تجنّب انتظار طويل × عدد العناوين). */
const PROXY_FETCH_MS = 20_000;

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
      signal: AbortSignal.timeout(PROXY_FETCH_MS),
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
    const hostsTried = resolved.candidates.map((c) => {
      try {
        return new URL(c).host;
      } catch {
        return c;
      }
    });
    console.error(
      "[api/backend] all backend candidates failed; tried hosts:",
      hostsTried.join(", "),
      lastErr
    );
    return NextResponse.json(
      {
        detail:
          "تعذّر الاتصال بالباكند بعد تجربة كل العناوين. تحقق: 1) خدمة FastAPI شغّالة و /health يعمل 2) على الفرونت API_URL = عنوان يصل من **داخل** حاوية الفرونت (مثال http://اسم-الخدمة-في-Easypanel:8000) ويمكنك عدة عناوين بفاصلة 3) لا تستخدم localhost إلا إن الباكند فنفس الحاوية.",
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
