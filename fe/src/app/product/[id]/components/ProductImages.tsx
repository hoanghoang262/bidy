"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4 w-full h-fit max-w-md mx-auto lg:mx-0 lg:w-[357px]">
      {/* Main Image */}
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-card">
        <Image
          src={images[selectedImage]}
          alt={productName}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-all duration-300 ease-in-out"
          priority
        />
      </div>
      {/* Thumbnails Row */}
      <div className="flex items-center gap-3 w-full">
        {images.slice(0, 3).map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-[64px] h-[64px] rounded-md overflow-hidden border-2 transition-all duration-200 ease-in-out bg-card ${
              selectedImage === idx
                ? "border-primary scale-105 shadow-md"
                : "border-border hover:border-primary/50 hover:scale-102"
            }`}
          >
            <Image
              src={img}
              alt={productName + " thumbnail"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        {images.length > 3 && (
          <button
            onClick={() => setSelectedImage(3)}
            className={`relative w-[64px] h-[64px] rounded-md overflow-hidden border-2 transition-all duration-200 ease-in-out bg-card flex items-center justify-center ${
              selectedImage === 3
                ? "border-primary scale-105 shadow-md"
                : "border-border hover:border-primary/50 hover:scale-102"
            }`}
          >
            <Image
              src={images[3]}
              alt="more"
              width={64}
              height={64}
              className="w-full h-full object-cover opacity-50"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg bg-black/40">
              +{images.length - 3}
            </span>
          </button>
        )}
      </div>
    </div>
  );
} 