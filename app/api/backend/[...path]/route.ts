import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** مسار /api/backend معطّل — الطلبات تخرج من المتصفح إلى NEXT_PUBLIC_API_URL (انظر lib/api.ts). */
const PROXY_DISABLED = {
  detail:
    "بروكسي Next للباكند معطّل. المتصفح يتصل مباشرةً بعنوان API العام (NEXT_PUBLIC_API_URL).",
} as const;

function disabled(): NextResponse {
  return NextResponse.json(PROXY_DISABLED, { status: 503 });
}

export const GET = () => disabled();
export const POST = () => disabled();
export const PUT = () => disabled();
export const PATCH = () => disabled();
export const DELETE = () => disabled();
export const HEAD = () => disabled();
