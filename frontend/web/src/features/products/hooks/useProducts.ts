import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { CursorPagedResult, PagedResult } from "@/common/types/result";
import { AppError } from "@/common/errors/AppError";
import { ProductService } from "../services/productService";
import {
  ProductSummaryResponse,
  ProductDetailsResponse,
  ProductFilters,
} from "../types";

export const useProducts = (
  page = 1,
  pageSize = 10,
  filters: ProductFilters = {},
  options?: UseQueryOptions<PagedResult<ProductSummaryResponse>, AppError>
) => {
  return useQuery<PagedResult<ProductSummaryResponse>, AppError>({
    queryKey: ["products", page, pageSize, filters],
    queryFn: () => ProductService.getProducts(page, pageSize, filters),
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    ...options,
  });
};

export const useEducatorProducts = (educatorId: string, pageSize = 12) => {
  return useInfiniteQuery<CursorPagedResult<ProductSummaryResponse>, AppError>({
    queryKey: ["educator-products", educatorId],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<readonly unknown[], unknown>) => {
      return ProductService.getProductsByEducator(
        educatorId,
        pageParam as string | null,
        pageSize
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!educatorId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
  });
};

export const usePurchasedProducts = (userId: string, pageSize = 12) => {
  return useInfiniteQuery<CursorPagedResult<ProductSummaryResponse>, AppError>({
    queryKey: ["my-purchased-products", userId],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<readonly unknown[], unknown>) => {
      return ProductService.getPurchasedProducts(
        pageParam as string | null,
        pageSize
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
  });
};

export const useProductById = (
  id: string,
  options?: UseQueryOptions<ProductDetailsResponse, AppError>
) => {
  return useQuery<ProductDetailsResponse, AppError>({
    queryKey: ["product", id],
    queryFn: () => ProductService.getProductById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id?.trim(),
    retry: (failureCount, error) =>
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      failureCount < 2,
    ...options,
  });
};
