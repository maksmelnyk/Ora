export interface PagedResult<T> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export interface CursorPagedResult<T> {
  items: T[];
  pageSize: number;
  nextCursor: string | null;
}
