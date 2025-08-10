interface ProductQuickInfoProps {
  category: string;
  brand: string;
  condition: string;
  starterPrice: string;
  quickBuy?: string;
  currentPrice?: string;
}

export default function ProductQuickInfo({
  category,
  brand,
  condition,
  starterPrice,
  quickBuy,
  currentPrice,
}: ProductQuickInfoProps) {
  return (
    <div className="flex flex-col gap-2 mb-1">
      <div className="flex justify-between text-base">
        <span className="text-foreground font-medium">Phân loại:</span>
        <span className="text-foreground-secondary font-semibold">{category}</span>
      </div>
      <div className="flex justify-between text-base">
        <span className="text-foreground font-medium">Hãng:</span>
        <span className="text-foreground-secondary font-semibold">{brand}</span>
      </div>
      <div className="flex justify-between text-base">
        <span className="text-foreground font-medium">Tình trạng:</span>
        <span className="text-foreground-secondary font-semibold">{condition}</span>
      </div>
      <div className="flex justify-between text-base">
        <span className="text-foreground font-medium">Giá khởi điểm:</span>
        <span className="text-foreground-secondary font-semibold">{starterPrice}</span>
      </div>
      {quickBuy && (
        <div className="flex justify-between text-base">
          <span className="text-foreground font-medium">Giá mua ngay:</span>
          <span className="text-primary font-bold">{quickBuy}</span>
        </div>
      )}
      {currentPrice && (
        <div className="flex justify-between text-base">
          <span className="text-foreground font-medium">Giá hiện tại:</span>
          <span className="text-primary font-bold">{currentPrice}</span>
        </div>
      )}
    </div>
  );
} 