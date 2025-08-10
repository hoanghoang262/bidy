import { API_ROUTES } from "@/constants";
import axiosClient from "@/lib/axios-client";

// Get all products (featured products for home page)
export const fetchFeaturedProducts = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_STATUS("happenning"));
  return res.data;
};

// Get products by seller ID
export const fetchProductsBySeller = async (sellerId: string) => {
  const res = await axiosClient.get(`/auction/seller/${sellerId}`);
  return res.data;
};

// Get products by category
export const fetchProductsByCategory = async (category: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_CATEGORY(category));
  return res.data;
};

// Get products by status
export const fetchProductsByStatus = async (status: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_STATUS(status));
  return res.data;
};

// Get product by ID
export const fetchProductById = async (id: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_BY_ID(id));
  return res.data;
};

// Search products
export const fetchProductSearch = async (keyword: string) => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_SEARCH(keyword));
  return res.data;
};

// Get seller products by status
export const fetchSellerProductsByStatus = async (sellerId: string, status: string) => {
  const res = await axiosClient.get(`/auction/seller/${sellerId}/status/${status}`);
  return res.data;
};

// Get categories
export const fetchProductCategories = async () => {
  const res = await axiosClient.get(API_ROUTES.AUCTION_CATEGORIES);
  return res.data;
};

// Place a manual bid
export const fetchBid = async (id: string, amount: number) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_BID(id), { amount });
  return res.data;
};

// Buy now
export const fetchBuyNow = async (id: string) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_BUY_NOW(id));
  return res.data;
};

// Auto-bid
export const fetchAutoBid = async (id: string, increment: number, limitBid: number) => {
  const res = await axiosClient.post(API_ROUTES.AUCTION_AUTO_BID(id), { increment, limitBid });
  return res.data;
};

// Create a new auction listing
export const createAuctionListing = async (formData: FormData) => {
  const res = await axiosClient.post("/auction/listing", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}; 