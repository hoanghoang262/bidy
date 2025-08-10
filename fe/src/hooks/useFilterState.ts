"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FilterState } from "@/components/product/SidebarFilter";
import { STATUS_AUCTIONS } from "@/constants/app.enum";

export function useFilterState() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") || STATUS_AUCTIONS.HAPPENING;
  const urlSearch = searchParams.get("search") || "";

  const initialFilterState: FilterState = {
    selectedType: urlType,
    selectedCategories: [],
    selectedBrands: [],
    selectedConditions: [],
    priceFrom: "",
    priceTo: "",
    search: urlSearch,
    sort: "",
  };

  const [filterState, setFilterState] =
    useState<FilterState>(initialFilterState);

  // Sync with URL changes
  useEffect(() => {
    const newType = searchParams.get("type") || STATUS_AUCTIONS.HAPPENING;
    const newSearch = searchParams.get("search") || "";
    if (newType !== filterState.selectedType) {
      setFilterState((prev) => ({
        ...prev,
        selectedType: newType,
      }));
    }
    if (newSearch !== filterState.search) {
      setFilterState((prev) => ({
        ...prev,
        search: newSearch,
      }));
    }
  }, [searchParams, filterState.selectedType, filterState.search]);

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  const updateFilter = (field: keyof FilterState, value: string | string[]) => {
    setFilterState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    filterState,
    setFilterState,
    resetFilters,
    updateFilter,
  };
}
