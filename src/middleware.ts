import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/session";

const protectedRoutes = ["/", "/profile"];

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (protectedRoutes.includes(request.nextUrl.pathname) && !session.id) {
    return NextResponse.redirect(new URL("/create-account", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
