import { authApi } from "@/common/api/axiosInstance";
import {
  RegistrationRequest,
  RegistrationResponse,
  RegistrationStatusRequest,
  RegistrationStatusResponse,
} from "@/common/types/auth";

export const AuthService = {
  async register(
    registrationData: RegistrationRequest
  ): Promise<RegistrationResponse> {
    const response = await authApi.post<RegistrationResponse>(
      "/api/v1/auth/register",
      registrationData
    );
    return response.data;
  },
  async checkRegistrationStatus(
    statusToken: string
  ): Promise<RegistrationStatusResponse> {
    const requestBody: RegistrationStatusRequest = { token: statusToken };
    const response = await authApi.post<RegistrationStatusResponse>(
      "/api/v1/auth/status",
      requestBody
    );
    return response.data;
  },
};
