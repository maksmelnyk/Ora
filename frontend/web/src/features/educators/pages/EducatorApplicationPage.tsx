import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/common/constants/routes";
import { ErrorDisplay, Layout, PageLayout } from "@/common/components";
import { ApplicationFormData } from "../schemas";
import { ApplicationStep } from "../types";
import { EducatorService } from "../services/educatorService";
import ApplicationFormStep from "../components/ApplicationFormStep";
import IntroStep from "../components/IntroStep";
import { useUser } from "@/common/contexts";

export const EducatorApplicationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>(
    ApplicationStep.INTRO
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isEducator } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isEducator) {
      navigate(routes.public.home);
    }
  }, [user, isEducator]);

  const handleFormSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      //TODO: replace videoUrl with real implementation
      const apiData = {
        bio: data.bio,
        experience: data.experience,
        videoUrl: "example",
      };
      await EducatorService.createEducatorProfile(apiData);
      navigate(routes.public.home);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error || !user)
    return (
      <ErrorDisplay
        error={error}
        title={"Failed to register user. Please try again later."}
        onRedirect={() => navigate(routes.public.home)}
      />
    );

  return (
    <Layout>
      <PageLayout>
        {currentStep === ApplicationStep.INTRO ? (
          <IntroStep
            onGetStarted={() =>
              setCurrentStep(ApplicationStep.APPLICATION_FORM)
            }
          />
        ) : (
          <ApplicationFormStep
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </PageLayout>
    </Layout>
  );
};
