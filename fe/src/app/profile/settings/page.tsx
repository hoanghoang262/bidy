"use client";

import React, { useState } from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes.constants";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useChangePassword, useUpdateUser } from "@/services/user";
import { useAuth } from "@/hooks";
import { getValidText } from "@/utils";
import { ProfileFormSchema, ProfileForm } from "./schema";

function ProfileGeneralInfoForm({
  register,
  errors,
}: {
  register: UseFormRegister<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Username */}
      <div>
        <label className="font-semibold text-foreground">Username</label>
        <input
          {...register("username")}
          disabled
          className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.username && (
          <p className="text-sm text-primary mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="font-semibold text-foreground">Email</label>
        <input
          {...register("email")}
          disabled
          className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.email && (
          <p className="text-sm text-primary mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Full name */}
      <div>
        <label className="font-semibold text-foreground">Họ Và Tên</label>
        <input
          {...register("name")}
          placeholder="Nhập họ và tên"
          className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.name && (
          <p className="text-sm text-primary mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="font-semibold text-foreground">Số Điện Thoại</label>
        <input
          {...register("phone")}
          placeholder="Nhập số điện thoại"
          className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.phone && (
          <p className="text-sm text-primary mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>
    </div>
  );
}

function ProfileActionButtons({
  onCancel,
  isValid,
  isDirty,
}: {
  onCancel: () => void;
  isValid: boolean;
  isDirty: boolean;
}) {
  return (
    <div className="flex gap-4 justify-end mt-8">
      <button
        type="button"
        onClick={onCancel}
        disabled={!isDirty}
        className={cn(
          "font-semibold rounded-lg px-8 py-2 text-base shadow transition",
          {
            "disabled:opacity-50 bg-btn-disabled-bg cursor-default text-accent-foreground":
              !isDirty,
            "bg-secondary text-secondary-foreground hover:opacity-80 cursor-pointer":
              isDirty,
          }
        )}
      >
        Huỷ
      </button>
      <button
        type="submit"
        disabled={!isValid || !isDirty}
        className={cn(
          "font-semibold rounded-lg px-8 py-2 text-base shadow transition",
          {
            "disabled:opacity-50 bg-primary text-primary-foreground cursor-default":
              !isValid || !isDirty,
            "cursor-pointer bg-primary text-primary-foreground hover:opacity-75":
              isValid && isDirty,
          }
        )}
      >
        Lưu Thay Đổi
      </button>
    </div>
  );
}

function ProfileQuickNavTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <>
      {/* Dropdown for mobile */}
      <div className="w-full max-w-[92vw] lg:max-w-2xl mb-8 block md:hidden">
        <select
          className="hover:cursor-pointer w-full h-[43px] rounded-full border border-border bg-card text-foreground font-semibold px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          value={active}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="general">Thông tin chung</option>
          <option value="delivery">Vận chuyển</option>
          <option value="security">Bảo mật</option>
          {/* <option value="payment">Thanh toán</option> */}
        </select>
      </div>
      {/* Tabs for desktop */}
      <div className="hidden md:flex w-full max-w-2xl mb-8 bg-card rounded-full overflow-hidden border border-border">
        <button
          className={`hover:cursor-pointer flex-1 h-[43px] flex items-center justify-center font-semibold text-base rounded-full transition ${
            active === "general"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-secondary/80"
          }`}
          style={{ minWidth: 0 }}
          onClick={() => onChange("general")}
        >
          Thông tin chung
        </button>
        <button
          className={`hover:cursor-pointer flex-1 h-[43px] flex items-center justify-center font-semibold text-base rounded-full transition ${
            active === "delivery"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-secondary/80"
          }`}
          style={{ minWidth: 0 }}
          onClick={() => onChange("delivery")}
        >
          Vận chuyển
        </button>
        <button
          className={`hover:cursor-pointer flex-1 h-[43px] flex items-center justify-center font-semibold text-base rounded-full transition ${
            active === "security"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground hover:bg-secondary/80"
          }`}
          style={{ minWidth: 0 }}
          onClick={() => onChange("security")}
        >
          Bảo mật
        </button>
      </div>
    </>
  );
}
const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Bắt buộc nhập mật khẩu hiện tại"),
    newPassword: z.string().min(8, "Tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận lại mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;
function SecuritySettingsForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: changePassword } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = (data: FormValues) => {
    changePassword({
      old_password: data.currentPassword,
      new_password: data.newPassword,
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[92vw] lg:max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-8 flex flex-col gap-8"
      style={{ boxShadow: "0 0 8px 0 rgba(108,108,108,0.25)" }}
    >
      <h2 className="text-xl font-bold text-foreground mb-2">Bảo mật</h2>

      <div className="flex flex-col gap-6">
        {/* Current password */}
        <div>
          <label className="font-semibold text-foreground">
            Mật khẩu hiện tại <span className="text-primary">*</span>
          </label>
          <div className="relative mt-2">
            <input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              onClick={() => setShowCurrent((v) => !v)}
              tabIndex={-1}
            >
              👁
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-primary mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New password */}
        <div>
          <label className="font-semibold text-foreground">
            Mật khẩu mới <span className="text-primary">*</span>
          </label>
          <div className="relative mt-2">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              placeholder="Nhập mật khẩu mới"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              onClick={() => setShowNew((v) => !v)}
              tabIndex={-1}
            >
              👁
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-primary mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="font-semibold text-foreground">
            Nhập lại mật khẩu mới <span className="text-primary">*</span>
          </label>
          <div className="relative mt-2">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              👁
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-primary mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-8">
        <button
          type="button"
          disabled={!isValid || !isDirty}
          onClick={() => reset()}
          className={cn(
            "cursor-pointer bg-none text-secondary-foreground font-semibold rounded-lg px-8 py-2 text-base shadow hover:bg-secondary transition",
            {
              "disabled:opacity-50 bg-btn-disabled-bg cursor-default text-accent-foreground":
                !isValid || !isDirty,
            }
          )}
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={!isValid || !isDirty}
          className={cn(
            "disabled:opacity-50 bg-primary text-primary-foreground font-semibold rounded-lg px-8 py-2 text-base shadow hover:opacity-75 transition",
            isValid || isDirty ? "cursor-pointer" : "cursor-default"
          )}
        >
          Lưu Thay Đổi
        </button>
      </div>
    </form>
  );
}

function DeliverySettingsTab() {
  // Mock data
  const summary = [
    { count: 10, label: "Tất cả", active: true },
    { count: 5, label: "Tự vận chuyển" },
    { count: 5, label: "Vận chuyển bởi chúng tôi" },
    { count: 2, label: "Đã tới người mua" },
  ];
  const rows = Array.from({ length: 10 }).map((_, i) => ({
    date: "08 Jun 2024",
    name: "Vintage OMGA Watch",
    code: "#48586901",
    buyer: "Phạm Thị B",
    price: "10.000.000 VND",
    status: i < 8 ? "pending" : "done",
  }));
  return (
    <div
      className="w-full max-w-[92vw] lg:max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-8 flex flex-col gap-6"
      style={{ boxShadow: "0 0 8px 0 rgba(108,108,108,0.25)" }}
    >
      <h2 className="text-xl font-bold text-foreground mb-2">Vận chuyển</h2>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center rounded-2xl h-fit min-h-[56px] py-4 border border-border font-semibold text-base transition bg-secondary text-foreground"
          >
            <span className="text-2xl font-bold mb-1 text-primary">
              {item.count}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      {/* Search and date filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 flex items-center bg-background rounded-lg border border-border px-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã sản phẩm"
            className="flex-1 py-2 bg-transparent outline-none text-foreground placeholder:text-foreground-secondary"
          />
          <svg
            className="w-5 h-5 text-foreground-secondary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <div className="flex items-center bg-background rounded-lg border border-border px-4">
          <input
            type="date"
            className="py-2 bg-transparent outline-none text-foreground placeholder:text-foreground-secondary"
          />
          {/* <svg
            className="w-5 h-5 text-muted ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg> */}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary text-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold text-left">
                Ngày Kết Thúc Đấu Giá
              </th>
              <th className="px-4 py-3 font-semibold text-left">
                Tên Sản Phẩm
              </th>
              <th className="px-4 py-3 font-semibold text-left">Mã Sản Phẩm</th>
              <th className="px-4 py-3 font-semibold text-left">Người Mua</th>
              <th className="px-4 py-3 font-semibold text-left">
                Giá Cuối Cùng
              </th>
              <th className="px-4 py-3 font-semibold text-center">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="px-4 py-3 whitespace-nowrap text-foreground-secondary">
                  {row.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground-secondary">
                  {row.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground-secondary">
                  {row.code}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground-secondary">
                  {row.buyer}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-semibold text-primary">
                  {row.price}
                </td>
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" className="accent-primary w-5 h-5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            className={`w-8 h-8 rounded border text-base font-semibold flex items-center justify-center transition ${
              n === 1
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary/80"
            }`}
          >
            {n}
          </button>
        ))}
        <button className="w-8 h-8 rounded border border-border bg-background text-foreground flex items-center justify-center hover:bg-secondary/80">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// function PaymentSettingsTab() {
//   return (
//     <div
//       className="w-full max-w-[92vw] lg:max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-8 flex flex-col gap-8"
//       style={{ boxShadow: "0 0 8px 0 rgba(108,108,108,0.25)" }}
//     >
//       <h2 className="text-xl font-bold text-foreground mb-2">
//         Thanh toán
//       </h2>
//       {/* Saved credit cards */}
//       <div className="bg-secondary rounded-xl p-6 flex flex-col items-center justify-center border border-border">
//         <div className="w-full flex flex-col items-center justify-center gap-4 min-h-[120px]">
//           {/* Empty state illustration (simple SVG placeholder) */}
//           <Image src={"/nocard.svg"} alt="No card" width={128} height={128} />
//           <div className="text-foreground font-semibold text-base">
//             Thẻ tín dụng đã lưu
//           </div>
//           <div className="text-foreground text-sm text-center max-w-md">
//             Chưa có thẻ tín dụng nào được lưu. Thêm thẻ tín dụng để thanh toán
//             nhanh gọn hơn!
//           </div>
//           <button className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg px-6 py-2 text-base shadow hover:bg-primary/80 transition">
//             Thêm thẻ tín dụng
//           </button>
//         </div>
//       </div>
//       {/* Default payment method row as dropdown */}
//       <div className="flex flex-col md:flex-row items-center gap-4 bg-background rounded-lg border border-border px-6 py-4">
//         <div className="flex-1 flex flex-col md:flex-row items-center w-full justify-between gap-4">
//           <div className="font-semibold text-foreground">
//             Phương thức thanh toán mặc định
//           </div>
//           <select
//             className="w-full md:w-fit px-4 py-2 rounded border border-border bg-secondary text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
//             defaultValue="credit"
//           >
//             <option value="credit">Thẻ tín dụng</option>
//             <option value="qr">Quét mã QR chuyển khoản</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }


export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const { mutate: updateUser } = useUpdateUser();
  const formMethods = useForm<ProfileForm>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: getValidText(user?.full_name),
      username: getValidText(user?.user_name),
      phone: getValidText(user?.phone),
      email: getValidText(user?.email),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = formMethods;

  const onSubmit = (data: ProfileForm) => {
    const payload = {
      fullName: data.name,
      email: data.email,
      identity: getValidText(user?.identity),
      phone: data.phone,
    };
    updateUser(payload, {
      onSuccess: () => {
        reset(data);
      },
    });
  };

  const onCancel = () => {
    reset();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background py-16 pb-64 lg:pb-40">
      <p className="text-2xl lg:text-3xl font-bold text-primary w-full text-center mb-8">
        Cài Đặt
      </p>
      <ProfileQuickNavTabs active={activeTab} onChange={setActiveTab} />
      {activeTab === "general" && (
        <form
          className="w-full max-w-[92vw] lg:max-w-4xl bg-card rounded-2xl shadow-lg p-8 border border-border"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-xl font-bold text-foreground mb-6">
            Thông tin chung
          </h2>
          <ProfileGeneralInfoForm register={register} errors={errors} />
          <ProfileActionButtons
            onCancel={onCancel}
            isValid={isValid}
            isDirty={isDirty}
          />
        </form>
      )}
      {activeTab === "security" && <SecuritySettingsForm />}
      {activeTab === "delivery" && <DeliverySettingsTab />}
      <Link
        href={APP_ROUTES.PROFILE}
        className="w-full text-center mt-8 text-foreground-secondary hover:text-primary transition"
      >
        Quay lại
      </Link>
    </main>
  );
}
