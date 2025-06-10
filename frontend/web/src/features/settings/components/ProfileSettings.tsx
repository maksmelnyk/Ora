import { useState } from "react";
import { Camera } from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  FormGroup,
  Input,
  Textarea,
} from "@/common/components";
import { useValibotForm } from "@/common/hooks/useValibotForm";
import { profileSchema, ProfileFormData } from "../schemas";
import { useCurrentUser } from "@/features/profiles/hooks/useProfile";
import { UpdateProfileRequest } from "@/features/profiles/types";

interface ProfileSettingsProps {
  initialData?: ProfileFormData;
  isLoading?: boolean;
}

interface ProfileSettingsProps {
  initialData?: ProfileFormData;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserInfo } = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useValibotForm(profileSchema, initialData);

  const handleSave = async (data: ProfileFormData) => {
    const updateUserData: UpdateProfileRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio === "" ? null : data.bio,
      imageUrl: null,
    };

    setIsLoading(true);
    try {
      updateUserInfo(updateUserData);
    } catch (error) {
      console.error("Failed to save portfolio settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(initialData);
  };

  const handleImageUpload = () => {
    console.log("Upload image");
  };

  return (
    <section className="space-y-8" aria-labelledby="profile-settings-title">
      <Card>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit(handleSave)}>
            <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
              <div className="flex flex-col justify-start items-center space-y-4 lg:w-1/4">
                <Avatar
                  //src={initialData?.imageUrl}
                  name={initialData?.firstName}
                  size="xl"
                  className="w-30 h-30 lg:w-40 lg:h-40"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Camera className="w-4 h-4" />}
                  onClick={handleImageUpload}
                  disabled={isLoading}
                >
                  Choose image
                </Button>
                <p className="text-sm text-ora-gray mt-2">
                  JPG, PNG or GIF. Max size of 2MB.
                </p>
              </div>

              <div className="flex-1 lg:w-3/4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="First Name" required>
                    <Input
                      {...register("firstName")}
                      error={errors.firstName?.message}
                      disabled={isLoading}
                    />
                  </FormGroup>

                  <FormGroup label="Last Name" required>
                    <Input
                      {...register("lastName")}
                      error={errors.lastName?.message}
                      disabled={isLoading}
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Tell about yourself:">
                  <Textarea
                    {...register("bio")}
                    error={errors.bio?.message}
                    disabled={isLoading}
                    rows={4}
                    resize="vertical"
                  />
                </FormGroup>

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
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfileSettings;
