import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UnifiedProduct } from "../home/unifiedMock";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import { APP_ROUTES } from "@/constants/routes.constants";

export default function FeatureCard({
  feature,
  className = "",
}: {
  feature: UnifiedProduct;
  className?: string;
}) {
  return (
    <Link
      href={APP_ROUTES.PRODUCT_DETAIL(feature.id)}
      className="w-full flex justify-center"
    >
      <div
        className={`bg-card w-full border-2 border-border rounded-xl shadow-md p-4 flex flex-col max-w-[88vw] md:max-w-[64vw] lg:max-w-[342px] gap-4 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      >
        {/* Image */}
        <div className="w-full h-[200px] bg-secondary rounded-md flex items-center justify-center overflow-hidden">
          <Image
            src={feature.image[0]}
            alt={feature.name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Info */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="text-base font-semibold text-foreground">
            {feature.name}
          </div>
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Giá khởi điểm:</span>
            <span>{feature.startingPrice}</span>
          </div>
          {feature.type === STATUS_AUCTIONS.INITIAL && (
            <div className="flex justify-between text-sm text-foreground-secondary">
              <span>Giá mua ngay:</span>
              <span>{feature.buyNow}</span>
            </div>
          )}
          {feature.type === STATUS_AUCTIONS.HAPPENING && (
            <>
              {/* <div className="flex justify-between text-sm text-foreground-secondary">
                <span>Giá hiện tại:</span>
                <span className="text-primary/80">
                  {feature.currentPrice}
                </span>
              </div> */}
              <div className="flex justify-between text-sm text-foreground">
                <span>Giá mua ngay:</span>
                <span>{feature.buyNow}</span>
              </div>
            </>
          )}
          {feature.type === STATUS_AUCTIONS.ENDED && (
            <>
              <div className="flex justify-between text-sm text-foreground-secondary">
                <span>Giá cuối cùng:</span>
                <span>{feature.finalPrice}</span>
              </div>
            </>
          )}
          {/* Status */}
          <div className="flex justify-between text-sm text-foreground-secondary">
            <span>Trạng thái:</span>
            <span>
              {feature.type === STATUS_AUCTIONS.HAPPENING
                ? "Đang đấu giá"
                : feature.type === STATUS_AUCTIONS.INITIAL
                ? "Sắp đấu giá"
                : "Đã kết thúc"}
            </span>
          </div>
          {/* Current price */}
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Giá hiện tại:</span>
            <span className="text-primary">{feature.currentPrice}</span>
          </div>
          {/* Seller */}
          <div className="flex items-center gap-2 text-sm text-foreground-secondary mt-2">
            <User className="text-primary" />
            <span>{feature.seller}</span>
          </div>
        </div>
        {/* CTA */}
        <button
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold flex items-center justify-center gap-2 mt-2 hover:bg-primary/80 transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          {feature.type === STATUS_AUCTIONS.HAPPENING
            ? "Tham Gia Đấu Giá"
            : feature.type === STATUS_AUCTIONS.INITIAL
            ? "Đặt Thông Báo"
            : "Kiểm Tra Thông Tin"}
        </button>
      </div>
    </Link>
  );
}
