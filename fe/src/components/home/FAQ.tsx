import { CircleCheckBig, CreditCard, User } from "lucide-react";
import React from "react";

const steps = [
  {
    icon: (
      <span className="flex items-center justify-center w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-accent text-foreground">
        <User className="w-8 h-8 lg:w-12 lg:h-12" />
      </span>
    ),
    title: "Tạo tài khoản miễn phí",
    subtitle: "Nhanh chóng - chỉ mất dưới 5 phút!",
  },
  {
    icon: (
      <span className="flex items-center justify-center w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-accent text-foreground">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="block w-8 h-8 lg:w-10 lg:h-10"
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
      <span className="flex items-center justify-center w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-accent text-foreground">
        <CreditCard className="w-8 h-8 lg:w-12 lg:h-12" />
      </span>
    ),
    title: "Thanh toán & nhận hàng",
    subtitle: "Bảo mật tuyệt đối, thanh toán linh hoạt!",
  },
];

const whyChecks = [
  "Hỗ trợ trực tiếp 24/7",
  "Kiểm tra trước khi thanh toán",
  "Thanh toán bảo mật",
  "Giao hàng toàn quốc",
];

export default function FAQ() {
  return (
    <section
      className="w-full p-8 py-16 lg:py-8 lg:px-24 xl:px-48 bg-gradient-to-t from-background to-accent-foreground flex flex-col lg:flex-row gap-16  xl:gap-16"
      aria-labelledby="faq-title"
    >
      {/* How to participate */}
      <div className="flex flex-col gap-4 flex-1 max-w-full lg:max-w-[632px] lg:justify-center lg:items-center">
        <div className="mb-2 lg:mb-8 items-center flex flex-col gap-0">
          <h2
            id="faq-title"
            className="text-2xl  font-semibold text-foreground text-center lg:text-left"
          >
            CÁCH THAM GIA ĐẤU GIÁ
          </h2>
          <p className="text-sm text-foreground-secondary text-center lg:text-left mt-2 lg:mt-4">
            Đấu giá cực dễ - chỉ với các bước sau
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-row items-center gap-4 w-full max-w-[343px] bg-card border border-border rounded-xl shadow-md px-4 py-3"
            >
              {step.icon}
              <div className="flex-1">
                <div className="font-semibold text-foreground text-base ">
                  {step.title}
                </div>
                <div className="text-xs lg:text-md text-foreground-secondary mt-1">
                  {step.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Why choose us */}
      <div className="flex flex-col items-center flex-1 max-w-full lg:max-w-[632px] lg:justify-center lg:items-center gap-4 ">
        <div className="mb-2 lg:mb-8 items-center flex flex-col gap-0">
          <h2 className="text-2xl  font-semibold text-foreground text-center lg:text-left">
            VÌ SAO CHỌN CHÚNG TÔI?
          </h2>
          <p className="text-sm  text-foreground-secondary text-center lg:text-left mt-2 lg:mt-4">
            Uy tín tạo niềm tin - giao dịch an toàn
          </p>
        </div>
        <div className="flex flex-col gap-2 lg:gap-16 w-fit">
          {whyChecks.map((text, i) => (
            <div key={i} className="flex flex-row items-center gap-2 ">
              <span className="inline-flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8">
                <CircleCheckBig className="text-primary w-6 h-6 lg:w-8 lg:h-8" />
              </span>
              <span className="text-foreground text-sm ">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
