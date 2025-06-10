import { useValibotForm } from "@/common/hooks/useValibotForm";
import { Button, FormGroup, Input } from "@/common/components";
import { accountInfoSchema, AccountInfoData } from "../schemas";
import { useAuth } from "@/common/contexts";

interface AccountInfoStepProps {
  onNext: (data: AccountInfoData) => void;
  onCancel: () => void;
}

export const AccountInfoStep: React.FC<AccountInfoStepProps> = ({
  onNext,
  onCancel,
}) => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useValibotForm(accountInfoSchema);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="ora-subheading text-2xl text-ora-navy">
          Create account
        </h1>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit(onNext)}>
        <FormGroup
          label="Nickname"
          htmlFor="nickname"
          error={errors.username?.message}
          required
        >
          <Input
            {...register("username")}
            type="text"
            error={errors.username?.message}
            required
          />
        </FormGroup>

        <FormGroup
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            {...register("email")}
            type="email"
            error={errors.email?.message}
            required
          />
        </FormGroup>

        <FormGroup
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <Input
            {...register("password")}
            type="password"
            error={errors.password?.message}
            required
          />
        </FormGroup>

        <FormGroup
          label="Repeat password"
          htmlFor="repeatPassword"
          error={errors.repeatPassword?.message}
          required
        >
          <Input
            {...register("repeatPassword")}
            type="password"
            error={errors.repeatPassword?.message}
            required
          />
        </FormGroup>

        <div className="text-center text-ora-gray">
          or{" "}
          <button className="text-ora-blue" onClick={login}>
            sign up
          </button>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="purple"
            size="md"
            fullWidth
            disabled={!isValid}
            className="mt-8"
          >
            Next
          </Button>
          <Button
            type="button"
            variant="neutral"
            size="md"
            fullWidth
            className="mt-8"
            onClick={onCancel}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountInfoStep;
