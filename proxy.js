import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";

export function proxy(req) {

  const pathname = req.nextUrl.pathname;

  // =========================
  // PUBLIC ROUTES
  // =========================

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // =========================
  // GET TOKEN
  // =========================

  const token =
    req.cookies.get("token")?.value;

  // =========================
  // NO TOKEN
  // =========================

  if (!token) {

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const role =
      decoded.role?.toLowerCase();

    // =========================
    // ADMIN ROUTES
    // =========================

    if (
      pathname.startsWith("/admin") &&
      role !== "admin"
    ) {

      return NextResponse.redirect(
        new URL(
          "/users/dashboard",
          req.url
        )
      );
    }

    // =========================
    // USER ROUTES
    // =========================

    if (
      pathname.startsWith("/users") &&
      role !== "user"
    ) {

      return NextResponse.redirect(
        new URL(
          "/admin/dashboard",
          req.url
        )
      );
    }

    return NextResponse.next();

  } catch (error) {

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: ["/:path*"],
};