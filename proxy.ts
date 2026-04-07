import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";
import { parse } from "cookie";

const publicRoutes = ["/login", "/register", "/"];
// const privateRoutes = ["/transactions/path:*"];

export default async function proxy(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isPrivateRoute = pathname.startsWith("/transactions");

  if (!accessToken) {
    if (refreshToken) {
      const res = await checkSession();
      const setCookie = res.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.expires ? new Date(parsed.expires) : undefined,
            path: parsed.path,
            maxAge: Number(parsed["Max-Age"]),
          };
          if (parsed.accessToken)
            cookieStore.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set("refreshToken", parsed.refreshToken, options);
        }
        if (isPublicRoute) {
          return NextResponse.next({
            headers: { Cookie: cookieStore.toString() },
          });
        }
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: { Cookie: cookieStore.toString() },
          });
        }
      }
    }
    if (isPublicRoute) return NextResponse.next();
    if (isPrivateRoute) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (accessToken) {
    try {
      await checkSession();

      if (isPublicRoute) {
        return NextResponse.redirect(
          new URL("/transactions/expenses", req.nextUrl),
        );
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Token invalid or expired", error);

      const response = NextResponse.redirect(new URL("/", req.nextUrl));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }
}

export const config = {
  matcher: ["/login", "/register", "/transactions/:path*", "/"],
};
