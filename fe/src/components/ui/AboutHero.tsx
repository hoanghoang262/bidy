import React from "react";

export default function AboutHero() {
  return (
    <section
      className="w-full p-4"
      style={{
        background:
          "linear-gradient(45deg, var(--destructive) 0%, var(--accent-foreground) 60%, var(--accent) 100%)",
      }}
    >
      <div className="mx-auto flex flex-col gap-6 px-4 py-16 w-full items-center justify-center">
        <h1
          className="text-4xl font-extrabold uppercase leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          BIDY - NƠI GIÁ TRỊ GIAO THOA VỚI NIỀM TIN
        </h1>
        <div className="flex flex-col gap-4 w-fit items-center justify-center">
          <p className="text-xl" style={{ color: "var(--foreground-secondary)" }}>
            Chúng tôi giúp kết nối người mua và người bán qua nền tảng đấu giá
            công bằng, minh bạch, và cạnh tranh.
          </p>
          <button className="w-full lg:w-fit px-4 h-12 font-semibold rounded-md text-xl shadow transition-colors hover:bg-primary/80 bg-primary text-primary-foreground">
            Bắt Đầu Đấu Giá Ngay
          </button>
        </div>
      </div>
    </section>
  );
}
