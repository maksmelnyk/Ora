import { useMemo, useCallback, useState } from "react";
import { EditProductFormSection } from "../constants";
import { ProductType } from "../types";

export const useProductWizard = (productType: ProductType) => {
  const [currentSection, setCurrentSection] = useState(
    EditProductFormSection.Details
  );

  const shouldShowCurriculum = useMemo(
    () =>
      [ProductType.OnlineCourse, ProductType.PreRecordedCourse].includes(
        productType
      ),
    [productType]
  );

  const requiresParticipants = useMemo(
    () =>
      [ProductType.OnlineCourse, ProductType.GroupSession].includes(
        productType
      ),
    [productType]
  );

  const requiresSessionDuration = useMemo(
    () =>
      [ProductType.PrivateSession, ProductType.GroupSession].includes(
        productType
      ),
    [productType]
  );

  const getAvailableSections = useCallback(() => {
    const sections = [EditProductFormSection.Details];
    if (shouldShowCurriculum) sections.push(EditProductFormSection.Curriculum);
    sections.push(EditProductFormSection.Overview);
    return sections;
  }, [shouldShowCurriculum]);

  return {
    currentSection,
    setCurrentSection,
    shouldShowCurriculum,
    requiresParticipants,
    requiresSessionDuration,
    getAvailableSections,
  };
};
