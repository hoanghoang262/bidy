import { API_ROUTES } from "@/constants";
import axiosClient from "@/lib/axios-client";
import {
  AdminGetAllAuctionsParams,
  AdminGetAllCategoriesParams,
  AdminGetAllUsersParams,
} from "@/types";

export const fetchAllUsers = async (params?: AdminGetAllUsersParams) => {
  const res = await axiosClient.get(API_ROUTES.ADMIN_GET_ALL_USERS, { params });
  return res.data;
};

export const updateUserStatus = async (id: string) => {
  const res = await axiosClient.put(API_ROUTES.ADMIN_UPDATE_STATUS_USER(id));
  return res.data;
};

export const fetchAllAuctions = async (params?: AdminGetAllAuctionsParams) => {
  const res = await axiosClient.get(API_ROUTES.ADMIN_GET_ALL_AUCTIONS, {
    params,
  });
  return res.data;
};

export const fetchAllCategories = async (
  params?: AdminGetAllCategoriesParams
) => {
  const res = await axiosClient.get(API_ROUTES.ADMIN_GET_ALL_CATEGORIES, {
    params,
  });
  return res.data;
};

export const createCategory = async (formData: FormData) => {
  const res = await axiosClient.post(
    API_ROUTES.ADMIN_CREATE_CATEGORY,
    formData
  );
  return res.data;
};

export const updateCategory = async (id: string, formData: FormData) => {
  const res = await axiosClient.patch(
    API_ROUTES.ADMIN_UPDATE_CATEGORY(id),
    formData
  );
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await axiosClient.delete(API_ROUTES.ADMIN_DELETE_CATEGORY(id));
  return res.data;
};

export const fetchStatistic = async () => {
  const res = await axiosClient.get(API_ROUTES.ADMIN_GET_STATISTIC);
  return res.data;
};
export const fetchStatisticAuctions = async (year?: string) => {
  const res = await axiosClient.get(API_ROUTES.ADMIN_GET_STATISTIC_AUCTIONS, {
    params: { year },
  });
  return res.data;
};
export const fetchStatisticUsers = async (year?: string) => {
  const res = await axiosClient.get(API_ROUTES.ADMIN_GET_STATISTIC_USERS, {
    params: { year },
  });
  return res.data;
};
