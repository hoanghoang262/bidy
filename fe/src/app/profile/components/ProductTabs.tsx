import React from "react";
import { STATUS_AUCTIONS } from "@/constants";

// Mock stats types since the original functions were removed in refactor
type SellerStats = {
  revenue: string;
  highestBid: string;
  sold: number;
  auctioning: number;
  upcoming: number;
};

type BuyerStats = {
  totalSpent: string;
  bidding: number;
  won: number;
  watching: number;
};

interface ProductTabsProps {
  isSeller: boolean;
  productTab: string;
  setProductTab: (tab: string) => void;
  buyerTab: string;
  setBuyerTab: (tab: string) => void;
  stats: SellerStats;
  buyerStats: BuyerStats;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  isSeller,
  productTab,
  setProductTab,
}) => {
  if (isSeller) {
    return (
      <div className="flex items-center gap-6 mt-2 mb-2">
        <button
          className={`cursor-pointer text-base font-semibold pb-2 px-2 border-b-2 transition-colors ${
            productTab === STATUS_AUCTIONS.HAPPENING
              ? "text-primary border-primary"
              : "text-foreground border-transparent"
          }`}
          onClick={() => setProductTab(STATUS_AUCTIONS.HAPPENING)}
        >
          Đang đấu giá
        </button>
        <button
          className={`cursor-pointer text-base font-semibold pb-2 px-2 border-b-2 transition-colors ${
            productTab === STATUS_AUCTIONS.ENDED
              ? "text-primary border-primary"
              : "text-foreground border-transparent"
          }`}
          onClick={() => setProductTab(STATUS_AUCTIONS.ENDED)}
        >
          Đã kết thúc
        </button>
        <button
          className={`cursor-pointer text-base font-semibold pb-2 px-2 border-b-2 transition-colors ${
            productTab === STATUS_AUCTIONS.INITIAL
              ? "text-primary border-primary"
              : "text-foreground border-transparent"
          }`}
          onClick={() => setProductTab(STATUS_AUCTIONS.INITIAL)}
        >
          Sắp bắt đầu
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-6 mb-2">
        {/* <button
          className={`text-base font-semibold pb-2 px-2 border-b-2 transition-colors ${
            buyerTab === "bidding"
              ? "text-primary border-primary"
              : "text-foreground border-transparent"
          }`}
          onClick={() => setBuyerTab("bidding")}
        >
          Đang đấu giá
        </button>
        <button
          className={`text-base font-semibold pb-2 px-2 border-b-2 transition-colors ${
            buyerTab === "bought"
              ? "text-primary border-primary"
              : "text-foreground border-transparent"
          }`}
          onClick={() => setBuyerTab("bought")}
        >
          Đã mua
        </button>
        <button
          className={`text-base font-semibold pb-2 px-2 border-b-2 transition-colors ${
            buyerTab === "watching"
              ? "text-primary border-primary"
              : "text-foreground border-transparent"
          }`}
          onClick={() => setBuyerTab("watching")}
        >
          Đang theo dõi
        </button> */}
      </div>
    );
  }
};

export default ProductTabs;
