import { profileApi } from "@/common/api/axiosInstance";
import { PagedResult } from "@/common/types/result";
import {
  EducatorSummaryResponse,
  UpdateEducatorProfileRequest,
} from "../types";

export const EducatorService = {
  async getEducators(
    page = 1,
    pageSize = 10
  ): Promise<PagedResult<EducatorSummaryResponse>> {
    const params = new URLSearchParams();
    params.append("pageNumber", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await profileApi.get<PagedResult<EducatorSummaryResponse>>(
      `/api/v1/educators?${params.toString()}`
    );
    return response.data;
  },
  async getRecommendedEducators(
    page = 1,
    pageSize = 10
  ): Promise<PagedResult<EducatorSummaryResponse>> {
    const params = new URLSearchParams();
    params.append("pageNumber", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await profileApi.get<PagedResult<EducatorSummaryResponse>>(
      `/api/v1/educators/recommended?${params.toString()}`
    );
    return response.data;
  },
  async createEducatorProfile(
    data: UpdateEducatorProfileRequest
  ): Promise<void> {
    await profileApi.post<void>("/api/v1/educators/me", data);
  },
  async updateEducatorProfile(
    data: UpdateEducatorProfileRequest
  ): Promise<void> {
    await profileApi.put<void>("/api/v1/educators/me", data);
  },
};
