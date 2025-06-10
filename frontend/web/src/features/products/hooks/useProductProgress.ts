import { useMemo } from "react";
import { ProductFormData } from "../schemas";

interface ProgressFlags {
  requiresSessionDuration: boolean;
  requiresParticipants: boolean;
  shouldShowCurriculum: boolean;
}

export const useProductProgress = (
  formData: ProductFormData,
  flags: ProgressFlags
) => {
  return useMemo(() => {
    let completed = 0;
    let total = 0;

    const isFilled = (val: any) =>
      val !== undefined && val !== null && val !== "";

    const isBooleanTrue = (val: any) => val === true;

    const count = (field: any, isBoolean = false) => {
      total++;
      if (isBoolean ? isBooleanTrue(field) : isFilled(field)) {
        completed++;
      }
    };

    count(formData.type);
    count(formData.categoryId);
    count(formData.subCategoryId);
    count(formData.title);
    count(formData.level);
    count(formData.language);
    count(formData.price);

    if (flags.requiresSessionDuration) count(formData.durationMin);
    if (flags.requiresParticipants) count(formData.maxParticipants);

    count(formData.description);
    count(formData.objectives);
    count(formData.highlights);
    count(formData.audience);
    count(formData.requirements);

    count(formData.agreesToGuidelines, true);
    count(formData.agreesToTerms, true);

    if (flags.shouldShowCurriculum) {
      total++;
      if (
        formData.modules?.length &&
        formData.modules.every(
          (m) =>
            m.title &&
            m.description &&
            m.lessons.every((l) => l.title && l.durationMin > 0)
        )
      ) {
        completed++;
      }
    }

    return Math.round((completed / total) * 100);
  }, [formData, flags]);
};
