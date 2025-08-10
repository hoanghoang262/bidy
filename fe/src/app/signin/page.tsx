"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { LocalUser } from "../../utils/localAuth";
import { fetchProfile, useSignin } from "@/services/user";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";

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
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 pb-64 lg:pb-24">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8 border border-border">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">ĐĂNG NHẬP</h1>
          <p className="text-foreground">Chào Mừng Quay Trở Lại!</p>
        </div>
        {/* Demo credentials */}
        {/* <div className="mb-4">
          <div className="text-xs text-foreground mb-1">
            Demo User: demo@email.com / 123456
          </div>
          <div className="text-xs text-foreground mb-1">
            Admin User: admin@email.com / admin123
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-red-500"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Mật Khẩu <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-red-500"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="cursor-pointer w-full bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition-colors"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="text-center text-foreground-secondary text-sm mt-4">
          <Link
            href="/forgot-password"
            className="text-red-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <div className="text-center text-foreground-secondary text-sm mt-2">
          Chưa có tài khoản?{" "}
          <Link
            href={APP_ROUTES.SIGN_UP}
            className="text-red-600 hover:underline"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}

function SignInFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">ĐĂNG NHẬP</h1>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return <SignInContent />;
}
