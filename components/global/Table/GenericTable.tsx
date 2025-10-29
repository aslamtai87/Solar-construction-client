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
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  nextPage: boolean;
  previousPage: boolean;
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
  layout2?: boolean; // Optional prop for new table design variation
}

export function GenericTable<T extends { id: string }>({
  data,
  columns,
  currentPage,
  setCurrentPage,
  totalPages,
  nextPage,
  previousPage,
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
  showSearch = true,
  layout2 = false,
}: GenericTableProps<T>) {
  return (
    <div>
      <div
        className={`space-y-4 rounded-2xl ${
          layout2 ? "bg-[#F7F9FB] shadow-new" : ""
        } p-5`}
      >
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
        <div className="min-w-[1200px]">
          <Table
            className={` ${
              layout2 ? "border-separate border-spacing-y-4" : ""
            }`}
          >
            <TableHeader>
              <TableRow
                className={` ${
                  layout2
                    ? "bg-bg-text hover:bg-bg-text"
                    : "bg-table-header hover:bg-table-header"
                } border-none`}
              >
                {columns.map((column, index) => (
                  <TableHead
                    key={column.key}
                    className={`font-medium p-4  ${
                      index === 0
                        ? "first:rounded-tl-xl first:rounded-bl-xl"
                        : index === columns.length - 1
                        ? "last:rounded-tr-xl last:rounded-br-xl"
                        : ""
                    } ${column.className || ""}`}
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
                    className={`border-0 ${
                      layout2
                        ? "bg-bg-text hover:bg-bg-text"
                        : index % 2 === 0
                        ? "bg-bg-text hover:bg-bg-text"
                        : "bg-table-row hover:bg-table-row"
                    }`}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={column.key}
                        className={`p-0  ${
                          colIndex === 0
                            ? "first:rounded-tl-xl first:rounded-bl-xl"
                            : colIndex === columns.length - 1
                            ? "last:rounded-tr-xl last:rounded-br-xl"
                            : ""
                        }`}
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
                    className="text-center text-gray-500 p-8"
                  >
                    {isLoading
                      ? "Loading..."
                      : isError
                      ? "Error loading data"
                      : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </div>

        {pagination && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        )}
      </div>
    </div>
  );
}
