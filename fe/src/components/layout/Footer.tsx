"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { APP_ROUTES } from "@/constants/routes.constants";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

const socialIcons = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    svg: (

      <SiFacebook fill="var(--foreground)" size={32}/>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    svg: (
      <SiX fill="var(--foreground)" size={32}/>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    svg: (
      <SiInstagram fill="var(--foreground)" size={32}/>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@email.com";
  const isAdminPage =
    pathname.startsWith("/admin") || (pathname === "/notification" && isAdmin);

  const isMessagesPage = pathname === "/profile/messages";
  const [logo, setLogo] = useState("/logo-light@3x.webp");
  useEffect(
    () =>
      setLogo(
        resolvedTheme === "light" ? "/logo-light@3x.webp" : "/logo-dark@3x.webp"
      ),
    [resolvedTheme]
  );


  return (
    !isAdminPage &&
    !isMessagesPage && (
      <footer className="bg-muted shadow-[0_-1px_4px_rgba(155,155,155,0.25)] pt-10 pb-4 px-4 flex flex-col gap-6 lg:pt-0 lg:pb-0 lg:px-0 lg:gap-0">
        {/* CTA Card / CTA Bar */}
        <div
          className="bg-accent rounded-2xl p-6 flex flex-col gap-8 mt-[-240px] lg:mt-[8px] max-w-[88vw] mx-auto shadow-lg
        lg:rounded-[20px] lg:shadow-lg lg:w-[1280px] lg:h-fit lg:py-8 lg:flex-row lg:items-center lg:justify-between lg:p-0 lg:gap-2 lg:relative lg:top-[-88px]"
        >
          {/* Desktop: 3 CTAs in a row, Mobile: stacked */}
          <div className="flex flex-col gap-8 w-full lg:flex-row lg:gap-8 lg:justify-between lg:px-20 lg:py-0 lg:max-w-[1120px] lg:mx-auto">
            {/* Signup CTA */}
            <div className="flex flex-col gap-2 items-center justify-center lg:w-[264px]">
              <div className="text-foreground text-base font-roboto font-semibold text-center leading-tight">
                Bạn muốn mua sản phẩm đấu giá một cách dễ dàng?
              </div>
              <button className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-roboto font-semibold rounded-md px-6 py-2 text-base shadow hover:bg-primary/80 transition">
                <span>Đăng ký ngay</span>
              </button>
            </div>
            {/* Post CTA */}
            <div className="flex flex-col gap-2 items-center justify-center lg:w-[264px]">
              <div className="text-foreground text-base font-roboto font-semibold text-center leading-tight">
                Bạn muốn đăng sản phẩm đấu giá?
              </div>
              <button className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-roboto font-semibold rounded-md px-6 py-2 text-base shadow hover:bg-primary/80 transition">
                <span>Đăng sản phẩm</span>
              </button>
            </div>
            {/* Follow CTA */}
            <div className="flex flex-col gap-2 items-center justify-center lg:w-[264px]">
              <div className="text-foreground text-base font-roboto font-semibold text-center leading-tight">
                Bạn muốn theo dõi phiên đấu giá yêu thích?
              </div>
              <button className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-roboto font-semibold rounded-md px-6 py-2 text-base shadow hover:bg-primary/80 transition">
                <span>Theo dõi đấu giá</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Links/Info Section */}
        <div className="flex flex-col-reverse gap-8 items-center mt-8 w-full lg:mt-0 lg:flex-row lg:items-start lg:justify-center lg:gap-[75px] lg:w-full lg:px-0 lg:py-8 lg:h-fit">
          {/* Link Columns */}
          <div className="flex flex-col md:flex-row lg:flex-col justify-center gap-8 w-full max-w-[343px] md:max-w-[768px] lg:max-w-none lg:w-auto lg:flex-row lg:gap-[75px] lg:items-start lg:justify-start">
            <div className="flex flex-col gap-4 lg:w-[103px]">
              <div className="text-foreground font-roboto font-semibold text-lg">
                THÔNG TIN
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={APP_ROUTES.CATEGORY}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Danh mục
                </Link>
                <Link
                  href={APP_ROUTES.ABOUT}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Về chúng tôi
                </Link>
                <Link
                  href={APP_ROUTES.NEWS}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Tin tức
                </Link>
                <Link
                  href={APP_ROUTES.CONTACT}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Liên hệ
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:w-[176px]">
              <div className="text-foreground font-roboto font-semibold text-lg">
                THÔNG TIN THÊM
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={APP_ROUTES.ABOUT}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  An toàn người mua
                </Link>
                <Link
                  href={"/account"}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Xác minh tài khoản
                </Link>
                <Link
                  href={"/fee"}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Phí dịch vụ
                </Link>
                <Link
                  href={"/payment"}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Phương thức thanh toán
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:w-[134px]">
              <div className="text-foreground font-roboto font-semibold text-lg">
                HỖ TRỢ
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={APP_ROUTES.GUIDE}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Tài khoản
                </Link>
                <Link
                  href={APP_ROUTES.GUIDE}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Đấu giá
                </Link>
                <Link
                  href={APP_ROUTES.GUIDE}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Thanh toán
                </Link>
                <Link
                  href={APP_ROUTES.GUIDE}
                  className="rounded-md text-foreground-secondary font-inter text-sm"
                >
                  Hỗ trợ khách hàng
                </Link>
              </div>
            </div>
          </div>
          {/* Logo and Socials */}
          <div className="hidden lg:flex flex-col items-center gap-4 lg:w-[232px] lg:ml-[75px]">
            <Image
              src={logo}
              alt="Bidy Logo"
              width={232}
              height={104}
              className="w-[232px] h-auto"
            />
            <div className="flex gap-3">
              {socialIcons.map((icon) => (
                <a
                  key={icon.name}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  className="rounded-full w-24 h-24 flex items-center justify-center hover:opacity-80 transition"
                >
                  {icon.svg}
                </a>
              ))}
            </div>
          </div>
          {/* Mobile logo/socials */}
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <Image
              src={logo}
              alt="Bidy Logo"
              width={232}
              height={104}
              className="w-[116px] h-auto"
            />
            <div className="flex gap-3">
              {socialIcons.map((icon) => (
                <a
                  key={icon.name}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  className="rounded-full w-24 h-24 flex items-center justify-center hover:bg-[var(--btn-2-hover)] transition"
                >
                  {icon.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="w-full max-w-[343px] md:max-w-[768px] mx-auto mt-8 border-t border-foreground-secondary pt-6 flex flex-col gap-2 items-center
        lg:max-w-none lg:w-[1152px] lg:mx-auto lg:mt-0 lg:border-t lg:border-foreground-secondary lg:pt-0 lg:flex-row lg:items-center lg:justify-between lg:h-[50px] lg:px-0"
        >
          {/* Desktop: horizontal bar, Mobile: stacked */}
          <div className="flex flex-col gap-2 items-center lg:flex-row lg:gap-0 lg:w-full lg:justify-between lg:items-center lg:h-full">
            <div className="flex flex-col gap-2 justify-center lg:flex-row lg:gap-8 lg:items-center">
              <span className="text-foreground-secondary text-xs font-inter lg:text-sm lg:mr-8">
                Designed by{" "}
                <Link
                  href="https://norman-fts.vercel.app"
                  target="_blank"
                  className="text-foreground-secondary font-inter text-sm"
                >
                  @norman.fts
                </Link>
              </span>
              <span className="text-foreground-secondary text-xs font-inter mt-2 lg:mt-0 lg:text-sm">
                © 2025 Bidy. All rights reserved
              </span>
            </div>
            <div className="flex flex-col gap-2 justify-center lg:flex-row lg:gap-8 lg:items-center">
              <Link
                href={APP_ROUTES.GUIDE}
                className="rounded-md text-foreground-secondary font-inter text-sm lg:mr-8"
              >
                Điều khoản & điều kiện
              </Link>
              <Link
                href={APP_ROUTES.GUIDE}
                className="rounded-md text-foreground-secondary font-inter text-sm"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
  );
}
