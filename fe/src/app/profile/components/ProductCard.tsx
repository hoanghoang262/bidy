import React from "react";
import Image from "next/image";
import { User, Award, Trash2 } from "lucide-react";
import { Bid } from "@/types";
import { formatDateTime, getImageURL, getValidText } from "@/utils";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Bid;
  tab: string;
  buyerTab: string;
  handleProductClick: (product: Bid) => void;
  handleButtonClick: (
    e: React.MouseEvent,
    product: Bid,
    action: string
  ) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleProductClick,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <>
      <div
        className="flex flex-col md:flex-row gap-4 bg-background border border-border rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => handleProductClick(product)}
      >
        <Image
          src={getImageURL(product?.image?.[0])}
          alt={getValidText(product?.name)}
          width={128}
          height={128}
          className="w-full h-auto md:max-w-1/3 object-cover rounded-lg border border-border"
        />
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-base font-bold text-foreground">
            {product.name}
          </div>
          <div className="text-sm text-foreground">
            Giá khởi điểm:{" "}
            <span className="font-semibold text-foreground-secondary">
              {product.price}
            </span>
          </div>
          {product?.priceBuyNow && (
            <div className="text-sm text-foreground">
              Giá mua ngay:{" "}
              <span className="font-semibold text-foreground-secondary">
                {product.priceBuyNow}
              </span>
            </div>
          )}
          {product?.time_remain && (
            <div className="text-sm text-foreground">
              Thời gian còn lại:{" "}
              <span className="font-semibold text-foreground-secondary">
                {product.time_remain}
              </span>
            </div>
          )}
          {product?.price && (
            <div className="text-sm text-foreground">
              Giá hiện tại:{" "}
              <span className="font-semibold text-foreground">
                {product.price}
              </span>
            </div>
          )}
          {product?.finishedTime && (
            <div className="text-sm text-foreground">
              Kết thúc:{" "}
              <span className="font-semibold text-foreground">
                {formatDateTime(product?.finishedTime)}
              </span>
            </div>
          )}
          <div className="text-sm text-foreground flex items-center gap-1">
            <User className="w-4 h-4 text-primary" />
            {product.owner?.full_name || "Không rõ người bán"}
          </div>
          {!!product?.top_ownerships?.[0]?.user_id &&
            product?.top_ownerships?.[0]?.user_id === user?._id && (
              <div className="text-sm text-green-600 flex items-center gap-1">
                <Award className="w-4 h-4" />
                Người thắng cuộc
              </div>
            )}
        </div>
        <div className="flex flex-col gap-2 justify-end">
          {user?._id && product?.owner?._id === user?._id && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/product/${product._id}/edit`);
                }}
                className="hover:opacity-80 cursor-pointer bg-primary text-primary-foreground rounded-lg px-6 py-2 font-semibold text-sm shadow transition-colors"
              >
                Chỉnh Sửa
              </button>
              <button className="cursor-pointer bg-secondary text-secondary-foreground rounded-lg px-6 py-2 text-center flex-row justify-center font-semibold text-sm shadow hover:opacity-70 transition-colors flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                Xoá
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default ProductCard;
