import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to auth pages when not authenticated
    if (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/setup")
    ) {
      if (token && !pathname.startsWith("/setup")) {
        // Redirect authenticated users away from auth pages (but allow setup)
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Protect API routes
    if (pathname.startsWith("/api")) {
      // Allow public API routes
      if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/register") ||
        pathname.startsWith("/api/setup-admin")
      ) {
        return NextResponse.next();
      }

      // Require authentication for other API routes
      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      // Admin-only API routes
      const adminRoutes = [
        "/api/dashboard",
        "/api/members",
        "/api/membership-plans",
        "/api/payments",
        "/api/attendance",
      ];

      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAdminRoute && token.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }

      // Admin-only dashboard routes
      const adminDashboardRoutes = [
        "/dashboard/members",
        "/dashboard/membership-plans",
        "/dashboard/payments",
        "/dashboard/attendance",
      ];

      const isAdminDashboardRoute = adminDashboardRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAdminDashboardRoute && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/sign-in") ||
          pathname.startsWith("/sign-up") ||
          pathname.startsWith("/setup") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/register") ||
          pathname.startsWith("/api/setup-admin")
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/sign-in",
      error: "/sign-in",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
