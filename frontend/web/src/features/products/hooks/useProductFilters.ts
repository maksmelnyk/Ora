import { useState, useCallback } from "react";
import { ProductFilters, ProductType } from "../types";
import { useDebouncedValue } from "@/common/hooks";

interface UseProductFiltersProps {
  defaultProductType: ProductType;
}

interface UseProductFiltersReturn {
  filters: ProductFilters;
  filtersForQuery: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  updateFilters: (updates: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export const useProductFilters = ({
  defaultProductType,
}: UseProductFiltersProps): UseProductFiltersReturn => {
  const [filters, setFilters] = useState<ProductFilters>({
    type: defaultProductType,
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    level: undefined,
    language: undefined,
  });

  const updateFilters = useCallback((updates: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      type: defaultProductType,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      level: undefined,
      language: undefined,
    });
  }, [defaultProductType]);

  const hasActiveFilters = Boolean(
    filters.minPrice ||
      filters.maxPrice ||
      filters.rating ||
      filters.level ||
      filters.language
  );

  const debouncedFilters = useDebouncedValue(filters, 500);
  const filtersForQuery = {
    ...debouncedFilters,
    type: filters.type,
  };

  return {
    filters,
    filtersForQuery,
    setFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
};

export default useProductFilters;
