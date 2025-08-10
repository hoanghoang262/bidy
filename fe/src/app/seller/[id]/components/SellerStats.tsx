import React from "react";
import { UnifiedProduct } from "@/components/home/unifiedMock";
import { STATUS_AUCTIONS } from "@/constants/app.enum";

interface SellerStatsProps {
  sellerProducts: UnifiedProduct[];
}

export default function SellerStats({ sellerProducts }: SellerStatsProps) {
  const done = sellerProducts.filter((p) => p.type === STATUS_AUCTIONS.ENDED).length;
  const now = sellerProducts.filter((p) => p.type === STATUS_AUCTIONS.HAPPENING).length;
  const soon = sellerProducts.filter((p) => p.type === STATUS_AUCTIONS.INITIAL).length;

  return (
    <div className="w-full rounded-2xl bg-background border border-border shadow-sm p-6 flex flex-col gap-4">
      <div className="text-base font-semibold text-foreground mb-2">
        Thống kê
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Done */}
        <div className="flex-1 bg-card rounded-lg border border-border shadow flex items-center gap-4 px-6 py-4 min-h-[60px]">
          <span className="text-2xl font-bold text-primary">{done}</span>
          <span className="text-foreground text-base font-medium">
            Sản phẩm đã bán
          </span>
        </div>
        {/* Now */}
        <div className="flex-1 bg-card rounded-lg border border-border shadow flex items-center gap-4 px-6 py-4 min-h-[60px]">
          <span className="text-2xl font-bold text-primary">{now}</span>
          <span className="text-foreground text-base font-medium">
            Sản phẩm đang đấu giá
          </span>
        </div>
        {/* Soon */}
        <div className="flex-1 bg-card rounded-lg border border-border shadow flex items-center gap-4 px-6 py-4 min-h-[60px]">
          <span className="text-2xl font-bold text-primary">{soon}</span>
          <span className="text-foreground text-base font-medium">
            Sản phẩm sắp bán
          </span>
        </div>
      </div>
    </div>
  );
}
