import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/common/constants/routes";
import { usePagination } from "@/common/hooks";
import {
  ErrorDisplay,
  Layout,
  NoProductsFound,
  Pagination,
  SidebarLayout,
  Spinner,
  SubHeader,
} from "@/common/components";
import {
  getProductPath,
  getProductTypeFromParam,
  getSubHeaderItems,
} from "../utils";
import useProductFilters from "../hooks/useProductFilters";
import { useProducts } from "../hooks/useProducts";
import { useRecommendedEducators } from "../../educators/hooks/useEducator";
import FeaturedProducts from "../components/catalog/FeaturedProducts";
import RecommendedEducators from "../components/catalog/RecommendedEducators";
import ProductFiltersSidebar from "../components/catalog/ProductFilters";
import ProductSummaryCard from "../components/catalog/ProductSummaryCard";

export const ProductCatalogPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pagination = usePagination({ defaultPage: 1, defaultPageSize: 12 });

  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get("type");
  const currentProductType = getProductTypeFromParam(typeParam);

  const {
    filters,
    filtersForQuery,
    setFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useProductFilters({ defaultProductType: currentProductType });

  useEffect(() => {
    if (!typeParam) {
      navigate(getProductPath(null), { replace: true });
    }
  }, [typeParam, navigate]);

  useEffect(() => {
    if (filters.type !== currentProductType) {
      updateFilters({ type: currentProductType });
    }
  }, [currentProductType, filters.type, updateFilters]);

  const {
    data: productData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts(pagination.currentPage, pagination.pageSize, filtersForQuery);

  const {
    data: educatorData,
    isLoading: educatorsLoading,
    error: educatorsError,
  } = useRecommendedEducators(1, 3);

  const handleBookmark = (productId: string) => {
    console.log("Bookmark product:", productId);
  };

  const topSections = (
    <div className="space-y-12">
      <FeaturedProducts
        products={productData?.items || []}
        onBookmark={handleBookmark}
        isLoading={productsLoading}
      />

      <RecommendedEducators
        educators={educatorData?.items || []}
        isLoading={educatorsLoading}
        error={educatorsError}
      />
    </div>
  );

  const subHeaderItems = getSubHeaderItems();

  if (!typeParam) {
    return (
      <Layout>
        <SidebarLayout sidebar={[]} wide>
          <Spinner message="Redirecting..." size="md" className="py-12" />
        </SidebarLayout>
      </Layout>
    );
  }

  const sidebarContent = (
    <ProductFiltersSidebar
      filters={filters}
      onFiltersChange={setFilters}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    />
  );

  if (productsLoading || educatorsLoading) {
    return (
      <Layout>
        <SidebarLayout
          subHeader={<SubHeader items={subHeaderItems} />}
          sidebar={sidebarContent}
          wide
        >
          <Spinner message="Loading products..." size="md" className="py-12" />
        </SidebarLayout>
      </Layout>
    );
  }

  if (productsError) {
    return (
      <Layout>
        <SidebarLayout
          subHeader={<SubHeader items={subHeaderItems} />}
          sidebar={sidebarContent}
          wide
        >
          <ErrorDisplay
            error={productsError}
            onRetry={refetchProducts}
            title="Failed to load products"
          />
        </SidebarLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <SidebarLayout
        subHeader={<SubHeader items={subHeaderItems} />}
        topSections={topSections}
        sidebar={sidebarContent}
        contentResultCount={productData?.totalItems}
        wide
      >
        <div className="space-y-6">
          {productData?.items && productData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
                {productData.items.map((product) => (
                  <ProductSummaryCard
                    key={product.id}
                    product={product}
                    onBookmark={handleBookmark}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={productData.totalPages}
                pageSize={pagination.pageSize}
                totalItems={productData.totalItems}
                availablePageSizes={pagination.availablePageSizes}
                onPageChange={pagination.setCurrentPage}
                onPageSizeChange={pagination.setPageSize}
              />
            </>
          ) : (
            <NoProductsFound
              hasFilters={hasActiveFilters}
              actionLabel={
                hasActiveFilters ? "Clear Filters" : "Browse All Categories"
              }
              onAction={hasActiveFilters ? clearFilters : () => {}}
              secondaryActionLabel={
                hasActiveFilters ? "Browse All Categories" : undefined
              }
              onSecondaryAction={
                hasActiveFilters
                  ? () => navigate(routes.products.list)
                  : undefined
              }
            />
          )}
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default ProductCatalogPage;
