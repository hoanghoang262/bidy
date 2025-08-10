import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/constants";
import {
  fetchFeaturedProducts,
  fetchProductsBySeller,
  fetchProductsByCategory,
  fetchProductsByStatus,
  fetchProductById,
  fetchProductSearch,
  fetchSellerProductsByStatus,
  fetchProductCategories,
} from "./product.fetcher";

// Get featured products for home page
export const useFeaturedProducts = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });

  return {
    featuredProducts: data?.data?.auction ?? [],
    refetchFeaturedProducts: refetch,
    isLoading,
  };
};

// Get products by seller ID
export const useProductsBySeller = (sellerId: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["productsBySeller", sellerId],
    queryFn: () => fetchProductsBySeller(sellerId),
    enabled: !!sellerId,
  });

  return {
    sellerProducts: data?.data ?? [],
    refetchSellerProducts: refetch,
    isLoading,
  };
};

// Get products by category
export const useProductsByCategory = (category: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_BY_CATEGORY, category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category,
  });

  return {
    categoryProducts: data?.data ?? [],
    refetchCategoryProducts: refetch,
    isLoading,
  };
};

// Get products by status
export const useProductsByStatus = (status: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_BY_STATUS, status],
    queryFn: () => fetchProductsByStatus(status),
    enabled: !!status,
  });

  return {
    statusProducts: data?.data?.auction ?? [],
    refetchStatusProducts: refetch,
    isLoading,
  };
};

// Get product by ID
export const useProductById = (id: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_BY_ID, id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  return {
    product: data?.data ?? null,
    refetchProduct: refetch,
    isLoading,
  };
};

// Search products
export const useProductSearch = (keyword: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_SEARCH, keyword],
    queryFn: () => fetchProductSearch(keyword),
    enabled: !!keyword,
  });

  return {
    searchResults: data?.data?.auction ?? [],
    refetchSearch: refetch,
    isLoading,
  };
};

// Get seller products by status
export const useSellerProductsByStatus = (sellerId: string, status: string) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["sellerProductsByStatus", sellerId, status],
    queryFn: () => fetchSellerProductsByStatus(sellerId, status),
    enabled: !!sellerId && !!status,
  });

  return {
    sellerStatusProducts: data?.data ?? [],
    refetchSellerStatusProducts: refetch,
    isLoading,
  };
};

// Get product categories
export const useProductCategories = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [API_ROUTES.AUCTION_CATEGORIES],
    queryFn: fetchProductCategories,
  });

  return {
    categories: data?.data ?? [],
    refetchCategories: refetch,
    isLoading,
  };
}; 