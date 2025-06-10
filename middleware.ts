// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value; // ← 對齊名稱
  console.log("Access token from cookie:", token);

  // No cookie → go to login
  if (!token) {
    console.log("No access token found, redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Validate signature & expiry (HS256 in this example)
    await jwtVerify(token, encoder.encode(process.env.JWT_SECRET!), {
      algorithms: ["HS256"],
    });
    console.log("Access token is valid, proceeding to the requested page.");
    return NextResponse.next();
  } catch {
    // Invalid or expired → force re-auth
    console.log("Access token is invalid or expired, redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

/**
 * Run on every path except:
 * - /api routes
 * - static assets
 * - image optimizer
 * - public auth pages
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
