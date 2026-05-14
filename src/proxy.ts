import { NextRequest, NextResponse } from "next/server";

// Only API routes are protected at the proxy layer.
// The /admin page itself loads in the browser and handles auth client-side
// (stores Bearer token in sessionStorage, attaches it to every API call).
export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/api/admin");

  if (!isProtected) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail closed: if ADMIN_PASSWORD is not set, block all admin routes
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${adminPassword}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: { "WWW-Authenticate": 'Bearer realm="DataLatte Admin"' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
