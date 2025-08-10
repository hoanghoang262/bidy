"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { sellers } from "@/components/home/sellersMock";
import SellerInfo from "@/app/product/[id]/components/SellerInfo";
import SellerProducts from "./components/SellerProducts";
import SellerStats from "./components/SellerStats";
import SellerAbout from "./components/SellerAbout";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useProductsBySeller } from "@/services/product";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  
  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
    });
  }, [params]);
  const sellerId = parseInt(id, 10);
  const seller = sellers.find((s) => s.id === sellerId);
  
  if (!seller) notFound();
  
  const { sellerProducts, isLoading } = useProductsBySeller(id);

  // Don't render until we have the id
  if (!id) {
    return (
      <div className="min-h-screen bg-background pb-64 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-foreground-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-64 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-foreground-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-64 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-foreground-secondary">
            <li>
              <Link
                href={APP_ROUTES.HOME}
                className="hover:text-primary"
              >
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">
              {seller.name}
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl text-foreground font-bold mb-8 text-center lg:text-left">
          Hồ sơ người bán
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Seller Info Card */}
          <div className="w-full max-w-[342px] mx-auto lg:mx-0 lg:w-[342px] flex-shrink-0 h-fit">
            <SellerInfo
              seller={seller}
              productId={-1}
              productCode={"-"}
              status={""}
              startDate={""}
              lastUpdate={""}
              price={""}
              condition={""}
              location={seller.location}
              variant="profile"
            />
          </div>
          <div className="w-full flex flex-col gap-8 h-fit">
            {/* Seller's Products */}
            <SellerStats sellerProducts={sellerProducts} />
            <SellerAbout seller={seller} />
            <SellerProducts sellerProducts={sellerProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
