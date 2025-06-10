import * as v from "valibot";

export const applicationSchema = v.object({
  bio: v.pipe(
    v.string(),
    v.minLength(50, "Bio must be at least 50 characters long"),
    v.maxLength(1000, "Bio must not exceed 1000 characters")
  ),
  experience: v.pipe(
    v.string(),
    v.minLength(
      100,
      "Professional listing must be at least 100 characters long"
    ),
    v.maxLength(2000, "Professional listing must not exceed 2000 characters")
  ),
  video: v.optional(v.any()),
  document: v.optional(v.any()),
  documentType: v.pipe(v.string(), v.minLength(1, "Document type is required")),
  countryOfIssue: v.pipe(
    v.string(),
    v.minLength(1, "Country of issue is required")
  ),
  agreeToTerms: v.pipe(
    v.boolean(),
    v.literal(true, "You must agree to the Terms & Conditions")
  ),
});

export type ApplicationFormData = v.InferInput<typeof applicationSchema>;
