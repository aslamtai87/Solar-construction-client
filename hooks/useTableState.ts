'use client'
import { useState,useEffect } from "react";
import debounce from "lodash.debounce";

interface UseTableStateOptions {
  initialPage?: number;
  initialSearch?: string;
}

export const useTableState = (options: UseTableStateOptions = {}) => {
  const [currentPage, setCurrentPage] = useState(options.initialPage || 1);
  const [searchText, setSearchText] = useState(options.initialSearch || "");
  const [deletingId, setDeletingId] = useState<string | null>(null);
    const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

 useEffect(() => {
    const handler = debounce((val: string) => setDebouncedSearchText(val), 500);
    handler(searchText);
    return () => handler.cancel();
  }, [searchText]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/^\s/, "");
    value = value.replace(/\s+/g, " ");
    setSearchText(value); // Immediate update for input field
    setCurrentPage(1);
  };

  const resetToFirstPage = () => setCurrentPage(1);

  const createDeleteHandler = (deleteMutation: any) => async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    searchText,
    debouncedSearchText,
    setSearchText,
    handleSearchChange,
    resetToFirstPage,
    deletingId,
    setDeletingId,
    createDeleteHandler,
  };
};
