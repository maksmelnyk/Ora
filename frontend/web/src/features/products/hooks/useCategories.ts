import { AppError } from "@/common/errors/AppError";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { CategoryResponse } from "../types";
import { CategoryService } from "../services/categoriesService";

export const useCategories = (
  options?: UseQueryOptions<CategoryResponse[], AppError>
) => {
  return useQuery<CategoryResponse[], AppError>({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getCategories(),
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    ...options,
  });
};
