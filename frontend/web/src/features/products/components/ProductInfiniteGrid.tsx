import React from "react";
import { InfiniteData } from "@tanstack/react-query";
import { CursorPagedResult } from "@/common/types";
import { useIntersectionObserver } from "@/common/hooks";
import { Button, EmptyState, ErrorDisplay, Spinner } from "@/common/components";
import { ProductSummaryResponse } from "../types";
import ProductPreviewCard from "./ProductPreviewCard";
import ProductSummaryCard from "./catalog/ProductSummaryCard";

interface InfiniteProductGridProps {
  data: InfiniteData<CursorPagedResult<ProductSummaryResponse>> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  refetch: () => void;
  emptyTitle: string;
  emptyMessage: string;
  onBookmark?: (productId: string) => void;
  type?: "summary" | "preview";
}

export const ProductInfiniteGrid: React.FC<InfiniteProductGridProps> = ({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  error,
  fetchNextPage,
  refetch,
  emptyTitle,
  emptyMessage,
  type = "preview",
}) => {
  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  const targetRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { enabled: hasNextPage && !isFetchingNextPage }
  );

  if (isLoading) {
    return <Spinner message="Loading products..." size="md" />;
  }

  if (error && allItems.length === 0) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load products"
        size="sm"
        onRetry={refetch}
      />
    );
  }

  if (allItems.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} size="md" />;
  }

  return (
    <div>
      {type == "summary" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allItems.map((product, index) => (
            <ProductSummaryCard
              key={`${product.id}-${index}`}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allItems.map((product, index) => (
            <ProductPreviewCard
              key={`${product.id}-${index}`}
              product={product}
            />
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" showMessage={false} />
        </div>
      )}

      {error && allItems.length > 0 && (
        <div className="flex justify-center py-4">
          <Button variant="outline" size="sm" onClick={refetch}>
            Failed to load more. Retry
          </Button>
        </div>
      )}

      <div ref={targetRef} className="h-1" />
    </div>
  );
};

export default ProductInfiniteGrid;
