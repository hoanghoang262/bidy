"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FeatureCard } from "../ui";
import { useFeaturedProducts } from "@/services/product";
import { APP_ROUTES } from "@/constants/routes.constants";
import { mapImageUrls } from "@/utils/image.utils";

import { STATUS_AUCTIONS } from "@/constants/app.enum";

export default function Features() {
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 9; // Show 9 items on lg screens
  const mobileItemsPerPage = 3; // Show 3 items on mobile
  
  const { featuredProducts, isLoading } = useFeaturedProducts();
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const currentItemsPerPage = isMobile ? mobileItemsPerPage : itemsPerPage;

  if (isLoading) {
    return (
      <section className="w-full p-8 px-0 lg:px-48 min-h-screen bg-gradient-to-b from-card to-accent-foreground flex flex-col gap-8">
        <div className="flex flex-col gap-2 items-center px-4">
          <h2 className="text-2xl font-semibold text-foreground">
            PHIÊN ĐẤU GIÁ NỔI BẬT
          </h2>
          <p className="text-center text-foreground-secondary text-base max-w-md">
            Những mặt hàng đang được săn đón nhiều nhất - đấu giá ngay để không bỏ lỡ.
          </p>
        </div>
        <div className="w-full flex flex-col h-fit gap-6 items-center lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
          <div className="text-center text-foreground-secondary">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full p-8 px-0 lg:px-48 min-h-screen bg-gradient-to-b from-card to-accent-foreground flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2 items-center px-4">
        <h2 className="text-2xl font-semibold text-foreground">
          PHIÊN ĐẤU GIÁ NỔI BẬT
        </h2>
        <p className="text-center text-foreground-secondary text-base max-w-md">
          Những mặt hàng đang được săn đón nhiều nhất - đấu giá ngay để không bỏ lỡ.
        </p>
      </div>
      {/* Cards */}
      <div className="w-full flex flex-col h-fit gap-6 items-center lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
        {featuredProducts.length === 0 ? (
          <div className="text-center text-foreground-secondary col-span-full">
            Không có sản phẩm đấu giá nào hiện tại. Hãy quay lại sau!
          </div>
        ) : (
          featuredProducts.slice(0, currentItemsPerPage).map((feature: {
            _id?: string;
            id?: string | number;
            name?: string;
            image?: string[];
            description?: string;
            price?: number;
            priceBuyNow?: number;
            time_remain?: string;
            finishedTime?: string;
            owner?: { full_name?: string; _id?: string | number };
            category?: string;
            status?: string;
            createdAt?: string;
            updatedAt?: string;
          }, idx: number) => {
          // Map API data to UnifiedProduct format
          const featureId = feature._id || feature.id;
          // Keep the original ID as string for API compatibility
          const productId = typeof featureId === 'string' ? featureId : featureId?.toString() || "0";
          
          const mappedFeature = {
            id: productId,
            name: feature.name || "",
            image: mapImageUrls(feature.image),
            description: feature.description || "",
            startingPrice: feature.price?.toString() || "0",
            buyNow: feature.priceBuyNow?.toString() || undefined,
            currentPrice: feature.price?.toString() || undefined,
            finalPrice: feature.price?.toString() || undefined,
            timeLeft: feature.time_remain || undefined,
            endTime: feature.finishedTime || undefined,
            seller: feature.owner?.full_name || "",
            sellerId: typeof feature.owner?._id === 'string' ? parseInt(feature.owner._id, 10) || 0 : (feature.owner?._id as number) || 0,
            category: feature.category || undefined,
            condition: "new" as "new" | "used" | "refurbished" | undefined,
            status: feature.status as STATUS_AUCTIONS || STATUS_AUCTIONS.INITIAL,
            type: feature.status as STATUS_AUCTIONS || STATUS_AUCTIONS.INITIAL,
            views: 0, // Backend doesn't have views field
            createdAt: feature.createdAt || undefined,
            updatedAt: feature.updatedAt || undefined,
            isWatched: false, // Backend doesn't have isWatched field
          };
          
          return (
            <FeatureCard
              key={idx}
              feature={mappedFeature}
            />
          );
          })
        )}
      </div>
      
      {/* CTA at bottom */}
      <div className="flex justify-center mt-8">
        <Link href={APP_ROUTES.CATEGORY} className="bg-secondary border-2 border-border rounded-lg shadow px-8 py-3 font-semibold text-secondary-foreground">
          Xem tất cả
        </Link>
      </div>
    </section>
  );
}
