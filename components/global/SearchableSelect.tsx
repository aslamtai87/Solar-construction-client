"use client";
import { useState, useRef, useEffect, useMemo, memo } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearchChange?: (query: string) => void;
  hasError?: boolean;
  searchQuery?: string;
}

const SearchableSelectComponent = ({
  options,
  value,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  onChange,
  onClear,
  onSearchChange,
  hasError = false,
  searchQuery: externalSearchQuery,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchQuery =
    externalSearchQuery !== undefined
      ? externalSearchQuery
      : internalSearchQuery;

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [options, searchQuery],
  );

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const handleSearchChange = (query: string) => {
    if (externalSearchQuery === undefined) {
      setInternalSearchQuery(query);
    }
    onSearchChange?.(query);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    if (externalSearchQuery === undefined) {
      setInternalSearchQuery("");
    } else {
      onSearchChange?.("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
    if (externalSearchQuery === undefined) {
      setInternalSearchQuery("");
    } else {
      onSearchChange?.("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (externalSearchQuery === undefined) {
          setInternalSearchQuery("");
        } else {
          onSearchChange?.("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [externalSearchQuery, onSearchChange]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative w-full ", className)}>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        className={cn(
          " max-w-84 sm:w-full justify-between text-left font-normal bg-white",
          !selectedOption && "text-muted-foreground",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && selectedOption && (
            <X
              className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-border bg-white rounded-md shadow-lg">
          <div className="p-2 border-b border-table-row">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 h-8 text-sm bg-white"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2",
                    value === option.value && "bg-green-50 text-green-600",
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SearchableSelect = memo(SearchableSelectComponent);
