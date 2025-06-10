import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/common/components";
import { ProductType } from "../../products/types";
import { useEducatorProducts } from "../../products/hooks/useProducts";
import ProductInfiniteGrid from "../../products/components/ProductInfiniteGrid";
import { routes } from "@/common/constants/routes";

const PRODUCT_TYPE_FILTERS = [
  { id: "all", label: "All", value: undefined },
  { id: "courses", label: "Courses", value: ProductType.PreRecordedCourse },
  { id: "1on1", label: "1-on-1", value: ProductType.PrivateSession },
  {
    id: "group-courses",
    label: "Group Courses",
    value: ProductType.OnlineCourse,
  },
  {
    id: "group-classes",
    label: "Group Classes",
    value: ProductType.GroupSession,
  },
];

interface EducatorContentTabProps {
  educatorId: string;
  allowCreate: boolean;
}

export const EducatorOffersTab: React.FC<EducatorContentTabProps> = ({
  educatorId,
  allowCreate,
}) => {
  const [selectedProductType, setSelectedProductType] = useState<
    ProductType | undefined
  >(undefined);
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
    refetch,
  } = useEducatorProducts(educatorId, selectedProductType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPE_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={
                selectedProductType === filter.value ? "neutral" : "outline"
              }
              size="xs"
              onClick={() => setSelectedProductType(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        {allowCreate && (
          <Button
            variant="secondary"
            size="xs"
            onClick={() => navigate(routes.products.create)}
          >
            Add
          </Button>
        )}
      </div>

      <ProductInfiniteGrid
        type="summary"
        data={data}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        fetchNextPage={fetchNextPage}
        refetch={refetch}
        emptyTitle="No Products"
        emptyMessage="This educator hasn't published any products yet."
      />
    </div>
  );
};

export default EducatorOffersTab;
