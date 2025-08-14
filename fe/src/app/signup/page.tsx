"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { useRegister } from "@/services/user";
import { BodyRegisterRequest } from "@/types";
import PasswordInput from "@/components/ui/PasswordInput";
import AnimatedFormContainer from "@/components/ui/AnimatedFormContainer";
import AnimatedButton from "@/components/ui/AnimatedButton";
import AuthLayout from "@/components/ui/AuthLayout";
import ResponsiveFormGrid from "@/components/ui/ResponsiveFormGrid";
import ResponsiveInput from "@/components/ui/ResponsiveInput";

const registerSchema = z.object({
  userName: z.string().min(1, "Tên đăng nhập là bắt buộc."),
  full_name: z.string().min(1, "Họ và tên là bắt buộc."),
  email: z.string().email("Email không hợp lệ."),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số."),
  identity: z.string().min(9, "CMND/CCCD là bắt buộc."),
  password: z.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Mật khẩu phải có chữ hoa, chữ thường và số."),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  news: z.boolean().optional(),
  agree: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      full_name: "",
      email: "",
      phone: "",
      identity: "",
      password: "",
      confirmPassword: "",
      news: false,
      agree: false,
    },
  });

  const watchPassword = watch("password");

  const { mutate: registerUser } = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    const payload: BodyRegisterRequest = {
      userName: data.userName,
      fullName: data.full_name, // Backend expects 'fullName', not 'full_name'
      email: data.email,
      phone: data.phone,
      identity: data.identity,
      password: data.password,
    };
    registerUser(payload);
    reset();
  };

  return (
    <AuthLayout 
      title="ĐĂNG KÝ" 
      subtitle="Tạo Tài Khoản Mới Miễn Phí"
      className="max-w-4xl"
    >
      <AnimatedFormContainer>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
          <ResponsiveFormGrid columns={2}>
            <ResponsiveInput
              label="Tên đăng nhập"
              {...register("userName")}
              error={errors.userName?.message}
              autoComplete="username"
              required
            />
            <ResponsiveInput
              label="Họ và tên"
              {...register("full_name")}
              error={errors.full_name?.message}
              autoComplete="name"
              required
            />
            <ResponsiveInput
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              autoComplete="email"
              required
            />
            <ResponsiveInput
              label="Số điện thoại"
              type="tel"
              {...register("phone")}
              error={errors.phone?.message}
              autoComplete="tel"
              required
            />
            <ResponsiveInput
              label="CMND/CCCD"
              {...register("identity")}
              error={errors.identity?.message}
              required
            />
            <div className="min-[480px]:col-span-1">
              <PasswordInput
                label="Mật khẩu"
                name="password"
                register={register}
                error={errors.password?.message}
                showStrength={true}
              />
            </div>
            <div className="min-[480px]:col-span-1">
              <PasswordInput
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword?.message}
                showMatch={true}
                originalPassword={watchPassword}
              />
            </div>
          </ResponsiveFormGrid>

          {/* Terms and conditions section */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-start gap-2 text-foreground text-xs sm:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  {...register("news")}
                  className="accent-primary mt-0.5 flex-shrink-0"
                />
                <span>Gửi tôi email về tin tức & hướng dẫn mới</span>
              </label>
              
              <label className="flex items-start gap-2 text-foreground text-xs sm:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agree")}
                  className="accent-primary mt-0.5 flex-shrink-0"
                />
                <span>Tôi đồng ý với các điều khoản & chính sách</span>
              </label>
              
              {errors.agree && (
                <p className="text-red-500 text-sm flex items-center gap-2 ml-6">
                  <AlertCircle size={14} />
                  {errors.agree.message}
                </p>
              )}
            </div>

            {/* reCAPTCHA placeholder - compact layout */}
            <div className="flex justify-center sm:justify-end">
              <div className="bg-muted border border-border rounded flex items-center px-2 py-1.5 text-xs text-muted-foreground">
                <input type="checkbox" className="mr-1.5 accent-primary" />
                <span>I&apos;m not a robot</span>
                <span className="ml-1.5 text-muted-foreground">[reCAPTCHA]</span>
              </div>
            </div>
          </div>

          <AnimatedButton
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Đang tạo tài khoản..."
            className="w-full mt-2"
            size="md"
          >
            Tạo Tài Khoản
          </AnimatedButton>

          <div className="text-center text-foreground text-xs sm:text-sm pt-1.5 border-t border-border">
            Đã có tài khoản?{" "}
            <Link
              href="/signin"
              className="font-semibold text-primary hover:underline transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </AnimatedFormContainer>
    </AuthLayout>
  );
}

