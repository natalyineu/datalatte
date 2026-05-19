import { NextRequest, NextResponse } from "next/server";

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
