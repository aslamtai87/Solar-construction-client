import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableHeader } from "./TableHeader";
import Pagination from "./Pagination";
import CursorPagination from "./CursorPagination";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: boolean;
  paginationType?: 'offset' | 'cursor';
  // Offset-based pagination props
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  nextPage?: boolean;
  previousPage?: boolean;
  // Cursor-based pagination props
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onFirstPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPageNumber?: number;
  totalItems?: number;
  currentItems?: number;
  // Common props
  showSearch?: boolean;
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: () => void;
  addButtonText?: string;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  showDatePicker?: boolean;
  onDateRangeChange?: (range: { from: Date; to: Date } | null) => void;
  searchPlaceholder?: string;
  filterComponents?: React.ReactNode;
  showHeader?: boolean;
  loadingMessage?: string;
  tableName?: string;
  tableDescription?: string;
  addButtonIcon?: React.ReactNode;
  addButtonOutline?: boolean;
  headerText?: string;
  headerDescription?: string;
  layout2?: boolean;
}

export function GenericTable<T extends { id: string }>({
  data,
  columns,
  currentPage = 1,
  setCurrentPage = () => {},
  totalPages = 1,
  nextPage = false,
  previousPage = false,
  onNextPage,
  onPreviousPage,
  onFirstPage,
  hasNextPage = false,
  hasPreviousPage = false,
  currentPageNumber = 1,
  totalItems,
  currentItems,
  searchValue,
  onSearchChange,
  onAdd,
  addButtonText = "Add New",
  isLoading = false,
  isError = false,
  emptyMessage = "No data found",
  loadingMessage = "Loading...",
  showDatePicker = true,
  showHeader = true,
  onDateRangeChange,
  searchPlaceholder = "Search",
  filterComponents,
  tableName,
  tableDescription,
  addButtonIcon = null,
  addButtonOutline = false,
  pagination = true,
  paginationType = 'offset',
  showSearch = true,
  layout2 = false,
}: GenericTableProps<T>) {
  return (
    <div>
      <div className="space-y-4 rounded-2xl py-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{tableName}</h2>
          <span className="text-text-light text-sm">{tableDescription}</span>
        </div>
        {showHeader && (
          <DataTableHeader
            showSearch={showSearch}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onAdd={onAdd}
            addButtonText={addButtonText}
            showDatePicker={showDatePicker}
            onDateRangeChange={onDateRangeChange}
            searchPlaceholder={searchPlaceholder}
            addButtonIcon={addButtonIcon}
            addButtonOutline={addButtonOutline}
          >
            {filterComponents}
          </DataTableHeader>
        )}
        <div className="w-full overflow-x-auto">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-border transition-colors hover:bg-muted/30"
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className="p-0 text-foreground"
                        >
                          {column.render(item, index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg
                          className="h-12 w-12 opacity-40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-sm font-medium">
                          {isLoading
                            ? "Loading data..."
                            : isError
                            ? "Error loading data"
                            : emptyMessage}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {pagination && paginationType === 'offset' && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        )}
        
        {pagination && paginationType === 'cursor' && onNextPage && onPreviousPage && (
          <CursorPagination
            onNext={onNextPage}
            onPrevious={onPreviousPage}
            onFirst={onFirstPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            currentPage={currentPageNumber}
            totalItems={totalItems}
            currentItems={currentItems}
          />
        )}
      </div>
    </div>
  );
}
