"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { useRegister } from "@/services/user";
import { BodyRegisterRequest } from "@/types";

const registerSchema = z.object({
  userName: z.string().min(1, "Tên đăng nhập là bắt buộc."),
  full_name: z.string().min(1, "Họ và tên là bắt buộc."),
  email: z.string().email("Email không hợp lệ."),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số."),
  identity: z.string().min(9, "CMND/CCCD là bắt buộc."),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  news: z.boolean().optional(),
  agree: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      full_name: "",
      email: "",
      phone: "",
      identity: "",
      password: "",
      news: false,
      agree: false,
    },
  });

  const { mutate: registerUser } = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    const payload: BodyRegisterRequest = {
      userName: data.userName,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      identity: data.identity,
      password: data.password,
    };
    registerUser(payload);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background px-4 pt-12 pb-64 lg:pb-32">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-3xl font-bold text-primary tracking-wider mb-0.5">
            ĐĂNG KÝ
          </h1>
          <p className="text-base text-foreground-secondary">
            Tạo Tài Khoản Mới Miễn Phí
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên đăng nhập"
            name="userName"
            register={register}
            error={errors.userName?.message}
          />
          <Input
            label="Họ và tên"
            name="full_name"
            register={register}
            error={errors.full_name?.message}
          />
          <Input
            label="Email"
            name="email"
            register={register}
            error={errors.email?.message}
          />
          <Input
            label="Số điện thoại"
            name="phone"
            register={register}
            error={errors.phone?.message}
          />
          <Input
            label="CMND/CCCD"
            name="identity"
            register={register}
            error={errors.identity?.message}
          />
          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 text-foreground text-sm">
              <input
                type="checkbox"
                {...register("news")}
                className="accent-primary"
              />
              Gửi tôi email về tin tức & hướng dẫn mới
            </label>
            <label className="flex items-center gap-2 text-foreground text-sm">
              <input
                type="checkbox"
                {...register("agree")}
                className="accent-primary"
              />
              Tôi đồng ý với các điều khoản & chính sách
            </label>
            {errors.agree && (
              <p className="text-red-500 text-sm">{errors.agree.message}</p>
            )}
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="bg-secondary-foreground border border-border rounded flex items-center px-4 py-2 text-xs text-muted">
              <input type="checkbox" className="mr-2 accent-primary" />
              I&apos;m not a robot
              <span className="ml-2 text-secondary">[reCAPTCHA]</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-base mt-2 shadow hover:bg-primary/80 transition-colors"
        >
          Tạo Tài Khoản
        </button>

        <div className="text-center text-foreground text-sm">
          Đã có tài khoản?{" "}
          <Link
            href="/signin"
            className="font-semibold text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </form>

      <style jsx>{`
        .input {
          @apply border border-border rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground-secondary;
        }
      `}</style>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  register,
  error,
}: {
  label: string;
  name: keyof RegisterFormValues;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-foreground">
        {label} <span className="text-primary">*</span>
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={`Nhập ${label.toLowerCase()}`}
        className="input border rounded-md p-2 text-foreground placeholder:text-foreground-secondary"
      />
      {error && <p className="text-primary text-sm">{error}</p>}
    </div>
  );
}
