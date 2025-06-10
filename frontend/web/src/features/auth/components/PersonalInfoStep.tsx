import { useValibotForm } from "@/common/hooks/useValibotForm";
import {
  Button,
  Checkbox,
  DatePicker,
  FormGroup,
  Input,
} from "@/common/components";
import { personalInfoSchema, PersonalInfoData } from "../schemas";

interface PersonalInfoStepProps {
  onSubmit: (data: PersonalInfoData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useValibotForm(personalInfoSchema);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="ora-subheading text-2xl text-ora-navy">
          Personal Information
        </h1>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label="First Name"
          htmlFor="firstName"
          error={errors.firstName?.message}
          required
        >
          <Input
            {...register("firstName")}
            type="text"
            error={errors.firstName?.message}
            disabled={isLoading}
            required
          />
        </FormGroup>

        <FormGroup
          label="Last Name"
          htmlFor="lastName"
          error={errors.lastName?.message}
          required
        >
          <Input
            {...register("lastName")}
            type="text"
            error={errors.lastName?.message}
            disabled={isLoading}
            required
          />
        </FormGroup>

        <FormGroup
          label="Date of birth"
          htmlFor="birthDate"
          error={errors.birthDate?.message}
          required
        >
          <DatePicker
            {...register("birthDate")}
            error={errors.birthDate?.message}
            disabled={isLoading}
            required
          />
        </FormGroup>

        <FormGroup
          label="I agree to the terms of service and privacy policy"
          labelOptions={{
            variant: "checkbox",
            position: "right",
            size: "md",
          }}
          htmlFor="agreeToTerms"
          error={errors.agreeToTerms?.message}
          required
        >
          <Checkbox
            {...register("agreeToTerms")}
            error={errors.agreeToTerms?.message}
            disabled={isLoading}
            size="md"
            variant="secondary"
          />
        </FormGroup>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="purple"
            size="md"
            fullWidth
            className="mt-8"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            variant="neutral"
            size="md"
            fullWidth
            className="mt-8"
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;
