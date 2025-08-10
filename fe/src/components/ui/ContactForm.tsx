"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    subject: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    subject: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: typeof errors = {
      email: "",
      name: "",
      subject: "",
      description: "",
    };
    if (!form.email) newErrors.email = "Vui lòng nhập địa chỉ email.";
    if (!form.name) newErrors.name = "Vui lòng nhập họ và tên.";
    if (!form.subject) newErrors.subject = "Vui lòng chọn chủ đề cần trợ giúp.";
    if (!form.description)
      newErrors.description = "Vui lòng nhập mô tả cụ thể.";
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      // Here you can handle the form submission (e.g., send to API)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[375px] lg:max-w-[80dvw] lg:w-[80dvw] mx-auto bg-background rounded-2xl shadow-lg p-4 lg:p-8 flex flex-col gap-4"
      style={{ boxShadow: "0 0 8px 0 rgba(108,108,108,0.25)" }}
      noValidate
    >
      <h2 className="text-lg font-bold text-center text-foreground mb-2">
        Form hỗ trợ người dùng
      </h2>
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-foreground"
          htmlFor="email"
        >
          Địa chỉ Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Nhập địa chỉ email"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-border"
          } bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary`}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email}</span>
        )}
      </div>
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-foreground"
          htmlFor="name"
        >
          Họ và tên *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Nhập họ và tên"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? "border-red-500" : "border-border"
          } bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary`}
        />
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name}</span>
        )}
      </div>
      {/* Subject */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-foreground"
          htmlFor="subject"
        >
          Chủ đề cần trợ giúp *
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.subject ? "border-red-500" : "border-border"
          } bg-background text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary`}
        >
          <option value="" disabled>
            Chọn chủ đề cần trợ giúp
          </option>
          <option value="tài khoản">Tài khoản</option>
          <option value="đấu giá">Đấu giá</option>
          <option value="thanh toán">Thanh toán</option>
          <option value="khác">Khác</option>
        </select>
        {errors.subject && (
          <span className="text-xs text-red-500">{errors.subject}</span>
        )}
      </div>
      {/* Description */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-foreground"
          htmlFor="description"
        >
          Mô tả cụ thể *
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả cụ thể nội dung cần trợ giúp"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description
              ? "border-red-500"
              : "border-border"
          } bg-background text-foreground-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y`}
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description}</span>
        )}
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 lg:mt-6 w-full lg:w-auto self-stretch lg:self-end flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg px-6 py-3 text-base shadow hover:bg-primary/80 transition"
      >
        Gửi yêu cầu
      </button>
      {submitted && (
        <div className="text-green-600 text-center mt-2 text-sm font-semibold">
          Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại sớm nhất.
        </div>
      )}
    </form>
  );
}
