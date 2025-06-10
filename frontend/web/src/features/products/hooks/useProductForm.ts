import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ProductType } from "../types";
import {
  getInitialFormData,
  getInitialModuleData,
  ProductField,
} from "../utils";
import { EditProductFormSection } from "../constants";
import { getProductFormSchema, ProductFormData } from "../schemas";
import { useValibotForm } from "@/common/hooks";
import { useProductWizard } from "./useProductWizard";
import { useProductProgress } from "./useProductProgress";

export const useProductForm = () => {
  const initialData = getInitialFormData();
  const [productType, setProductType] = useState<ProductType>(initialData.type);
  const hasInitializedModules = useRef(false);

  const schema = useMemo(
    () => getProductFormSchema(productType),
    [productType]
  );
  const formMethods = useValibotForm(schema, initialData);
  const { watch, setValue, trigger, reset } = formMethods;
  const formData = watch();

  const {
    currentSection,
    setCurrentSection,
    shouldShowCurriculum,
    requiresParticipants,
    requiresSessionDuration,
    getAvailableSections,
  } = useProductWizard(productType);

  const progress = useProductProgress(formData, {
    shouldShowCurriculum,
    requiresParticipants,
    requiresSessionDuration,
  });

  useEffect(() => {
    if (formData.type !== productType) {
      setProductType(formData.type);
      hasInitializedModules.current = false;
      formMethods.clearErrors();
      trigger();
    }
  }, [formData.type, productType, setProductType, trigger, formMethods]);

  useEffect(() => {
    if (!requiresSessionDuration) setValue(ProductField.DurationMin, undefined);
    if (!requiresParticipants)
      setValue(ProductField.MaxParticipants, undefined);

    if (!shouldShowCurriculum) {
      setValue(ProductField.Modules, []);
      hasInitializedModules.current = false;
    } else if (!hasInitializedModules.current) {
      const currentModules = formData.modules;
      if (!currentModules || currentModules.length === 0) {
        setValue(ProductField.Modules, [getInitialModuleData()]);
        hasInitializedModules.current = true;
      }
    }
  }, [
    shouldShowCurriculum,
    requiresParticipants,
    requiresSessionDuration,
    setValue,
  ]);

  const validateCurrentSection = useCallback(async () => {
    const fields: (keyof ProductFormData)[] = [];

    switch (currentSection) {
      case EditProductFormSection.Details:
        fields.push(
          ProductField.Type,
          ProductField.Level,
          ProductField.CategoryId,
          ProductField.SubCategoryId,
          ProductField.Title,
          ProductField.Language,
          ProductField.Price
        );
        if (requiresSessionDuration) fields.push(ProductField.DurationMin);
        if (requiresParticipants) fields.push(ProductField.MaxParticipants);
        break;

      case EditProductFormSection.Curriculum:
        if (shouldShowCurriculum) fields.push(ProductField.Modules);
        break;

      case EditProductFormSection.Overview:
        fields.push(
          ProductField.Description,
          ProductField.Objectives,
          ProductField.Highlights,
          ProductField.Audience,
          ProductField.Requirements,
          ProductField.AgreesToGuidelines,
          ProductField.AgreesToTerms
        );
        break;
    }

    return await trigger(fields);
  }, [
    currentSection,
    requiresParticipants,
    requiresSessionDuration,
    shouldShowCurriculum,
    trigger,
  ]);

  const handleNext = useCallback(async () => {
    const sections = getAvailableSections();
    const currentIndex = sections.indexOf(currentSection);
    const valid = await validateCurrentSection();

    if (valid && currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
      return { success: true };
    }

    return { success: false };
  }, [currentSection, getAvailableSections, validateCurrentSection]);

  const handleReset = useCallback(() => {
    reset(getInitialFormData());
    setCurrentSection(EditProductFormSection.Details);
  }, [reset, setCurrentSection]);

  const availableSections = useMemo(
    () => getAvailableSections(),
    [getAvailableSections]
  );

  const isLastSection = useMemo(
    () => currentSection === availableSections[availableSections.length - 1],
    [currentSection, availableSections]
  );

  return {
    formMethods,

    currentSection,
    shouldShowCurriculum,
    requiresParticipants,
    requiresSessionDuration,
    availableSections,
    progress,
    isLastSection,
    setCurrentSection,
    handleNext,
    handleReset,
  };
};
