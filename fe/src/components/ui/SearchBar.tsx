"use client";

import React, { useState, useEffect, useRef } from "react";
import { useProductSearch } from "@/services/product";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants";

type ProductSearchResult = { id?: string; _id?: string; name: string };

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch products as user types
  const { searchResults, isLoading } = useProductSearch(searchValue.trim());

  // Show dropdown only if input is focused and has value
  useEffect(() => {
    if (searchValue.trim()) setShowDropdown(true);
    else setShowDropdown(false);
  }, [searchValue]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Handle search action
  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/category?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/category");
    }
  };

  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="hidden lg:flex w-full bg-background py-4 px-0 justify-center">
      <div className="w-full max-w-[1120px] flex flex-row gap-4 items-center">
        {/* Search input */}
        <div
          className="flex-1 flex items-center bg-card border border-border rounded-lg h-[45px] px-4 relative"
          ref={wrapperRef}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            className="mr-2"
          >
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
          <input
            className="flex-1 bg-transparent outline-none text-foreground placeholder-foreground text-base"
            placeholder="Nhập sản phẩm cần tìm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => searchValue.trim() && setShowDropdown(true)}
            autoComplete="off"
            onKeyDown={handleKeyDown}
          />
          {/* Dropdown for search results */}
          {showDropdown && (
            <div className="absolute left-0 top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-2 text-foreground-secondary">Đang tìm kiếm...</div>
              ) : searchValue.trim() && searchResults.length > 0 ? (
                searchResults.map((product: ProductSearchResult) => (
                  <Link
                    key={product.id ?? product._id ?? ''}
                    href={APP_ROUTES.PRODUCT_DETAIL(
                      (product.id ?? product._id) as string
                    )}
                    className="block px-4 py-2 hover:bg-accent-foreground text-foreground cursor-pointer"
                    onClick={() => setShowDropdown(false)}
                  >
                    {product.name}
                  </Link>
                ))
              ) : searchValue.trim() ? (
                <div className="px-4 py-2 text-foreground-secondary">Không tìm thấy sản phẩm</div>
              ) : null}
            </div>
          )}
        </div>
        {/* Search button */}
        <button
          className="h-[45px] px-8 bg-primary text-primary-foreground font-semibold rounded-lg shadow flex items-center justify-center text-base"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>
    </section>
  );
}
