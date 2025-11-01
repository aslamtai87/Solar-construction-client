import { useState, useCallback } from 'react';

interface PaginationInfo {
  nextCursor: string | null;
  total: number;
  noOfOutput: number;
}

interface UseCursorPaginationReturn {
  cursor: string | null;
  currentPageIndex: number;
  handleNextPage: (nextCursor: string | null) => void;
  handlePreviousPage: () => void;
  handleFirstPage: () => void;
  hasNextPage: (paginationInfo?: PaginationInfo) => boolean;
  hasPreviousPage: boolean;
}

export const useCursorPagination = (): UseCursorPaginationReturn => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [pageHistory, setPageHistory] = useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleNextPage = useCallback((nextCursor: string | null) => {
    if (nextCursor) {
      setCursor(nextCursor);
      
      // Add to history if not already there
      if (pageHistory[currentPageIndex + 1] !== nextCursor) {
        const newHistory = [...pageHistory.slice(0, currentPageIndex + 1), nextCursor];
        setPageHistory(newHistory);
      }
      setCurrentPageIndex(currentPageIndex + 1);
    }
  }, [pageHistory, currentPageIndex]);

  const handlePreviousPage = useCallback(() => {
    if (currentPageIndex > 0) {
      const prevCursor = pageHistory[currentPageIndex - 1];
      setCursor(prevCursor);
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }, [pageHistory, currentPageIndex]);

  const handleFirstPage = useCallback(() => {
    setCursor(null);
    setCurrentPageIndex(0);
    setPageHistory([null]);
  }, []);

  const hasNextPage = useCallback((paginationInfo?: PaginationInfo) => {
    return !!paginationInfo?.nextCursor;
  }, []);

  const hasPreviousPage = currentPageIndex > 0;

  return {
    cursor,
    currentPageIndex,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    hasNextPage,
    hasPreviousPage,
  };
};
