"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useResetPassword } from "@/services/user";
import { APP_ROUTES } from "@/constants";

const schema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof schema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword } = useResetPassword();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormSchema) => {
    if (!token) return;
    setIsSuccess(false);
    resetPassword(
      { token, newPassword: data.password },
      {
        onSuccess() {
          setIsSuccess(true);
          router.push(APP_ROUTES.SIGN_IN);
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background px-4 pt-8 pb-64 lg:pb-32">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Đặt lại mật khẩu thành công!
              </h1>
              <p className="text-foreground-secondary text-sm">
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật
                khẩu mới.
              </p>
            </div>
          </div>

          <Link
            href="/signin"
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm shadow hover:bg-primary/80 transition-colors text-center block"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background px-4 pt-8 pb-64 lg:pb-32">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-wider">
            Đặt lại mật khẩu
          </h1>
          <p className="text-foreground-secondary text-sm text-center">
            {email && `Đặt lại mật khẩu cho ${email}`}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-foreground text-sm">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Nhập mật khẩu mới"
                className={`w-full border rounded-lg px-4 py-3 pl-12 pr-12 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground-secondary ${
                  errors.password ? "border-red-500" : "border-border"
                }`}
                autoComplete="new-password"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground-secondary hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-foreground text-sm">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Nhập lại mật khẩu mới"
                className={`w-full border rounded-lg px-4 py-3 pl-12 pr-12 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground-secondary ${
                  errors.confirmPassword ? "border-red-500" : "border-border"
                }`}
                autoComplete="new-password"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground-secondary hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isDirty || !isValid}
            className="cursor-pointer w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm shadow hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            Cập nhật mật khẩu
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-foreground-secondary text-sm hover:text-foreground transition-colors"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for reset password page
const ResetPasswordLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8 border border-border">
      <div className="text-center mb-6">
        <div className="h-8 bg-muted rounded w-48 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-12 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
