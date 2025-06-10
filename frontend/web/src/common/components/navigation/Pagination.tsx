import React, { JSX } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils";

export interface PageSizeSelectorProps {
  pageSize: number;
  availablePageSizes: number[];
  onPageSizeChange: (size: number) => void;
  totalItems?: number;
  className?: string;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  availablePageSizes,
  onPageSizeChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <label htmlFor="page-size-select" className="ora-body">
        Show:
      </label>
      <select
        id="page-size-select"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className={cn("rounded-md px-3 py-1.5 text-sm ora-body text-ora-navy")}
        aria-label="Items per page"
      >
        {availablePageSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  availablePageSizes?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  availablePageSizes = [12, 24, 36, 48],
  onPageChange,
  onPageSizeChange,
  className,
}) => {
  const maxPagesToShow = 5;

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    const pages: JSX.Element[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={cn(
            "relative inline-flex items-center px-3 py-2 text-sm font-medium border-2 hover:text-ora-highlight"
          )}
          aria-label="Go to page 1"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span
            key="start-ellipsis"
            className={cn(
              "relative inline-flex items-center px-4 py-2 border-2 border-ora-gray-200",
              "bg-white text-sm font-medium text-ora-gray ora-body"
            )}
            aria-hidden="true"
          >
            ...
          </span>
        );
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      const isActive = page === currentPage;
      pages.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            " relative inline-flex whitespace-nowrap py-4 px-3 font-medium text-sm ora-transition focus:outline-none",
            isActive
              ? "text-ora-highlight"
              : "border-transparent text-ora-gray hover:text-ora-navy hover:border-ora-gray-300"
          )}
          aria-current={isActive ? "page" : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className={cn(
              "relative inline-flex items-center px-4 py-2 border-2 border-ora-gray-200",
              "bg-white text-sm font-medium text-ora-gray ora-body"
            )}
            aria-hidden="true"
          >
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={cn(
            "relative inline-flex items-center px-3 py-2 text-sm font-medium border-2 hover:text-ora-highlight"
          )}
          aria-label={`Go to page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalItems === 0 && totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-center gap-4",
        className
      )}
    >
      <PageSizeSelector
        pageSize={pageSize}
        availablePageSizes={availablePageSizes}
        onPageSizeChange={onPageSizeChange}
      />

      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center"
          aria-label="Pagination"
        >
          <div className="flex items-center isolate gap-1">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={cn(
                "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium  ora-body",
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-ora-highlight"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="hidden sm:flex items-center gap-1 mx-2">
              {renderPageNumbers()}
            </div>

            <div className="sm:hidden flex items-center px-4 py-2 text-sm ora-body text-ora-gray border-2 border-ora-gray-200 bg-white rounded-md mx-2">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={cn(
                "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-ora-highlight"
              )}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </nav>
      )}

      <div className="text-sm ora-body text-ora-gray text-center">
        Showing{" "}
        <span className="font-medium ora-emphasis text-ora-navy">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-medium ora-emphasis text-ora-navy">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium ora-emphasis text-ora-navy">
          {totalItems}
        </span>{" "}
        results
      </div>
    </div>
  );
};

export default Pagination;
