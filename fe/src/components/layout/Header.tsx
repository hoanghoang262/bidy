"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { APP_ROUTES, STATUS_AUCTIONS } from "@/constants";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [desktopCategoryOpen, setDesktopCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Thành phố");
  const [selectedCategory, setSelectedCategory] = useState("Danh mục");
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "";
  const router = useRouter();
  const [logo, setLogo] = useState("/logo-light@3x.webp");

  const { resolvedTheme } = useTheme();

  // Always get auth state, but conditionally show auth-dependent UI
  const { user, isAuthenticated, logout } = useAuth();
  // const isAdmin = user && user?.role?.toLowerCase() === "admin";
  // const isAdminPage =
  //   pathname.startsWith("/admin") ||
  //   (pathname === APP_ROUTES.NOTIFICATIONS && isAdmin) ||
  //   (pathname === APP_ROUTES.MESSAGES && isAdmin);

  // Close all popups when route changes
  useEffect(() => {
    setMenuOpen(false);
    setCategoryOpen(false);
    setDesktopCategoryOpen(false);
    setSearchOpen(false);
    setCityOpen(false);
  }, [pathname, searchParams]);

  useEffect(
    () =>
      setLogo(
        resolvedTheme === "light" ? "/logo-light@3x.webp" : "/logo-dark@3x.webp"
      ),
    [resolvedTheme]
  );

  // Get the display name for the current type
  const getTypeDisplayName = () => {
    return "Danh mục";
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex w-[100vw] h-16 bg-card border-b border-border items-center justify-between px-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-16">
          <Link
            href={APP_ROUTES.HOME}
            className="w-[67px] h-[36px] flex items-center"
          >
            <Image src={logo} alt="Logo" width={67} height={36} priority />
          </Link>
          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-base">
            <Link
              href={APP_ROUTES.HOME}
              className={`font-bold ${
                pathname === APP_ROUTES.HOME && !searchParams.toString()
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Trang chủ
            </Link>
            <div className="relative flex items-center gap-1">
              <div
                className={`text-base font-bold flex items-center gap-1 cursor-pointer focus:outline-none ${
                  pathname === APP_ROUTES.CATEGORY
                    ? "text-primary"
                    : "text-foreground"
                }`}
                onClick={() => setDesktopCategoryOpen((v) => !v)}
                aria-expanded={desktopCategoryOpen}
                aria-controls="desktop-category-dropdown"
              >
                {getTypeDisplayName()}
                {desktopCategoryOpen ? (
                  <ChevronUp
                    className={cn(
                      pathname === APP_ROUTES.CATEGORY
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  />
                ) : (
                  <ChevronDown
                    className={cn(
                      pathname === APP_ROUTES.CATEGORY
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  />
                )}
              </div>
              {/* Dropdown */}
              {desktopCategoryOpen && (
                <div
                  id="desktop-category-dropdown"
                  className="absolute left-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 flex flex-col"
                >
                  <Link
                    href={`${APP_ROUTES.CATEGORY}?type=${STATUS_AUCTIONS.INITIAL}`}
                    className={`px-4 py-2 hover:opacity-90 hover:text-primary rounded-lg ${
                      currentType === "initial"
                        ? "text-primary bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    Sắp đấu giá
                  </Link>
                  <Link
                    href={`${APP_ROUTES.CATEGORY}?type=${STATUS_AUCTIONS.HAPPENING}`}
                    className={`px-4 py-2 hover:opacity-90 hover:text-primary rounded-lg ${
                      currentType === "happening"
                        ? "text-primary bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    Đang đấu giá
                  </Link>
                  <Link
                    href={`${APP_ROUTES.CATEGORY}?type=${STATUS_AUCTIONS.ENDED}`}
                    className={`px-4 py-2 hover:opacity-90 hover:text-primary rounded-lg ${
                      currentType === "ended"
                        ? "text-primary bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    Đã kết thúc
                  </Link>
                </div>
              )}
            </div>
            <Link
              href={APP_ROUTES.ABOUT}
              className={`font-bold ${
                pathname === APP_ROUTES.ABOUT
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Về chúng tôi
            </Link>
            <Link
              href={APP_ROUTES.NEWS}
              className={`font-bold ${
                pathname === APP_ROUTES.NEWS
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Tin tức
            </Link>
            <Link
              href={APP_ROUTES.CONTACT}
              className={`font-bold ${
                pathname === APP_ROUTES.CONTACT
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Liên hệ
            </Link>
            <Link
              href={APP_ROUTES.GUIDE}
              className={`font-bold ${
                pathname === APP_ROUTES.GUIDE
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Hướng dẫn
            </Link>
            {user?.role === "admin" && (
              <Link
                href={APP_ROUTES.ADMIN}
                className={`font-bold ${
                  pathname === APP_ROUTES.ADMIN
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        {/* Right: Auth & Theme */}
        <div className="flex items-center gap-0 justify-end">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href={APP_ROUTES.NOTIFICATIONS}
                title="Thông báo"
                className="hover:opacity-70"
                onClick={(e) => {
                  if (pathname === APP_ROUTES.NOTIFICATIONS) {
                    e.preventDefault();
                    router.back();
                  }
                }}
              >
                <Bell className="w-4 h-4 text-foreground" />
              </Link>
              <span className="h-6 w-px bg-border" />
              <Link
                href={APP_ROUTES.MESSAGES}
                className="hover:opacity-70"
                title="Tin nhắn"
                onClick={(e) => {
                  if (pathname === APP_ROUTES.MESSAGES) {
                    e.preventDefault();
                    router.back();
                  }
                }}
              >
                <MessageCircle className="w-4 h-4 text-foreground" />
              </Link>
              <span className="h-6 w-px bg-border" />
              <Link
                href={APP_ROUTES.PROFILE}
                title="Trang cá nhân"
                className="hover:opacity-70"
              >
                <User className="w-4 h-4 text-foreground" />
              </Link>
              <span className="h-6 w-px bg-border" />
              <button
                title="Đăng xuất"
                className="hover:opacity-70 cursor-pointer"
                onClick={() => {
                  logout();
                  router.push(APP_ROUTES.SIGN_IN);
                }}
              >
                <LogOut className="w-4 h-4 text-foreground" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href={APP_ROUTES.SIGN_UP}
                className="text-primary font-bold mr-2"
              >
                Đăng Ký
              </Link>
              <span className="text-foreground mr-2">hoặc</span>
              <Link
                href={APP_ROUTES.SIGN_IN}
                className="text-primary font-bold mr-2"
              >
                Đăng Nhập
              </Link>
            </>
          )}
          <span className="mx-2 h-6 border-l border-border" />
          <ThemeToggle />
        </div>
      </header>
      {/* Mobile Header */}
      <header className="lg:hidden w-full h-[52px] bg-card flex flex-col justify-center z-20 relative">
        <div className="flex flex-row items-center justify-between h-[36px] px-4">
          {/* Logo */}
          <Link
            href={APP_ROUTES.HOME}
            className="w-[67px] h-[36px] flex items-center"
          >
            <Image src={logo} alt="Logo" width={67} height={36} priority />
          </Link>
          {/* Menu Icon */}
          <button
            className="w-5 h-5 flex items-center justify-center cursor-pointer"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="4"
                width="20"
                height="2"
                rx="1"
                fill="var(--foreground)"
              />
              <rect
                y="9"
                width="20"
                height="2"
                rx="1"
                fill="var(--foreground)"
              />
              <rect
                y="14"
                width="20"
                height="2"
                rx="1"
                fill="var(--foreground)"
              />
            </svg>
          </button>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {menuOpen && !searchOpen && (
        <div className="fixed inset-0 w-full h-full bg-background z-50 flex flex-col lg:hidden">
          {/* Header with logo and close button */}
          <div className="flex flex-row items-center justify-between h-[52px] px-4 bg-card">
            <Link
              href={APP_ROUTES.HOME}
              className="w-[67px] h-[36px] flex items-center"
            >
              <Image src={logo} alt="Logo" width={67} height={36} priority />
            </Link>
            <button
              className="w-5 h-5 flex items-center justify-center"
              aria-label="Close menu"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
            >
              {/* Close (X) icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="5"
                  y1="5"
                  x2="15"
                  y2="15"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="15"
                  y1="5"
                  x2="5"
                  y2="15"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {/* Menu Items - Top Buttons */}
          <div className="flex flex-row gap-4 mt-8 px-4">
            <button
              className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground text-lg font-medium border border-border"
              onClick={() => setSearchOpen(true)}
            >
              Tìm Kiếm
            </button>
            <button
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-lg font-medium"
              onClick={() => router.push(APP_ROUTES.PRODUCT_NEW)}
            >
              Đăng Sản Phẩm
            </button>
          </div>
          {/* Menu Items - Auth Links and Theme Toggle */}
          <div className="flex justify-center items-center gap-0 mt-8">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href={APP_ROUTES.NOTIFICATIONS}
                  title="Thông báo"
                  onClick={(e) => {
                    if (pathname === APP_ROUTES.NOTIFICATIONS) {
                      e.preventDefault();
                      router.back();
                    }
                  }}
                >
                  <Bell className="w-4 h-4 text-foreground" />
                </Link>
                <span className="h-6 w-px bg-border" />
                <Link
                  href={APP_ROUTES.MESSAGES}
                  title="Tin nhắn"
                  onClick={(e) => {
                    if (pathname === APP_ROUTES.MESSAGES) {
                      e.preventDefault();
                      router.back();
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-foreground" />
                </Link>
                <span className="h-6 w-px bg-border" />
                <Link href={APP_ROUTES.PROFILE} title="Trang cá nhân">
                  <User className="w-4 h-4 text-foreground" />
                </Link>
                <span className="h-6 w-px bg-border" />
                <button
                  title="Đăng xuất"
                  className="hover:opacity-80"
                  onClick={() => {
                    logout();
                    router.push(APP_ROUTES.HOME);
                    window.location.reload();
                  }}
                >
                  <LogOut className="w-4 h-4 text-foreground" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href={APP_ROUTES.SIGN_UP}
                  className="text-primary font-bold mr-2"
                >
                  Đăng Ký
                </Link>
                <span className="text-foreground mr-2">hoặc</span>
                <Link
                  href={APP_ROUTES.SIGN_IN}
                  className="text-primary font-bold mr-2"
                >
                  Đăng Nhập
                </Link>
              </>
            )}
            <span className="mx-2 h-6 border-l border-border" />
            <ThemeToggle />
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 mt-8 px-4 w-full items-center">
            <Link
              href={APP_ROUTES.HOME}
              className={`font-bold ${
                pathname === APP_ROUTES.HOME && !searchParams.toString()
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Trang chủ
            </Link>
            <div className="flex flex-col w-full items-center">
              <button
                className={`flex items-center gap-1 w-full justify-center py-2 focus:outline-none font-bold cursor-pointer ${
                  pathname === APP_ROUTES.CATEGORY
                    ? "text-primary"
                    : "text-foreground"
                }`}
                onClick={() => setCategoryOpen((v) => !v)}
                aria-expanded={categoryOpen}
                aria-controls="mobile-category-dropdown"
              >
                {getTypeDisplayName()}
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke={
                      pathname === APP_ROUTES.CATEGORY
                        ? "var(--primary)"
                        : "var(--foreground)"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {categoryOpen && (
                <div
                  id="mobile-category-dropdown"
                  className="flex flex-col w-full bg-card border border-border rounded-lg shadow-lg mt-2"
                >
                  <Link
                    href={`${APP_ROUTES.CATEGORY}?type=${STATUS_AUCTIONS.INITIAL}`}
                    className={`px-4 py-2 hover:bg-accent-foreground text-center ${
                      currentType === "initial"
                        ? "text-primary bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    Sắp đấu giá
                  </Link>
                  <Link
                    href={`${APP_ROUTES.CATEGORY}?type=${STATUS_AUCTIONS.HAPPENING}`}
                    className={`px-4 py-2 hover:bg-accent-foreground text-center ${
                      currentType === "happening"
                        ? "text-primary bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    Đang đấu giá
                  </Link>
                  <Link
                    href={`${APP_ROUTES.CATEGORY}?type=${STATUS_AUCTIONS.ENDED}`}
                    className={`px-4 py-2 hover:bg-accent-foreground text-center ${
                      currentType === "ended"
                        ? "text-primary bg-muted"
                        : "text-foreground"
                    }`}
                  >
                    Đã kết thúc
                  </Link>
                </div>
              )}
            </div>
            <Link
              href={APP_ROUTES.ABOUT}
              className={`font-bold ${
                pathname === APP_ROUTES.ABOUT
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Về chúng tôi
            </Link>
            <Link
              href={APP_ROUTES.NEWS}
              className={`font-bold ${
                pathname === APP_ROUTES.NEWS
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Tin tức
            </Link>
            <Link
              href={APP_ROUTES.CONTACT}
              className={`font-bold ${
                pathname === APP_ROUTES.CONTACT
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Liên hệ
            </Link>
            <Link
              href={APP_ROUTES.GUIDE}
              className={`font-bold ${
                pathname === APP_ROUTES.GUIDE
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              Hướng dẫn
            </Link>
            {user?.role === "admin" && (
              <Link
                href={APP_ROUTES.ADMIN}
                className={`font-bold ${
                  pathname === APP_ROUTES.ADMIN
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 w-full h-full bg-background z-50 flex flex-col lg:hidden">
          {/* Header with close button */}
          <div className="flex flex-row items-center justify-between h-[52px] px-4 bg-card">
            <span className="font-bold text-lg text-foreground">Tìm kiếm</span>
            <button
              className="w-5 h-5 flex items-center justify-center"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              {/* Close (X) icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="5"
                  y1="5"
                  x2="15"
                  y2="15"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="15"
                  y1="5"
                  x2="5"
                  y2="15"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {/* Search Content */}
          <div className="flex flex-col gap-4 p-4">
            {/* Search bar */}
            <div className="flex items-center bg-background border border-border rounded-lg px-4 h-10">
              <input
                className="flex-1 bg-transparent outline-none text-foreground placeholder-foreground"
                placeholder={
                  selectedCity !== "Thành phố"
                    ? `Tìm kiếm tại ${selectedCity}`
                    : "Nhập từ khoá.."
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            {/* Filters */}
            <div className="flex flex-row gap-2">
              {/* City Dropdown */}
              <div className="relative flex-1">
                <button
                  className="w-full h-10 bg-background border border-border rounded-lg flex items-center justify-between px-4 text-foreground"
                  onClick={() => setCityOpen((v) => !v)}
                  aria-expanded={cityOpen}
                  aria-controls="city-dropdown"
                >
                  {selectedCity}
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="var(--foreground)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {cityOpen && (
                  <div
                    id="city-dropdown"
                    className="absolute left-0 top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-20 flex flex-col"
                  >
                    {["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh"].map((city) => (
                      <button
                        key={city}
                        className="px-4 py-2 text-left hover:bg-muted text-foreground rounded-lg"
                        onClick={() => {
                          setSelectedCity(city);
                          setCityOpen(false);
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Category Dropdown */}
              <div className="relative flex-1">
                <button
                  className="w-full h-10 bg-background border border-border rounded-lg flex items-center justify-between px-4 text-foreground"
                  onClick={() => setCategoryOpen((v) => !v)}
                  aria-expanded={categoryOpen}
                  aria-controls="category-dropdown"
                >
                  {selectedCategory}
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="var(--foreground)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {categoryOpen && (
                  <div
                    id="category-dropdown"
                    className="absolute left-0 top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-20 flex flex-col"
                  >
                    {["Sắp đấu giá", "Đang đấu giá", "Đã kết thúc"].map(
                      (cat) => (
                        <button
                          key={cat}
                          className="px-4 py-2 text-left hover:bg-muted text-foreground rounded-lg"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCategoryOpen(false);
                          }}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Search Button */}
            <button className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg shadow flex items-center justify-center gap-2 text-base mt-4">
              Tìm kiếm
            </button>
          </div>
        </div>
      )}
    </>
  );
}
