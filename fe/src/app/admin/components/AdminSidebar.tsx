import React, { useState } from "react";
import { LayoutDashboard, LayoutList, Users, ChevronDown } from "lucide-react";

interface AdminSidebarProps {
  tab: string;
  setTab: (tab: string) => void;
}

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  {
    key: "products",
    label: "Danh sách sản phẩm",
    icon: <LayoutList size={16} />,
  },
  { key: "users", label: "Danh sách người dùng", icon: <Users size={16} /> },
];

export default function AdminSidebar({ tab, setTab }: AdminSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const currentTab = tabs.find((t) => t.key === tab) || tabs[0];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-1/6 min-w-[240px] min-h-screen bg-muted border-r border-border flex-col gap-8 py-8 px-4 hidden lg:flex">
        <div className="flex flex-col gap-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`cursor-pointer flex flex-row justify-start items-center gap-3 px-3 py-3 rounded-full font-semibold text-base transition ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              <span className="text-sm">{t.label}</span>
            </button>
          ))}
        </div>
      </aside>
      {/* Mobile horizontal dropdown */}
      <div className="lg:hidden bg-muted border-b border-border px-4 py-3 flex flex-col relative z-20">
        <button
          className="cursor-pointer flex items-center gap-2 w-full justify-between px-4 py-2 rounded-lg font-semibold text-base bg-secondary text-foreground"
          onClick={() => setOpenDropdown((v) => !v)}
        >
          <span className="flex items-center gap-2">
            {currentTab.icon} {currentTab.label}
          </span>
          <ChevronDown
            size={18}
            className={openDropdown ? "rotate-180 transition" : "transition"}
          />
        </button>
        {openDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-secondary border border-border rounded-lg shadow-lg flex flex-col">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`flex flex-row items-center gap-2 px-4 py-3 w-full font-semibold text-sm transition whitespace-nowrap ${
                  tab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary/80"
                }`}
                onClick={() => {
                  setTab(t.key);
                  setOpenDropdown(false);
                }}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
