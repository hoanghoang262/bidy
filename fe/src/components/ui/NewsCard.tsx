import React from "react";
import Image from "next/image";

interface NewsCardProps {
  image: string;
  title: string;
  link: string;
}

export default function NewsCard({ image, title, link }: NewsCardProps) {
  return (
    <div className="flex flex-col bg-card border-2 border-border rounded-xl shadow-md overflow-hidden w-full max-w-[343px] mx-auto">
      <div className="relative w-full h-[311px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>
      <div className="flex flex-col gap-4 p-4 flex-1">
        <div className="font-semibold text-foreground text-lg leading-tight min-h-[46px]">
          {title}
        </div>
        <a
          href={link}
          className="inline-block text-primary font-semibold text-sm hover:underline mt-auto"
        >
          Đọc tiếp &gt;&gt;
        </a>
      </div>
    </div>
  );
}
