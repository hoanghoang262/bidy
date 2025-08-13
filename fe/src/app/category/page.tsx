"use client";

import { useEffect, useState, Suspense } from "react";
import { SidebarFilter, ProductList } from "../../components/product";
import { useFilterState } from "../../hooks";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useProductSearch, useProductsByStatus } from "@/services/product";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function CategoryPageContent() {
  const { filterState, setFilterState } = useFilterState();
  const router = useRouter();

  // Debounce the search input
  const debouncedSearch = useDebouncedValue(filterState.search, 400);

  const { searchResults, isLoading: isSearchLoading } = useProductSearch(debouncedSearch.trim());
  const { statusProducts, isLoading: isStatusLoading } = useProductsByStatus(filterState.selectedType);

  const products = debouncedSearch.trim() ? searchResults : statusProducts;
  const isLoading = debouncedSearch.trim() ? isSearchLoading : isStatusLoading;

  return (
    <main className="flex-1 w-full px-4 py-8 pb-60 lg:px-24 flex flex-col gap-4 bg-gradient-to-b from-card to-accent-foreground">
      {/* Header */}
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        <p className="text-2xl lg:text-3xl font-bold text-primary w-full lg:w-fit text-center">
          SẢN PHẨM ĐẤU GIÁ
        </p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg w-full lg:w-fit hover:bg-primary/80 transition-colors w-fit"
          onClick={() => router.push(APP_ROUTES.PRODUCT_NEW)}
          title="Thêm Sản Phẩm"
        >
          Thêm Sản Phẩm
        </button>
      </div>

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

// Loading fallback for category page
const CategoryLoading = () => (
  <main className="flex-1 w-full px-4 py-8 pb-60 lg:px-24 flex flex-col gap-4 bg-gradient-to-b from-card to-accent-foreground">
    <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
      <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
      <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
    </div>
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-start">
      <div className="w-full lg:w-80 h-96 bg-muted rounded animate-pulse"></div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  </main>
);

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryPageContent />
    </Suspense>
  );
}
