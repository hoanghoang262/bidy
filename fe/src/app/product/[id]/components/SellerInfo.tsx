import Image from "next/image";
import Link from "next/link";
import { Seller } from "@/components/home/sellersMock";
import { Mail, Phone, Search } from "lucide-react";
import { SiFacebook, SiTiktok, SiZalo } from "@icons-pack/react-simple-icons";
import React from "react";

interface SellerInfoProps {
  seller: Seller;
  productId: number;
  productCode: string;
  status: string;
  startDate: string;
  lastUpdate: string;
  price: string;
  condition: string;
  location: string;
  variant?: "product" | "profile";
}

export default function SellerInfo({
  seller,
  productCode,
  status,
  startDate,
  lastUpdate,
  price,
  condition,
  location,
  variant = "product",
}: SellerInfoProps) {
  if (variant === "profile") {
    return (
      <aside className="w-full max-w-[342px] flex flex-col gap-4">
        {/* Info Card */}
        <div className="bg-card rounded-2xl shadow-sm p-4 flex flex-col gap-4 border border-border">
          <div className="flex flex-col gap-4">
            <div className="text-base font-semibold text-foreground text-center">
              Thông tin cá nhân
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src={seller.avatar}
                alt={seller.name}
                width={200}
                height={200}
                className="rounded-full object-cover w-[200px] h-[200px] border-4 border-primary"
              />
              <div className="text-lg font-bold text-foreground">
                {seller.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    fill={
                      i < Math.round(seller.rating)
                        ? "var(--accent)"
                        : "#E5E5E5"
                    }
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-xs text-foreground-secondary ml-1">
                  ({seller.ratingCount})
                </span>
              </div>
              <div className="text-xs text-foreground-secondary">
                Gia nhập năm {seller.joinYear}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs text-foreground-secondary">
                Hoạt động 5 phút trước
              </span>
            </div>
            <button className="w-full h-8 rounded-full bg-primary text-primary-foreground font-semibold mt-2">
              Thêm vào danh sách yêu thích
            </button>
          </div>
        </div>
        {/* Contact Info */}
        <div className="bg-card rounded-2xl shadow-sm p-4 flex flex-col gap-4 border border-border">
          <div className="text-base font-semibold text-foreground w-full text-center lg:text-left">
            Thông tin liên hệ
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <Mail className="text-primary" size={20} />
              <span className="text-sm text-foreground">
                {seller.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-primary" size={20} />
              <span className="text-sm text-foreground">
                {seller.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="text-primary" size={20} />
              <span className="text-sm text-foreground">
                {seller.location}
              </span>
            </div>
          </div>
        </div>
        {/* Share Card */}
        <div className="bg-card rounded-2xl shadow-sm p-4 flex flex-col justify-center items-center lg:items-start gap-4 border border-border">
          <div className="text-base font-semibold text-foreground">
            Chia sẻ hồ sơ
          </div>
          <div className="flex items-center gap-4 mt-2">
            {/* Social icons placeholder */}
            <span className="w-8 h-8 rounded-full text-foreground-secondary hover:bg-muted flex items-center justify-center">
              <SiFacebook />
            </span>
            <span className="w-8 h-8 rounded-full text-foreground-secondary hover:bg-muted flex items-center justify-center">
              <SiZalo />
            </span>
            <span className="w-8 h-8 rounded-full text-foreground-secondary hover:bg-muted flex items-center justify-center">
              <SiTiktok />
            </span>
          </div>
        </div>
        {/* Bottom Action Button */}
        <button className="w-full h-10 rounded-full border border-border text-primary font-semibold mt-2">
          Báo cáo hồ sơ
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-full max-w-[342px] flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
      {/* Product Info Card */}
      <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-4 border border-border">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-base font-medium text-foreground">
            Mã sản phẩm
          </span>
          <span className="text-base font-bold text-foreground">
            #{productCode}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-base font-medium text-foreground">
            Trạng thái
          </span>
          <span className="text-base font-bold text-primary">{status}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">
            Ngày bắt đầu
          </span>
          <span className="text-base text-foreground">
            {startDate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">
            Cập nhật mới nhất
          </span>
          <span className="text-base text-foreground">
            {lastUpdate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">
            Mức giá
          </span>
          <span className="text-base font-bold text-primary">{price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">
            Tình trạng
          </span>
          <span className="text-base text-foreground">
            {condition}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">
            Địa điểm
          </span>
          <span className="text-base text-foreground">
            {location}
          </span>
        </div>
      </div>
      {/* Seller Card */}
      <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-4 border border-border">
        <div className="flex flex-col items-center gap-2">
          <Link
            href={`/seller/${seller.id}`}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Image
              src={seller.avatar}
              alt={seller.name}
              width={100}
              height={100}
              className="rounded-full object-cover w-[100px] h-[100px] border-4 border-primary"
            />
            <span className="text-lg font-bold text-foreground">
              {seller.name}
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                fill={
                  i < Math.round(seller.rating)
                    ? "var(--accent)"
                    : "#E5E5E5"
                }
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className="text-xs text-foreground-secondary ml-1">
              ({seller.ratingCount})
            </span>
          </div>
          <span className="text-xs text-foreground-secondary">
            Gia nhập năm {seller.joinYear}
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <Mail className="text-primary" size={20} />
            <span className="text-sm text-foreground">
              {seller.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-primary" size={20} />
            <span className="text-sm text-foreground">
              {seller.phone}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="text-primary" size={20} />
            <span className="text-sm text-foreground">
              {seller.location}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold">
            Liên hệ người bán
          </button>
          <button className="w-full h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold border border-border">
            Lưu người bán
          </button>
          <button className="w-full h-10 rounded-full bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-semibold border border-primary">
            Báo cáo người bán
          </button>
        </div>
      </div>
    </aside>
  );
}
