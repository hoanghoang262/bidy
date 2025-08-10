"use client";

import { useEffect, useState } from "react";
import { SidebarFilter, ProductList } from "../../../components/product";
import { useFilterState } from "../../../hooks";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useProductSearch, useProductsByStatus } from "@/services/product";
import { useAuctionByStatus } from "@/services/bid";
import { ArrowLeft } from "lucide-react";
import { STATUS_AUCTIONS } from "@/constants/app.enum";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function AllCategoriesContent() {
  const { filterState, setFilterState } = useFilterState();
  const router = useRouter();

  // Debounce the search input
  const debouncedSearch = useDebouncedValue(filterState.search, 400);

  // Fetch all products (happening auctions by default)
  const defaultStatus = filterState.selectedType || STATUS_AUCTIONS.HAPPENING;
  const { auctions: allProducts, isLoading: isAllLoading } = useAuctionByStatus(defaultStatus);
  const { searchResults, isLoading: isSearchLoading } = useProductSearch(debouncedSearch.trim());
  const { statusProducts, isLoading: isStatusLoading } = useProductsByStatus(filterState.selectedType);

  // Determine which products to show
  let products = allProducts;
  let isLoading = isAllLoading;

  // If searching, use search results
  if (debouncedSearch.trim()) {
    products = searchResults;
    isLoading = isSearchLoading;
  } 
  // If status filter is selected (and different from default), use status products
  else if (filterState.selectedType && filterState.selectedType !== defaultStatus) {
    products = statusProducts;
    isLoading = isStatusLoading;
  }

  // Apply category filters
  if (products && filterState.selectedCategories.length > 0) {
    products = products.filter((product: any) => 
      filterState.selectedCategories.includes(product.category?._id || product.category)
    );
  }

  // Apply brand filters
  if (products && filterState.selectedBrands.length > 0) {
    products = products.filter((product: any) => 
      filterState.selectedBrands.some(brand => 
        product.name?.toLowerCase().includes(brand.toLowerCase()) ||
        product.description?.toLowerCase().includes(brand.toLowerCase())
      )
    );
  }

  // Apply condition filters
  if (products && filterState.selectedConditions.length > 0) {
    products = products.filter((product: any) => 
      filterState.selectedConditions.some(condition =>
        product.condition?.includes(condition) ||
        product.description?.toLowerCase().includes(condition.toLowerCase())
      )
    );
  }

  // Apply price range filters
  if (products && filterState.priceFrom) {
    const minPrice = parseFloat(filterState.priceFrom);
    products = products.filter((product: any) => 
      (product.currentPrice || product.price || 0) >= minPrice
    );
  }

  if (products && filterState.priceTo) {
    const maxPrice = parseFloat(filterState.priceTo);
    products = products.filter((product: any) => 
      (product.currentPrice || product.price || 0) <= maxPrice
    );
  }

  return (
    <main className="flex-1 w-full px-4 py-8 pb-60 lg:px-24 flex flex-col gap-4 bg-gradient-to-b from-card to-accent-foreground">
      {/* Header */}
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(APP_ROUTES.HOME)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Quay lại trang chủ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-primary">
              TẤT CẢ SẢN PHẨM ĐẤU GIÁ
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Khám phá tất cả sản phẩm đang được đấu giá
            </p>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg w-full lg:w-fit hover:bg-primary/80 transition-colors"
          onClick={() => router.push(APP_ROUTES.PRODUCT_NEW)}
          title="Thêm Sản Phẩm"
        >
          Thêm Sản Phẩm
        </button>
      </div>

      {/* Badge for total products */}
      {products && products.length > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full w-fit">
          <span className="text-sm font-medium">
            {products.length} sản phẩm đang được đấu giá
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-start">
        {/* Sidebar */}
        <SidebarFilter
          filterState={filterState}
          setFilterState={setFilterState}
        />
        {/* Product Cards */}
        <ProductList
          filterState={filterState}
          setFilterState={setFilterState}
          view="grid"
          products={products}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}

export default function AllCategoriesPage() {
  return <AllCategoriesContent />;
}