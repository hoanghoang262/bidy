"use client";

import RelatedProductCard from "./RelatedProductCard";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { Seller, sellers } from "@/components/home/sellersMock";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import { useProductById, useProductsByCategory } from "@/services/product";
import type { ApiProductData } from "@/types/product";
import type { UnifiedProduct } from "@/components/home/unifiedMock";

export default function RelatedByCategory() {
  const params = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const productId = Number.isNaN(Number(params.id))
    ? -1
    : parseInt(params.id as string, 10);
  
  const { product } = useProductById(params.id as string);
  const { categoryProducts } = useProductsByCategory(product?.category || "");
  
  if (!product) return null;
  
  // Filter out the current product and get products with same category
  const related = categoryProducts
    .filter((p: ApiProductData) => p.id !== productId)
    .map((p: ApiProductData) => ({
      id: typeof p.id === 'string' ? parseInt(p.id, 10) || 0 : p.id,
      name: p.name || "",
      image: p.image || p.images || ["/images.jpeg"],
      description: p.description || "",
      startingPrice: p.startingPrice?.toString() || "0",
      buyNow: p.buyNow?.toString() || undefined,
      currentPrice: p.currentPrice?.toString() || undefined,
      finalPrice: p.finalPrice?.toString() || undefined,
      timeLeft: p.timeLeft || undefined,
      endTime: p.endTime || undefined,
      seller: p.owner?.full_name || p.seller || "Không rõ người bán",
      sellerId: typeof p.owner?._id === 'string' ? parseInt(p.owner._id, 10) || 0 : typeof p.owner?._id === 'number' ? p.owner._id : typeof p.sellerId === 'number' ? p.sellerId : 0,
      category: p.category || undefined,
      condition: p.condition as "new" | "used" | "refurbished" | undefined,
      status: p.status as STATUS_AUCTIONS || STATUS_AUCTIONS.INITIAL,
      type: p.type as STATUS_AUCTIONS || STATUS_AUCTIONS.INITIAL,
      views: p.views || 0,
      createdAt: p.createdAt || undefined,
      updatedAt: p.updatedAt || undefined,
      isWatched: p.isWatched || false,
    }));

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (related.length === 0) return null;

  return (
    <>
      {related.length !== 0 ? (
        <section className="my-12">
          <h2 className="text-center text-2xl font-bold mb-6 text-foreground">
            SẢN PHẨM CÙNG DANH MỤC
          </h2>
          <div className="relative flex justify-center items-center">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background rounded-full shadow p-2 text-foreground"
            >
              <span>&lt;</span>
            </button>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide w-[80%]"
            >
              {related.map((p: UnifiedProduct, idx: number) => {
                const seller: Seller | undefined = sellers.find(
                  (s: Seller) => s.name === p.seller
                );
                return (
                  <div key={idx} className={idx > 0 ? "block" : ""}>
                    <RelatedProductCard
                      product={p}
                      seller={seller!}
                      ctaType={
                        p.type === STATUS_AUCTIONS.ENDED
                          ? "bid"
                          : p.type === STATUS_AUCTIONS.INITIAL
                          ? "notify"
                          : "bid"
                      }
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background rounded-full shadow p-2 text-foreground"
            >
              <span>&gt;</span>
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
