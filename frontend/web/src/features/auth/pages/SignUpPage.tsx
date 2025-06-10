import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/contexts";
import { RegistrationState } from "@/common/types";
import { ErrorDisplay } from "@/common/components";
import { routes } from "@/common/constants/routes";
import SignupLayout from "@/common/components/layout/SignupLayout";
import { AccountInfoData, PersonalInfoData } from "../schemas";
import AccountInfoStep from "../components/AccountInfoStep";
import PersonalInfoStep from "../components/PersonalInfoStep";
import { AuthService } from "../services/authService";

export const SignUpPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<AccountInfoData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStep1Next = (data: AccountInfoData) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleCancel = () => {
    navigate(routes.public.home);
  };

  const handleSubmit = async (data: PersonalInfoData) => {
    if (!step1Data) return;

    const registrationData = {
      username: step1Data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: step1Data.email,
      password: step1Data.password,
      birthDate: data.birthDate,
    };

    setIsLoading(true);
    try {
      const { statusToken } = await AuthService.register(registrationData);
      let attempts = 0;
      const MAX_ATTEMPTS = 10;
      const POLLING_INTERVAL = 2000;

      while (attempts < MAX_ATTEMPTS) {
        const status = await AuthService.checkRegistrationStatus(statusToken);
        if (status.state === RegistrationState.COMPLETED) {
          setIsLoading(false);
          login();
        } else if (status.state === RegistrationState.FAILED) {
          throw new Error(status.errorMessage || "Registration failed.");
        }
        attempts++;
        await new Promise((res) => setTimeout(res, POLLING_INTERVAL));
      }
      throw new Error("Registration timed out.");
    } catch (error: any) {
      setError(error.message || "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (error)
    return (
      <ErrorDisplay
        error={error}
        title={"Failed to register user. Please try again later."}
        onRedirect={() => navigate(routes.public.home)}
      />
    );

  return (
    <SignupLayout>
      {currentStep === 1 && (
        <AccountInfoStep onNext={handleStep1Next} onCancel={handleCancel} />
      )}

      {currentStep === 2 && (
        <PersonalInfoStep
          onSubmit={handleSubmit}
          onBack={handleBack}
          isLoading={isLoading}
        />
      )}
    </SignupLayout>
  );
};

export default SignUpPage;
