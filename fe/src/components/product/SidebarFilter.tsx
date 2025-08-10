"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import { useAuctionCategories } from "@/services/bid";

const CATEGORY_OPTIONS = [
  { label: "Sắp đấu giá", value: STATUS_AUCTIONS.INITIAL },
  { label: "Đang đấu giá", value: STATUS_AUCTIONS.HAPPENING },
  { label: "Đã kết thúc", value: STATUS_AUCTIONS.ENDED },
];

const BRANDS = ["Samsung", "Sony", "LG", "Apple", "Bosch", "Siemens", "Mitsubishi"];
const CONDITIONS = ["Mới", "Như mới (98-99%)", "Đã qua sử dụng", "Cũ"];

export interface FilterState {
  selectedType: string;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedConditions: string[];
  priceFrom: string;
  priceTo: string;
  search: string;
  sort?: string;
}

interface SidebarFilterProps {
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
}

interface Category {
  _id: string;
  name: string;
  status?: boolean;
}

const FilterContent = React.memo(function FilterContent({
  filterState,
  handleCategoryTypeChange,
  handleCheckbox,
  updateFilter,
}: {
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
  handleCategoryTypeChange: (type: string) => void;
  handleCheckbox: (field: keyof FilterState, value: string) => void;
  updateFilter: (field: keyof FilterState, value: string) => void;
}) {
  // Fetch categories from API
  const { categories, isLoading: categoriesLoading } = useAuctionCategories();
  
  // Filter active categories
  const activeCategories = categories?.filter((cat: Category) => cat.status !== false) || [];

  return (
    <aside className="w-full max-w-[320px] flex-shrink-0 flex flex-col gap-8">
      {/* Danh mục filter */}
      <div>
        <div className="font-roboto font-semibold text-lg mb-4 text-foreground">
          Trạng thái đấu giá
        </div>
        <div className="bg-card border border-border rounded-lg shadow-md p-2 flex flex-col gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`w-full text-left rounded-lg px-3 py-2 font-inter text-base border transition-colors ${
                filterState.selectedType === opt.value
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-secondary text-foreground border-border hover:bg-secondary/80"
              }`}
              onClick={() => handleCategoryTypeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Bộ lọc */}
      <div className="flex flex-col gap-8">
        {/* Search */}
        <div>
          <div className="font-roboto font-semibold text-base mb-2 text-foreground">
            Tìm kiếm
          </div>
          <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2">
            <input
              className="flex-1 bg-transparent outline-none text-foreground placeholder-foreground-secondary text-base"
              placeholder="Nhập từ khoá..."
              value={filterState.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle
                cx="9"
                cy="9"
                r="7"
                stroke="var(--foreground)"
                strokeWidth="2"
              />
              <line
                x1="14.5"
                y1="14.5"
                x2="19"
                y2="19"
                stroke="var(--foreground)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        
        {/* Category from API */}
        <div>
          <div className="font-roboto font-semibold text-base mb-2 text-foreground">
            Danh mục sản phẩm
          </div>
          <div className="bg-card border border-border rounded-lg shadow-md p-2 flex flex-col gap-2 max-h-64 overflow-y-auto">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
              </div>
            ) : activeCategories.length > 0 ? (
              activeCategories.map((cat: Category) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-secondary/50 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filterState.selectedCategories.includes(cat._id)}
                    onChange={() => handleCheckbox("selectedCategories", cat._id)}
                    className="accent-primary w-5 h-5 rounded border border-border"
                  />
                  <span className="text-foreground text-sm font-inter line-clamp-1" title={cat.name}>
                    {cat.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                Không có danh mục
              </p>
            )}
          </div>
        </div>
        
        {/* Brand */}
        <div>
          <div className="font-roboto font-semibold text-base mb-2 text-foreground">
            Thương hiệu
          </div>
          <div className="bg-card border border-border rounded-lg shadow-md p-2 flex flex-col gap-2 max-h-48 overflow-y-auto">
            {BRANDS.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-secondary/50 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filterState.selectedBrands.includes(brand)}
                  onChange={() => handleCheckbox("selectedBrands", brand)}
                  className="accent-primary w-5 h-5 rounded border border-border"
                />
                <span className="text-foreground text-base font-inter">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Condition */}
        <div>
          <div className="font-roboto font-semibold text-base mb-2 text-foreground">
            Tình trạng
          </div>
          <div className="bg-card border border-border rounded-lg shadow-md p-2 flex flex-col gap-2">
            {CONDITIONS.map((cond) => (
              <label
                key={cond}
                className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-secondary/50 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filterState.selectedConditions.includes(cond)}
                  onChange={() => handleCheckbox("selectedConditions", cond)}
                  className="accent-primary w-5 h-5 rounded border border-border"
                />
                <span className="text-foreground text-base font-inter">
                  {cond}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div>
          <div className="font-roboto w-full font-semibold text-base mb-2 text-foreground">
            Khoảng giá
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 w-full">
              <input
                type="number"
                min={0}
                placeholder="Từ..."
                value={filterState.priceFrom}
                onChange={(e) => updateFilter("priceFrom", e.target.value)}
                className="flex-1 w-full bg-card border border-border rounded-lg px-3 py-2 text-base text-foreground placeholder-muted"
              />
              <span className="text-foreground-secondary text-sm">VND</span>
            </div>
            <div className="flex items-center gap-2 w-full">
              <input
                type="number"
                min={0}
                placeholder="Tới..."
                value={filterState.priceTo}
                onChange={(e) => updateFilter("priceTo", e.target.value)}
                className="flex-1 w-full bg-card border border-border rounded-lg px-3 py-2 text-base text-foreground placeholder-muted"
              />
              <span className="text-foreground-secondary text-sm">VND</span>
            </div>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(filterState.selectedCategories.length > 0 || 
          filterState.selectedBrands.length > 0 || 
          filterState.selectedConditions.length > 0 ||
          filterState.priceFrom || 
          filterState.priceTo) && (
          <button
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            onClick={() => {
              setFilterState({
                ...filterState,
                selectedCategories: [],
                selectedBrands: [],
                selectedConditions: [],
                priceFrom: "",
                priceTo: "",
              });
            }}
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </aside>
  );
});

const SidebarFilter = React.memo(function SidebarFilter({
  filterState,
  setFilterState,
}: SidebarFilterProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Checkbox handler
  const handleCheckbox = (field: keyof FilterState, value: string) => {
    const currentArray = filterState[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];

    setFilterState({
      ...filterState,
      [field]: newArray,
    });
  };

  const updateFilter = (field: keyof FilterState, value: string) => {
    setFilterState({
      ...filterState,
      [field]: value,
    });
  };

  // Handle category type selection with URL update
  const handleCategoryTypeChange = (type: string) => {
    // Update the filter state
    setFilterState({
      ...filterState,
      selectedType: type,
    });

    // Update the URL
    router.push(`/category?type=${type}`);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        className="lg:hidden w-full mb-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
        onClick={() => setIsMobileOpen(true)}
      >
        Bộ lọc
      </button>

      {/* Mobile Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 lg:hidden">
          <div className="bg-background rounded-lg shadow-xl w-[90%] max-w-sm max-h-[88vh] overflow-y-auto p-4 relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 z-10"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Đóng bộ lọc"
            >
              <X className="w-6 h-6" />
            </button>
            <FilterContent
              filterState={filterState}
              setFilterState={setFilterState}
              handleCategoryTypeChange={handleCategoryTypeChange}
              handleCheckbox={handleCheckbox}
              updateFilter={updateFilter}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterContent
          filterState={filterState}
          setFilterState={setFilterState}
          handleCategoryTypeChange={handleCategoryTypeChange}
          handleCheckbox={handleCheckbox}
          updateFilter={updateFilter}
        />
      </div>
    </>
  );
});

export default SidebarFilter;