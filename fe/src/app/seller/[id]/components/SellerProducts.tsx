"use client";

import React, { useState, useMemo } from "react";
import { UnifiedProduct } from "@/components/home/unifiedMock";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Grid, List, ChevronDown, Filter } from "lucide-react";
import { STATUS_AUCTIONS } from "@/constants/app.enum";

interface SellerProductsProps {
  sellerProducts: UnifiedProduct[];
}

type SortOption = "name" | "price" | "date" | "status";
type SortOrder = "asc" | "desc";

const TYPE_TABS = [
  { key: STATUS_AUCTIONS.HAPPENING, label: "Đang diễn ra" },
  { key: STATUS_AUCTIONS.ENDED, label: "Đã hoàn thành" },
  { key: STATUS_AUCTIONS.INITIAL, label: "Sắp diễn ra" },
];

export default function SellerProducts({
  sellerProducts,
}: SellerProductsProps) {
  const router = useRouter();
  const [typeTab, setTypeTab] = useState<STATUS_AUCTIONS>(STATUS_AUCTIONS.HAPPENING);
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter products based on type only
  const filteredProducts = useMemo(() => {
    return sellerProducts.filter((p) => p.type === typeTab);
  }, [sellerProducts, typeTab]);

  // Sort products based on current sort settings
  const currentProducts = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.startingPrice.replace(/[^\d]/g, ""));
          bValue = parseFloat(b.startingPrice.replace(/[^\d]/g, ""));
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case "date":
        default:
          // Use endTime for date sorting, fallback to name
          aValue = a.endTime || a.name.toLowerCase();
          bValue = b.endTime || b.name.toLowerCase();
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return sorted;
  }, [filteredProducts, sortBy, sortOrder]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
  };

  const getSortLabel = () => {
    const labels = {
      name: "Tên sản phẩm",
      price: "Giá",
      date: "Ngày",
      status: "Trạng thái",
    };
    return labels[sortBy];
  };

  const handleProductClick = (product: UnifiedProduct) => {
    router.push(`/product/${product.id}`);
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    product: UnifiedProduct,
    action: string
  ) => {
    e.stopPropagation();

    switch (action) {
      case "edit":
        router.push(`/product/${product.id}`);
        break;
      case "delete":
        // Delete product action
        break;
      case "view":
        router.push(`/product/${product.id}`);
        break;
    }
  };

  const ProductCard = ({ product }: { product: UnifiedProduct }) => (
    <div
      className="flex flex-col md:flex-row gap-4 bg-background border border-border rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleProductClick(product)}
    >
      <div className="h-full w-full md:w-1/3 bg-secondary rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={128}
          height={160}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-base font-bold text-foreground">
            {product.name}
          </div>
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Giá khởi điểm:</span>
            <span>{product.startingPrice}</span>
          </div>
          {product.type === STATUS_AUCTIONS.INITIAL && product.buyNow && (
            <div className="flex justify-between text-sm text-foreground-secondary">
              <span>Giá mua ngay:</span>
              <span>{product.buyNow}</span>
            </div>
          )}
          {product.type === STATUS_AUCTIONS.HAPPENING && (
            <>
              {product.currentPrice && (
                <div className="flex justify-between text-sm text-foreground-secondary">
                  <span>Giá hiện tại:</span>
                  <span className="text-primary/80">
                    {product.currentPrice}
                  </span>
                </div>
              )}
              {product.buyNow && (
                <div className="flex justify-between text-sm text-foreground">
                  <span>Giá mua ngay:</span>
                  <span>{product.buyNow}</span>
                </div>
              )}
            </>
          )}
          {product.type === STATUS_AUCTIONS.ENDED && product.finalPrice && (
            <div className="flex justify-between text-sm text-foreground-secondary">
              <span>Giá cuối cùng:</span>
              <span>{product.finalPrice}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>
              Trạng thái:
            </span>
            <span>
              {product.timeLeft || product.endTime}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground">
              Giá hiện tại:
            </span>
            <span className="text-primary">
              {product.currentPrice}
            </span>
          </div>
          {/* <div className="flex items-center gap-2 text-sm text-foreground-secondary mt-2">
            <User className="text-primary" />
            <span>{product.seller}</span>
          </div> */}
     
        </div>
        <div className="flex flex-col gap-2 justify-end w-full items-end">
          <button
            className="w-full md:w-fit px-4 bg-primary text-primary-foreground rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors"
            onClick={(e) => handleButtonClick(e, product, "view")}
          >
            {product.type === STATUS_AUCTIONS.HAPPENING
              ? "Tham Gia Đấu Giá"
              : product.type === STATUS_AUCTIONS.INITIAL
              ? "Đặt Thông Báo"
              : "Kiểm Tra Thông Tin"}
          </button>
        </div>
      </div>
    </div>
  );

  const ProductGridCard = ({ product }: { product: UnifiedProduct }) => (
    <div
      className="bg-background border border-border rounded-2xl shadow p-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-48 object-cover rounded-lg border border-border"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-base font-bold text-foreground line-clamp-2">
          {product.name}
        </div>
        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>Giá khởi điểm:</span>
          <span>{product.startingPrice}</span>
        </div>
        {product.type === STATUS_AUCTIONS.HAPPENING && product.currentPrice && (
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Giá hiện tại:</span>
            <span className="text-primary/80">
              {product.currentPrice}
            </span>
          </div>
        )}
        {product.type === STATUS_AUCTIONS.ENDED && product.finalPrice && (
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Giá cuối cùng:</span>
            <span>{product.finalPrice}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-foreground-secondary">
          <span>
            Trạng thái:
          </span>
          <span>
            {product.timeLeft || product.endTime}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">
            Giá hiện tại:
          </span>
          <span className="text-primary">
            {product.currentPrice}
          </span>
        </div>

      </div>
      <div className="flex flex-col gap-2 justify-end">
        <button
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors"
          onClick={(e) => handleButtonClick(e, product, "view")}
        >
          {product.type === STATUS_AUCTIONS.HAPPENING
            ? "Tham Gia Đấu Giá"
            : product.type === STATUS_AUCTIONS.INITIAL
            ? "Đặt Thông Báo"
            : "Kiểm Tra Thông Tin"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full rounded-2xl bg-background border border-border shadow-md p-6">
      <div className="text-base font-semibold text-foreground mb-4">
        Sản phẩm
      </div>

      {/* Type buttons */}
      <div className="flex gap-2 mb-6">
        {TYPE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTypeTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeTab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground-secondary hover:bg-secondary/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* View toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-colors ${
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground-secondary hover:bg-secondary/80"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-colors ${
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground-secondary hover:bg-secondary/80"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 bg-secondary text-foreground-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Sắp xếp: {getSortLabel()}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showSortMenu ? "rotate-180" : ""
              }`}
            />
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[200px]">
              <button
                onClick={() => handleSort("name")}
                className="w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors text-foreground-secondary"
              >
                Tên sản phẩm
              </button>
              <button
                onClick={() => handleSort("price")}
                className="w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors text-foreground-secondary"
              >
                Giá
              </button>
              <button
                onClick={() => handleSort("date")}
                className="w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors text-foreground-secondary"
              >
                Ngày
              </button>
              <button
                onClick={() => handleSort("status")}
                className="w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors text-foreground-secondary"
              >
                Trạng thái
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products or Empty State */}
      {currentProducts.length === 0 ? (
        <div className="text-center text-foreground py-8">
          Không có sản phẩm nào trong danh mục này.
        </div>
      ) : (
        <>
          {/* Products */}
          {view === "list" ? (
            <div className="flex flex-col gap-4">
              {currentProducts.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product, idx) => (
                <ProductGridCard key={idx} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
