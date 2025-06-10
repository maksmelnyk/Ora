import { useValibotForm } from "@/common/hooks/useValibotForm";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FileUpload,
  FormGroup,
  LanguageAutocomplete,
  Select,
  Textarea,
} from "@/common/components";
import { ApplicationFormData, applicationSchema } from "../schemas";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { routes } from "@/common/constants/routes";

interface ApplicationFormStepProps {
  isSubmitting?: boolean;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
}

export const documentTypeOptions = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
];

export const ApplicationFormStep: React.FC<ApplicationFormStepProps> = ({
  isSubmitting,
  onSubmit,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useValibotForm(applicationSchema);

  const onFormSubmit = handleSubmit(async (data: ApplicationFormData) => {
    await onSubmit(data);
  });

  return (
    <section className="py-1">
      <div className="text-center mb-12">
        <h2 className="ora-heading text-3xl text-ora-navy mb-4">
          Complete Your Profile
        </h2>
        <p className="ora-body text-ora-gray">
          Tell us about yourself and your teaching experience
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={onFormSubmit} className="space-y-8">
            <FormGroup
              label="Bio"
              required
              helperText="Share a brief introduction about yourself, your teaching philosophy, and what students can expect from your lessons. Highlight your personality."
            >
              <Textarea
                {...register("bio")}
                rows={6}
                error={errors.bio?.message}
              />
            </FormGroup>

            <FormGroup
              label="Professional Listing"
              required
              helperText="Provide structured details about your qualifications, work experience, skills, and achievements. This section serves as your professional profile, helping students understand your expertise and credentials."
            >
              <Textarea
                {...register("experience")}
                rows={6}
                error={errors.experience?.message}
              />
            </FormGroup>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Controller
                  control={control}
                  name="video"
                  render={({ field }) => (
                    <FileUpload
                      {...field}
                      onChange={(files) => {
                        field.onChange(files);
                      }}
                      accept="video/mp4"
                      maxSize={1024}
                      //error={errors.video?.message}
                      showPreview={true}
                    />
                  )}
                />
              </div>

              <div className="lg:col-span-2">
                <h3 className="ora-body text-lg mb-2">Video Introduction*</h3>
                <p className="ora-body text-sm text-ora-gray">
                  Introduce Yourself to Potential Students.
                </p>
                <div className="space-y-3 ora-body text-ora-gray text-sm">
                  <p>
                    Upload a short video (1-5 minutes) where you introduce
                    yourself, share your teaching style, experience, and what
                    students can expect from your lessons. This video helps
                    students get to know you and decide if your approach aligns
                    with their learning needs.
                  </p>
                  <p>
                    <strong>File Format:</strong> MP4
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (
                    <FileUpload
                      {...field}
                      onChange={(files) => {
                        field.onChange(files);
                      }}
                      accept="image/*,.pdf"
                      maxSize={10}
                      //error={errors.video?.message}
                      showPreview={true}
                    />
                  )}
                />
              </div>

              <div className="lg:col-span-2">
                <h3 className="ora-body text-lg mb-2">
                  Identity verification*
                </h3>
                <p className="ora-body text-sm text-ora-gray pb-8">
                  Passport or National ID or Driver's License (not stored, only
                  for verification)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FormGroup
                    label="Document Type*"
                    error={errors.documentType?.message}
                    htmlFor="document-type"
                  >
                    <Select
                      {...register("documentType")}
                      options={documentTypeOptions}
                      placeholder="Select a document type"
                      error={errors.documentType?.message}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Country of Issue*"
                    error={errors.countryOfIssue?.message}
                    htmlFor="country-of-issue"
                  >
                    <Controller
                      name="countryOfIssue"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field, fieldState }) => (
                        <LanguageAutocomplete
                          variant="default"
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          placeholder="Type to search..."
                        />
                      )}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>

            <div className="bg-ora-bg border border-ora-gray-200 rounded-xl p-6">
              <h4 className="ora-heading text-base mb-2">Moderation Process</h4>
              <div className="space-y-2 ora-body text-ora-gray text-sm">
                <p>
                  Your application will be reviewed within 1–3 business days. We
                  don't store your ID — it's only used for identity
                  verification.
                </p>
                <p>
                  If your fails moderation multiple times in a row, please
                  contact our support team{" "}
                  <Link to={routes.public.home} className="text-ora-highlight">
                    here
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormGroup
                label="I agree to the Terms & Conditions and understand that my identity will be verified for safety and quality assurance"
                labelOptions={{
                  variant: "checkbox",
                  position: "right",
                }}
                htmlFor="agreedToTerms"
                error={errors.agreeToTerms?.message}
                required
              >
                <Checkbox
                  {...register("agreeToTerms")}
                  error={errors.agreeToTerms?.message}
                  size="md"
                  variant="secondary"
                />
              </FormGroup>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
                className="w-1/3"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default ApplicationFormStep;
