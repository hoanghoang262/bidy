import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleErrorMessage } from "@/utils/error.utils";
import logger from "@/utils/logger";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchCategories,
  fetchMyAuctions,
  fetchAuctionCart,
  fetchAuctionByStatus,
  fetchAuctionByCategory,
  fetchAuctionById,
  fetchAuctionSearch,
  fetchOrders,
  fetchAuctionEnd,
  createAuctionListing,
  uploadAuctionImages,
  buyNow,
  placeBid,
  autoBid,
  deleteMyAuction,
  forceEndAuction,
  createOrder,
  getAuctionImages,
  updateProduct,
  fetchUserAuctionByStatus,
  fetchUserBuyAuction,
  fetchUserSellAuction,
} from "./bid.fetcher";
import { AutoBidPayload, PlaceBidPayload } from "@/types";
import { API_ROUTES } from "@/constants";

export const useAuctionCategories = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_CATEGORIES],
    queryFn: fetchCategories,
  });

  return {
    categories: data?.data ?? null,
    refetchCategories: refetch,
    isLoading,
  };
};

export const useMyAuctions = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_MY],
    queryFn: fetchMyAuctions,
    enabled: isAuthenticated,
  });

  return {
    myAuctions: data?.data ?? null,
    refetchMyAuctions: refetch,
    isLoading,
  };
};

export const useAuctionCart = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_CART],
    queryFn: fetchAuctionCart,
    enabled: isAuthenticated,
  });

  return {
    cart: data?.data ?? null,
    refetchCart: refetch,
    isLoading,
  };
};

export const useAuctionOrders = () => {
  const { isAuthenticated } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_ORDER],
    queryFn: fetchOrders,
    enabled: isAuthenticated,
  });

  return {
    orders: data?.data ?? null,
    refetchOrders: refetch,
    isLoading,
  };
};

export const useAuctionByStatus = (status: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_BY_STATUS, status],
    queryFn: () => fetchAuctionByStatus(status),
    enabled: !!status,
  });

  return {
    auctions: data?.data?.auction ?? null,
    refetchAuctions: refetch,
    isLoading,
  };
};
export const useUserAuctionByStatus = (id: string, status: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_USER_BY_STATUS(id, status)],
    queryFn: () => fetchUserAuctionByStatus(id, status),
    enabled: !!id && !!status,
  });

  return {
    auctions: data?.data?.auction ?? null,
    refetchAuctions: refetch,
    isLoading,
  };
};
export const useUserBuyAuction = (id: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_USER_BUY(id)],
    queryFn: () => fetchUserBuyAuction(id),
    enabled: !!id,
  });

  return {
    auctionsBuy: data?.data?.orders ?? null, // Changed from 'auction' to 'orders'
    refetchAuctions: refetch,
    isLoading,
  };
};
export const useUserSellAuction = (id: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_USER_SELL(id)],
    queryFn: () => fetchUserSellAuction(id),
    enabled: !!id,
  });

  return {
    auctionsSell: data?.data?.auction ?? null,
    refetchAuctions: refetch,
    isLoading,
  };
};

export const useAuctionByCategory = (category: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_BY_CATEGORY, category],
    queryFn: () => fetchAuctionByCategory(category),
    enabled: !!category,
  });

  return {
    products: data?.data ?? null,
    refetchProducts: refetch,
    isLoading,
  };
};

export const useAuctionById = (id: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_BY_ID, id],
    queryFn: () => fetchAuctionById(id),
    enabled: !!id,
  });

  return {
    product: data?.data ?? null,
    refetchProduct: refetch,
    isLoading,
  };
};

export const useAuctionSearch = (keyword: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_SEARCH, keyword],
    queryFn: () => fetchAuctionSearch(keyword),
    enabled: !!keyword,
  });

  return {
    searchResults: data?.data ?? null,
    refetchSearch: refetch,
    isLoading,
  };
};

export const useAuctionEnd = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_END],
    queryFn: fetchAuctionEnd,
  });

  return {
    auctionEnd: data?.data ?? null,
    refetchAuctionEnd: refetch,
    isLoading,
  };
};

export const useGetAuctionImages = (key: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getAuctionImages"],
    queryFn: () => getAuctionImages(key),
  });
  logger.debug('Fetching auction images', { key });
  return {
    image: data?.[0]?.url ?? null,
    refetchImages: refetch,
    isLoading,
  };
};

export const useUpdateProduct = () =>
  useMutation({
    mutationFn: (payload: { id: string; formData: FormData }) =>
      updateProduct(payload.id, payload.formData),
    onError: (error) => handleErrorMessage(error),
    onSuccess: (data) =>
      toast.success(data?.messages ?? "Product updated successfully!"),
  });

export const useCreateAuctionListing = () =>
  useMutation({
    mutationFn: createAuctionListing,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Auction created successfully!"),
  });

export const useUploadAuctionImages = () =>
  useMutation({
    mutationFn: uploadAuctionImages,
    onError: (error) => handleErrorMessage(error),
  });

export const useBuyNow = () =>
  useMutation({
    mutationFn: buyNow,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Bought successfully!"),
  });

export const usePlaceBid = () =>
  useMutation({
    mutationFn: ({ id, price }: PlaceBidPayload) => placeBid(id, { price }),
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Đã đặt giá thành công!"),
  });

export const useAutoBid = () =>
  useMutation({
    mutationFn: ({ id, max }: AutoBidPayload) => autoBid(id, { max }),
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Đã bật tự động đấu giá!"),
  });

export const useDeleteMyAuction = () =>
  useMutation({
    mutationFn: deleteMyAuction,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Deleted successfully!"),
  });

export const useForceEndAuction = () =>
  useMutation({
    mutationFn: forceEndAuction,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Auction ended early!"),
  });

export const useCreateOrder = () =>
  useMutation({
    mutationFn: createOrder,
    onError: (error) => handleErrorMessage(error),
    onSuccess: () => toast.success("Order created!"),
  });
