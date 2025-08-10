import React from "react";
import { Filter, ChevronDown, List, Grid } from "lucide-react";

interface ProductControlsProps {
  sortBy: string;
  sortOrder: string;
  setShowSortMenu: (show: boolean) => void;
  showSortMenu: boolean;
  handleSort: (option: string) => void;
  getSortLabel: () => string;
  view: string;
  setView: (view: string) => void;
}

const ProductControls: React.FC<ProductControlsProps> = ({
  sortBy,
  sortOrder,
  setShowSortMenu,
  showSortMenu,
  handleSort,
  getSortLabel,
  view,
  setView,
}) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="relative">
      <button
        className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-foreground text-sm font-medium bg-background hover:bg-accent-foreground transition-colors"
        onClick={() => setShowSortMenu(!showSortMenu)}
      >
        <Filter className="w-4 h-4" />
        <span>Sắp xếp theo: {getSortLabel()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            showSortMenu ? "rotate-180" : ""
          }`}
        />
      </button>
      {showSortMenu && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[200px]">
          <button
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent-foreground transition-colors flex items-center justify-between"
            onClick={() => handleSort("name")}
          >
            <span>Tên sản phẩm</span>
            {sortBy === "name" && (
              <span className="text-primary">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-foreground text-sm hover:bg-accent-foreground transition-colors flex items-center justify-between"
            onClick={() => handleSort("price")}
          >
            <span>Giá</span>
            {sortBy === "price" && (
              <span className="text-primary">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-foreground text-sm hover:bg-accent-foreground transition-colors flex items-center justify-between"
            onClick={() => handleSort("date")}
          >
            <span>Ngày</span>
            {sortBy === "date" && (
              <span className="text-primary">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-foreground text-sm hover:bg-accent-foreground transition-colors flex items-center justify-between"
            onClick={() => handleSort("status")}
          >
            <span>Trạng thái</span>
            {sortBy === "status" && (
              <span className="text-primary">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
    <div className="flex-1" />
    <button
      className={`p-2 rounded-lg border ${
        view === "list"
          ? "bg-primary border-primary"
          : "bg-background border-border"
      }`}
      onClick={() => setView("list")}
    >
      <List
        className={`w-5 h-5 cursor-pointer ${
          view === "list" ? "text-primary-foreground" : "text-foreground"
        }`}
      />
    </button>
    <button
      className={`p-2 rounded-lg border md:block hidden ${
        view === "grid"
          ? "bg-primary border-primary"
          : "bg-background border-border"
      }`}
      onClick={() => setView("grid")}
    >
      <Grid
        className={`w-5 h-5 cursor-pointer ${
          view === "grid" ? "text-primary-foreground" : "text-foreground"
        }`}
      />
    </button>
  </div>
);

export default ProductControls;
