import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function backendBase(): string {
  return (
    process.env.BACKEND_INTERNAL_URL?.trim() ||
    process.env.API_URL?.trim() ||
    process.env.API_BASE_URL?.trim() ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
}

const HOP_BY_HOP = new Set(
  "host,connection,content-length,keep-alive,transfer-encoding,te,trailer,upgrade"
    .split(",")
);

async function proxy(req: NextRequest, segments: string[] | undefined) {
  const subpath = segments?.length ? segments.join("/") : "";
  const target = new URL(
    `${backendBase()}/${subpath}${req.nextUrl.search || ""}`
  );

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  let res: Response;
  try {
    res = await fetch(target, init);
  } catch {
    return NextResponse.json(
      {
        detail:
          "تعذّر الوصول لـ FastAPI من خادم Next. في Easypanel ضع BACKEND_INTERNAL_URL=http://اسم_خدمة_الباكند:8000 في بيئة الواجهة وأعد التشغيل. محلياً: شغّل الباكند على 8000 أو NEXT_PUBLIC_MOCK_ORDERS=true.",
      },
      { status: 502 }
    );
  }

  const out = new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
  });

  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    out.headers.set(key, value);
  });

  return out;
}

type RouteCtx = { params: Promise<{ path?: string[] }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function HEAD(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
