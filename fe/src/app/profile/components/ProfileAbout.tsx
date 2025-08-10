import React from "react";

interface ProfileAboutProps {
  isSeller: boolean;
  about: string;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ isSeller, about }) => (
  <div className="rounded-2xl bg-background border border-border shadow-md p-6 flex flex-col gap-2">
    <div className="text-base font-semibold text-foreground mb-2">
      {isSeller ? "Về Người Bán" : "Về Người Mua"}
    </div>
    <div className="text-foreground-secondary text-base leading-relaxed">
      {about}
    </div>
  </div>
);

export default ProfileAbout; 