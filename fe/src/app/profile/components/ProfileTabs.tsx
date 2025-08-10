import React from "react";

interface ProfileTabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tab, setTab }) => (
  <div className="flex items-center justify-center gap-12 mb-4 w-full">
    <button
      className={`cursor-pointer text-xl font-semibold pb-2 w-full px-2 border-b-2 transition-colors ${
        tab === "seller"
          ? "text-primary border-primary"
          : "text-foreground border-transparent"
      }`}
      onClick={() => setTab("seller")}
    >
      Người bán
    </button>
    <button
      className={`cursor-pointer text-xl font-semibold pb-2 w-full px-2 border-b-2 transition-colors ${
        tab === "buyer"
          ? "text-primary border-primary"
          : "text-foreground border-transparent"
      }`}
      onClick={() => setTab("buyer")}
    >
      Người mua
    </button>
  </div>
);

export default ProfileTabs;
