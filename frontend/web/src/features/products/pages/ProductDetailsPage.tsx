import React from "react";
import { useParams } from "react-router-dom";
import {
  Breadcrumbs,
  ErrorDisplay,
  Layout,
  PageLayout,
  Spinner,
} from "@/common/components";
import { useProductById } from "../hooks/useProducts";
import { ProductType } from "../types";
import ProductDetailsHeader from "../components/details/ProductDetailsHeader";
import ProductDetailsTabs from "../components/details/ProductDetailsTabs";
import { useCategories } from "../hooks/useCategories";
import { getBreadcrumbItems } from "../utils";

export const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useProductById(productId!);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  if (isLoading || categoriesLoading) {
    return (
      <Layout>
        <PageLayout>
          <Spinner
            message="Loading product details..."
            size="lg"
            className="py-12"
          />
        </PageLayout>
      </Layout>
    );
  }

  if (error || !product || categoriesError) {
    return (
      <Layout>
        <PageLayout>
          <ErrorDisplay
            error={error || { message: "Product not found" }}
            onRetry={refetch}
            title="Failed to load product"
          />
        </PageLayout>
      </Layout>
    );
  }

  const names = getBreadcrumbItems(categories || [], product);

  const showContentTab =
    product.type === ProductType.OnlineCourse ||
    product.type === ProductType.PreRecordedCourse;

  return (
    <Layout>
      <PageLayout className="space-y-8">
        <Breadcrumbs items={names.map((name) => ({ label: name }))} />
        <ProductDetailsHeader product={product} />
        <ProductDetailsTabs product={product} showContentTab={showContentTab} />
      </PageLayout>
    </Layout>
  );
};

export default ProductDetailsPage;
