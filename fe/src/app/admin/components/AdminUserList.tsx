import ConfirmationDialog from "@/components/common/confirmation-dialog";
import PaginationCustom from "@/components/common/pagination-custom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateUserStatus } from "@/services/admin";
import { useUserBuyAuction, useUserSellAuction } from "@/services/bid";
import { AdminBid, User } from "@/types";
import { getImageURL, getValidText, secureRandom } from "@/utils";
import debounce from "lodash.debounce";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";

interface AdminUserListProps {
  setTab: (tab: string) => void;
  setSelectedProduct: (p: AdminBid) => void;
  selectedUser: User | null;
  setSelectedUser: (u: User | null) => void;
  paramsUser: {
    page: number;
    limit: number;
    keyword: string;
  };
  setParamsUser: (u: { page: number; limit: number; keyword: string }) => void;
  refetchUsers: () => void;
  currentPageUser: number;
  totalPagesUsers: number;
  users: User[];
}

export default function AdminUserList({
  setTab,
  setSelectedProduct,
  selectedUser,
  setSelectedUser,
  paramsUser,
  setParamsUser,
  refetchUsers,
  currentPageUser,
  totalPagesUsers,
  users,
}: AdminUserListProps) {
  const selected = selectedUser;
  const { auctionsBuy } = useUserBuyAuction(selectedUser?._id ?? "");
  const { auctionsSell } = useUserSellAuction(selectedUser?._id ?? "");
  const { mutate: deleteUser } = useUpdateUserStatus();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((value: string) => {
      setParamsUser({ ...paramsUser, keyword: value, page: 1 });
    }, 500),
    []
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  const handleDeleteUser = () => {
    // delete selected
    deleteUser(selectedUser?._id ?? "", {
      onSuccess: () => {
        // back to list users view
        setSelectedUser(null);
        // refetch users
        refetchUsers();
      },
    });
  };

  const handleViewDetails = (u: User) => {
    setParamsUser({ ...paramsUser, keyword: "" });
    setSelectedUser(u);
  };

  const renderRecentProducts = (prod: AdminBid, idBuying: boolean) => {
    return (
      <div
        key={prod?._id ?? secureRandom()}
        className="bg-card rounded-xl border border-border p-4 flex flex-col gap-2 items-start mb-4"
      >
        <div className="font-bold text-foreground">
          {idBuying
            ? "Sản phẩm đã mua gần đây"
            : "Sản phẩm bán đấu giá gần đây"}
        </div>
        <div className="flex flex-row w-full gap-4 relative">
          <div className="flex-1 flex items-center gap-4">
            <Image
              src={getImageURL(prod?.image?.[0])}
              alt={getValidText(prod?.name)}
              width={160}
              height={160}
              className="rounded-md object-cover"
            />
            <div className="flex flex-col gap-2 w-full">
              <div className="font-semibold text-foreground">{prod.name}</div>
              <div className="text-sm text-foreground">
                Giá mua:{" "}
                <span className="text-red-500 font-bold">
                  {getValidText(prod.price)}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  className="lg:w-fit text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setTab("products");
                  }}
                >
                  Xem chi tiết <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selected) {
    // Detail view
    return (
      <div className="bg-background rounded-2xl shadow-lg border border-border p-4 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Thông tin người dùng
          </h2>
          <button
            className="text-primary bg-background rounded-full p-2 hover:bg-secondary/80 transition cursor-pointer"
            onClick={() => setSelectedUser(null)}
            aria-label="Quay lại"
          >
            <ArrowLeft />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mb-4 items-start">
          <div className="w-32 h-32 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-5xl text-yellow-700">
            {getValidText(selected?.full_name).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                Tên Người Dùng
              </label>
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={getValidText(selected?.user_name)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                Họ Tên
              </label>
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={getValidText(selected?.full_name)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                Địa Chỉ Email
              </label>
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={getValidText(selected?.email)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                Số Điện Thoại
              </label>
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={getValidText(selected?.phone)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                Vai trò
              </label>
              <input
                className="w-full rounded-lg border border-border px-4 py-2 bg-card text-foreground"
                value={selected?.role ?? "user"}
                readOnly
              />
            </div>
            <div className="flex items-end h-full">
              <Badge
                className={cn(
                  "px-4 py-2 text-base",
                  selected?.status
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white"
                )}
              >
                {selected?.status ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        {auctionsBuy?.map((prod: AdminBid) => renderRecentProducts(prod, true))}
        {auctionsSell?.map((prod: AdminBid) =>
          renderRecentProducts(prod, false)
        )}
        {selected?.status && (
          <div className="flex justify-end gap-2 mt-6">
            <ConfirmationDialog
              trigger={
                <Button className="bg-primary text-primary-foreground cursor-pointer">
                  Xoá Người Dùng
                </Button>
              }
              title="Xoá Người Dùng"
              description="Bạn chắc chắn muốn xóa người dùng này chứ?"
              confirmText="Xóa"
              cancelText="Hủy"
              onConfirm={handleDeleteUser}
              confirmButtonClassName="cursor-pointer"
            />
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="bg-background rounded-2xl shadow-lg border border-border p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Danh sách người dùng
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          onChange={onChange}
          className="flex-1 rounded-lg border border-border px-4 py-2 bg-card text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-0"
          placeholder="Tìm theo tên người dùng..."
        />
      </div>
      {users?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((u: User) => (
            <div
              key={u._id}
              className="bg-background rounded-xl border border-border p-4 flex flex-col gap-2 shadow"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-2xl text-yellow-700">
                  T
                </div>
                <div className="flex-1">
                  <div className="font-bold text-primary">
                    {getValidText(u?.user_name)}
                  </div>
                  <div className="font-semibold text-foreground">
                    {getValidText(u?.full_name)}
                  </div>
                  <div className="text-xs text-foreground-secondary">
                    {getValidText(u?.email)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-foreground">
                Số điện thoại: {getValidText(u?.phone)}
              </div>
              <div className="text-sm text-foreground">
                CCCD: {getValidText(u?.identity)}
              </div>
              <div className="text-sm text-foreground">
                Vai trò: {u?.role ?? "user"}
              </div>
              <div className="text-sm text-foreground">
                <Badge
                  className={cn(
                    u?.status
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white"
                  )}
                >
                  {u?.status ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-foreground/90 hover:text-primary-foreground transition"
                  onClick={() => handleViewDetails(u)}
                >
                  Xem Chi Tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center font-bold text-primary w-full">
          Không tìm thấy người dùng này!
        </div>
      )}
      {users?.length > 0 && (
        <PaginationCustom
          totalPages={totalPagesUsers}
          currentPage={currentPageUser}
          onPageChange={(p) => setParamsUser({ ...paramsUser, page: p })}
        />
      )}
    </div>
  );
}
