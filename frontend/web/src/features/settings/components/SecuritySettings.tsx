import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormGroup,
  Input,
} from "@/common/components";
import { useValibotForm } from "@/common/hooks/useValibotForm";
import { securitySchema, SecurityFormData } from "../schemas";

interface SecuritySettingsProps {
  initialData?: SecurityFormData;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useValibotForm(securitySchema, initialData);

  const handleSave = async () => {
    setIsLoading(true);
    try {
    } catch (error) {
      console.error("Failed to save portfolio settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password");
  };

  const handleCancel = () => {
    reset(initialData);
  };

  return (
    <section className="space-y-8" aria-labelledby="security-settings-title">
      <Card>
        <CardHeader>
          <CardTitle>Change email</CardTitle>
        </CardHeader>
        <CardContent>
          <FormGroup label="Email" required helperText="Enter your email.">
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup
            label="Current password"
            required
            helperText="For safety reasons, enter your current password."
          >
            <Input
              {...register("currentPassword")}
              type="password"
              placeholder="Enter your current password"
              error={errors.currentPassword?.message}
              disabled={isLoading}
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
            <FormGroup label="Current password" required>
              <Input
                {...register("currentPassword")}
                type="password"
                placeholder="Enter your current password"
                error={errors.currentPassword?.message}
                disabled={isLoading}
              />
            </FormGroup>

            <div className="text-right">
              <button
                type="button"
                className="text-ora-highlight hover:underline text-sm disabled:opacity-50"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>

            <FormGroup label="New password" required>
              <Input
                {...register("newPassword")}
                type="password"
                placeholder="Enter your new password"
                error={errors.newPassword?.message}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup label="Repeat password" required>
              <Input
                {...register("repeatPassword")}
                type="password"
                placeholder="Repeat your new password"
                error={errors.repeatPassword?.message}
                disabled={isLoading}
              />
            </FormGroup>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isLoading}
                disabled={!isValid}
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

export default SecuritySettings;
