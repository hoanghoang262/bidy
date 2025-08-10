import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

import { APP_CONSTANTS, APP_ROUTES, PROTECTED_ROUTES } from "@/constants";
import { MiddlewareFactory } from "@/middlewares/type";
import { getExpiredTime, getTokenExpiration, verifyJwt } from "@/utils";
import { UserCookie } from "@/types";

// export const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
//   return async (request: NextRequest, _next: NextFetchEvent) => {
//     const { pathname } = request.nextUrl;
//     const token = request.cookies.get(APP_CONSTANTS.AUTH_COOKIE_NAME)?.value;
//     const isSignInPage = pathname.startsWith(APP_ROUTES.SIGN_IN);

//     const isProtectedRoute = PROTECTED_ROUTES.some(
//       (route) => pathname === route || pathname.startsWith(`${route}/`)
//     );

//     if (token && isSignInPage) {
//       return NextResponse.redirect(new URL(APP_ROUTES.HOME, request.url));
//     }

//     if (!token && isProtectedRoute && !isSignInPage) {
//       return NextResponse.redirect(new URL(APP_ROUTES.SIGN_IN, request.url));
//     }

//     if (token) {
//       const verifiedJwt = await verifyJwt(token);
//       if (verifiedJwt) {
//         const exp = getTokenExpiration(verifiedJwt);
//         const duration = getExpiredTime(exp?.toString() ?? "");
//         const res = NextResponse.next();
//         res.cookies.set({
//           name: APP_CONSTANTS.AUTH_COOKIE_NAME,
//           value: JSON.stringify(verifiedJwt),
//           expires: duration,
//           httpOnly: false,
//           maxAge: duration,
//         });

//         return next(request, _next);
//       } else {
//         const response = NextResponse.next();
//         response.cookies.delete(APP_CONSTANTS.AUTH_COOKIE_NAME);

//         if (isProtectedRoute) {
//           return NextResponse.redirect(
//             new URL(APP_ROUTES.SIGN_IN, request.url)
//           );
//         }
//       }
//     }

//     return next(request, _next);
//   };
// };

export const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(APP_CONSTANTS.AUTH_COOKIE_NAME)?.value;
    const userCookie = request.cookies.get(
      APP_CONSTANTS.USER_COOKIE_NAME
    )?.value;

    const isSignInPage = pathname.startsWith(APP_ROUTES.SIGN_IN);
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const isAdminRoute =
      pathname === APP_ROUTES.ADMIN ||
      pathname.startsWith(`${APP_ROUTES.ADMIN}/`);

    // 🚫 Guest visiting protected route
    if (!token && isProtectedRoute && !isSignInPage) {
      return NextResponse.redirect(new URL(APP_ROUTES.SIGN_IN, request.url));
    }

    // ✅ Authenticated user on sign-in page → redirect home
    if (token && isSignInPage) {
      return NextResponse.redirect(new URL(APP_ROUTES.HOME, request.url));
    }

    // ✅ Token exists, validate
    if (token) {
      const verifiedJwt = await verifyJwt(token);
      if (verifiedJwt) {
        const exp = getTokenExpiration(verifiedJwt);
        const duration = getExpiredTime(exp?.toString() ?? "");

        // 🧠 Parse user info from cookie
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let userInfo: UserCookie | any = {};
        try {
          userInfo = JSON.parse(userCookie || "{}");
        } catch {
          userInfo = {};
        }

        // 🔐 Admin route protection
        if (isAdminRoute && userInfo?.role !== "admin") {
          return NextResponse.redirect(new URL(APP_ROUTES.HOME, request.url));
        }

        const res = NextResponse.next();
        res.cookies.set({
          name: APP_CONSTANTS.AUTH_COOKIE_NAME,
          value: verifiedJwt,
          expires: duration,
          httpOnly: false,
          maxAge: duration,
        });

        return res;
      } else {
        // ❌ Invalid JWT → remove cookie and redirect
        const response = NextResponse.next();
        response.cookies.delete(APP_CONSTANTS.AUTH_COOKIE_NAME);
        if (isProtectedRoute) {
          return NextResponse.redirect(
            new URL(APP_ROUTES.SIGN_IN, request.url)
          );
        }
      }
    }

    return next(request, _next);
  };
};
