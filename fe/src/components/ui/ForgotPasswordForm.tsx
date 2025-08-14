"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "@/services/user";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ResponsiveInput from "@/components/ui/ResponsiveInput";

interface ForgotPasswordFormProps {
  onBackToSignIn?: () => void;
}

// 🧠 Zod validation schema
const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordForm({
  onBackToSignIn,
}: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { mutate: forgotPassword } = useForgotPassword();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const email = watch("email");

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: () => {
          setError("Không thể gửi email. Vui lòng thử lại.");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleResendEmail = () => {
    setIsSubmitted(false);
    setError("");
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Email đã được gửi!
            </h2>
            <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
              <strong>{email}</strong>. Vui lòng kiểm tra hộp thư và làm theo
              hướng dẫn.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Lưu ý:</p>
              <ul className="space-y-1 text-xs">
                <li>• Kiểm tra cả thư mục Spam/Junk</li>
                <li>• Email có thể mất vài phút để đến</li>
                <li>• Link đặt lại mật khẩu có hiệu lực trong 24 giờ</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleResendEmail}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm shadow hover:bg-primary/80 transition-colors"
          >
            Gửi lại email
          </button>

          {onBackToSignIn ? (
            <button
              onClick={onBackToSignIn}
              className="w-full border border-border text-foreground rounded-lg py-3 font-semibold text-sm hover:bg-accent-foreground transition-colors"
            >
              Quay lại đăng nhập
            </button>
          ) : (
            <Link
              href="/signin"
              className="w-full border border-border text-foreground rounded-lg py-3 font-semibold text-sm hover:bg-accent-foreground transition-colors text-center block"
            >
              Quay lại đăng nhập
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <ResponsiveInput
          label="Địa chỉ Email"
          type="email"
          {...register("email")}
          placeholder="Nhập địa chỉ email của bạn"
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          disabled={isLoading}
          error={errors.email?.message}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isDirty || !isValid || isLoading}
          className="cursor-pointer w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm shadow hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" color="white" />
              Đang gửi...
            </div>
          ) : (
            "Gửi email đặt lại mật khẩu"
          )}
        </button>
      </form>

      <div className="text-center">
        {onBackToSignIn ? (
          <button
            onClick={onBackToSignIn}
            className="inline-flex items-center gap-2 text-foreground-secondary text-sm hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </button>
        ) : (
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-foreground-secondary text-sm hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        )}

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 pt-4 border-t border-border">
            <Link
              href="/test-reset"
              className="inline-flex items-center gap-2 text-blue-600 text-xs hover:text-blue-800 transition-colors"
            >
              🧪 Test Reset Password (Dev Only)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
