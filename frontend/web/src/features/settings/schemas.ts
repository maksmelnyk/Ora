import * as v from "valibot";

export const profileSchema = v.object({
  firstName: v.pipe(
    v.string("First name must be a string"),
    v.nonEmpty("First name is required"),
    v.minLength(2, "First name must be at least 2 characters"),
    v.maxLength(50, "First name must be less than 50 characters")
  ),
  lastName: v.pipe(
    v.string("Last name must be a string"),
    v.nonEmpty("Last name is required"),
    v.minLength(2, "Last name must be at least 2 characters"),
    v.maxLength(50, "Last name must be less than 50 characters")
  ),
  bio: v.optional(
    v.nullable(
      v.pipe(
        v.string("Bio must be a string"),
        v.maxLength(500, "Bio must be less than 500 characters")
      )
    )
  ),
  image: v.optional(v.any()),
});

export const securitySchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string("Email must be a string"),
      v.nonEmpty("Email is required"),
      v.email("Please enter a valid email address")
    ),
    currentPassword: v.pipe(
      v.string("Current password must be a string"),
      v.nonEmpty("Current password is required")
    ),
    newPassword: v.pipe(
      v.string("New password must be a string"),
      v.minLength(8, "Password must be at least 8 characters"),
      v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
      v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
      v.regex(/[0-9]/, "Password must contain at least one number"),
      v.regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
    ),
    repeatPassword: v.pipe(
      v.string("Repeat password must be a string"),
      v.nonEmpty("Please repeat your password")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["repeatPassword"]],
      (input) => input.newPassword === input.repeatPassword,
      "Passwords do not match"
    ),
    ["repeatPassword"]
  )
);

export const portfolioSchema = v.object({
  bio: v.pipe(
    v.string("Bio must be a string"),
    v.nonEmpty("Bio is required"),
    v.minLength(50, "Bio must be at least 50 characters"),
    v.maxLength(1000, "Bio must be less than 1000 characters")
  ),
  experience: v.pipe(
    v.string("Experience must be a string"),
    v.nonEmpty("Experience is required"),
    v.minLength(100, "Experience must be at least 100 characters"),
    v.maxLength(2000, "Experience must be less than 2000 characters")
  ),
  video: v.optional(v.any()),
});

export type ProfileFormData = v.InferInput<typeof profileSchema>;
export type SecurityFormData = v.InferInput<typeof securitySchema>;
export type PortfolioFormData = v.InferInput<typeof portfolioSchema>;
