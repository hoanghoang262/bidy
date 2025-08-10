import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  useAdminAuctions,
  useAdminStatistic,
  useAdminStatisticAuctions,
  useAdminStatisticUsers,
} from "@/services/admin";
import {
  getImageURL,
  getValidNumber,
  getValidText,
  secureRandom,
} from "@/utils";
import { AdminBid, User } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { YearSelect } from "@/app/admin/components/YearSelect";

interface AdminDashboardContentProps {
  setTab?: (tab: string) => void;
  setSelectedProduct?: (p: AdminBid | null) => void;
  setSelectedUser?: (u: User | null) => void;
  users: User[];
}

export default function AdminDashboardContent({
  setTab,
  setSelectedProduct,
  setSelectedUser,
  users,
}: AdminDashboardContentProps) {
  const { statistics } = useAdminStatistic();
  const { auctions: products } = useAdminAuctions({
    page: 1,
    limit: 3,
  });
  const currentYear = new Date().getFullYear().toString();

  const [yearAuction, setYearAuction] = useState(currentYear);
  const [yearUser, setYearUser] = useState(currentYear);
  const { statisticsAuctions, refetchStatsAuctions } =
    useAdminStatisticAuctions(yearAuction);
  const { statisticsUsers, refetchStatsUsers } =
    useAdminStatisticUsers(yearUser);

  // Call your fetch functions when year changes
  useEffect(() => {
    refetchStatsAuctions();
  }, [refetchStatsAuctions, yearAuction]);

  useEffect(() => {
    refetchStatsUsers();
  }, [refetchStatsUsers, yearUser]);

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Chào mừng quay lại trang dashboard!
      </h1>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-background rounded-xl shadow border border-border p-6 flex flex-col items-start gap-2">
          <div className="text-2xl font-bold text-primary">Users</div>
          <div className="text-foreground flex justify-between w-full">
            <div>Total users</div>
            <div>{getValidNumber(statistics?.users?.totalUsers)}</div>
          </div>
          <div className="text-foreground flex justify-between w-full">
            <div>Active users</div>
            <div>{getValidNumber(statistics?.users?.isActive)}</div>
          </div>
          <div className="text-foreground flex justify-between w-full">
            <div>Block users</div>
            <div>{getValidNumber(statistics?.users?.isBlock)}</div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow border border-border p-6 flex flex-col items-start gap-2">
          <div className="text-2xl font-bold text-primary">Auctions</div>
          <div className="text-foreground flex justify-between w-full">
            <div>Total auctions</div>
            <div>{getValidNumber(statistics?.auctions?.totalAuctions)}</div>
          </div>
          <div className="text-foreground flex justify-between w-full">
            <div>Happening auctions</div>
            <div>{getValidNumber(statistics?.auctions?.isHappening)}</div>
          </div>
          <div className="text-foreground flex justify-between w-full">
            <div>Ended auctions</div>
            <div>{getValidNumber(statistics?.auctions?.isFinished)}</div>
          </div>
        </div>
        <div className="bg-background rounded-xl shadow border border-border p-6 flex flex-col items-start gap-2">
          <div className="text-2xl font-bold text-primary">Categories</div>
          <div className="text-foreground flex justify-between w-full">
            <div>Total categories</div>
            <div>{getValidNumber(statistics?.categories?.totalCategories)}</div>
          </div>
          <div className="text-foreground flex justify-between w-full">
            <div>Shown categories</div>
            <div>{getValidNumber(statistics?.categories?.isShow)}</div>
          </div>
          <div className="text-foreground flex justify-between w-full">
            <div>Hide categories</div>
            <div>{getValidNumber(statistics?.categories?.isHide)}</div>
          </div>
        </div>
      </div>
      {/* Reports and Side Cards */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Side Cards */}
        <div className="w-full flex flex-col gap-6">
          <div className="bg-background rounded-2xl shadow-lg border border-border p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-foreground">
                Phiên đấu giá
              </span>
              <button
                className="text-primary text-lg cursor-pointer"
                onClick={() => {
                  if (setSelectedProduct) setSelectedProduct(null);
                  if (setTab) setTab("products");
                }}
              >
                <ArrowRight />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 h-full">
              {products?.map((product: AdminBid) => (
                <div
                  key={product?._id ?? secureRandom()}
                  className="bg-background rounded-2xl shadow-lg border border-border p-2 flex flex-col gap-3"
                >
                  <div
                    className="flex flex-col md:flex-row items-center gap-3 h-full"
                  >
                    <Image
                      src={getImageURL(product?.image?.[0])}
                      alt="product"
                      width={128}
                      height={128}
                      className="rounded-md object-cover w-full md:w-auto h-auto md:h-full"
                    />
                    <div className="flex flex-col w-full items-start">
                      <div className="font-semibold text-foreground my-1">
                        {getValidText(product?.name)}
                      </div>
                      <div className="text-xs text-foreground-secondary truncate my-1">
                        {getValidText(product?.description)}
                      </div>
                      <div className="text-xs text-foreground-secondary my-1">
                        Price: {getValidText(product?.price)}
                      </div>
                      <button
                        className="cursor-pointer w-full bg-primary text-primary-foreground font-semibold rounded-lg py-2 px-1 mt-2 text-sm shadow hover:bg-primary/80 transition"
                        onClick={() => {
                          if (setSelectedProduct)
                            setSelectedProduct(products[0]);
                          if (setTab) setTab("products");
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* New User Card */}
          <div className="bg-background rounded-2xl shadow-lg border border-border p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-foreground">
                Người dùng
              </span>
              <button
                className="text-primary text-lg cursor-pointer"
                onClick={() => {
                  if (setSelectedUser) setSelectedUser(null);
                  if (setTab) setTab("users");
                }}
              >
                <ArrowRight />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
              {users?.slice(0, 3).map((user: User) => (
                <div
                  key={user?._id ?? secureRandom()}
                  className="bg-background rounded-2xl shadow-lg border border-border p-4 flex flex-col gap-4 lg:gap-3 h-full"
                >
                  <div className="flex flex-col xl:flex-row items-center gap-4 lg:gap-3 justify-between items-start h-full">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-xl text-yellow-700">
                      {getValidText(user?.full_name)[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {getValidText(user?.full_name)}
                      </div>
                      <div className="text-xs text-foreground-secondary">
                        {getValidText(user?.email)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full cursor-pointer bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-2 text-base shadow hover:bg-primary/80 transition"
                    onClick={() => {
                      if (setSelectedUser) setSelectedUser(user);
                      if (setTab) setTab("users");
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Analytics Section */}
      {/* Auctions Chart */}
      <div className="bg-background rounded-2xl shadow-lg border border-border p-4 flex flex-col mb-8">
        <div className="flex items-center justify-between">
          <div className="text-lg text-foreground font-bold mb-4">
            Phân tích phiên đấu giá hàng tháng
          </div>
          <YearSelect value={yearAuction} onChange={setYearAuction} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statisticsAuctions ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              label={{
                value: "Amount",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              name="Month"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Users Chart */}
      <div className="bg-background rounded-2xl shadow-lg border border-border p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg text-foreground font-bold mb-4">
            Phân tích người dùng hàng tháng
          </div>
          <YearSelect value={yearUser} onChange={setYearUser} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statisticsUsers ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              label={{
                value: "Amount",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              name="Month"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
