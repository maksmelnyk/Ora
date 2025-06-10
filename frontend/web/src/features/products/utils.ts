import { routes } from "@/common/constants/routes";
import { PRODUCT_LEVEL_CONFIG, PRODUCT_TYPE_CONFIG } from "./constants";
import {
  CategoryResponse,
  ProductDetailsResponse,
  ProductLevel,
  ProductType,
} from "./types";
import { LessonFormData, ModuleFormData, ProductFormData } from "./schemas";

export const getProductPath = (type: ProductType | null) => {
  return `${routes.products.list}?type=${type || ProductType.OnlineCourse}`;
};

export const getProductTypeLabel = (type: ProductType): string => {
  return PRODUCT_TYPE_CONFIG[type]?.label || "Unknown";
};

export const getProductLevelLabel = (level: ProductLevel): string => {
  return PRODUCT_LEVEL_CONFIG[level]?.label || "Unknown";
};

export const getProductTypeFromParam = (param: string | null): ProductType => {
  const typeNumber = param ? parseInt(param, 10) : NaN;
  return isNaN(typeNumber) || !(typeNumber in PRODUCT_TYPE_CONFIG)
    ? ProductType.OnlineCourse
    : (typeNumber as ProductType);
};

export const getSubHeaderItems = () =>
  Object.entries(PRODUCT_TYPE_CONFIG)
    .sort(([, configA], [, configB]) => configA.sortOrder - configB.sortOrder)
    .map(([type, config]) => ({
      id: type,
      label: config.label,
      href: `/products?type=${type}`,
    }));

export const getProductTypeOptions = () =>
  Object.values(PRODUCT_TYPE_CONFIG)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((config) => ({
      value: config.value,
      label: config.displayName,
    }));

export const getProductLevelOptions = () =>
  Object.values(PRODUCT_LEVEL_CONFIG).map((config) => ({
    value: config.value,
    label: config.label,
  }));

export const generateDurationOptions = () => {
  const options = [];
  for (let minutes = 15; minutes <= 120; minutes += 5) {
    const hours = minutes / 60;
    let label;

    if (minutes < 60) {
      label = `${minutes} minutes`;
    } else if (minutes === 60) {
      label = "1 hour";
    } else {
      const wholeHours = Math.floor(hours);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        label = `${wholeHours} hours`;
      } else {
        label = `${wholeHours} hour ${remainingMinutes} minutes`;
      }
    }
    options.push({ value: String(minutes), label: label });
  }
  return options;
};

export function getBreadcrumbItems(
  categories: CategoryResponse[],
  product: ProductDetailsResponse
): string[] {
  for (const category of categories) {
    const subCategory = category.subCategories.find(
      (sub) => sub.id === product.subCategoryId
    );
    if (subCategory) {
      return [category.name, subCategory.name, product.title];
    }
  }
  return [];
}

export const getInitialFormData = (): ProductFormData => ({
  type: ProductType.PreRecordedCourse,
  level: ProductLevel.Beginner,
  categoryId: "",
  subCategoryId: "",
  title: "",
  objectives: "",
  description: "",
  highlights: "",
  audience: "",
  requirements: "",
  language: "",
  price: "",
  agreesToGuidelines: false,
  agreesToTerms: false,
});

export const getInitialModuleData = (): ModuleFormData => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  sortOrder: 0,
  lessons: [getInitialLessonData()],
});

export const getInitialLessonData = (): LessonFormData => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  durationMin: 0,
  sortOrder: 0,
});

export enum ProductField {
  Type = "type",
  Level = "level",
  CategoryId = "categoryId",
  SubCategoryId = "subCategoryId",
  Title = "title",
  Language = "language",
  Price = "price",
  DurationMin = "durationMin",
  MaxParticipants = "maxParticipants",
  Modules = "modules",
  Description = "description",
  Objectives = "objectives",
  Highlights = "highlights",
  Audience = "audience",
  Requirements = "requirements",
  AgreesToGuidelines = "agreesToGuidelines",
  AgreesToTerms = "agreesToTerms",
}
