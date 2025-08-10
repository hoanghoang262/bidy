import { parseCookies, setCookie, destroyCookie } from "nookies";

// Cookie options
const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const setAppCookie = (key: string, value: string) => {
  setCookie(null, key, value, cookieOptions);
};
export const getAppCookie = (key: string) => {
  const cookies = parseCookies();
  return cookies[key];
};

export const removeCookie = (key: string) => {
  destroyCookie(undefined, key, { path: "/" });
};
