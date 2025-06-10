import { profileApi } from "@/common/api/axiosInstance";
import { ProfileDetailsResponse, UpdateProfileRequest } from "../types";

export const ProfileService = {
  async getMyProfile(): Promise<ProfileDetailsResponse> {
    const response = await profileApi.get<ProfileDetailsResponse>(
      "api/v1/profiles/me"
    );
    return response.data;
  },
  async getProfileById(id: string): Promise<ProfileDetailsResponse> {
    const response = await profileApi.get<ProfileDetailsResponse>(
      `api/v1/profiles/${id}`
    );
    return response.data;
  },
  async updateMyProfile(user: UpdateProfileRequest): Promise<void> {
    await profileApi.put<void>("api/v1/profiles/me", user);
  },
};
