import { withAuth } from "@/middlewares/auth.middleware";
import { NextResponse } from "next/server";

const middleware = withAuth(async () => {
  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/product/new',
    '/notifications'
  ],
};
