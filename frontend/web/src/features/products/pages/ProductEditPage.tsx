import {
  SidebarLayout,
  Button,
  Layout,
  Spinner,
  ErrorDisplay,
} from "@/common/components";
import CurriculumSection from "../components/edit/CurriculumSection";
import DetailsSection from "../components/edit/DetailsSection";
import { OverviewSection } from "../components/edit/OverviewSection";
import { useProductForm } from "../hooks/useProductForm";
import { ProductCreateRequest } from "../types";
import ProductEditSidebar from "../components/edit/ProductEditSidebar";
import { useCategories } from "../hooks/useCategories";
import { ProductService } from "../services/productService";
import { useState } from "react";
import { EditProductFormSection } from "../constants";
import { ProductFormData } from "../schemas";
import { FormProvider } from "react-hook-form";

export const ProductEditPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const methods = useProductForm();

  const {
    formMethods: { handleSubmit },
    currentSection,
    handleNext,
    handleReset,
    setCurrentSection,
    availableSections,
    isLastSection,
    progress,
    shouldShowCurriculum,
    requiresParticipants,
    requiresSessionDuration,
  } = methods;

  const handleSectionChange = (section: EditProductFormSection) => {
    setCurrentSection(section);
  };

  const onSubmit = async (data: ProductFormData) => {
    const productData: ProductCreateRequest = {
      type: data.type,
      level: data.level,
      subCategoryId: data.subCategoryId,
      title: data.title,
      objectives: data.objectives,
      description: data.description,
      highlights: data.highlights,
      audience: data.audience,
      requirements: data.requirements,
      language: data.language,
      imageUrl: "example",
      videoUrl: "example",
      price: Number(data.price),
      durationMin: data.durationMin,
      maxParticipants: data.maxParticipants,
      modules: data.modules?.map((module) => ({
        title: module.title,
        description: module.description,
        sortOrder: module.sortOrder,
        lessons: module.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description == "" ? null : lesson.description,
          sortOrder: lesson.sortOrder,
          durationMin: lesson.durationMin,
        })),
      })),
    };

    try {
      setIsCreating(true);
      console.log(productData);
      ProductService.createProduct(productData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case EditProductFormSection.Details:
        return (
          <DetailsSection
            categories={categoriesData ?? []}
            requiresParticipants={requiresParticipants}
            requiresSessionDuration={requiresSessionDuration}
          />
        );

      case EditProductFormSection.Curriculum:
        if (!shouldShowCurriculum) return null;
        return <CurriculumSection />;

      case EditProductFormSection.Overview:
        return <OverviewSection />;

      default:
        return null;
    }
  };

  const sidebarContent = (
    <ProductEditSidebar
      currentSection={currentSection}
      progress={progress}
      availableSections={availableSections}
      onSectionChange={handleSectionChange}
    />
  );

  if (categoriesLoading)
    return (
      <Layout>
        <SidebarLayout subHeader={[]} sidebar={sidebarContent} wide>
          <Spinner message="Loading data..." size="md" className="py-12" />
        </SidebarLayout>
      </Layout>
    );

  if (categoriesError)
    return (
      <Layout>
        <SidebarLayout subHeader={[]} sidebar={sidebarContent} wide>
          <ErrorDisplay
            error={categoriesError}
            onRetry={refetchCategories}
            title="Failed to load data"
          />
        </SidebarLayout>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <SidebarLayout subHeader={[]} sidebar={sidebarContent} wide>
          <ErrorDisplay
            error={categoriesError}
            onRetry={handleReset}
            title="Failed to load data"
          />
        </SidebarLayout>
      </Layout>
    );

  return (
    <Layout>
      <SidebarLayout sidebar={sidebarContent} wide>
        <FormProvider {...methods.formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <div>{renderSectionContent()}</div>
              <div className="flex justify-end">
                <div className="flex w-[30%] gap-4">
                  <Button
                    type="button"
                    variant="teal"
                    size="sm"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>

                  {isLastSection ? (
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isCreating}
                      size="sm"
                      className="flex-1"
                      onClick={handleNext}
                    >
                      Create
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </SidebarLayout>
    </Layout>
  );
};

export default ProductEditPage;
