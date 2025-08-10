import { API_ROUTES } from "@/constants";
import axiosClient from "@/lib/axios-client";
import { CreateOrderBody, UploadImageKeyPayload } from "@/types";

export const getAuctionImages = async (key: string) => {
  const res = await axiosClient.get("/", {
    params: { key },
  });
  return res.data;
};
export const uploadAuctionImages = async (payload: UploadImageKeyPayload) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_IMAGE_UPLOAD, payload);
  return res.data;
};

export const createAuctionListing = async (formData: FormData) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_LISTING, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const fetchOrders = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_ORDER);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_CATEGORIES);
  return res.data;
};

export const fetchMyAuctions = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_MY);
  return res.data;
};

export const fetchAuctionCart = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_CART);
  return res.data;
};

export const fetchAuctionEnd = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_END);
  return res.data;
};

export const fetchAuctionByStatus = async (status: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_STATUS(status));
  return res.data;
};

export const fetchUserAuctionByStatus = async (id: string, status: string) => {
  const res = await axiosClient.get(
    API_ROUTES.AUCTION_USER_BY_STATUS(id, status)
  );
  return res.data;
};

export const fetchUserBuyAuction = async (id: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_USER_BUY(id));
  // const res = await axiosClient.get("/auction/buy");
  return res.data;
};

export const fetchUserSellAuction = async (id: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_USER_SELL(id));
  return res.data;
};

export const fetchAuctionByCategory = async (category: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_CATEGORY(category));
  return res.data;
};

export const fetchAuctionById = async (id: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_ID(id));
  return res.data;
};

export const fetchAuctionSearch = async (keyword: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_SEARCH(keyword));
  return res.data;
};

export const buyNow = async (id: string) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_BUY_NOW(id));
  return res.data;
};

export const placeBid = async (id: string, payload: { price: number }) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_BID(id), payload);
  return res.data;
};

export const autoBid = async (id: string, payload: { max: number }) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_AUTO_BID(id), payload);
  return res.data;
};

export const deleteMyAuction = async (id: string) => {
  const res = await axiosClient.delete(API_ROUTES.AUCTION_DELETE(id));
  return res.data;
};

export const forceEndAuction = async (id: string) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_FORCE_END(id));
  return res.data;
};

export const createOrder = async (payload: CreateOrderBody) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_CREATE_ORDER, payload);
  return res.data;
};

export const updateProduct = async (id: string, formData: FormData) => {
  const res = await axiosClient.put(API_ROUTES.AUCTION_BY_ID(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
