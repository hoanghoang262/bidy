import React from "react";
import ProductCard from "./ProductCard";
import ProductGridCard from "./ProductGridCard";
import { secureRandom } from "@/utils";
import { Bid } from "@/types";

interface ProductListProps {
  products: Bid[];
  view: string;
  tab: string;
  buyerTab: string;
  handleProductClick: (product: Bid) => void;
  handleButtonClick: (
    e: React.MouseEvent,
    product: Bid,
    action: string
  ) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  view,
  tab,
  buyerTab,
  handleProductClick,
  handleButtonClick,
}) => {
  if (products?.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-secondary">
        Không có sản phẩm nào trong danh mục này.
      </div>
    );
  }
  
  // Force list view on mobile, allow grid view only on larger screens
  const effectiveView = view;
  
  return effectiveView === "list" ? (
    <div className="flex flex-col gap-4">
      {products &&
        products?.map((product) => (
          <ProductCard
            key={secureRandom()}
            product={product}
            tab={tab}
            buyerTab={buyerTab}
            handleProductClick={handleProductClick}
            handleButtonClick={handleButtonClick}
          />
        ))}
    </div>
  ) : (
    <>
      {/* Mobile: Always show list view */}
      <div className="flex flex-col gap-4 md:hidden">
        {products &&
          products?.map((product) => (
            <ProductCard
              key={secureRandom()}
              product={product}
              tab={tab}
              buyerTab={buyerTab}
              handleProductClick={handleProductClick}
              handleButtonClick={handleButtonClick}
            />
          ))}
      </div>
      {/* Desktop: Show grid view when selected */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products &&
          products?.map((product) => (
            <ProductGridCard
              key={secureRandom()}
              product={product}
              tab={tab}
              buyerTab={buyerTab}
              handleProductClick={handleProductClick}
              handleButtonClick={handleButtonClick}
            />
          ))}
      </div>
    </>
  );
};

export default ProductList;
