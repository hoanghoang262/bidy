"use client";
import { API_ROUTES, APP_CONSTANTS, APP_ROUTES } from "@/constants";
import { useAuth } from "@/hooks";
import { setAppCookie } from "@/lib/auth-cookies";
import {
  addWishlist,
  changePassword,
  checkUser,
  fetchProfile,
  fetchStats,
  fetchUserList,
  fetchWishlist,
  forgotPassword,
  register,
  removeAllWishlist,
  removeWishlist,
  resetPassword,
  signin,
  updateUser,
} from "@/services/user/user.fetcher";
import { handleErrorMessage } from "@/utils/error.utils";
import logger from "@/utils/logger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect, usePathname } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onError: (error) => handleErrorMessage(error),
    onSuccess(data) {
      toast.success(
        data?.message ??
          "Register successfully! Check your email for verifying your account."
      );
      redirect(APP_ROUTES.SIGN_IN);
    },
  });
};

export const useSignin = () => {
  return useMutation({
    mutationFn: signin,
    onError: (error) => handleErrorMessage(error),
    onSuccess: async (data) => {
      toast.success(data?.message ?? "Sign in successfully!");
      setAppCookie(APP_CONSTANTS.AUTH_COOKIE_NAME, data?.data.token ?? "");
      logger.debug('User signed in successfully', { userId: data?.data?.user?.id });
      setAppCookie(
        APP_CONSTANTS.USER_COOKIE_NAME,
        JSON.stringify(data?.data?.user ?? "")
      );
    },
  });
};

export const useProfile = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.PROFILE],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
  });

  return {
    profile: data?.data ?? null,
    refetchProfile: refetch,
    isLoading,
  };
};
export const useUserStats = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.USER_STATS],
    queryFn: fetchStats,
    enabled: isAuthenticated,
  });

  return {
    stats: data?.data ?? null,
    refetchProfile: refetch,
    isLoading,
  };
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
    onError: (error) => handleErrorMessage(error),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Profile updated successfully!");
    },
  });
};

export const useChangePassword = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  return useMutation({
    mutationFn: changePassword,
    onError: (error) => handleErrorMessage(error),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Password changed successfully!");
      logout(pathname);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => {
      toast.success("Check your email for a reset link!");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error) => handleErrorMessage(error),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Password reset successfully!");
    },
  });
};

export const useUserList = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.USER_LIST],
    queryFn: fetchUserList,
    enabled: isAuthenticated,
  });
  return {
    users: data?.data ?? null,
    refetchProfile: refetch,
    isLoading,
  };
};

export const useCheckUser = () => {
  return useMutation({
    mutationFn: checkUser,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Valid user information."),
  });
};

export const useWishlist = (page: number, limit: number) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.WISHLIST, page, limit],
    queryFn: () => fetchWishlist(page, limit),
    enabled: isAuthenticated,
  });
  return {
    profile: data?.data ?? null,
    refetchProfile: refetch,
    isLoading,
  };
};

export const useAddWishlist = () => {
  return useMutation({
    mutationFn: addWishlist,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Added to wishlist"),
  });
};

export const useRemoveWishlist = () => {
  return useMutation({
    mutationFn: removeWishlist,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Removed from wishlist"),
  });
};

export const useRemoveAllWishlist = () => {
  return useMutation({
    mutationFn: removeAllWishlist,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Cleared wishlist"),
  });
};
