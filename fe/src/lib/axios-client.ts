import axios from "axios";
import { getAppCookie, removeCookie } from "./auth-cookies";
import { redirect } from "next/navigation";
import { APP_CONSTANTS, APP_ROUTES } from "@/constants";
import { clearAuth } from "@/store/slices/authSlice";
import { store } from "@/store";
import { appConfig } from "@/config/app.config";

const baseURL = appConfig.api.baseUrl;
const axiosClient = axios.create({
  baseURL,
  timeout: appConfig.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAppCookie(APP_CONSTANTS.AUTH_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      removeCookie(APP_CONSTANTS.AUTH_COOKIE_NAME);
      removeCookie(APP_CONSTANTS.USER_COOKIE_NAME);
      store.dispatch(clearAuth());
      redirect(APP_ROUTES.SIGN_IN);
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

export default axiosClient;
