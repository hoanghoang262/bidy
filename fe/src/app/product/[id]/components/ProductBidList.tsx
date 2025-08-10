import Image from "next/image";
import { STATUS_AUCTIONS } from "@/constants/app.enum";

export interface Bid {
  id: number;
  name: string;
  avatar: string;
  time: string;
  amount: number;
}

interface ProductBidListProps {
  bids: Bid[];
  formatCurrency: (amount: number) => string;
  type: STATUS_AUCTIONS;
}

export default function ProductBidList({ bids, formatCurrency, type }: ProductBidListProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center h-fit py-3 px-6 border-b border-border bg-card rounded-t-2xl">
        <span className="text-lg font-semibold text-primary">
          Danh sách đấu giá <span className="text-foreground-secondary text-sm">&nbsp;(cập nhật sau mỗi 30s)</span>
        </span>
      </div>
      <div className="bg-card rounded-b-2xl shadow-sm p-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
        {bids.slice(0, 3).map((bid, idx) => (
          <div
            key={bid.id}
            className="flex items-center bg-background rounded-xl border border-border shadow-sm p-4 gap-4"
          >
            <Image
              src={bid.avatar}
              alt={bid.name}
              width={60}
              height={60}
              className="rounded-full object-cover w-[60px] h-[60px]"
            />
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-base">
                  {bid.name}
                </span>
                {type === STATUS_AUCTIONS.ENDED && idx === 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Người thắng
                  </span>
                )}
              </div>
              <span className="text-xs text-foreground-secondary">{bid.time}</span>
            </div>
            <span
              className={`text-lg font-bold ${idx === 0 ? "text-primary" : "text-foreground"}`}
            >
              {formatCurrency(bid.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 