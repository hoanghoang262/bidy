"use client";

import React, { useState, useMemo } from "react";

const guideSections = [
  {
    title: "Các câu hỏi thường gặp",
    items: [
      {
        title: "Đấu giá & Phiên đấu giá",
        details:
          "Tìm hiểu về quy trình đấu giá và các loại phiên đấu giá khác nhau.",
      },
      {
        title: "Tài khoản",
        details: "Hướng dẫn tạo và quản lý tài khoản của bạn.",
      },
      {
        title: "Đăng sản phẩm đấu giá",
        details: "Cách đăng sản phẩm để bán đấu giá một cách hiệu quả.",
      },
      {
        title: "Thanh toán & Hoá đơn",
        details: "Thông tin về các phương thức thanh toán và hoá đơn.",
      },
      {
        title: "Vận chuyển & Hoàn trả",
        details: "Chính sách vận chuyển và hoàn trả sản phẩm.",
      },
    ],
  },
  {
    title: "Các điều khoản và chính sách",
    items: [
      {
        title: "Điều khoản dịch vụ",
        details: "Điều khoản và điều kiện sử dụng dịch vụ của chúng tôi.",
      },
      {
        title: "Chính sách bảo mật",
        details: "Chính sách bảo mật thông tin cá nhân của người dùng.",
      },
      {
        title: "Điều khoản & Điều kiện",
        details: "Các điều khoản và điều kiện chi tiết khi sử dụng nền tảng.",
      },
      {
        title: "Chính sách hoàn trả",
        details: "Chính sách hoàn trả và đổi trả sản phẩm.",
      },
    ],
  },
  {
    title: "Hướng dẫn cho người mới",
    items: [
      {
        title: "Cách đấu giá",
        details: "Hướng dẫn từng bước cách tham gia đấu giá.",
      },
      {
        title: "Cách bán đấu giá",
        details: "Hướng dẫn cách đăng và bán sản phẩm đấu giá.",
      },
      {
        title: "Các mẹo đặt giá để chiến thắng",
        details: "Những mẹo và chiến lược để đặt giá hiệu quả.",
      },
    ],
  },
];

function AddIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className={`transition-transform duration-200 ${
        isExpanded ? "rotate-45" : ""
      }`}
    >
      <rect width="20" height="20" fill="none" />
      <path
        d="M10 4.167v11.666M4.167 10h11.666"
        stroke="var(--primary-600, #444)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Function to highlight search terms in text
function highlightSearchTerm(text: string, searchTerm: string) {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-primary text-primary-foreground font-medium px-0.5 py-1 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function GuideMain() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (sectionTitle: string, itemTitle: string) => {
    const key = `${sectionTitle}-${itemTitle}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter guide sections based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return guideSections;
    }

    const searchLower = searchTerm.toLowerCase();

    return guideSections
      .map((section) => {
        const filteredItems = section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchLower) ||
            item.details.toLowerCase().includes(searchLower)
        );

        // Only include sections that have matching items
        if (filteredItems.length > 0) {
          return {
            ...section,
            items: filteredItems,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof guideSections;
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Auto-expand items when searching
    if (e.target.value.trim()) {
      const newExpandedItems: Record<string, boolean> = {};
      filteredSections.forEach((section) => {
        section.items.forEach((item) => {
          const key = `${section.title}-${item.title}`;
          newExpandedItems[key] = true;
        });
      });
      setExpandedItems(newExpandedItems);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-8 pb-64 lg:pb-32 bg-gradient-to-t from-background via-accent-foreground to-background">
      <div className="w-full max-w-[375px] lg:max-w-2xl px-2 py-8">
        <div className="flex flex-col gap-16">
          {/* Title */}
          <div className="flex flex-col gap-2 text-center w-full items-center justify-center">
            <p className="text-2xl lg:text-3xl font-bold text-primary w-full lg:w-fit text-center">
              HƯỚNG DẪN
            </p>
          </div>
          {/* Search Placeholder */}
          <div
            className="flex items-center bg-background border border-border rounded-lg shadow-sm px-4 py-3 gap-2"
            style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,0.10)" }}
          >
            <input
              type="text"
              placeholder="Tìm chủ đề hướng dẫn..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 text-foreground text-sm bg-transparent border-none outline-none placeholder:text-foreground-secondary"
            />
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle
                cx="9.167"
                cy="9.167"
                r="6.667"
                stroke="var(--primary)"
                strokeWidth="1.5"
              />
              <path
                d="M15 15L17.5 17.5"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Guide Sections */}
          <div className="flex flex-col gap-8">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <div
                  key={section.title}
                  className="bg-background rounded-2xl shadow-md px-4 py-6"
                  style={{
                    boxShadow: "0 0 8px 0 rgba(108,108,108,0.15)",
                  }}
                >
                  <div className="text-lg font-semibold text-foreground mb-4">
                    {section.title}
                  </div>
                  <div className="flex flex-col gap-4">
                    {section.items.map((item) => {
                      const key = `${section.title}-${item.title}`;
                      const isExpanded = expandedItems[key] || false;

                      return (
                        <div key={item.title} className="flex flex-col">
                          <div
                            className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3 shadow-sm cursor-pointer"
                            style={{ boxShadow: "0 0 6px 0 rgba(0,0,0,0.10)" }}
                            onClick={() =>
                              toggleItem(section.title, item.title)
                            }
                          >
                            <span className="text-foreground text-base">
                              {highlightSearchTerm(item.title, searchTerm)}
                            </span>
                            <button
                              type="button"
                              aria-label={
                                isExpanded ? "Thu gọn" : "Xem chi tiết"
                              }
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(section.title, item.title);
                              }}
                            >
                              <AddIcon isExpanded={isExpanded} />
                            </button>
                          </div>
                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-2 bg-background border border-border rounded-lg px-4 py-3">
                              <p className="text-foreground-secondary text-sm leading-relaxed">
                                {highlightSearchTerm(item.details, searchTerm)}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-foreground-secondary text-base">
                  Không tìm thấy kết quả cho &quot;{searchTerm}&quot;
                </p>
                <p className="text-foreground-secondary text-sm mt-2">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
