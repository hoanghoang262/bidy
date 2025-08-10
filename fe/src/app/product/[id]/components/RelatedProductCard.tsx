"use client";
import Image from "next/image";
import Link from "next/link";
import { UnifiedProduct } from "@/components/home/unifiedMock";
import { Seller } from "@/components/home/sellersMock";
import { APP_ROUTES } from "@/constants/routes.constants";

interface RelatedProductCardProps {
  product: UnifiedProduct;
  seller: Seller;
  ctaType: "info" | "notify" | "bid";
}

const CTA_LABELS = {
  info: "Kiểm Tra Thông Tin",
  notify: "Đặt Thông Báo",
  bid: "Tham Gia Đấu Giá",
};

export default function RelatedProductCard({
  product,
  seller,
  ctaType,
}: RelatedProductCardProps) {
  return (
    <Link
      href={APP_ROUTES.PRODUCT_DETAIL(product.id)}
      className="w-[342px] bg-background rounded-2xl border border-border shadow flex flex-col overflow-hidden p-2 gap-2 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="w-full h-[240px] relative rounded-lg overflow-hidden">
        <Image
          src={product.image[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-2 flex-1">
        <div className="font-semibold text-foreground text-sm">{product.name}</div>
        <div className="text-xs text-foreground-secondary">
          Giá khởi điểm: {product.startingPrice}
        </div>
        {product.finalPrice && (
          <div className="text-xs text-foreground-secondary">
            Giá cuối cùng: {product.finalPrice}
          </div>
        )}
        {product.currentPrice && (
          <div className="text-xs text-foreground-secondary">
            Giá hiện tại: {product.currentPrice}
          </div>
        )}
        {product.buyNow && (
          <div className="text-xs text-foreground-secondary">
            Giá mua ngay: {product.buyNow}
          </div>
        )}
        <div className="text-xs text-foreground-secondary">
          Thời gian kết thúc: 20h 10m 5s
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Link
            href={`/seller/${seller?.id || ""}`}
            className="text-xs font-medium text-foreground-secondary hover:underline"
          >
            {seller?.name || "Tên người bán"}
          </Link>
        </div>
        <button
          className={`mt-2 w-full h-9 rounded-lg font-semibold text-white ${
            ctaType === "info"
              ? "bg-primary"
              : ctaType === "notify"
              ? "bg-primary"
              : "bg-primary"
          }`}
        >
          {CTA_LABELS[ctaType]}
        </button>
      </div>
    </Link>
  );
}
