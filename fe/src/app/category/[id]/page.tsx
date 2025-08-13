"use client";

import { useEffect, useState, Suspense } from "react";
import { SidebarFilter, ProductList } from "../../../components/product";
import { useFilterState } from "../../../hooks";
import { useRouter, useParams } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useProductSearch, useProductsByStatus } from "@/services/product";
import { useAuctionByCategory, useAuctionCategories } from "@/services/bid";
import { ArrowLeft } from "lucide-react";
import { Category, Auction } from "@/types/category.types";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function CategoryDetailContent() {
  const { filterState, setFilterState } = useFilterState();
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  // Fetch categories to get category name
  const { categories } = useAuctionCategories();
  const currentCategory = categories?.find((cat: Category) => cat._id === categoryId);

  // Debounce the search input
  const debouncedSearch = useDebouncedValue(filterState.search, 400);

  // Fetch products for this category
  const { products: categoryProducts, isLoading: isCategoryLoading } = useAuctionByCategory(categoryId);
  const { searchResults, isLoading: isSearchLoading } = useProductSearch(debouncedSearch.trim());
  const { statusProducts, isLoading: isStatusLoading } = useProductsByStatus(filterState.selectedType);

  // Determine which products to show based on filters
  let products = categoryProducts;
  let isLoading = isCategoryLoading;

  // If searching, use search results
  if (debouncedSearch.trim()) {
    products = searchResults;
    isLoading = isSearchLoading;
  } 
  // If status filter is selected, use status products
  else if (filterState.selectedType) {
    products = statusProducts;
    isLoading = isStatusLoading;
  }

  // Apply category filters if any selected (for sub-filtering within the main category)
  if (products && filterState.selectedCategories.length > 0) {
    products = products.filter((product: Auction) => 
      filterState.selectedCategories.includes(
        typeof product.category === 'object' ? product.category._id : product.category
      )
    );
  }

  // Apply brand filters
  if (products && filterState.selectedBrands.length > 0) {
    products = products.filter((product: Auction) => 
      filterState.selectedBrands.some(brand => 
        product.title?.toLowerCase().includes(brand.toLowerCase()) ||
        product.description?.toLowerCase().includes(brand.toLowerCase())
      )
    );
  }

  // Apply condition filters
  if (products && filterState.selectedConditions.length > 0) {
    products = products.filter((product: Auction) => 
      filterState.selectedConditions.some(condition =>
        product.description?.toLowerCase().includes(condition.toLowerCase())
      )
    );
  }

  // Apply price range filters
  if (products && filterState.priceFrom) {
    const minPrice = parseFloat(filterState.priceFrom);
    products = products.filter((product: Auction) => 
      (product.currentBid || product.startPrice || 0) >= minPrice
    );
  }

  if (products && filterState.priceTo) {
    const maxPrice = parseFloat(filterState.priceTo);
    products = products.filter((product: Auction) => 
      (product.currentBid || product.startPrice || 0) <= maxPrice
    );
  }

  // Set selected category on mount
  useEffect(() => {
    if (categoryId && !filterState.selectedCategories.includes(categoryId)) {
      setFilterState({
        ...filterState,
        selectedCategories: [categoryId],
      });
    }
  }, [categoryId, filterState, setFilterState]);

  return (
    <main className="flex-1 w-full px-4 py-8 pb-60 lg:px-24 flex flex-col gap-4 bg-gradient-to-b from-card to-accent-foreground">
      {/* Header */}
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(APP_ROUTES.CATEGORY)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-primary">
              {currentCategory?.name || "Danh mục"}
            </p>
            {currentCategory && (
              <p className="text-sm text-muted-foreground mt-1">
                Đấu giá trong danh mục {currentCategory.name}
              </p>
            )}
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

// Loading fallback for category detail page
const CategoryDetailLoading = () => (
  <main className="flex-1 w-full px-4 py-8 pb-60 lg:px-24 flex flex-col gap-4 bg-gradient-to-b from-card to-accent-foreground">
    <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
      </div>
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

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={<CategoryDetailLoading />}>
      <CategoryDetailContent />
    </Suspense>
  );
}