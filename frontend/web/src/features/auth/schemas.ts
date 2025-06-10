import * as v from "valibot";

export const accountInfoSchema = v.pipe(
  v.object({
    username: v.pipe(
      v.string("Username must be a string"),
      v.nonEmpty("Nickname is required"),
      v.minLength(3, "Nickname must be at least 3 characters"),
      v.maxLength(20, "Nickname must be less than 20 characters"),
      v.regex(
        /^[a-zA-Z0-9_]+$/,
        "Nickname can only contain letters, numbers, and underscores"
      )
    ),
    email: v.pipe(
      v.string("Email must be a string"),
      v.nonEmpty("Email is required"),
      v.email("Please enter a valid email address")
    ),
    password: v.pipe(
      v.string("Password must be a string"),
      v.minLength(8, "Password must be at least 8 characters"),
      v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
      v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
      v.regex(/[0-9]/, "Password must contain at least one number")
    ),
    repeatPassword: v.pipe(
      v.string("Repeat password must be a string"),
      v.nonEmpty("Please repeat your password")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["repeatPassword"]],
      (input) => input.password === input.repeatPassword,
      "Passwords do not match"
    ),
    ["repeatPassword"]
  )
);

export const personalInfoSchema = v.object({
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
  birthDate: v.pipe(
    v.string("Birth date must be a string"),
    v.nonEmpty("Date of birth is required"),
    v.isoDate("Please enter a valid date")
  ),
  agreeToTerms: v.pipe(
    v.boolean("Agreement must be a boolean"),
    v.literal(true, "You must agree to the terms of service and privacy policy")
  ),
});

export type AccountInfoData = v.InferInput<typeof accountInfoSchema>;
export type PersonalInfoData = v.InferInput<typeof personalInfoSchema>;
