import {
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  Textarea,
} from "@/common/components";
import { useFormContext } from "react-hook-form";
import { ProductFormData } from "../../schemas";
import { ProductField } from "../../utils";

interface OverviewSectionProps {
  // add something later
}

export const OverviewSection: React.FC<OverviewSectionProps> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  return (
    <div className="space-y-6">
      <FormGroup
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
        required
        helperText="Provide a clear and engaging overview of the course."
      >
        <Textarea
          {...register(ProductField.Description)}
          rows={4}
          error={errors.description?.message}
          required
        />
      </FormGroup>
      <FormGroup
        label="What you'll learn"
        htmlFor="objectives"
        error={errors.objectives?.message}
        required
      >
        <Textarea
          {...register(ProductField.Objectives)}
          rows={4}
          error={errors.objectives?.message}
          required
        />
      </FormGroup>
      <FormGroup
        label="Course Highlights"
        htmlFor="highlights"
        error={errors.highlights?.message}
        required
      >
        <Textarea
          {...register(ProductField.Highlights)}
          rows={4}
          error={errors.highlights?.message}
          required
        />
      </FormGroup>
      <FormGroup
        label="Who this course is for?"
        htmlFor="audience"
        error={errors.audience?.message}
        required
      >
        <Textarea
          {...register(ProductField.Audience)}
          rows={4}
          error={errors.audience?.message}
          required
        />
      </FormGroup>
      <FormGroup
        label="Requirements"
        htmlFor="requirements"
        error={errors.requirements?.message}
        required
      >
        <Textarea
          {...register(ProductField.Requirements)}
          rows={4}
          error={errors.requirements?.message}
          required
        />
      </FormGroup>

      <Card className="border border-ora-gray-300 rounded-xl">
        <CardContent className="p-6">
          <h3 className="ora-heading text-lg text-ora-navy mb-4">
            Final Review Before Publishing
          </h3>
          <p className="ora-body text-ora-gray mb-4">
            Before publishing your course, please ensure:
          </p>

          <div className="space-y-3">
            <FormGroup
              label="All content meets platform guidelines."
              labelOptions={{
                variant: "checkbox",
                position: "right",
                width: "w-1/3",
              }}
              htmlFor="agreesToGuidelines"
              error={errors.agreesToGuidelines?.message}
              required
            >
              <Checkbox
                {...register(ProductField.AgreesToGuidelines)}
                error={errors.agreesToGuidelines?.message}
                required
              />
            </FormGroup>

            <FormGroup
              label="You agree to the platform's terms regarding sales, refunds, and payouts."
              labelOptions={{
                variant: "checkbox",
                position: "right",
                width: "w-1/3",
              }}
              htmlFor="agreesToTerms"
              error={errors.agreesToTerms?.message}
              required
            >
              <Checkbox
                {...register(ProductField.AgreesToTerms)}
                error={errors.agreesToTerms?.message}
                required
              />
            </FormGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;
