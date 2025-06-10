import React from "react";
import { X } from "lucide-react";
import {
  Button,
  LanguageAutocomplete,
  DualRange,
  Sidebar,
  SidebarSection,
  CheckboxWithLabel,
} from "@/common/components";
import { ProductFilters, ProductLevel } from "../../types";
import { PRODUCT_LEVEL_CONFIG } from "../../constants";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const ProductFiltersSidebar: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  hasActiveFilters,
  onClearFilters,
}) => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 1500;

  const updateFilters = (updates: Partial<ProductFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleLevelChange = (level: ProductLevel, checked: boolean) => {
    updateFilters({ level: checked ? level : undefined });
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    updateFilters({
      minPrice: value[0] > MIN_PRICE ? value[0] : undefined,
      maxPrice: value[1] < MAX_PRICE ? value[1] : undefined,
    });
  };

  const handleRatingChange = (ratingValue: number, checked: boolean) => {
    updateFilters({ rating: checked ? ratingValue : undefined });
  };

  const handleLanguageChange = (languageCode: string | undefined) => {
    updateFilters({ language: languageCode });
  };

  return (
    <Sidebar>
      {hasActiveFilters && (
        <div className="p-4 border-b border-ora-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            fullWidth
            leftIcon={<X className="w-4 h-4" />}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      <SidebarSection title="Language">
        <LanguageAutocomplete
          value={filters.language}
          onChange={handleLanguageChange}
          placeholder="Search languages..."
        />
      </SidebarSection>

      <SidebarSection title="Level">
        <div className="space-y-2">
          {Object.entries(PRODUCT_LEVEL_CONFIG).map(([levelValue, item]) => {
            const levelEnum = parseInt(levelValue) as ProductLevel;
            return (
              <CheckboxWithLabel
                key={levelValue}
                id={`level-${levelValue}`}
                label={item.label}
                checked={filters.level === levelEnum}
                onChange={(e) => handleLevelChange(levelEnum, e.target.checked)}
              />
            );
          })}
        </div>
      </SidebarSection>

      <SidebarSection title="Rating">
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <CheckboxWithLabel
              key={rating}
              id={`${rating}-stars`}
              label={`${rating}${rating < 5 ? "+" : ""} Star${
                rating !== 1 ? "s" : ""
              }`}
              checked={filters.rating === rating}
              onChange={(e) => handleRatingChange(rating, e.target.checked)}
            />
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Price">
        <DualRange
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={5}
          value={[filters.minPrice || MIN_PRICE, filters.maxPrice || MAX_PRICE]}
          onChange={handlePriceRangeChange}
        />
      </SidebarSection>
    </Sidebar>
  );
};

export default ProductFiltersSidebar;
