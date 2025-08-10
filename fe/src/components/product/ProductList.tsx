"use client";

import { useMemo, useState, useCallback } from "react";
import ProductListCard, { ProductGridCard } from "./ProductListCard";
import type { UnifiedProduct } from "../home/unifiedMock";
import { FilterState } from "./SidebarFilter";
import { ArrowUpNarrowWide, ChevronLeft, ChevronRight } from "lucide-react";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import { mapImageUrls } from "@/utils/image.utils";

interface ProductListProps {
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
  view: "list" | "grid";
  products: ApiProduct[];
  isLoading: boolean;
}

// Define interface for API product data
interface ApiProduct {
  _id?: string;
  id?: string;
  name?: string;
  productName?: string;
  image?: string[];
  images?: string[];
  description?: string;
  price?: number;
  startingPrice?: number;
  starterPrice?: number;
  buyNow?: number;
  quickBuy?: number;
  currentPrice?: number;
  finalPrice?: number;
  timeLeft?: string;
  time_remain?: string;
  endTime?: string;
  sellerName?: string;
  seller?: string;
  sellerId?: number;
  category?: string;
  condition?: string;
  status?: string;
  type?: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  isWatched?: boolean;
  owner?: {
    _id?: string;
    full_name?: string;
  };
}

const SORT_OPTIONS = [
  { label: "Sắp xếp theo", value: "", isPlaceholder: true },
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
];

export default function ProductList({
  filterState,
  setFilterState,
  view,
  products,
  isLoading,
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(view);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Helper to map API data to UnifiedProduct if needed
  const mapToUnifiedProduct = useCallback((product: ApiProduct): UnifiedProduct => {
    const images = mapImageUrls(product.image || product.images);
    let timeLeft = product.timeLeft || undefined;
    // Use time_remain for HAPPENING type
    if ((product.status || product.type) === STATUS_AUCTIONS.HAPPENING && product.time_remain) {
      timeLeft = product.time_remain;
    }
    
    // Keep the original ID as string for API compatibility
    const productId = product._id || product.id || "0";
    const finalId = typeof productId === "string" ? productId : String(productId);
    
    // Type-safe condition mapping
    const condition = product.condition as "new" | "used" | "refurbished" | undefined;
    
    // Type-safe status mapping
    const status = (product.status as STATUS_AUCTIONS) || STATUS_AUCTIONS.INITIAL;
    
    return {
      id: finalId,
      name: product.name || product.productName || "",
      image: images,
      description: product.description || "",
      startingPrice: product.price?.toString() || product.startingPrice?.toString() || product.starterPrice?.toString() || "0",
      buyNow: product.buyNow?.toString() || product.quickBuy?.toString() || undefined,
      currentPrice: product.currentPrice?.toString() || undefined,
      finalPrice: product.finalPrice?.toString() || undefined,
      timeLeft,
      endTime: product.endTime || undefined,
      seller: product.owner?.full_name || product.sellerName || product.seller || "Không rõ người bán",
      sellerId: typeof product.owner?._id === 'string' ? parseInt(product.owner._id, 10) || 0 : typeof product.owner?._id === 'number' ? product.owner._id : typeof product.sellerId === 'number' ? product.sellerId : 0,
      category: product.category || undefined,
      condition,
      status,
      type: filterState.selectedType as STATUS_AUCTIONS,
      views: product.views || 0,
      createdAt: product.createdAt || undefined,
      updatedAt: product.updatedAt || undefined,
      isWatched: product.isWatched || false,
    };
  }, [filterState.selectedType]);

  // Filtering logic (client-side for price, location, etc.)
  const filtered = useMemo(() => {
    // Map and filter API data
    const unifiedProducts: UnifiedProduct[] = Array.isArray(products)
      ? products.map(mapToUnifiedProduct)
      : [];

    let result = unifiedProducts.filter((f: UnifiedProduct) => {
      if (
        filterState.selectedCategories.length &&
        (!f.category || !filterState.selectedCategories.includes(f.category))
      )
        return false;
      if (
        filterState.priceFrom &&
        getPrice(f) < parseInt(filterState.priceFrom)
      )
        return false;
      if (filterState.priceTo && getPrice(f) > parseInt(filterState.priceTo))
        return false;
      if (
        filterState.selectedBrands.length &&
        (!f.seller || !filterState.selectedBrands.some((brand) => f.seller.includes(brand)))
      )
        return false;
      if (
        filterState.selectedConditions.length &&
        (!f.condition || !filterState.selectedConditions.includes(f.condition))
      )
        return false;
      // Remove search filter here, since backend search is used
      return true;
    });

    // Sorting logic
    if (filterState.sort === "price-asc") {
      result = result.slice().sort((a, b) => {
        const aPrice = getPrice(a);
        const bPrice = getPrice(b);
        return aPrice - bPrice;
      });
    } else if (filterState.sort === "price-desc") {
      result = result.slice().sort((a, b) => {
        const aPrice = getPrice(a);
        const bPrice = getPrice(b);
        return bPrice - aPrice;
      });
    }
    // 'newest' is default order (API order)
    return result;
  }, [filterState, products, mapToUnifiedProduct]);

  function getPrice(product: UnifiedProduct): number {
    const priceStr =
      product.currentPrice ||
      product.startingPrice ||
      "0";
    return parseInt(priceStr.replace(/\D/g, "")) || 0;
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState({ ...filterState, sort: e.target.value });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      {/* Sort Bar */}
      <div className="flex items-center justify-between gap-4 ">
        <div className="sticky top-0 z-10 bg-card border border-border flex items-center gap-4 justify-center px-2 py-3 rounded-lg shadow-sm cursor-pointer w-full lg:w-fit lg:justify-between">
          <ArrowUpNarrowWide className="text-foreground-secondary" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <select
                className={`ml-2 pr-1 bg-transparent outline-none font-semibold 
                  ${
                    !filterState.sort
                      ? "text-foreground-secondary"
                      : "text-foreground"
                  }
                `}
                value={filterState.sort || ""}
                onChange={handleSortChange}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={!!opt.isPlaceholder}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="items-center space-x-2 hidden lg:flex">
          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground border-border"
                : "bg-background text-foreground-secondary border-border hover:border-foreground"
            }`}
            title="Grid View"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 3H8V8H3V3ZM3 10H8V15H3V10ZM10 3H15V8H10V3ZM10 10H15V15H10V10Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground-secondary border-border hover:border-foreground"
            }`}
            title="List View"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 3H17V5H3V3ZM3 7H17V9H3V7ZM3 11H17V13H3V11ZM3 15H17V17H3V15Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Product Grid */}
      <div
        className={`grid gap-6 w-full ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {currentProducts.length === 0 ? (
          <div className="col-span-3 text-center text-foreground-secondary text-lg">
            Không tìm thấy sản phẩm nào
          </div>
        ) : (
          currentProducts.map((product, index) => {
            return (
              <div key={startIndex + index}>
                {/* Mobile: Always use grid cards */}
                <div className="block md:hidden">
                  <ProductGridCard feature={product} />
                </div>
                {/* Desktop: Use view mode */}
                <div className="hidden md:block">
                  {viewMode === "grid" ? (
                    <ProductGridCard feature={product} />
                  ) : (
                    <ProductListCard feature={product} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-border text-foreground-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card"
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`py-2 px-4 rounded-lg border ${
                currentPage === page
                  ? "bg-primary text-primary-foreground border-border"
                  : "border-border text-foreground-secondary hover:bg-card"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-border text-foreground-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
