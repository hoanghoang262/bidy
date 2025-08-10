"use client";
import React, { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { AdminBid, User } from "@/types";
import { useAdminAuctions, useAdminUsers } from "@/services/admin";

// Import components directly for immediate loading - eliminating lazy loading delay
import AdminDashboardContent from "./components/AdminDashboardContent";
import AdminProductList from "./components/AdminProductList";
import AdminUserList from "./components/AdminUserList";

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<AdminBid | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paramsUser, setParamsUser] = useState({
    page: 1,
    limit: 10,
    keyword: "",
  });
  const {
    users,
    totalPages: totalPagesUsers,
    currentPage: currentPageUser,
    refetchUsers,
  } = useAdminUsers({
    page: paramsUser.page,
    limit: paramsUser.limit,
    keyword: paramsUser.keyword,
  });
  const [paramsProduct, setParamsProduct] = useState({
    page: 1,
    limit: 10,
    keyword: "",
  });
  const {
    auctions: products,
    currentPage: currentPageProduct,
    totalPages: totalPagesProducts,
  } = useAdminAuctions({
    page: paramsProduct.page,
    limit: paramsProduct.limit,
    keyword: paramsProduct.keyword,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar tab={tab} setTab={setTab} />
      <div className="flex-1 p-10 bg-background">
        {tab === "dashboard" && (
          <AdminDashboardContent
            setTab={setTab}
            setSelectedProduct={setSelectedProduct}
            setSelectedUser={setSelectedUser}
            users={users}
          />
        )}
        {tab === "products" && (
          <AdminProductList
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            paramsProduct={paramsProduct}
            setParamsProduct={setParamsProduct}
            products={products}
            totalPagesProducts={totalPagesProducts}
            currentPageProduct={currentPageProduct}
          />
        )}
        {tab === "users" && (
          <AdminUserList
            setTab={setTab}
            setSelectedProduct={setSelectedProduct}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            paramsUser={paramsUser}
            setParamsUser={setParamsUser}
            users={users}
            totalPagesUsers={totalPagesUsers}
            currentPageUser={currentPageUser}
            refetchUsers={refetchUsers}
          />
        )}
      </div>
    </div>
  );
}
