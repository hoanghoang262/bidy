import React from "react";
import Image from "next/image";

export default function Vision() {
  return (
    <section className="w-full py-8">
      <div className="w-full mx-auto px-4 lg:px-16 py-4 lg:py-8 ">
        <div className="flex lg:flex-row-reverse flex-col gap-8">
          {/* Business people image */}
          <div className="aspect-16/9 w-full lg:w-[52%] rounded-2xl overflow-hidden">
            <Image
              src="/about.png"
              alt="Front view business man woman"
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and description */}
          <div className="flex flex-col w-full lg:w-[48%] gap-4 px-1 items-center justify-center">
            {/* Title */}
            <h2 className="text-2xl lg:text-4xl font-semibold leading-tight text-foreground">
              Sứ mệnh của chúng tôi
            </h2>

            {/* Description */}
            <p className="text-base lg:text-lg leading-relaxed text-foreground">
              Trao quyền cho cá nhân và doanh nghiệp bằng cách tạo ra trải
              nghiệm đấu giá nhanh chóng, công bằng và dễ tiếp cận cho mọi người
              tại Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
