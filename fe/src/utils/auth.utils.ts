import { JwtPayload } from "@/types/common";
import { jwtDecode } from "jwt-decode";

export const verifyJwt = async (token: string) => {
  const expirationDate = getTokenExpiration(token);
  const now = new Date();
  const hasExpired = expirationDate
    ? expirationDate.getTime() < now.getTime()
    : true;

  return hasExpired ? undefined : token;
};

export const getTokenExpiration = (token: string) => {
  const decoded = decodedToken(token);
  const expiration = decoded.exp * 1000; // convert to milliseconds
  return new Date(expiration) ?? null;
};

export const decodedToken = (token: string) => {
  return jwtDecode<JwtPayload>(token);
};
