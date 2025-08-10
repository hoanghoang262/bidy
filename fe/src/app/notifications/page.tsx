"use client";
import { useAuth } from "../../hooks/useAuth";
import { Bell, ShieldCheck, User, X } from "lucide-react";
import { useState } from "react";

const adminNotifications = [
  {
    id: 1,
    type: "admin",
    title: "Báo cáo mới cần xử lý",
    message: "Có 2 báo cáo người dùng mới được gửi lên hệ thống.",
    time: "5 phút trước",
  },
  {
    id: 2,
    type: "admin",
    title: "Sản phẩm chờ duyệt",
    message: "Có 1 sản phẩm mới đang chờ duyệt đăng bán.",
    time: "1 giờ trước",
  },
  {
    id: 3,
    type: "admin",
    title: "Tài khoản bị cảnh báo",
    message: "Tài khoản user123 đã bị cảnh báo 2 lần.",
    time: "2 giờ trước",
  },
  {
    id: 4,
    type: "admin",
    title: "Hệ thống bảo trì",
    message: "Hệ thống sẽ bảo trì vào lúc 23:00 hôm nay.",
    time: "3 giờ trước",
  },
  {
    id: 5,
    type: "admin",
    title: "Người dùng mới đăng ký",
    message: "Có 5 người dùng mới đăng ký hôm nay.",
    time: "4 giờ trước",
  },
];

const userNotifications = [
  {
    id: 1,
    type: "user",
    title: "Đấu giá thành công!",
    message: "Bạn đã thắng phiên đấu giá sản phẩm Đồng hồ.",
    time: "10 phút trước",
  },
  {
    id: 2,
    type: "user",
    title: "Sản phẩm mới",
    message: "Sản phẩm iPhone 15 Pro Max vừa được đăng bán.",
    time: "1 giờ trước",
  },
  {
    id: 3,
    type: "user",
    title: "Cảnh báo tài khoản",
    message: "Tài khoản của bạn đã bị cảnh báo do vi phạm quy định.",
    time: "2 ngày trước",
  },
  {
    id: 4,
    type: "user",
    title: "Đấu giá thất bại",
    message: "Bạn đã không thắng phiên đấu giá sản phẩm Laptop.",
    time: "3 ngày trước",
  },
  {
    id: 5,
    type: "user",
    title: "Khuyến mãi mới",
    message: "Nhận mã giảm giá 10% cho lần đấu giá tiếp theo!",
    time: "4 ngày trước",
  },
];

function NotificationContent() {
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@email.com";
  const initialNotifications = isAdmin ? adminNotifications : userNotifications;
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <main
      className={`bg-background flex flex-col items-center justify-center py-10 px-4 ${
        !isAdmin ? "pb-64 lg:pb-32 min-h-screen" : "pb-64 lg:pb-32 min-h-screen"
      }`}
    >
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-lg p-4 lg:p-8">
        <div className="flex items-center gap-3 mb-6 justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Thông báo
            </h1>
          </div>
          {notifications.length > 0 && (
            <button
              className="text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg transition"
              onClick={handleClearAll}
            >
              Xóa tất cả
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4 max-h-[50dvh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center text-muted py-12">
              Không có thông báo nào.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex gap-4 items-start bg-background border border-border rounded-xl p-4 shadow-sm relative"
              >
                <div className="mt-1">
                  {n.type === "admin" ? (
                    <ShieldCheck className="w-7 h-7 text-red-500" />
                  ) : (
                    <User className="w-7 h-7 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground text-lg mb-1">
                    {n.title}
                  </div>
                  <div className="text-foreground-secondary mb-2">
                    {n.message}
                  </div>
                  <div className="text-xs text-foreground-secondary">
                    {n.time}
                  </div>
                </div>
                <button
                  className="absolute top-3 right-3 text-foreground-secondary hover:text-primary transition"
                  onClick={() => handleDelete(n.id)}
                  aria-label="Xóa thông báo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function NotificationPage() {
  return <NotificationContent />;
}
