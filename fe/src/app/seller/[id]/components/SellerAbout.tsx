import React from "react";
import { Seller } from "@/components/home/sellersMock";

interface SellerAboutProps {
  seller: Seller;
}

export default function SellerAbout({ seller }: SellerAboutProps) {
  return (
    <div className="w-full rounded-2xl bg-background border border-border shadow-sm p-6 flex flex-col gap-4">
      <div className="text-base font-semibold text-foreground mb-2">
        Về người bán
      </div>
      <div className="text-foreground-secondary text-base leading-relaxed">
        {seller.about ||
          "Người bán chưa cung cấp thông tin giới thiệu cá nhân."}
      </div>
    </div>
  );
}
