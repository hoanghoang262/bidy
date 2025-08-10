import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full p-4 pt-8 pb-16 min-h-[831px] bg-gradient-to-b from-accent to-destructive flex flex-col items-center justify-center lg:pt-0 lg:pb-0 lg:min-h-[704px]">
      <div className="w-full max-w-[375px] mx-auto flex flex-col-reverse items-center justify-center gap-8 lg:max-w-[1120px] lg:flex-row lg:items-center lg:justify-center lg:gap-16 xl:gap-32 lg:h-[544px]">
        {/* Left: Texts and CTAs */}
        <div className="flex flex-col gap-8 h-fit items-center text-center w-full lg:w-1/2 lg:items-start lg:text-left lg:justify-center lg:h-full">
          <div className="flex flex-col gap-4 w-full">
            <h1 className="text-2xl font-bold text-foreground leading-tight w-full lg:text-5xl lg:leading-tight">
              Giành Ngay Những Món Hàng Độc Quyền Trong Các Phiên Đấu Giá Trực
              Tuyến
            </h1>
            <p className="text-base text-foreground-secondary max-w-md w-full lg:text-xl lg:max-w-none">
              Hơn 10.000 người đang đấu giá trực tiếp, đừng bỏ lỡ cơ hội sở hữu
              món hàng yêu thích của bạn!
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full h-fit lg:max-w-[378px]">
            <Link href={"/category"} className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg shadow flex items-center justify-center gap-2 text-base lg:text-lg">
              Bắt Đầu Đấu Giá Ngay
            </Link>
            {/* <Link href={"/category"} className="w-full h-12 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow flex items-center justify-center gap-2 text-base border border-border lg:text-lg">
              Khám Phá Các Phiên Đấu Giá
            </Link> */}
          </div>
        </div>
        {/* Right: Auction Image with Timer */}
        <div className="relative w-full h-[343px] rounded-2xl overflow-hidden border-2 border-border shadow-lg lg:w-[544px] lg:h-[544px] lg:flex-shrink-0">
          <Image
            src="/hero.png"
            alt="Auction Hero"
            fill
            className="object-cover rounded-2xl"
            priority
          />
          {/* Timer Overlay */}
          <div className="absolute top-4 right-4 flex flex-col items-center shadow lg:top-8 lg:right-8 lg:w-fit">
            <span className="text-xs font-semibold text-foreground bg-destructive w-full px-4 py-2 text-center rounded-t-xl lg:text-base">
              Đấu giá kết thúc sau
            </span>
            <span className="text-lg font-bold text-primary tracking-widest bg-card w-full px-4 py-2 text-center rounded-b-xl lg:text-2xl">
              08:31:01
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
