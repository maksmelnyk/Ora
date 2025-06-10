import { useState } from "react";

interface UsePaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  availablePageSizes?: number[];
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
}

export const usePagination = ({
  defaultPage = 1,
  defaultPageSize = 12,
  availablePageSizes = [12, 24, 36, 48],
}: UsePaginationOptions = {}): PaginationState & {
  availablePageSizes: number[];
} => {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(() => {
    return availablePageSizes.includes(defaultPageSize)
      ? defaultPageSize
      : availablePageSizes[0];
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    if (!availablePageSizes.includes(size)) {
      console.warn(
        `Page size ${size} is not in available options:`,
        availablePageSizes
      );
      return;
    }
    setPageSize(size);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetPagination = () => {
    setCurrentPage(defaultPage);
    setPageSize(
      availablePageSizes.includes(defaultPageSize)
        ? defaultPageSize
        : availablePageSizes[0]
    );
  };

  return {
    currentPage,
    pageSize,
    availablePageSizes,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    resetPagination,
  };
};
