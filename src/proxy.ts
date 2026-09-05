import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { roleAtLeast } from "@/lib/rbac";

const SUPERADMIN_ROUTES = ["/users", "/firmware"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    SUPERADMIN_ROUTES.some((route) => pathname.startsWith(route)) &&
    !roleAtLeast(role!, "Superadmin")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
