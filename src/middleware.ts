import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuth,
  authRoutes,
  publicRoutes,
} from "../routes";

import { updateSession } from "./lib/supabase/middleware";
import readUserSession from "./actions";

export async function middleware(request: NextRequest) {
  // Protected routes
  const { nextUrl } = request;
  const { data } = await readUserSession();
  const isLoggedIn = Boolean(data.session);

  const isAPIAuthRoute = apiAuth.find((item) =>
    nextUrl.pathname.includes(item),
  );

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAPIAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  if (isLoggedIn) {
    if (isAuthRoute || nextUrl.pathname === "/auth/forget-password") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  if (!isLoggedIn && !isPublicRoute && nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", nextUrl));
  }

  // Supbase cookie management
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
