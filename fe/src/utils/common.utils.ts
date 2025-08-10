import { appConfig } from "@/config/app.config";

export const secureRandom = (): number => {
  const array = new Uint32Array(1);
  const MAX_UINT32 = 0xffffffff;
  const OFFSET = 1;

  crypto.getRandomValues(array);

  return array[0] / (MAX_UINT32 + OFFSET);
};
export const getSearchParamOrEmpty = (
  searchParams: URLSearchParams,
  key: string,
  initial = ""
): string => {
  return searchParams.get(key) ?? initial;
};
export const getExpiredTime = (expiration: string) => {
  const expirationTime = new Date(expiration).getTime();
  const currentTime = Date.now();
  const duration = expirationTime - currentTime;

  return duration;
};

export const getValidText = (value?: string) => {
  return value ?? "";
};
export const getValidNumber = (value?: number) => {
  return value ?? 0;
};

export const generateImageKey = (file: File) => {
  const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
  return `${file?.name}_${uniqueSuffix}`;
};

export const getImageURL = (url?: string) => {
  const serverUrl = appConfig.api.baseUrl;
  if (!url) {
    return "/images.jpeg";
  }
  if (url?.startsWith("blob:")) {
    return url;
  }
  if (url?.startsWith("http") || url?.startsWith("/")) {
    return url;
  }
  return `${serverUrl}/uploads/${url}`;
};

export const formatDateTime = (dateParam: Date | string) => {
  const date = typeof dateParam === "string" ? new Date(dateParam) : dateParam;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};
