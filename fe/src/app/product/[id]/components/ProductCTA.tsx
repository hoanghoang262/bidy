"use client";

import { useAuth } from "@/hooks";
import React, { useState, useEffect } from "react";
import { STATUS_AUCTIONS } from "@/constants/app.enum";
import {
  fetchBid,
  fetchBuyNow,
  fetchAutoBid,
} from "@/services/product/product.fetcher";
import { toast } from "sonner";
import logger from "@/utils/logger";
import axiosClient from "@/lib/axios-client";
import { TopOwnership } from "@/types/bid";
import { User } from "@/types/user";

interface ProductCTAProps {
  currentPrice: number;
  productId?: number;
  productType?: string;
  refetchProduct?: () => void;
  topOwnerships?: TopOwnership[];
  currentUser?: User | null;
  currentUserId?: string;
}

export default function ProductCTA({
  currentPrice,
  productId,
  productType,
  refetchProduct,
  topOwnerships = [],
  currentUser,
  productName,
  currentUserId,
}: ProductCTAProps & { productName?: string }) {
  const [bidInput, setBidInput] = useState("");
  const [bidError, setBidError] = useState("");
  const [autoIncrement, setAutoIncrement] = useState("");
  const [autoLimit, setAutoLimit] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  const { user } = useAuth();

  // Determine winner for ended products
  const sortedOwnerships = [...(topOwnerships || [])].sort((a, b) => b.amount - a.amount);
  const winnerUserId = sortedOwnerships[0]?.user_id;
  const winnerAmount = sortedOwnerships[0]?.amount;
  const isWinner = String(currentUserId) === String(winnerUserId);
  logger.debug('ProductCTA winner check', { 
    isWinner, 
    winnerUserId: String(winnerUserId), 
    currentUserId: String(currentUserId)
  });

  // Check if user has already paid for this auction
  useEffect(() => {
    if (productId && currentUser && productType === STATUS_AUCTIONS.ENDED) {
      setIsCheckingPayment(true);
      axiosClient.get(`/auction/order/${productId}/check`)
        .then(response => {
          setHasPaid(response.data.hasOrder);
        })
        .catch(err => {
          logger.error('Error checking order status', err, { productId, userId: currentUserId });
        })
        .finally(() => {
          setIsCheckingPayment(false);
        });
    } else {
      setIsCheckingPayment(false);
    }
  }, [productId, currentUser, productType, currentUserId]);

  if (productType === STATUS_AUCTIONS.ENDED) {
    if (isWinner) {
      if (isCheckingPayment) {
        return (
          <div className="flex flex-col items-center w-full mt-4">
            <div className="w-full max-w-3xl h-12 rounded-full bg-gray-500 text-white font-bold text-lg flex items-center justify-center">
              Đang kiểm tra trạng thái thanh toán...
            </div>
          </div>
        );
      }
      
      if (hasPaid) {
        return (
          <div className="flex flex-col items-center w-full mt-4">
            <div className="w-full max-w-3xl h-12 rounded-full bg-green-500 text-white font-bold text-lg flex items-center justify-center">
              Đã thanh toán thành công!
            </div>
            <div className="text-xs text-foreground-secondary mt-2 text-center">
              Cảm ơn bạn đã mua sản phẩm này
            </div>
          </div>
        );
      } else {
        // Show payment button for winner who hasn't paid
        const paymentUrl = `/payment?productId=${productId}&amount=${winnerAmount}&name=${encodeURIComponent(
          productName || ""
        )}`;
        return (
          <div className="flex flex-col items-center w-full mt-4">
            <a
              href={paymentUrl}
              className="w-full max-w-3xl h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-100 text-primary font-bold text-lg shadow-none transition-all flex items-center justify-center"
              style={{
                background: "linear-gradient(90deg, #FFE700 0%, #FFFADF 100%)",
              }}
            >
              Thanh toán ngay ({winnerAmount?.toLocaleString("vi-VN")} VNĐ)
            </a>
            <div className="text-xs text-foreground-secondary mt-2 text-center">
              *Quý khách vui lòng thanh toán trong vòng 24h sau khi kết thúc phiên
              đấu giá để chính thức sở hữu sản phẩm mong muốn
            </div>
          </div>
        );
      }
    } else {
      // Hide CTA for non-winners
      return null;
    }
  }

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt giá");
      logger.warn('Unauthenticated user attempted to place bid', { productId });
      return;
    }

    logger.info('User placing bid', { userId: user._id, productId, bidInput });

    const bidAmount = parseInt(bidInput);
    if (!bidAmount || bidAmount <= currentPrice) {
      setBidError(
        `Bid phải lớn hơn ${currentPrice.toLocaleString("vi-VN")} VNĐ`
      );
      return;
    }
    setBidError("");
    if (productId) {
      fetchBid(productId.toString(), bidAmount)
        .then(() => {
          setBidInput("");
          toast.success("Đặt giá thành công!");
          if (refetchProduct) refetchProduct();
        })
        .catch((error) => {
          logger.error('Bid placement failed', error, { userId: user._id, productId, bidAmount });
          setBidError("Đặt giá thất bại. Vui lòng thử lại.");
          toast.error("Đặt giá thất bại. Vui lòng thử lại.");
        });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua nhanh");
      return;
    }

    if (productId) {
      fetchBuyNow(productId.toString())
        .then(() => {
          toast.success("Mua nhanh thành công!");
          if (refetchProduct) refetchProduct();
        })
        .catch(() => {
          setBidError("Mua nhanh thất bại. Vui lòng thử lại.");
          toast.error("Mua nhanh thất bại. Vui lòng thử lại.");
        });
    }
  };

  const handleAutoBid = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đấu giá tự động");
      return;
    }

    const increment = parseInt(autoIncrement);
    const limit = parseInt(autoLimit);
    if (!increment || !limit) {
      setBidError("Vui lòng nhập mức tăng giá và giới hạn tối đa hợp lệ.");
      toast.error("Vui lòng nhập mức tăng giá và giới hạn tối đa hợp lệ.");
      return;
    }
    setBidError("");
    if (productId) {
      fetchAutoBid(productId.toString(), increment, limit)
        .then(() => {
          setAutoIncrement("");
          setAutoLimit("");
          toast.success("Đấu giá tự động thành công!");
          if (refetchProduct) refetchProduct();
        })
        .catch(() => {
          setBidError("Đấu giá tự động thất bại. Vui lòng thử lại.");
          toast.error("Đấu giá tự động thất bại. Vui lòng thử lại.");
        });
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleBidSubmit}>
      {/* Manual Bid Row */}
      <div className="w-full grid grid-cols-3 md:flex-row gap-4 md:gap-8 items-center border-b border-border pb-4">
        <button
          type="submit"
          className="w-full flex-1 h-12 rounded-lg bg-gradient-to-r from-accent to-accent-foreground text-foreground font-semibold text-base shadow-none transition-all"
        >
          Đấu giá
        </button>
        <input
          type="number"
          placeholder="Nhập số tiền..."
          className="w-full flex-1 h-12 rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={bidInput}
          onChange={(e) => setBidInput(e.target.value)}
          min={currentPrice + 1}
        />
        <button
          type="button"
          className="w-full flex-1 h-12 rounded-lg bg-gradient-to-r from-accent to-primary text-foreground font-semibold text-base shadow-none transition-all"
          onClick={handleBuyNow}
        >
          Mua nhanh
        </button>
      </div>
      {bidError && <div className="text-primary text-sm mt-1">{bidError}</div>}
      {/* Auto Bid Row */}
      <div className="w-full grid grid-cols-3 md:flex-row gap-4 md:gap-8 items-center">
        <input
          type="number"
          placeholder="Mức tăng giá"
          className="w-full flex-1 h-12 rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={autoIncrement}
          onChange={(e) => setAutoIncrement(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giới hạn tối đa"
          className="w-full flex-1 h-12 rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={autoLimit}
          onChange={(e) => setAutoLimit(e.target.value)}
        />
        <button
          type="button"
          className="w-full flex-1 h-12 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-foreground font-semibold text-base shadow-none transition-all"
          onClick={handleAutoBid}
        >
          Đấu giá tự động
        </button>
      </div>
    </form>
  );
}
