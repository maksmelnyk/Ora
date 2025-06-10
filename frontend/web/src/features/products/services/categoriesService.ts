import { learningApi } from "@/common/api/axiosInstance";
import { CategoryResponse } from "../types";

export const CategoryService = {
  async getCategories(): Promise<CategoryResponse[]> {
    const response = await learningApi.get<CategoryResponse[]>(
      `/api/v1/categories/`
    );
    return response.data;
  },
};
