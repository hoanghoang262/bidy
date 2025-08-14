"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import { useProductById } from "@/services/product";
import { mapImageUrls } from "@/utils/image.utils";
import Breadcrumbs from "./components/Breadcrumbs";
import ProductImages from "./components/ProductImages";
import ProductTitleBookmark from "./components/ProductTitleBookmark";
import ProductDescription from "./components/ProductDescription";
import ProductQuickInfo from "./components/ProductQuickInfo";
import ProductCTA from "./components/ProductCTA";
import ProductBidList from "./components/ProductBidList";
import ProductSoonCTA from "./components/ProductSoonCTA";
import RelatedByCategory from "./components/RelatedByCategory";
import type { Bid } from "./components/ProductBidList";
import type { TopOwnership } from "@/types/bid";
import { useAuth } from "@/hooks";
import logger from "@/utils/logger";
import CountdownTimer from "@/components/ui/CountdownTimer";

const PRODUCT_CATEGORY = "Đồ điện tử";
const PRODUCT_BRAND = "Apple"; // Placeholder, ideally from data
const PRODUCT_CONDITION = "Mới 100%"; // Placeholder, ideally from data

function formatCurrency(amount: number) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  
  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
    });
  }, [params]);

  const { product: apiProduct, isLoading: apiLoading, refetchProduct } = useProductById(id);
  const { user: currentUser } = useAuth();

  // Refresh product data based on configuration
  useEffect(() => {
    const interval = setInterval(() => {
      refetchProduct();
    }, 30000); // 30 seconds - configurable via environment
    return () => clearInterval(interval);
  }, [refetchProduct]);
  
  // Don't render until we have the id
  if (!id) {
    return (
      <div className="min-h-screen bg-background pb-60 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-foreground-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  if (apiLoading) {
    return (
      <div className="min-h-screen bg-background pb-60 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-foreground-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  if (!apiProduct) {
    notFound();
  }

  // Calculate current price from highest bid or starting price
  const highestBid = apiProduct.top_ownerships && apiProduct.top_ownerships.length > 0 
    ? Math.max(...apiProduct.top_ownerships.map((bid: TopOwnership) => bid.amount || 0))
    : null;
  
  const currentPriceValue = highestBid || parseFloat(apiProduct.price || "0");

  // Map backend data to frontend format - only use fields that exist in backend
  const product = {
    id: apiProduct._id || apiProduct.id || 0,
    name: apiProduct.name || "",
    image: mapImageUrls(apiProduct.image),
    description: apiProduct.description || "",
    startingPrice: apiProduct.price?.toString() || "0",
    buyNow: apiProduct.priceBuyNow?.toString() || undefined,
    currentPrice: currentPriceValue.toString() || undefined,
    finalPrice: currentPriceValue.toString() || undefined,
    timeLeft: apiProduct.time_remain || undefined,
    endTime: apiProduct.finishedTime || undefined,
    category: apiProduct.category || undefined,
    status: apiProduct.status as STATUS_AUCTIONS || STATUS_AUCTIONS.INITIAL,
    type: apiProduct.status as STATUS_AUCTIONS || STATUS_AUCTIONS.INITIAL,
    startDate: apiProduct.startDate || undefined,
    createdAt: apiProduct.createdAt || undefined,
    updatedAt: apiProduct.updatedAt || undefined,
  };

  // For demo, use the same image for all thumbnails
  const images = mapImageUrls(product.image);

  // Calculate current price from product data
  const currentPrice = currentPriceValue;

  // Backend doesn't provide owner/seller information, so we skip seller display

  // Product status and pricing info
  // const status =
  //   product.type === STATUS_AUCTIONS.HAPPENING
  //     ? "Đang đấu giá"
  //     : product.type === STATUS_AUCTIONS.INITIAL
  //     ? "Sắp đấu giá"
  //     : "Đã kết thúc";

  logger.debug('Product page status check', { 
    productStatus: apiProduct.status,
    productId: id,
    availableStatuses: Object.keys(STATUS_AUCTIONS)
  });

  return (
    <div className="min-h-screen bg-background pb-60 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumbs productName={product.name} />

        {/* Main Info Section */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 p-0 h-fit">
            <div className="flex flex-col lg:flex-row gap-8 w-full rounded-2xl border border-border bg-card p-4 h-fit shadow-sm">
              {/* Images Column */}
              <ProductImages
                images={images}
                productName={product.name}
              />

              {/* Info Column */}
              <div className="flex-1 flex flex-col gap-8 h-fit">
                {/* Title + Bookmark */}
                <ProductTitleBookmark
                  productName={product.name}
                />

                {/* Description */}
                <ProductDescription
                  description={product.description || "Không có mô tả sản phẩm."}
                />

                {/* Quick Info Rows */}
                <ProductQuickInfo
                  category={PRODUCT_CATEGORY}
                  brand={PRODUCT_BRAND}
                  condition={PRODUCT_CONDITION}
                  starterPrice={product.startingPrice}
                  quickBuy={product.buyNow}
                  currentPrice={product.currentPrice}
                />
              </div>
            </div>
            
            {/* Countdown Timer Section */}
            {(product.startDate && product.endTime) && (
              <div className="w-full">
                <CountdownTimer
                  startDate={product.startDate}
                  finishedTime={product.endTime}
                  className="w-full max-w-lg mx-auto"
                />
              </div>
            )}
            
            {/* CTA Section - conditional by product.type */}
            {(product.type !== STATUS_AUCTIONS.INITIAL) && (
              <ProductCTA
                currentPrice={currentPrice}
                productId={product.id}
                productType={product.type}
                refetchProduct={refetchProduct}
                topOwnerships={apiProduct.top_ownerships || []}
                currentUser={currentUser}
                currentUserId={currentUser?._id || ""}
                productName={product.name}
                buyNowPrice={parseFloat(product.buyNow || "0")}
                auctionOwner={apiProduct.owner}
              />
            )}
            {product.type === STATUS_AUCTIONS.ENDED && (
              <ProductBidList
                bids={apiProduct.top_ownerships
                  ?.slice()
                  .sort((a: TopOwnership, b: TopOwnership) => b.amount - a.amount)
                  .map((bid: TopOwnership, index: number) => ({
                    id: index,
                    name: bid.user_name || "Unknown User",
                    avatar: "/images.jpeg",
                    time: "N/A",
                    amount: bid.amount || 0,
                  })) as Bid[] || []}
                formatCurrency={formatCurrency}
                type={STATUS_AUCTIONS.ENDED}
              />
            )}
            {product.type === STATUS_AUCTIONS.INITIAL && <ProductSoonCTA />}
          </div>
          {/* Seller Info Panel - Removed since backend doesn't provide owner data */}
        </div>

        {/* Related Products Sections */}
        {/* <RelatedBySeller /> */}
        <RelatedByCategory />
      </div>
    </div>
  );
}
