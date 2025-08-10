"use client";

import { useEffect, useState } from "react";
import { SidebarFilter, ProductList } from "../../../components/product";
import { useFilterState } from "../../../hooks";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useProductSearch, useProductsByStatus } from "@/services/product";
import { useAuctionCategories } from "@/services/bid";
import { ArrowLeft, Smartphone } from "lucide-react";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function ElectronicsCategoryContent() {
  const { filterState, setFilterState } = useFilterState();
  const router = useRouter();

  // Fetch categories to find electronics category
  const { categories } = useAuctionCategories();
  const electronicsCategory = categories?.find((cat: any) => 
    cat.name.toLowerCase().includes("điện tử") ||
    cat.name.toLowerCase().includes("điện thoại") ||
    cat.name.toLowerCase().includes("máy tính") ||
    cat.name.toLowerCase().includes("laptop") ||
    cat.name.toLowerCase().includes("tablet")
  );

  // Debounce the search input
  const debouncedSearch = useDebouncedValue(filterState.search, 400);

  const { searchResults, isLoading: isSearchLoading } = useProductSearch(debouncedSearch.trim());
  const { statusProducts, isLoading: isStatusLoading } = useProductsByStatus(filterState.selectedType);

  // For electronics, we'll filter from all products
  let products = statusProducts;
  let isLoading = isStatusLoading;

  // If searching, use search results
  if (debouncedSearch.trim()) {
    products = searchResults;
    isLoading = isSearchLoading;
  }

  // Filter for electronics-related products
  if (products) {
    products = products.filter((product: any) => {
      const productName = product.name?.toLowerCase() || "";
      const productDesc = product.description?.toLowerCase() || "";
      const categoryName = product.category?.name?.toLowerCase() || "";
      
      // Check if product is electronics-related
      const isElectronics = 
        productName.includes("điện tử") ||
        productName.includes("điện thoại") ||
        productName.includes("phone") ||
        productName.includes("iphone") ||
        productName.includes("samsung") ||
        productName.includes("xiaomi") ||
        productName.includes("laptop") ||
        productName.includes("máy tính") ||
        productName.includes("tablet") ||
        productName.includes("ipad") ||
        productName.includes("camera") ||
        productName.includes("máy ảnh") ||
        productName.includes("tai nghe") ||
        productName.includes("loa") ||
        productName.includes("tivi") ||
        productName.includes("tv") ||
        productDesc.includes("điện tử") ||
        productDesc.includes("điện thoại") ||
        productDesc.includes("laptop") ||
        categoryName.includes("điện tử") ||
        categoryName.includes("điện thoại") ||
        categoryName.includes("máy tính");
      
      // Also check if electronics category is selected
      const categoryMatch = electronicsCategory && 
        (product.category?._id === electronicsCategory._id || 
         product.category === electronicsCategory._id);
      
      return isElectronics || categoryMatch;
    });
  }

  // Apply additional filters
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

  // Set electronics category as selected on mount if it exists
  useEffect(() => {
    if (electronicsCategory && !filterState.selectedCategories.includes(electronicsCategory._id)) {
      setFilterState({
        ...filterState,
        selectedCategories: [electronicsCategory._id],
      });
    }
  }, [electronicsCategory?._id]);

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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl">
              <Smartphone className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-primary">
                ĐIỆN TỬ
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Điện thoại, Laptop, Máy tính và các thiết bị điện tử
              </p>
            </div>
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

      {/* Badge for electronics products */}
      {products && products.length > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300 rounded-full w-fit">
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">
            {products.length} sản phẩm điện tử đang được đấu giá
          </span>
        </div>
      )}

      {/* Popular electronics brands */}
      <div className="flex flex-wrap gap-2">
        {["Apple", "Samsung", "Xiaomi", "Sony", "LG", "Dell", "HP", "Asus"].map((brand) => (
          <button
            key={brand}
            onClick={() => {
              const newBrands = filterState.selectedBrands.includes(brand)
                ? filterState.selectedBrands.filter(b => b !== brand)
                : [...filterState.selectedBrands, brand];
              setFilterState({ ...filterState, selectedBrands: newBrands });
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterState.selectedBrands.includes(brand)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {brand}
          </button>
        ))}
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

export default function ElectronicsCategoryPage() {
  return <ElectronicsCategoryContent />;
}