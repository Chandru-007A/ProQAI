import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE } from "@/lib/auth";

// Protected routes that require authentication
const PROTECTED = [
  "/dashboard",
  "/inventory",
  "/rfq",
  "/analysis",
  "/vendor-dashboard",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await verifyToken(token);
  if (!user) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete(AUTH_COOKIE);
    return res;
  }

  // Vendor cannot access buyer-only routes
  if (
    user.role === "VENDOR" &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/inventory") ||
      pathname.startsWith("/rfq") ||
      pathname.startsWith("/analysis"))
  ) {
    return NextResponse.redirect(new URL("/vendor-dashboard", req.url));
  }

  // Buyer cannot access vendor routes
  if (user.role === "BUYER" && pathname.startsWith("/vendor-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
