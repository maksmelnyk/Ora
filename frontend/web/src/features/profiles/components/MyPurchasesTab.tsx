import ProductInfiniteGrid from "../../products/components/ProductInfiniteGrid";
import { usePurchasedProducts } from "../../products/hooks/useProducts";

interface MyPurchasesTabProps {
  userId: string;
}

export const MyPurchasesTab: React.FC<MyPurchasesTabProps> = ({ userId }) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
    refetch,
  } = usePurchasedProducts(userId);

  return (
    <ProductInfiniteGrid
      data={data}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      fetchNextPage={fetchNextPage}
      refetch={refetch}
      emptyTitle="No Purchases"
      emptyMessage="You haven't purchased any products yet."
    />
  );
};

export default MyPurchasesTab;
