"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: { message?: string };
  label?: string;
  placeholder?: string;
}

const LocationAutocomplete = ({
  value,
  onChange,
  error,
  label = "Location",
  placeholder = "Search for a location...",
}: LocationAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=10`,
        {
          headers: {
            "User-Agent": "SolarResolute/1.0",
          },
        }
      );
      const data = await response.json();
      setResults(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Location search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("LocationAutocomplete results:", results);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchLocation(searchQuery);
    }, 500),
    []
  );
  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: LocationResult) => {
    const formattedLocation = location.display_name;
    setQuery(formattedLocation);
    onChange(formattedLocation);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative space-y-2.5">
      <Label htmlFor="location">{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="location"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            "pl-10 pb-0 min-h-10",
            error && "border-red-500 focus-visible:ring-red-500",
          )}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((location) => (
            <button
              key={location.place_id}
              type="button"
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-start gap-2"
            >
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-700">{location.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {error?.message && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default LocationAutocomplete;
