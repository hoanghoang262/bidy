/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAuctionById,
  useAuctionCategories,
  useUpdateProduct,
} from "@/services/bid";
import { getImageURL, getValidText, secureRandom } from "@/utils";
import { AuctionCategory, UpdateProductBody } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  category: z.string().min(1, "Loại sản phẩm là bắt buộc"),
  finishedTime: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  price: z.string().min(1, "Giá khởi điểm là bắt buộc"),
  priceBuyNow: z.string().min(1, "Giá mua nhanh là bắt buộc"),
  image: z.array(z.union([z.instanceof(File), z.string()])),
});

type FormData = z.infer<typeof schema>;

const initialForm: FormData = {
  name: "",
  description: "",
  category: "",
  finishedTime: "",
  price: "",
  priceBuyNow: "",
  image: [],
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { product } = useAuctionById(id as string);
  const { categories } = useAuctionCategories();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { mutate: updateProduct } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialForm,
  });

  useEffect(() => {
    if (!product || !product.image || categories?.length === 0) return;

    setImagePreviews(product?.image ?? []);
    reset({
      name: getValidText(product.name),
      description: getValidText(product.description),
      category: getValidText(product.category),
      finishedTime: getValidText(product.finishedTime?.slice(0, 10)),
      price: getValidText(product.price),
      priceBuyNow: getValidText(product.priceBuyNow),
      image: product?.image ?? [],
    });
  }, [product, categories, reset]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      const currentFiles = watch("image") || [];
      const updatedFiles = [...currentFiles, ...files];
      onChange(updatedFiles);
    }
  };

  const onSubmit = async (values: FormData) => {
    const formData = buildFormData(values);
    updateProduct({ id: (id as string) ?? "", formData });
    reset(values);
  };

  const buildFormData = (payload: UpdateProductBody) => {
    const formData = new FormData();
    formData.append("name", payload.name ?? "");
    formData.append("price", payload.price ?? "");
    formData.append("priceBuyNow", payload.priceBuyNow ?? "");
    formData.append("category", payload.category ?? "");
    formData.append("description", payload.description ?? "");
    formData.append("finishedTime", payload.finishedTime ?? "");
    payload?.image?.forEach((item) => formData.append("image", item));
    return formData;
  };

  const handleCancel = () => {
    router.push(`/product/${id}`);
  };

  return (
    <main className="min-h-screen flex gap-4 p-8 flex-col items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background pb-64 lg:pb-32">
      <div className="max-w-4xl mx-auto my-10 p-8 bg-card rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Chỉnh sửa sản phẩm đấu giá
        </h1>
        <p className="text-sm text-foreground-secondary mb-8">
          Cập nhật thông tin sản phẩm của bạn
        </p>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="font-semibold text-foreground">
              Tên Sản Phẩm <span className="text-primary">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="Tên sản phẩm"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-primary text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Mô Tả Sản Phẩm <span className="text-primary">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Mô tả sản phẩm"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
            />
            {errors.description && (
              <p className="text-primary text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Loại Sản Phẩm <span className="text-primary">*</span>
            </label>
            <select
              {...register("category")}
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Chọn loại sản phẩm</option>
              {categories?.map((category: AuctionCategory) => (
                <option key={category?._id} value={getValidText(category?._id)}>
                  {getValidText(category?.name)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-primary text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <Controller
            name="image"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <div>
                <label className="font-semibold text-foreground">
                  Hình Ảnh Sản Phẩm <span className="text-primary">*</span>
                </label>

                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px] bg-background overflow-x-auto">
                  <div className="flex gap-4 overflow-x-auto w-full pb-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={secureRandom()} className="relative shrink-0">
                        <Image
                          src={getImageURL(preview)}
                          alt={`Preview ${index}`}
                          width={160}
                          height={120}
                          className="rounded border border-muted"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPreviews = [...imagePreviews];
                            newPreviews.splice(index, 1);
                            setImagePreviews(newPreviews);
                            const newFiles = [...(value || [])];
                            newFiles.splice(index, 1);
                            onChange(newFiles);
                          }}
                          title="Xoá ảnh"
                          className="absolute top-1 right-1 bg-primary cursor-pointer text-background rounded-full w-5 h-5 text-xs flex items-center justify-center hover:scale-110 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, onChange)}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded cursor-pointer text-sm font-semibold hover:bg-primary/80 transition"
                  >
                    {imagePreviews.length > 0 ? "Thêm ảnh khác" : "Thêm ảnh"}
                  </label>
                </div>

                {errors.image && (
                  <p className="text-primary text-sm mt-1">
                    {errors.image.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />

          <div>
            <label className="font-semibold text-foreground">
              Ngày Kết Thúc <span className="text-primary">*</span>
            </label>
            <input
              {...register("finishedTime")}
              type="date"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.finishedTime && (
              <p className="text-primary text-sm mt-1">
                {errors.finishedTime.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="font-semibold text-foreground">
                Giá Khởi Điểm <span className="text-primary">*</span>
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  {...register("price")}
                  placeholder="Nhập giá khởi điểm"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="px-2 py-1 text-primary text-md font-semibold">
                  VND
                </span>
              </div>
              {errors.price && (
                <p className="text-primary text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-foreground">
                Giá Mua Nhanh <span className="text-primary">*</span>
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  {...register("priceBuyNow")}
                  placeholder="12.000.000"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="px-2 py-1 text-primary text-md font-semibold">
                  VND
                </span>
              </div>
              {errors.priceBuyNow && (
                <p className="text-primary text-sm mt-1">
                  {errors.priceBuyNow.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <button
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
              className="cursor-pointer bg-primary text-primary-foreground font-semibold rounded-lg px-8 py-2 text-base shadow hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập Nhật Sản Phẩm"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer bg-secondary text-secondary-foreground font-semibold rounded-lg px-8 py-2 text-base shadow hover:bg-secondary/80 transition"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
