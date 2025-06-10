import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PagedResult } from "@/common/types/result";
import { AppError } from "@/common/errors/AppError";
import { EducatorService } from "../services/educatorService";
import { EducatorSummaryResponse } from "../types";

export const useEducators = (
  page = 1,
  pageSize = 10,
  options?: Omit<
    UseQueryOptions<PagedResult<EducatorSummaryResponse>, AppError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PagedResult<EducatorSummaryResponse>, AppError>({
    queryKey: ["educators", page, pageSize],
    queryFn: () => EducatorService.getEducators(page, pageSize),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    ...options,
  });
};

export const useRecommendedEducators = (
  page = 1,
  pageSize = 10,
  options?: Omit<
    UseQueryOptions<PagedResult<EducatorSummaryResponse>, AppError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PagedResult<EducatorSummaryResponse>, AppError>({
    queryKey: ["recommended-educators", page, pageSize],
    queryFn: () => EducatorService.getRecommendedEducators(page, pageSize),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    ...options,
  });
};
