import * as v from "valibot";
import { ProductLevel, ProductType } from "./types";

const lessonSchema = v.object({
  id: v.string(),
  title: v.pipe(
    v.string(),
    v.nonEmpty("Lesson title is required"),
    v.maxLength(100)
  ),
  description: v.optional(v.string()),
  durationMin: v.pipe(v.number(), v.minValue(1)),
  sortOrder: v.number(),
  file: v.optional(v.any()),
});

const moduleSchema = v.object({
  id: v.string(),
  title: v.pipe(
    v.string(),
    v.nonEmpty("Module title is required"),
    v.maxLength(100)
  ),
  description: v.pipe(v.string(), v.nonEmpty("Description is required")),
  sortOrder: v.number(),
  lessons: v.pipe(
    v.array(lessonSchema),
    v.minLength(1, "At least one lesson required")
  ),
});

const baseProductSchema = v.object({
  type: v.enum(ProductType),
  level: v.enum(ProductLevel),
  categoryId: v.pipe(v.string(), v.nonEmpty("Category is required")),
  subCategoryId: v.pipe(v.string(), v.nonEmpty("Subcategory is required")),
  title: v.pipe(
    v.string(),
    v.nonEmpty("Product title is required"),
    v.maxLength(100)
  ),
  objectives: v.pipe(v.string(), v.nonEmpty("Objectives required")),
  description: v.pipe(v.string(), v.nonEmpty("Description required")),
  highlights: v.pipe(v.string(), v.nonEmpty("Highlights required")),
  audience: v.pipe(v.string(), v.nonEmpty("Audience required")),
  requirements: v.pipe(v.string(), v.nonEmpty("Requirements required")),
  language: v.pipe(v.string(), v.nonEmpty("Language is required")),
  imageFile: v.optional(v.any()),
  videoFile: v.optional(v.any()),
  price: v.pipe(
    v.string(),
    v.decimal(),
    v.regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number with up to 2 decimal places"
    )
  ),
  agreesToGuidelines: v.pipe(
    v.boolean(),
    v.literal(true, "You must agree to platform guidelines")
  ),
  agreesToTerms: v.pipe(
    v.boolean(),
    v.literal(true, "You must agree to platform terms")
  ),
  durationMin: v.optional(v.number()),
  maxParticipants: v.optional(
    v.pipe(v.number(), v.minValue(1), v.maxValue(15))
  ),
  modules: v.optional(v.array(moduleSchema)),
});

const preRecordedCourseSchema = v.object({
  ...baseProductSchema.entries,
  durationMin: v.optional(v.number()),
  maxParticipants: v.optional(v.number()),
  modules: v.pipe(
    v.array(moduleSchema),
    v.minLength(1, "At least one module is required")
  ),
});

const privateSessionSchema = v.object({
  ...baseProductSchema.entries,
  durationMin: v.pipe(
    v.number(),
    v.minValue(1, "Session duration is required")
  ),
  maxParticipants: v.optional(v.number()),
  modules: v.optional(v.array(moduleSchema)),
});

const onlineCourseSchema = v.object({
  ...baseProductSchema.entries,
  durationMin: v.optional(v.number()),
  maxParticipants: v.pipe(
    v.number(),
    v.minValue(1, "Minimum 1 participant is required"),
    v.maxValue(15, "Maximum 15 participant are allowed")
  ),
  modules: v.pipe(
    v.array(moduleSchema),
    v.minLength(1, "At least one module is required")
  ),
});

const groupSessionSchema = v.object({
  ...baseProductSchema.entries,
  durationMin: v.pipe(
    v.number(),
    v.minValue(1, "Session duration is required")
  ),
  maxParticipants: v.pipe(
    v.number(),
    v.minValue(1, "Minimum 1 participant is required"),
    v.maxValue(15, "Maximum 15 participant are allowed")
  ),
  modules: v.optional(v.array(moduleSchema)),
});

export const getProductFormSchema = (productType: ProductType) => {
  switch (productType) {
    case ProductType.PreRecordedCourse:
      return preRecordedCourseSchema;
    case ProductType.PrivateSession:
      return privateSessionSchema;
    case ProductType.OnlineCourse:
      return onlineCourseSchema;
    case ProductType.GroupSession:
      return groupSessionSchema;
    default:
      return baseProductSchema;
  }
};

export type LessonFormData = v.InferInput<typeof lessonSchema>;
export type ModuleFormData = v.InferInput<typeof moduleSchema>;
export type ProductFormData = v.InferInput<typeof baseProductSchema>;
