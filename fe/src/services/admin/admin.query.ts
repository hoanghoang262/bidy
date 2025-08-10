import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleErrorMessage } from "@/utils/error.utils";
import {
  createCategory,
  deleteCategory,
  fetchAllAuctions,
  fetchAllCategories,
  fetchAllUsers,
  fetchStatistic,
  fetchStatisticAuctions,
  fetchStatisticUsers,
  updateCategory,
  updateUserStatus,
} from "./admin.fetcher";
import { API_ROUTES } from "@/constants";
import {
  AdminGetAllAuctionsParams,
  AdminGetAllCategoriesParams,
  AdminGetAllUsersParams,
} from "@/types";
import { useAuth } from "@/hooks";
import { IStatistic, IStatisticAuctions } from "@/types/statistics";

export const useAdminUsers = (params?: AdminGetAllUsersParams) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.ADMIN_GET_ALL_USERS, params],
    queryFn: () => fetchAllUsers(params),
    enabled: isAuthenticated,
  });

  return {
    users: data?.data?.users ?? [],
    totalUsers: data?.data?.totalUsers ?? 0,
    totalPages: data?.data?.totalPages ?? 0,
    currentPage: data?.data?.currentPage ?? 0,
    refetchUsers: refetch,
    isLoading,
  };
};

export const useUpdateUserStatus = () =>
  useMutation({
    mutationFn: (id: string) => updateUserStatus(id),
    onError: handleErrorMessage,
    onSuccess: () => toast.success("Xóa người dùng thành công!"),
  });

export const useAdminAuctions = (params?: AdminGetAllAuctionsParams) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.ADMIN_GET_ALL_AUCTIONS, params],
    queryFn: () => fetchAllAuctions(params),
    enabled: isAuthenticated,
  });

  return {
    auctions: data?.data?.auctions ?? null,
    currentPage: data?.data?.currentPage ?? 0,
    totalAuctions: data?.data?.totalAuctions ?? 0,
    totalPages: data?.data?.totalPages ?? 0,
    refetchAuctions: refetch,
    isLoading,
  };
};

export const useAdminCategories = (params?: AdminGetAllCategoriesParams) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.ADMIN_GET_ALL_CATEGORIES, params],
    queryFn: () => fetchAllCategories(params),
    enabled: isAuthenticated,
  });

  return {
    categories: data?.data ?? null,
    refetchCategories: refetch,
    isLoading,
  };
};

export const useCreateCategory = () =>
  useMutation({
    mutationFn: (formData: FormData) => createCategory(formData),
    onError: handleErrorMessage,
    onSuccess: () => toast.success("Tạo danh mục thành công!"),
  });

export const useUpdateCategory = () =>
  useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateCategory(id, formData),
    onError: handleErrorMessage,
    onSuccess: () => toast.success("Cập nhật danh mục thành công!"),
  });

export const useDeleteCategory = () =>
  useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onError: handleErrorMessage,
    onSuccess: () => toast.success("Xóa danh mục thành công!"),
  });

export const useAdminStatistic = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.ADMIN_GET_STATISTIC],
    queryFn: fetchStatistic,
    enabled: isAuthenticated,
  });

  return {
    statistics: (data?.data as IStatistic) ?? null,
    refetchStatistics: refetch,
    isLoading,
  };
};
export const useAdminStatisticAuctions = (year?: string) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.ADMIN_GET_STATISTIC_AUCTIONS],
    queryFn: () => fetchStatisticAuctions(year),
    enabled: isAuthenticated,
  });

  return {
    statisticsAuctions: (data?.data as IStatisticAuctions) ?? null,
    refetchStatsAuctions: refetch,
    isLoading,
  };
};
export const useAdminStatisticUsers = (year?: string) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.ADMIN_GET_STATISTIC_USERS],
    queryFn: () => fetchStatisticUsers(year),
    enabled: isAuthenticated,
  });

  return {
    statisticsUsers: (data?.data as IStatisticAuctions) ?? null,
    refetchStatsUsers: refetch,
    isLoading,
  };
};
