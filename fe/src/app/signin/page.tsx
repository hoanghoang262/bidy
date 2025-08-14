"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { LocalUser } from "../../utils/localAuth";
import { fetchProfile, useSignin } from "@/services/user";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
import AnimatedFormContainer from "@/components/ui/AnimatedFormContainer";
import AnimatedButton from "@/components/ui/AnimatedButton";
import AuthLayout from "@/components/ui/AuthLayout";
import ResponsiveInput from "@/components/ui/ResponsiveInput";

const DEFAULT_USER: LocalUser = {
  name: "Demo User",
  email: "demo@email.com",
  phone: "0123456789",
  password: "123456",
  news: false,
};

const ADMIN_USER: LocalUser = {
  name: "Admin User",
  email: "admin@email.com",
  phone: "0999999999",
  password: "admin123",
  news: false,
};

function SignInContent() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { mutate: signin } = useSignin();
  const dispatch = useDispatch();

  // Seed default account if not present
  useEffect(() => {
    const users: LocalUser[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );
    let changed = false;
    if (!users.some((u) => u.email === DEFAULT_USER.email)) {
      users.push(DEFAULT_USER);
      changed = true;
    }
    if (!users.some((u) => u.email === ADMIN_USER.email)) {
      users.push(ADMIN_USER);
      changed = true;
    }
    if (changed) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    signin(
      { userName: form.username, password: form.password },
      {
        onSuccess: async (data) => {
          const profileRes = await fetchProfile();
          dispatch(setAuth({ user: profileRes?.data ?? null }));
          if (redirectTo) redirect(redirectTo);
          else if (data?.data?.user?.role === "admin")
            redirect(APP_ROUTES.ADMIN);
          else redirect(APP_ROUTES.HOME);
        },
        onError: () => {
          setIsSubmitting(false);
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      }
    );
  };

  return (
    <AuthLayout 
      title="ĐĂNG NHẬP" 
      subtitle="Chào Mừng Quay Trở Lại!"
    >
      <AnimatedFormContainer>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <ResponsiveInput
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
            disabled={isSubmitting}
            required
          />

          <div className="space-y-3">
            <label className="block font-semibold text-foreground text-base leading-tight">
              Mật Khẩu <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 pr-12 min-h-[44px] border border-border rounded-lg bg-background text-foreground placeholder:text-foreground-secondary text-base leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors disabled:opacity-50 min-w-[20px] min-h-[20px]"
                tabIndex={-1}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <AnimatedButton
            type="submit"
            disabled={isSubmitting || !form.username || !form.password}
            isLoading={isSubmitting}
            loadingText="Đang đăng nhập..."
            className="w-full mt-6"
            size="lg"
          >
            Đăng Nhập
          </AnimatedButton>

          <div className="space-y-5 pt-6 border-t border-border text-center">
            <Link
              href="/forgot-password"
              className="inline-block text-primary hover:underline hover:text-primary/80 transition-colors text-base min-h-[44px] flex items-center justify-center px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              Quên mật khẩu?
            </Link>

            <div className="text-foreground-secondary text-base leading-relaxed">
              Chưa có tài khoản?{" "}
              <Link
                href={APP_ROUTES.SIGN_UP}
                className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors inline-block min-h-[32px] px-2 py-1 rounded"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </form>
      </AnimatedFormContainer>
    </AuthLayout>
  );
}

// Loading fallback for signin page
const SignInLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background px-4">
    <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-border">
      <div className="text-center mb-8">
        <div className="h-9 bg-muted rounded w-48 mx-auto mb-2 animate-pulse"></div>
        <div className="h-5 bg-muted rounded w-32 mx-auto animate-pulse"></div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-12 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-12 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-12 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}