import { UserStats } from "@/types";
import { getValidText } from "@/utils";
import React from "react";

interface ProfileStatsProps {
  isSeller: boolean;
  stats: UserStats;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ isSeller, stats }) => {
  if (isSeller) {
    return (
      <div className="rounded-2xl bg-background border border-border shadow-md p-6 flex flex-col gap-4">
        <div className="text-base font-semibold text-foreground">Thống Kê</div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col-reverse lg:flex-1 bg-card rounded-lg border border-border shadow  items-center justify-between px-6 py-4 min-h-[60px]">
            <span className="text-base text-foreground">Tổng doanh thu</span>
            <span className="text-2xl font-bold text-primary">
              {getValidText(stats?.sell?.totalRevenue)}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 bg-card rounded-lg border border-border shadow flex flex-col items-center justify-center px-6 py-4 min-h-[60px]">
            <span className="text-2xl font-bold text-primary">
              {stats?.sell?.soldAmount}
            </span>
            <span className="text-foreground text-base font-medium">
              Sản phẩm đã bán
            </span>
          </div>
          <div className="flex-1 bg-card rounded-lg border border-border shadow flex flex-col items-center justify-center px-6 py-4 min-h-[60px]">
            <span className="text-2xl font-bold text-primary">
              {stats?.sell?.sellingAmount}
            </span>
            <span className="text-foreground text-base font-medium">
              Sản phẩm đang bán
            </span>
          </div>
          <div className="flex-1 bg-card rounded-lg border border-border shadow flex flex-col items-center justify-center px-6 py-4 min-h-[60px]">
            <span className="text-2xl font-bold text-primary">
              {stats?.sell?.willSellAmount}
            </span>
            <span className="text-foreground text-base font-medium">
              Sản phẩm sắp bán
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="rounded-2xl bg-background border border-border shadow-md p-6 flex flex-col gap-4">
        <div className="text-base font-semibold text-foreground">Thống Kê</div>
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="flex flex-col-reverse lg:flex-1 bg-card rounded-lg border border-border shadow  items-center justify-between px-6 py-4 min-h-[60px]">
            <span className="text-base text-foreground">Tổng chi tiêu</span>
            <span className="text-2xl font-bold text-primary">
              {getValidText(stats?.buy?.totalSpending)}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 bg-card rounded-lg border border-border shadow flex flex-col items-center justify-center px-6 py-4 min-h-[60px]">
            <span className="text-2xl font-bold text-primary">
              {stats?.buy?.boughtAmount}
            </span>
            <span className="text-foreground text-base font-medium">
              Sản phẩm đã mua
            </span>
          </div>
          <div className="flex-1 bg-card rounded-lg border border-border shadow flex flex-col items-center justify-center px-6 py-4 min-h-[60px]">
            <span className="text-2xl font-bold text-primary">
              {stats?.buy?.biddingAmount}
            </span>
            <span className="text-foreground text-base font-medium">
              Đang đấu giá
            </span>
          </div>
          <div className="flex-1 bg-card rounded-lg border border-border shadow flex flex-col items-center justify-center px-6 py-4 min-h-[60px]">
            <span className="text-2xl font-bold text-primary">
              {stats?.buy?.followAmount}
            </span>
            <span className="text-foreground text-base font-medium">
              Đang theo dõi
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default ProfileStats;
