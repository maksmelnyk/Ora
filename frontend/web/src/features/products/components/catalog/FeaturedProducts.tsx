import React from "react";
import { Tabs, TabItem } from "@/common/components";
import { ProductSummaryCard } from "./ProductSummaryCard";
import { ProductSummaryResponse } from "../../types";
import { TAB_CONFIG } from "../../constants";

interface FeaturedProductsProps {
  products: ProductSummaryResponse[];
  onBookmark: (productId: string) => void;
  isLoading?: boolean;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onBookmark,
  isLoading = false,
}) => {
  const ProductGrid: React.FC<{
    products: ProductSummaryResponse[];
    keyPrefix: string;
  }> = ({ products: tabProducts, keyPrefix }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tabProducts.map((product) => (
        <ProductSummaryCard
          key={`${keyPrefix}-${product.id}`}
          product={product}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );

  const getGroupedTabItems = (
    products: ProductSummaryResponse[] = []
  ): TabItem[] => {
    const chunkSize = 3;

    return TAB_CONFIG.map((tab, index) => {
      const startIndex = index * chunkSize;
      const tabProducts = products.slice(startIndex, startIndex + chunkSize);

      if (tabProducts.length === 0) return null;

      return {
        id: tab.id,
        label: tab.label,
        content: (
          <ProductGrid
            products={tabProducts}
            keyPrefix={tab.id.toLowerCase()}
          />
        ),
      };
    }).filter(Boolean) as TabItem[];
  };

  const tabItems = getGroupedTabItems(products);

  if (isLoading) {
    return (
      <section className="mb-20">
        <div className="mb-4">
          <h2 className="ora-heading text-2xl text-ora-navy">
            Featured Products
          </h2>
          <p className="mt-2 ora-body text-ora-gray">
            Discover our top-rated and trending courses
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-ora-gray-100 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mb-20">
      <div className="mb-4">
        <h2 className="ora-heading text-2xl text-ora-navy">
          Featured Products
        </h2>
        <p className="mt-2 ora-body text-ora-gray">
          Discover our top-rated and trending courses
        </p>
      </div>
      <Tabs items={tabItems} defaultTabId={TAB_CONFIG[0].id} />
    </section>
  );
};

export default FeaturedProducts;
