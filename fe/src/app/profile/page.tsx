"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar from "../../components/ui/ProfileSidebar";
// Mock data since the original exports were removed in refactor
const demoUserStats = {
  revenue: "125.000.000đ",
  highestBid: "45.000.000đ",
  sold: 12,
  auctioning: 5,
  upcoming: 3,
};

const demoBuyerStats = {
  totalSpent: "89.500.000đ",
  bidding: 8,
  won: 6,
  watching: 12,
};

import ProfileTabs from "./components/ProfileTabs";
import ProfileStats from "./components/ProfileStats";
import ProductTabs from "./components/ProductTabs";
import ProductControls from "./components/ProductControls";
import ProductList from "./components/ProductList";
import { useProfile, useUserStats } from "@/services/user";
import { useUserAuctionByStatus, useUserBuyAuction } from "@/services/bid";
import { STATUS_AUCTIONS } from "@/constants";
import { Bid } from "@/types";
import logger from "@/utils/logger";
import { useAuth } from "@/hooks";

type SortOption = "name" | "price" | "date" | "status";
type SortOrder = "asc" | "desc";

function ProfilePageContent() {
  const { profile, isLoading } = useProfile();
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("seller");
  const [productTab, setProductTab] = useState<STATUS_AUCTIONS>(
    STATUS_AUCTIONS.HAPPENING
  );
  const [buyerTab, setBuyerTab] = useState<"bidding" | "bought" | "watching">(
    "bidding"
  );
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Get user's sold products (as seller)
  const { auctions: soldProducts } = useUserAuctionByStatus(
    user?._id ?? "",
    productTab
  );
  
  // Get user's bought products (as buyer)
  const { auctionsBuy: boughtProducts } = useUserBuyAuction(user?._id ?? "");
  
  const { stats } = useUserStats();


  // Determine which products to show based on tab and buyerTab
  const currentProducts = useMemo(() => {
    let products: Bid[] = [];
    
    if (tab === "seller") {
      // Show sold products based on status
      products = soldProducts || [];
    } else if (tab === "buyer") {
      // Show bought products - extract auction data from orders
      if (boughtProducts && Array.isArray(boughtProducts)) {
        products = boughtProducts
          .filter(order => order.bid_id) // Only include orders with auction data
          .map(order => order.bid_id); // Extract the auction data from bid_id
      }
    }
    
    logger.debug('Profile page products to display', { productCount: products.length, tab, productTab });
    
    // Sort products based on current sort settings
    if (!products) return [];
    const sorted = [...products]?.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "price":
          aValue = parseFloat(a.price?.replace(/[^\d]/g, "") || "0");
          bValue = parseFloat(b.price?.replace(/[^\d]/g, "") || "0");
          break;
        case "status":
          aValue = a.status?.toLowerCase() || "";
          bValue = b.status?.toLowerCase() || "";
          break;
        case "date":
        default:
          // Use finishedTime for date sorting, fallback to name
          aValue = a.finishedTime || a.name?.toLowerCase() || "";
          bValue = b.finishedTime || b.name?.toLowerCase() || "";
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
  }, [tab, productTab, soldProducts, boughtProducts, sortBy, sortOrder]);

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

  const handleProductClick = (product: Bid) => {
    router.push(`/product/${product?._id}`);
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    product: Bid,
    action: string
  ) => {
    e.stopPropagation();
    if (tab === "buyer") {
      switch (action) {
        case "view":
        case "bid":
          router.push(`/product/${product?._id}`);
          break;
        case "unwatch":
          logger.info('User unwatched product', { productId: product?._id });
          break;
      }
    } else if (tab === "seller") {
      switch (action) {
        case "edit":
          router.push(`/product/${product?._id}`);
          break;
        case "delete":
          logger.info('User deleted product', { productId: product?._id });
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-64 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full max-w-[320px] mx-auto lg:mx-0 flex-shrink-0 h-fit">
          <ProfileSidebar profile={profile} isLoading={isLoading} />
        </div>
        {/* Right Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <ProfileTabs tab={tab} setTab={setTab as (tab: string) => void} />
          <ProfileStats isSeller={tab === "seller"} stats={stats} />
          <ProductTabs
            isSeller={tab === "seller"}
            productTab={productTab}
            setProductTab={setProductTab as (tab: string) => void}
            buyerTab={buyerTab}
            setBuyerTab={setBuyerTab as (tab: string) => void}
            stats={demoUserStats}
            buyerStats={demoBuyerStats}
          />
          <ProductControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            setShowSortMenu={setShowSortMenu}
            showSortMenu={showSortMenu}
            handleSort={handleSort as (option: string) => void}
            getSortLabel={getSortLabel}
            view={view}
            setView={setView as (view: string) => void}
          />
          <ProductList
            products={currentProducts}
            view={view}
            tab={tab}
            buyerTab={buyerTab}
            handleProductClick={handleProductClick}
            handleButtonClick={handleButtonClick}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfilePageContent />;
}
