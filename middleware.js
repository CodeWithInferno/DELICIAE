import { NextResponse } from "next/server";

export function middleware(req) {
  const isAuthenticated = req.cookies.get("appSession"); // Auth0 session cookie

  if (req.nextUrl.pathname.startsWith("/profile") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url)); // Redirect to login if not authenticated
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"], // Protect profile route
};
