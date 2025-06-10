import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useKeycloak } from "@/common/contexts/KeycloakContext";
import { ProfileService } from "../services/profileService";
import { ProfileDetailsResponse, UpdateProfileRequest } from "../types";
import { AppError } from "@/common/errors/AppError";
import { useUser } from "@/common/contexts";
import { UpdateEducatorProfileRequest } from "@/features/educators/types";

export const myProfileKey = (id: string) => ["my-profile", id] as const;
export const profileKey = (id: string) => ["profile", id] as const;

export const useProfileById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ProfileDetailsResponse, AppError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ProfileDetailsResponse, AppError>({
    queryKey: profileKey(id),
    queryFn: () => ProfileService.getProfileById(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id?.trim()),
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useMyProfile = (
  options?: Omit<
    UseQueryOptions<ProfileDetailsResponse, AppError>,
    "queryKey" | "queryFn"
  >
) => {
  const { authenticated, keycloak } = useKeycloak();

  return useQuery<ProfileDetailsResponse, AppError>({
    queryKey: myProfileKey(keycloak?.subject || ""),
    queryFn: () => ProfileService.getMyProfile(),
    staleTime: 5 * 60 * 1000,
    enabled: !!authenticated && !!keycloak?.token && !!keycloak?.subject,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return {
    updateUserInfo: async (update: UpdateProfileRequest) => {
      await ProfileService.updateMyProfile(update);

      if (!user) return;

      queryClient.setQueryData<ProfileDetailsResponse>(
        myProfileKey(user.id),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...update,
          };
        }
      );

      queryClient.setQueryData<ProfileDetailsResponse>(
        profileKey(user.id),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...update,
          };
        }
      );
    },
    updateEducatorInfo: async (update: UpdateEducatorProfileRequest) => {
      if (!user) return;

      queryClient.setQueryData<ProfileDetailsResponse>(
        myProfileKey(user.id),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            educator: {
              ...prev.educator,
              ...update,
            },
          };
        }
      );

      queryClient.setQueryData<ProfileDetailsResponse>(
        profileKey(user.id),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            educator: {
              ...prev.educator,
              ...update,
            },
          };
        }
      );
    },
  };
};
