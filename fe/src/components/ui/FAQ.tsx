import { CircleCheckBig, CreditCard, User, List } from "lucide-react";
import React from "react";

const steps = [
  {
    icon: (
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-foreground">
        <List className="w-8 h-8 text-foreground" />
      </span>
    ),
    title: "Tham khảo sản phẩm",
    subtitle: "Khám phá các mục đã xác minh trong nhiều danh mục.",
  },
  {
    icon: (
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-foreground">
        <User className="w-8 h-8 text-foreground" />
      </span>
    ),
    title: "Tạo tài khoản miễn phí",
    subtitle: "Nhanh chóng - chỉ mất dưới 5 phút!",
  },
  {
    icon: (
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-foreground">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="block w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.0049 20.0028V22.0028H2.00488V20.0028H14.0049ZM14.5907 0.689087L22.3688 8.46726L20.9546 9.88147L19.894 9.52792L17.4191 12.0028L23.076 17.6597L21.6617 19.0739L16.0049 13.417L13.6007 15.8212L13.8836 16.9525L12.4693 18.3668L4.69117 10.5886L6.10539 9.17437L7.23676 9.45721L13.53 3.16396L13.1765 2.1033L14.5907 0.689087ZM15.2978 4.22462L8.22671 11.2957L11.7622 14.8312L18.8333 7.76015L15.2978 4.22462Z" />
        </svg>
      </span>
    ),
    title: "Tham gia đấu giá",
    subtitle: "Đặt giá theo cách của bạn!",
  },
  {
    icon: (
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-foreground">
        <CreditCard className="w-8 h-8 text-foreground" />
      </span>
    ),
    title: "Thanh toán & nhận hàng",
    subtitle: "Bảo mật tuyệt đối, thanh toán linh hoạt!",
  },
];

const whyChecks = [
  {
    text: "Hỗ trợ trực tiếp 24/7",
    color: "text-primary",
    icon: "text-primary",
  },
  {
    text: "Kiểm tra trước khi thanh toán",
    color: "text-primary",
    icon: "text-primary",
  },
  {
    text: "Thanh toán bảo mật",
    color: "text-primary",
    icon: "text-primary",
  },
  {
    text: "Giao hàng toàn quốc",
    color: "text-primary",
    icon: "text-primary",
  },
];

export default function FAQ() {
  return (
    <section
      className="w-full py-12 px-4 flex flex-col lg:flex-row gap-16 lg:gap-0 lg:px-40"
      aria-labelledby="faq-title"
    >
      {/* How to participate */}
      <div className="flex flex-col gap-6 max-w-[375px] lg:max-w-none mx-auto">
        <div className="flex flex-col gap-1 items-center">
          <h2
            id="faq-title"
            className="text-2xl font-bold text-foreground text-center uppercase"
          >
            CÁCH THAM GIA ĐẤU GIÁ
          </h2>
          <p className="text-sm font-bold mt-2 text-foreground text-center uppercase">
            ĐẤU GIÁ CỰC DỄ - CHỈ VỚI CÁC BƯỚC SAU
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-row items-center gap-4 w-full bg-background border border-border rounded-xl shadow px-4 py-3"
            >
              {step.icon}
              <div className="flex-1">
                <div className="font-bold text-foreground text-base ">
                  {step.title}
                </div>
                <div className="text-xs text-foreground-secondary mt-1">
                  {step.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Why choose us */}
      <div className="flex flex-col gap-4 max-w-[375px] lg:max-w-none mx-auto items-center justify-center">
        <div className="flex flex-col gap-1 items-center justify-center">
          <h2 className="text-2xl font-bold text-foreground text-center uppercase">
            VÌ SAO CHỌN CHÚNG TÔI?
          </h2>
          <p className="text-sm font-bold text-foreground text-center uppercase mt-2">
            UY TÍN TẠO NIỀM TIN - GIAO DỊCH AN TOÀN
          </p>
        </div>
        <div className="flex flex-col gap-8 mt-8 w-fit">
          {whyChecks.map((item, i) => (
            <div
              key={i}
              className={`flex flex-row w-fit items-center gap-2 ${item.color}`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 ${item.icon}`}
              >
                <CircleCheckBig className={`w-6 h-6 ${item.icon}`} />
              </span>
              <span className={`text-sm ${item.color}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
