import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { User, ArrowLeft } from "lucide-react";
import debounce from "lodash.debounce";
import { AdminBid } from "@/types";
import { getImageURL, getValidText, secureRandom } from "@/utils";
import PaginationCustom from "@/components/common/pagination-custom";

interface AdminProductListProps {
  selectedProduct?: AdminBid | null;
  setSelectedProduct?: (p: AdminBid | null) => void;
  paramsProduct: {
    page: number;
    limit: number;
    keyword: string;
  };
  setParamsProduct: (u: {
    page: number;
    limit: number;
    keyword: string;
  }) => void;
  currentPageProduct: number;
  totalPagesProducts: number;
  products: AdminBid[];
}

export default function AdminProductList({
  selectedProduct,
  setSelectedProduct,
  paramsProduct,
  setParamsProduct,
  currentPageProduct,
  totalPagesProducts,
  products,
}: AdminProductListProps) {
  const [selected, setSelected] = useState<AdminBid | null>(null);

  // If selectedProduct is provided as a prop, use it for the detail view
  useEffect(() => {
    if (selectedProduct) setSelected(selectedProduct);
    if (selectedProduct === null) setSelected(null);
  }, [selectedProduct]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((value: string) => {
      setParamsProduct({ ...paramsProduct, keyword: value, page: 1 });
    }, 500),
    []
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  const handleBack = () => {
    if (setSelectedProduct) setSelectedProduct(null);
    else setSelected(null);
  };

  if (selected) {
    // Detail view
    return (
      <div className="bg-background rounded-2xl shadow-lg border border-border p-4 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Chi tiết phiên đấu giá
          </h2>
          <button
            className="text-primary bg-background rounded-full p-2 hover:bg-secondary/80 transition"
            onClick={handleBack}
            aria-label="Quay lại"
          >
            <ArrowLeft />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-foreground">
            Tên Sản Phẩm
          </label>
          <input
            className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
            value={getValidText(selected.name)}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-foreground">
            Mô Tả Sản Phẩm
          </label>
          <textarea
            className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
            value="Lorem ipsum dolor sit amet consectetur. Sed diam nibh placerat nisi ut facilisi phasellus erat. Commodo tincidunt venenatis nunc malesuada pulvinar sagittis condimentum. Volutpat pulvinar velit augue viverra etiam consectetur erat semper. Uma vitae ac fringilla suspendisse turpis scelerisque amet mi tempor."
            readOnly
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-foreground">
            Phân Loại Sản Phẩm
          </label>
          <input
            className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
            value={getValidText(selected.category?.name)}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-foreground">
            Hình Ảnh Sản Phẩm
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {selected?.image?.map((img) => (
              <div
                key={secureRandom()}
                className="flex flex-col items-center border border-border rounded-lg p-2 bg-card"
              >
                <Image
                  src={getImageURL(img)}
                  alt={getValidText(img)}
                  width={80}
                  height={80}
                  className="rounded-md object-cover mb-2"
                />
                <div className="text-xs text-foreground font-semibold">
                  {getValidText(img)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              Thời gian còn lại
            </label>
            <input
              className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
              value={getValidText(selected?.time_remain)}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              Ngày Kết Thúc
            </label>
            <input
              className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
              value={getValidText(selected?.finishedTime)}
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              Giá Khởi Điểm
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={getValidText(selected?.price)}
                readOnly
              />
              <span className="text-foreground font-semibold">VND</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              Giá Mua Nhanh
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={getValidText(selected?.priceBuyNow)}
                readOnly
              />
              <span className="text-foreground font-semibold">VND</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold">
            Xoá Sản Phẩm Đấu Giá
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-background rounded-2xl shadow-lg border border-border p-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Danh sách các phiên đấu giá
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          onChange={onChange}
          className="flex-1 rounded-lg border border-border px-4 py-2 bg-card text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-0"
          placeholder="Tìm theo tên sản phẩm..."
        />
      </div>
      {products?.length > 0 ? (
        <div className="flex flex-col gap-6">
          {products?.map((p: AdminBid) => (
            <div
              key={p?._id ?? secureRandom()}
              className="flex flex-col lg:flex-row gap-4 bg-background rounded-xl border border-border p-4"
            >
              <div className="w-full md:w-56 h-40 md:h-56 lg:h-64 lg:w-80 relative">
                <Image
                  src={getImageURL(p?.image?.[0])}
                  alt={getValidText(p?.name)}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-foreground">
                    {getValidText(p?.name)}
                  </div>
                  <div className="text-sm text-foreground">
                    Giá khởi điểm: {getValidText(p?.price)}
                  </div>
                  <div className="text-sm text-foreground">
                    Giá mua ngay: {getValidText(p?.priceBuyNow)}
                  </div>
                  <div className="text-sm text-foreground">
                    Giá hiện tại: {getValidText(p?.price)}
                  </div>
                  <div className="text-sm text-foreground">
                    Thời gian còn lại: {getValidText(p?.time_remain)}
                  </div>
                  <div className="text-sm text-foreground">
                    Thời gian kết thúc: {getValidText(p?.finishedTime)}
                  </div>
                  <div className="text-sm text-foreground">
                    Trạng thái:{" "}
                    <span className={p.status}>{getValidText(p?.status)}</span>
                  </div>
                  <div className="text-sm text-foreground flex items-center gap-1">
                    <User className="text-primary" size={16} />{" "}
                    {getValidText(p?.owner?.full_name)}
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className={
                      "px-4 py-2 rounded-lg font-semibold bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80"
                    }
                    onClick={() =>
                      setSelectedProduct
                        ? setSelectedProduct(p)
                        : setSelected(p)
                    }
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center font-bold text-primary w-full">
          Không tìm thấy sản phẩm này!
        </div>
      )}
      {products?.length > 0 && (
        <PaginationCustom
          totalPages={totalPagesProducts}
          currentPage={currentPageProduct}
          onPageChange={(p) => setParamsProduct({ ...paramsProduct, page: p })}
        />
      )}
    </div>
  );
}
