"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createAuctionListing } from '@/services/product/product.fetcher';
import { toast } from 'sonner';
import { useProductCategories } from '@/services/product/product.query';
import logger from '@/utils/logger';
import DateTimePicker from '@/components/ui/DateTimePicker';

// Define proper types
interface Category {
  _id: string;
  name: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}



// Helper function to get default start time (5 minutes from now for safety)
const getDefaultStartTime = () => {
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
  return fiveMinutesLater.toISOString().slice(0, 19); // Include seconds
};

// Helper function to get minutes for preset IDs
const getPresetMinutes = (presetId: string): number => {
  const presetMap: { [key: string]: number } = {
    'NOW': 3,        // 3 minutes buffer for "Ngay bây giờ"
    'FIVE_MIN': 5,   // 5 minutes
    'TEN_MIN': 10,   // 10 minutes  
    'THIRTY_MIN': 30, // 30 minutes
    'ONE_HOUR': 60,  // 1 hour
  };
  return presetMap[presetId] || 5; // Default to 5 minutes if not found
};

const initialForm = {
  name: "",
  description: "",
  quantity: 1,
  price: "",
  priceBuyNow: "",
  category: "",
  durationDays: "1",
  startDate: getDefaultStartTime(),
  image: null as File | null,
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { categories, isLoading: isCategoriesLoading } = useProductCategories();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    if (type === "file" && target instanceof HTMLInputElement && target.files) {
      const files = target.files;
      if (name === "image" && files[0]) {
        setForm((f) => ({ ...f, image: files[0] }));
        setImagePreview(URL.createObjectURL(files[0]));
      }
    } else if (name === "quantity" || name === "durationDays") {
      setForm((f) => ({ ...f, [name]: value.replace(/\D/g, "") }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.image || !form.price || !form.category || !form.startDate || !form.durationDays) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    // Calculate actual startDate - handle preset values dynamically
    let actualStartDate: Date;
    const now = new Date();
    
    if (form.startDate.startsWith('PRESET:')) {
      const presetId = form.startDate.replace('PRESET:', '');
      const bufferMinutes = getPresetMinutes(presetId);
      actualStartDate = new Date(now.getTime() + bufferMinutes * 60 * 1000);
      console.log(`🕐 Dynamic calculation: ${presetId} -> ${actualStartDate.toISOString()}`);
    } else {
      actualStartDate = new Date(form.startDate);
    }

    const startDate = actualStartDate; // For backward compatibility
    const durationDays = parseInt(form.durationDays);

    // Skip validation for preset values (they are always safe)
    if (!form.startDate.startsWith('PRESET:')) {
      // Only validate custom datetime selections
      const timeDiffSeconds = (startDate.getTime() - now.getTime()) / 1000;
      const minBufferSeconds = 60; // 1 minute buffer
      
      if (timeDiffSeconds < minBufferSeconds) {
        const remainingMinutes = Math.ceil((minBufferSeconds - timeDiffSeconds) / 60);
        toast.error(`Thời gian bắt đầu phải ít nhất ${remainingMinutes} phút nữa để đảm bảo đầu giá thành công.`);
        return;
      }
    }

    if (!durationDays || durationDays < 1) {
      toast.error('Thời gian đấu giá phải từ 1 ngày trở lên.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create form data with file
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('quantity', form.quantity.toString());
      formData.append('price', form.price);
      if (form.priceBuyNow) formData.append('priceBuyNow', form.priceBuyNow);
      formData.append('category', form.category);
      formData.append('durationDays', form.durationDays);
      formData.append('startDate', actualStartDate.toISOString());
      if (form.image) formData.append('images', form.image); // Send file directly
      
      // // Debug: Log form data
      // console.log('Form data being sent:');
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      
      await createAuctionListing(formData);
      toast.success('Tạo sản phẩm đấu giá thành công!');
      router.push('/profile');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      logger.error('Auction creation failed', apiError, {
        productName: form.name,
        category: form.category,
        price: form.price,
        errorStatus: apiError?.response?.status,
        errorData: apiError?.response?.data
      });
      
      if (apiError?.response?.status === 401 || apiError?.response?.status === 403) {
        toast.error('Bạn cần đăng nhập để tạo sản phẩm.');
      } else if (apiError?.response?.status === 500) {
        toast.error('Lỗi server. Vui lòng kiểm tra lại thông tin và thử lại.');
      } else {
        toast.error(`Tạo sản phẩm thất bại: ${apiError?.response?.data?.message || 'Vui lòng thử lại.'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="min-h-screen flex gap-4 p-8 flex-col items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background pb-64 lg:pb-32">
      <div className="max-w-4xl mx-auto my-10 p-8 bg-card rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Thêm sản phẩm đấu giá của bạn
        </h1>
        <p className="text-sm text-foreground-secondary mb-8">
          Làm theo các bước bên dưới
        </p>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Tên sản phẩm */}
          <div>
            <label className="font-semibold text-foreground">
              Tên Sản Phẩm <span className="text-primary">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Tên sản phẩm"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Mô tả sản phẩm */}
          <div>
            <label className="font-semibold text-foreground">
              Mô Tả Sản Phẩm <span className="text-primary">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Mô tả sản phẩm"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
            />
          </div>
          {/* Số lượng */}
          <div>
            <label className="font-semibold text-foreground">
              Số Lượng <span className="text-primary">*</span>
            </label>
            <input
              name="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="1"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Giá khởi điểm */}
          <div>
            <label className="font-semibold text-foreground">
              Giá Khởi Điểm <span className="text-primary">*</span>
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="Giá khởi điểm (VNĐ)"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Giá mua ngay */}
          <div>
            <label className="font-semibold text-foreground">
              Giá Mua Ngay
            </label>
            <input
              name="priceBuyNow"
              type="number"
              value={form.priceBuyNow}
              onChange={handleChange}
              placeholder="Giá mua ngay (VNĐ)"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Danh mục sản phẩm */}
          <div>
            <label className="font-semibold text-foreground">
              Danh Mục Sản Phẩm <span className="text-primary">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isCategoriesLoading}
            >
              <option value="">{isCategoriesLoading ? 'Đang tải danh mục...' : 'Chọn danh mục'}</option>
              {!isCategoriesLoading && categories && categories.length > 0 &&
                categories.map((cat: Category) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))
              }
              {!isCategoriesLoading && categories && categories.length === 0 && (
                <option value="" disabled>Không có danh mục nào</option>
              )}
            </select>
          </div>
          {/* Thời gian bắt đầu */}
          <DateTimePicker
            value={form.startDate}
            onChange={(value, presetType) => {
              setForm((f) => ({ ...f, startDate: value }));
              // Optional: Handle presetType if needed for additional logic
              if (presetType) {
                console.log('🕰️ Preset selected:', presetType);
              }
            }}
            label="Thời Gian Bắt Đầu"
            required
          />
          
          {/* Thời gian đấu giá (ngày) */}
          <div>
            <label className="font-semibold text-foreground">
              Thời Gian Đấu Giá (ngày) <span className="text-primary">*</span>
            </label>
            <input
              name="durationDays"
              type="number"
              min={1}
              value={form.durationDays}
              onChange={handleChange}
              required
              placeholder="1"
              className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Hình ảnh sản phẩm */}
          <div>
            <label className="font-semibold text-foreground">
              Hình Ảnh Sản Phẩm <span className="text-primary">*</span>
            </label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px] bg-background">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-contain max-h-[200px]"
                />
              ) : (
                <span className="text-foreground-secondary">Chưa chọn hình ảnh</span>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="mt-4 text-foreground-secondary w-full text-center"
                required
              />
            </div>
          </div>
          {/* Submit/Cancel */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition"
              disabled={isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? 'Đang tải lên...' : 'Đăng sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
