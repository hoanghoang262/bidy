import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes.constants";
import { User } from "@/types";
import { getValidText } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ProfileSidebarProps {
  profile: User;
  isLoading: boolean;
}
export default function ProfileSidebar({
  profile,
  isLoading,
}: ProfileSidebarProps) {
  const { resolvedTheme } = useTheme();
  const [defaultAvt, setDefaultAvt] = useState("/ava-light.png");

  useEffect(() => {
    if (resolvedTheme === "light") setDefaultAvt("/ava-light.png");
    else setDefaultAvt("/ava-dark.png");
  }, [resolvedTheme]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <aside className="w-full max-w-[342px] flex flex-col gap-4">
      {/* Info Card */}
      <div className="bg-card border border-border rounded-2xl shadow-md p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="text-base font-semibold text-primary text-center">
            Thông tin cá nhân
          </div>
          <div className="flex flex-col items-center gap-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ) : (
              <>
                <Image
                  src={profile?.avatar ?? defaultAvt}
                  alt={getValidText(profile?.full_name)}
                  width={200}
                  height={200}
                  className="rounded-full object-cover w-[200px] h-[200px] border-4 border-primary"
                />
                <div className="text-lg font-bold text-foreground mt-2">
                  {getValidText(profile?.full_name)}
                </div>
                <div className="font-semibold text-foreground-secondary">
                  {getValidText(profile?.user_name)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Contact Info */}
      <div className="bg-card border border-border rounded-2xl shadow-md p-4 flex flex-col gap-4">
        <div className="text-base font-semibold text-foreground w-full text-center lg:text-left">
          Thông tin liên hệ
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Mail className="text-primary" size={20} />
                <span className="text-sm text-foreground-secondary">
                  {getValidText(profile?.email)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-primary" size={20} />
                <span className="text-sm text-foreground-secondary">
                  {getValidText(profile?.phone)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Bottom Action Button */}
      <Link
        href={APP_ROUTES.SETTINGS}
        className="flex items-center justify-center w-full h-10 rounded-full border border-border text-primary font-semibold mt-2 hover:bg-primary hover:text-background"
      >
        Cài đặt
      </Link>
    </aside>
  );
}
