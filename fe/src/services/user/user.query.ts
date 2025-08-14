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
import { handleErrorMessage, handleSuccessMessage } from "@/utils/error.utils";
import logger from "@/utils/logger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: register,
    onError: (error) => handleErrorMessage(error),
    onSuccess(data) {
      const successMessage = data?.message ?? 
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.";
      handleSuccessMessage(successMessage);
      router.push(APP_ROUTES.SIGN_IN);
    },
  });
};

export const useSignin = () => {
  return useMutation({
    mutationFn: signin,
    onError: (error) => handleErrorMessage(error),
    onSuccess: async (data) => {
      const successMessage = data?.message ?? "Đăng nhập thành công!";
      handleSuccessMessage(successMessage);
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
      const successMessage = data?.message ?? "Cập nhật thông tin thành công!";
      handleSuccessMessage(successMessage);
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
      const successMessage = data?.message ?? "Đổi mật khẩu thành công!";
      handleSuccessMessage(successMessage);
      logout(pathname);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error) => handleErrorMessage(error),
    onSuccess: (data) => {
      const successMessage = data?.message ?? 
        "Vui lòng kiểm tra email để nhận liên kết đặt lại mật khẩu!";
      handleSuccessMessage(successMessage);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error) => handleErrorMessage(error),
    onSuccess: (data) => {
      const successMessage = data?.message ?? "Đặt lại mật khẩu thành công!";
      handleSuccessMessage(successMessage);
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
