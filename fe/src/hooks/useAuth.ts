"use client";

import { usePathname, useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useEffect, useState } from "react";
import { getAppCookie, removeCookie } from "@/lib/auth-cookies";
import { AppDispatch, persistor, RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "@/store/slices/authSlice";
import { handleErrorMessage } from "@/utils/error.utils";
import { APP_CONSTANTS } from "@/constants";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = getAppCookie(APP_CONSTANTS.AUTH_COOKIE_NAME);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppCookie(APP_CONSTANTS.AUTH_COOKIE_NAME)]);

  const logout = (redirectTo?: string) => {
    removeCookie(APP_CONSTANTS.AUTH_COOKIE_NAME);
    removeCookie(APP_CONSTANTS.USER_COOKIE_NAME);
    dispatch(clearAuth());
    persistor.purge();
    let url = APP_ROUTES.SIGN_IN;
    if (redirectTo) {
      url += `?redirect=${encodeURIComponent(redirectTo)}`;
    }
    router.push(url);
  };

  const requireAuth = (redirectTo: string = APP_ROUTES.SIGN_IN) => {
    try {
      const token = getAppCookie(APP_CONSTANTS.AUTH_COOKIE_NAME);
      if (!isLoading && !token) {
        const redirectUrl =
          redirectTo === APP_ROUTES.SIGN_IN
            ? `${APP_ROUTES.SIGN_IN}?redirect=${encodeURIComponent(pathname)}`
            : redirectTo;
        router.push(redirectUrl);
      }
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      handleErrorMessage(error);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    requireAuth,
  };
}
