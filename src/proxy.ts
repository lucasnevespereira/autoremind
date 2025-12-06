import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const isLoginPage = request.nextUrl.pathname === "/sign-in";
  const isSignUpPage = request.nextUrl.pathname === "/sign-up";
  const isAuthPage = isLoginPage || isSignUpPage;

  // If not authenticated and not on auth page, redirect to sign-in
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If authenticated and on auth page, redirect to home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - api/cron (cron jobs have their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!api/auth|api/cron|_next/static|_next/image|favicon.ico).*)",
  ],
};
