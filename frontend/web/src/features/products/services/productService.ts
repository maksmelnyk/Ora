import { learningApi } from "@/common/api/axiosInstance";
import { CursorPagedResult, PagedResult } from "@/common/types/result";
import {
  ProductSummaryResponse,
  ProductDetailsResponse,
  ProductFilters,
  ProductCreateRequest,
} from "../types";

export const ProductService = {
  async getProducts(
    page = 1,
    pageSize = 10,
    filters: ProductFilters = {}
  ): Promise<PagedResult<ProductSummaryResponse>> {
    const params = new URLSearchParams();
    params.append("pageNumber", page.toString());
    params.append("pageSize", pageSize.toString());
    if (filters.educatorId) params.append("educatorId", filters.educatorId);
    if (filters.type !== undefined)
      params.append("type", filters.type.toString());
    if (filters.level !== undefined)
      params.append("level", filters.level.toString());
    if (filters.language) params.append("language", filters.language);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.subCategoryId)
      params.append("subCategoryId", filters.subCategoryId);
    if (filters.title) params.append("title", filters.title);
    if (filters.rating) params.append("minRating", filters.rating.toString());

    const response = await learningApi.get<PagedResult<ProductSummaryResponse>>(
      `/api/v1/products?${params.toString()}`
    );
    return response.data;
  },
  async getProductsByEducator(
    educatorId: string,
    cursor: string | null = null,
    pageSize: number = 10
  ): Promise<CursorPagedResult<ProductSummaryResponse>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("pageSize", pageSize.toString());

    const response = await learningApi.get<
      CursorPagedResult<ProductSummaryResponse>
    >(`/api/v1/products/educator/${educatorId}?${params.toString()}`);
    return response.data;
  },
  async getPurchasedProducts(
    cursor: string | null = null,
    pageSize: number = 10
  ): Promise<CursorPagedResult<ProductSummaryResponse>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("pageSize", pageSize.toString());

    const response = await learningApi.get<
      CursorPagedResult<ProductSummaryResponse>
    >(`/api/v1/products/my?${params.toString()}`);
    return response.data;
  },
  async getProductById(id: string): Promise<ProductDetailsResponse> {
    const response = await learningApi.get<ProductDetailsResponse>(
      `/api/v1/products/${id}`
    );
    return response.data;
  },
  async createProduct(data: ProductCreateRequest): Promise<void> {
    await learningApi.post(`/api/v1/products`, data);
  },
};
