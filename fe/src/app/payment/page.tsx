"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { SiMastercard, SiVisa } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useSearchParams } from "next/navigation";
import axiosClient from '@/lib/axios-client';
import { useAuth } from '@/hooks';
import { toast } from 'sonner';
import logger from '@/utils/logger';

function PaymentContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const amount = searchParams.get("amount");
  const name = searchParams.get("name");
  const [tab, setTab] = useState("credit");
  //   const [saveInfo, setSaveInfo] = useState(false);
  const [agree, setAgree] = useState(false);
  const [qrTime, setQrTime] = useState(300); // 5 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const { user } = useAuth();

  React.useEffect(() => {
    if (tab !== "qr") return;
    if (qrTime <= 0) return;
    const timer = setInterval(() => {
      setQrTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [tab, qrTime]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus("loading");
    logger.info('Payment process initiated', { 
      userId: user?._id, 
      productId, 
      amount 
    });
    try {
      // Call backend to create order (only if user is logged in and productId/amount exist)
      if (user && productId && amount) {
        await axiosClient.post("/auction/order/create", {
          bid_id: productId,
          price: amount,
        });
        setPaymentStatus("success");
        toast.success("Thanh toán thành công! Đơn hàng đã được tạo.");
        setTimeout(() => {
          window.location.href = APP_ROUTES.PROFILE;
        }, 1800);
      } else {
        setPaymentStatus("error");
        toast.error("Thiếu thông tin người dùng hoặc sản phẩm.");
      }
    } catch {
      setPaymentStatus("error");
      toast.error("Bạn không phải người thắng cuộc hoặc có lỗi khi tạo đơn hàng!");
    }
  };

  return (
    <main className="min-h-screen flex gap-4 p-8 flex-col items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background pb-64 lg:pb-32">
      <div className="flex flex-row gap-4 justify-center w-full ">
        <p className="text-2xl lg:text-3xl font-bold text-primary w-fit text-center">
          THANH TOÁN
        </p>
      </div>
      {/* Payment Info Section */}
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 w-full lg:w-1/2 max-w-[90vw] mb-4">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg text-foreground">Sản phẩm: <span className="font-normal">{name || productId}</span></div>
          <div className="font-semibold text-lg text-foreground">Số tiền cần thanh toán: <span className="font-normal text-primary">{amount ? Number(amount).toLocaleString("vi-VN") + " VNĐ" : "N/A"}</span></div>
        </div>
      </div>
      <div className="bg-background border border-border rounded-2xl shadow-lg p-8 w-full lg:w-1/2 max-w-[90vw]">
        <div className="flex flex-col gap-2 items-center lg:items-start justify-between items-center mb-4">
          <div className="font-semibold text-xl text-foreground">Phương thức thanh toán</div>
          <div className="text-sm text-foreground-secondary">
            Chọn phương thức thanh toán
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("credit")}
            className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 border transition-colors ${
              tab === "credit"
                ? "border-primary text-primary bg-background"
                : "border-border text-foreground bg-card"
            }`}
          >
            Thẻ tín dụng
            {tab === "credit" && (
              <span className="ml-1 text-primary">✔</span>
            )}
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 border transition-colors ${
              tab === "qr"
                ? "border-primary text-primary bg-background"
                : "border-border text-foreground bg-card"
            }`}
          >
            Quét mã QR
            {tab === "qr" && <span className="ml-1 text-primary">✔</span>}
          </button>
        </div>
        {tab === "credit" && (
          <form className="flex flex-col gap-4" onSubmit={handlePayment}>
            <div className="flex items-center gap-4 mb-1">
              <SiVisa className="w-6 h-6 text-foreground" />
              <SiMastercard className="w-6 h-6 text-foreground" />
            </div>
            <label className="font-medium text-sm text-foreground">Chủ Thẻ Tín Dụng</label>
            <input
              placeholder="Nhập tên trên thẻ"
              className="p-2 rounded-lg border border-border mb-1 focus:outline-none focus:border-primary text-foreground"
            />
            <div className="flex gap-2 w-full">
              <input
                placeholder="Mã Số Thẻ"
                className="flex-2 p-2 w-full rounded-lg border border-border focus:outline-none focus:border-primary text-foreground"
              />
              <input
                placeholder="Ngày Hết Hạn"
                className="flex-1 p-2 w-full rounded-lg border border-border focus:outline-none focus:border-primary text-foreground"
              />
              <input
                placeholder="CVV/CVC"
                className="flex-1 p-2 w-full rounded-lg border border-border focus:outline-none focus:border-primary text-foreground"
              />
            </div>
            {/* <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="accent-primary"
                />
                <label
                  htmlFor="saveInfo"
                  className="text-primary text-sm"
                >
                  Lưu thông tin thanh toán cho lần sau
                </label>
              </div> */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="agree" className="text-primary text-sm">
                Tôi đồng ý với các điều khoản & điều kiện và chính sách bảo mật
              </label>
            </div>
            <div className="flex gap-4 mt-2">
              <Link
                href={APP_ROUTES.PROFILE}
                className="flex-1 text-center bg-secondary text-secondary-foreground rounded-lg py-2 font-semibold hover:bg-secondary/80 transition-colors"
              >
                Huỷ
              </Link>
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 font-semibold hover:bg-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={paymentStatus !== "idle"}
              >
                {paymentStatus === "idle" && "Thanh Toán"}
                {paymentStatus === "loading" && (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full"></span>
                    Đang thực hiện thanh toán
                  </span>
                )}
                {paymentStatus === "success" && "Thanh toán thành công"}
                {paymentStatus === "error" && "Thanh toán thất bại"}
              </button>
            </div>
          </form>
        )}
        {tab === "qr" && (
          <div className="flex flex-col items-center justify-center py-8 pb-2 gap-4">
            <Image src="/qr.svg" alt="VNPay QR" width={240} height={240} />
            {qrTime > 0 ? (
              <>
                <div className="text-lg font-medium text-foreground flex gap-2 items-center">
                  <span>Mã sẽ hết hạn sau:</span>
                  <span className="font-bold tabular-nums min-w-[48px] text-right">{`${String(
                    Math.floor(qrTime / 60)
                  ).padStart(2, "0")}:${String(qrTime % 60).padStart(
                    2,
                    "0"
                  )}`}</span>
                </div>
                <div className="flex gap-4 mt-2 w-full">
                  <Link
                    href={APP_ROUTES.PROFILE}
                    className="flex-1 text-center bg-secondary text-secondary-foreground rounded-lg py-2 font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    Huỷ
                  </Link>
                  <button
                    type="button"
                    className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 font-semibold hover:bg-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={paymentStatus !== "idle"}
                    onClick={() => {
                      setPaymentStatus("loading");
                      setTimeout(() => {
                        const isSuccess = Math.random() > 0.3;
                        setPaymentStatus(isSuccess ? "success" : "error");
                        setTimeout(() => {
                          window.location.reload();
                        }, 1800);
                      }, 1800);
                    }}
                  >
                    {paymentStatus === "idle" && "Thanh toán"}
                    {paymentStatus === "loading" && (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full"></span>
                        Đang thực hiện thanh toán
                      </span>
                    )}
                    {paymentStatus === "success" && "Thanh toán thành công"}
                    {paymentStatus === "error" && "Thanh toán thất bại"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-red-500">
                  Mã QR đã hết hạn
                </div>
                <div className="flex gap-4 mt-2 w-full">
                  <Link
                    href={APP_ROUTES.PROFILE}
                    className="flex-1 text-center bg-secondary text-secondary-foreground rounded-lg py-2 font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    Huỷ
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Loading fallback for payment page
const PaymentLoading = () => (
  <main className="min-h-screen bg-background">
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="h-8 bg-muted rounded w-48 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
        <div className="h-12 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  </main>
);

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  );
}
