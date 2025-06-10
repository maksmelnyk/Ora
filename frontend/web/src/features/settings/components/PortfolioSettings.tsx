import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  FileUpload,
  FormGroup,
  Textarea,
} from "@/common/components";
import { useValibotForm } from "@/common/hooks/useValibotForm";
import { portfolioSchema, PortfolioFormData } from "../schemas";
import { EducatorService } from "@/features/educators/services/educatorService";
import { UpdateEducatorProfileRequest } from "@/features/educators/types";
import { useCurrentUser } from "@/features/profiles/hooks/useProfile";
import { Controller } from "react-hook-form";

interface PortfolioSettingsProps {
  initialData?: PortfolioFormData;
}

export const PortfolioSettings: React.FC<PortfolioSettingsProps> = ({
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateEducatorInfo } = useCurrentUser();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useValibotForm(portfolioSchema, initialData);

  const handleSave = async (data: PortfolioFormData) => {
    const updateEducatorData: UpdateEducatorProfileRequest = {
      bio: data.bio,
      experience: data.experience,
      videoUrl: "example",
    };

    setIsLoading(true);
    try {
      EducatorService.updateEducatorProfile(updateEducatorData);
      updateEducatorInfo(updateEducatorData);
    } catch (error) {
      console.error("Failed to save portfolio settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(initialData);
  };

  return (
    <section className="space-y-8" aria-labelledby="portfolio-settings-title">
      <Card>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit(handleSave)}>
            <FormGroup
              label="Bio"
              required
              helperText={`Share a brief introduction about yourself, your teaching philosophy, and what students can expect from your lessons`}
            >
              <Textarea
                {...register("bio")}
                error={errors.bio?.message}
                disabled={isLoading}
                rows={6}
                resize="vertical"
              />
            </FormGroup>

            <FormGroup
              label="Professional Listing"
              required
              helperText={`Provide structured details about your qualifications, work experience, skills, and achievements`}
            >
              <Textarea
                {...register("experience")}
                error={errors.experience?.message}
                disabled={isLoading}
                rows={6}
                resize="vertical"
              />
            </FormGroup>

            <div>
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
                  <h3 className="ora-body text-base mb-2">
                    Video Introduction*
                  </h3>
                  <p className="ora-body text-sm text-ora-gray">
                    Introduce Yourself to Potential Students.
                  </p>
                  <div className="space-y-3 ora-body text-ora-gray text-sm">
                    <p>
                      Upload a short video (1–5 minutes) where you introduce
                      yourself, share your teaching style, experience, and what
                      students can expect from your lessons. This video helps
                      students get to know you and decide if your approach
                      aligns with their learning needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-1 border-ora-gray-300">
              <CardContent className="p-4">
                <h2 className="ora-subheading text-sm text-ora-navy mb-2">
                  Moderation Process
                </h2>
                <div className="space-y-1 text-sm text-ora-gray">
                  <p>
                    Before your video is published, it must pass moderation.
                    Below the loading boxes, you'll find a status indicator:
                  </p>
                  <p>
                    <span className="text-green-600">Green</span> — Your video
                    has been approved and will be published.
                  </p>
                  <p>
                    <span className="text-yellow-600">Yellow</span> — Please
                    retry the submission.
                  </p>
                  <p>
                    If your video fails moderation multiple times in a row,
                    please contact our support team{" "}
                    <button
                      type="button"
                      className="text-ora-highlight hover:underline"
                    >
                      here
                    </button>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isLoading}
                disabled={!isValid || !isDirty}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="teal"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default PortfolioSettings;
