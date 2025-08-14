import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { UnifiedProduct } from "../home/unifiedMock";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import { APP_ROUTES } from "@/constants/routes.constants";

export default function ProductListCard({
  feature,
  className = "",
}: {
  feature: UnifiedProduct;
  className?: string;
}) {
  // Helper function to get the appropriate time display
  const getTimeDisplay = (product: UnifiedProduct) => {
    if (product.type === STATUS_AUCTIONS.HAPPENING) {
      return product.timeLeft || "Đang đấu giá";
    } else if (product.type === STATUS_AUCTIONS.ENDED) {
      return product.endTime || "Đã kết thúc";
    } else {
      return product.timeLeft || "Sắp đấu giá";
    }
  };

  // Helper function to get CTA text
  const getCTAText = (product: UnifiedProduct) => {
    if (product.type === STATUS_AUCTIONS.HAPPENING) {
      return "Đấu giá ngay";
    } else if (product.type === STATUS_AUCTIONS.ENDED) {
      return "Xem kết quả";
    } else {
      return "Xem chi tiết";
    }
  };

  // Fallbacks for missing fields
  const imageSrc =
    feature.image && feature.image.length > 0
      ? feature.image[0]
      : "/images.jpeg";
  const sellerName = feature.seller || "Không rõ người bán";
  const name = feature.name || "Sản phẩm không tên";
  const startingPrice = feature.startingPrice || "0";
  const currentPrice = feature.currentPrice || startingPrice;
  const finalPrice = feature.finalPrice || startingPrice;
  const buyNow = feature.buyNow;

  return (
    <Link href={APP_ROUTES.PRODUCT_DETAIL(feature.id)} className="block">
      <div
        className={`bg-card w-full border-2 border-border rounded-xl shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      >
        {/* Image - Left Side */}
        <div className="h-full w-1/3 bg-secondary rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image
            src={imageSrc}
            alt={name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info - Right Side */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-lg font-semibold text-foreground">{name}</div>

          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Giá khởi điểm:</span>
            <span>{startingPrice}</span>
          </div>

          {feature.type === STATUS_AUCTIONS.INITIAL && buyNow && (
            <div className="flex justify-between text-sm text-foreground-secondary">
              <span>Giá mua ngay:</span>
              <span>{buyNow}</span>
            </div>
          )}

          {feature.type === STATUS_AUCTIONS.HAPPENING && (
            <>
              <div className="flex justify-between text-sm text-foreground-secondary">
                <span>Giá hiện tại:</span>
                <span className="text-primary/80">{currentPrice}</span>
              </div>
              {buyNow && (
                <div className="flex justify-between text-sm text-foreground">
                  <span>Giá mua ngay:</span>
                  <span>{buyNow}</span>
                </div>
              )}
            </>
          )}

          {feature.type === STATUS_AUCTIONS.ENDED && (
            <>
              <div className="flex justify-between text-sm text-foreground-secondary">
                <span>Giá cuối cùng:</span>
                <span>{finalPrice}</span>
              </div>
            </>
          )}

          {/* Time */}
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Trạng thái:</span>
            <span>{getTimeDisplay(feature)}</span>
          </div>

          {/* Seller and Location */}
          <div className="flex items-center gap-4 text-sm text-foreground-secondary mt-2">
            <div className="flex items-center gap-2">
              <User className="text-primary" />
              <span>{sellerName}</span>
            </div>
          </div>
          {/* CTA - Right Side */}
          <div className="flex flex-col justify-center items-end flex-shrink-0">
            <button className="bg-primary text-primary-foreground rounded-lg py-2 px-8 font-semibold flex items-center justify-center gap-2 whitespace-nowrap w-fit">
              {getCTAText(feature)}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductGridCard({
  feature,
  className = "",
}: {
  feature: UnifiedProduct;
  className?: string;
}) {
  // Helper function to get the appropriate time display
  const getTimeDisplay = (product: UnifiedProduct) => {
    if (product.type === STATUS_AUCTIONS.HAPPENING) {
      return product.timeLeft || "Đang đấu giá";
    } else if (product.type === STATUS_AUCTIONS.ENDED) {
      return product.endTime || "Đã kết thúc";
    } else {
      return product.timeLeft || "Sắp đấu giá";
    }
  };

  // Helper function to get CTA text
  const getCTAText = (product: UnifiedProduct) => {
    if (product.type === STATUS_AUCTIONS.HAPPENING) {
      return "Đấu giá ngay";
    } else if (product.type === STATUS_AUCTIONS.ENDED) {
      return "Xem kết quả";
    } else {
      return "Xem chi tiết";
    }
  };

  // Fallbacks for missing fields
  const imageSrc =
    feature.image && feature.image.length > 0
      ? feature.image[0]
      : "/images.jpeg";
  const sellerName = feature.seller || "Không rõ người bán";
  const name = feature.name || "Sản phẩm không tên";
  const startingPrice = feature.startingPrice || "0";
  const currentPrice = feature.currentPrice || startingPrice;
  const finalPrice = feature.finalPrice || startingPrice;
  const buyNow = feature.buyNow;

  return (
    <Link href={APP_ROUTES.PRODUCT_DETAIL(feature.id)} className="block">
      <div
        className={`bg-card w-full border-2 border-border rounded-xl shadow-md p-4 flex flex-col gap-4 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      >
        {/* Image - Top */}
        <div className="w-full h-[200px] bg-secondary rounded-md flex items-center justify-center overflow-hidden">
          <Image
            src={imageSrc}
            alt={name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-base font-semibold text-foreground">{name}</div>

          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Giá khởi điểm:</span>
            <span>{startingPrice}</span>
          </div>

          {feature.type === STATUS_AUCTIONS.INITIAL && buyNow && (
            <div className="flex justify-between text-sm text-foreground-secondary">
              <span>Giá mua ngay:</span>
              <span>{buyNow}</span>
            </div>
          )}

          {feature.type === STATUS_AUCTIONS.HAPPENING && (
            <>
              <div className="flex justify-between text-sm text-foreground-secondary">
                <span>Giá hiện tại:</span>
                <span className="text-primary/80">{currentPrice}</span>
              </div>
              {buyNow && (
                <div className="flex justify-between text-sm text-foreground">
                  <span>Giá mua ngay:</span>
                  <span>{buyNow}</span>
                </div>
              )}
            </>
          )}

          {feature.type === STATUS_AUCTIONS.ENDED && (
            <>
              <div className="flex justify-between text-sm text-foreground-secondary">
                <span>Giá cuối cùng:</span>
                <span>{finalPrice}</span>
              </div>
            </>
          )}

          {/* Time */}
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>
              {feature.type === STATUS_AUCTIONS.INITIAL && "Thời gian đấu giá:"}
              {feature.type === STATUS_AUCTIONS.HAPPENING &&
                "Thời gian còn lại:"}
              {feature.type === STATUS_AUCTIONS.ENDED && "Trạng thái:"}
            </span>
            <span>{getTimeDisplay(feature)}</span>
          </div>

          {/* Seller and Location */}
          <div className="flex flex-col gap-2 text-sm text-foreground-secondary mt-2">
            <div className="flex items-center gap-2">
              <User className="text-primary" />
              <span>{sellerName}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold flex items-center justify-center gap-2 mt-2 hover:bg-primary/80 transition-colors"
        >
          {getCTAText(feature)}
        </button>
      </div>
    </Link>
  );
}
