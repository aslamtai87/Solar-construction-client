export interface PaginationResponse<T> {
    data: {
        result: T[];
        pagination: Pagination;
    };
}

export interface Pagination {
  nextCursor: string | null;
  total: number;
  noOfOutput: number;
}