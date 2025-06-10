import React from "react";
import { Tabs, TabItem, EmptyState } from "@/common/components";
import { ProductDetailsResponse } from "../../types";
import ProductDescriptionTab from "./ProductDescriptionTab";
import ProductContentTab from "./ProductContentTab";

interface ProductDetailsTabsProps {
  product: ProductDetailsResponse;
  showContentTab: boolean;
  className?: string;
}

const ProductDetailsTabs: React.FC<ProductDetailsTabsProps> = ({
  product,
  showContentTab,
  className,
}) => {
  const tabItems: TabItem[] = [
    {
      id: "description",
      label: "Description",
      content: <ProductDescriptionTab product={product} />,
    },
  ];

  if (showContentTab) {
    tabItems.push({
      id: "content",
      label: "Content",
      content: <ProductContentTab product={product} />,
    });
  }

  tabItems.push({
    id: "reviews",
    label: "Reviews",
    content: (
      <EmptyState
        title="Coming Soon"
        message="News & Updates will be available soon."
        size="md"
      />
    ),
  });

  return (
    <div className={className}>
      <Tabs items={tabItems} defaultTabId="description" />
    </div>
  );
};

export default ProductDetailsTabs;
