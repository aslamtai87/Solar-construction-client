"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  subDays,
  subWeeks,
  startOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
interface DateRangePickerProps {
  onDateRangeChange?: (range: { from: Date; to: Date } | null) => void;
}
export function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialRange = {
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  };
  const [selectedRange, setSelectedRange] = useState<{
    from: Date;
    to: Date;
  } | null>(initialRange);
  const [tempRange, setTempRange] = useState<{ from: Date; to: Date } | null>(
    selectedRange
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("today");
  const presets = [
    {
      label: "Today",
      value: "today",
      range: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
    },
    {
      label: "Yesterday",
      value: "yesterday",
      range: () => {
        const yesterday = subDays(new Date(), 1);
        return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
      },
    },
    {
      label: "Last week",
      value: "lastWeek",
      range: () => ({ from: subWeeks(new Date(), 1), to: new Date() }),
    },
    {
      label: "Last 7 days",
      value: "last7Days",
      range: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      label: "This month",
      value: "thisMonth",
      range: () => ({ from: startOfMonth(new Date()), to: new Date() }),
    },
    {
      label: "Last 30 days",
      value: "last30Days",
      range: () => ({ from: subDays(new Date(), 30), to: new Date() }),
    },
  ];
  const handlePresetClick = (preset: (typeof presets)[0]) => {
    const range = preset.range();
    setTempRange(range);
    setSelectedPreset(preset.value);
  };
  const handleCustomRangeClick = () => {
    setSelectedPreset("today");
  };
  const handleDone = () => {
    setSelectedRange(tempRange);
    onDateRangeChange?.(tempRange);
    setIsOpen(false);
  };
  const handleCancel = () => {
    setTempRange(selectedRange);
    setIsOpen(false);
  };

  const handleDoubleClick = () => {
    const newInitialRange = {
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    };
    setSelectedRange(newInitialRange);
    setTempRange(newInitialRange);
    setSelectedPreset("today");
    onDateRangeChange?.(newInitialRange);
  };
  const formatDateRange = (range: { from: Date; to: Date } | null) => {
    if (!range) return "Today";
    if (range.from.toDateString() === range.to.toDateString()) {
      return format(range.from, "MMM d, yyyy");
    }
    return `${format(range.from, "MMM d, yyyy")} - ${format(
      range.to,
      "MMM d, yyyy"
    )}`;
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onDoubleClick={handleDoubleClick}
        >
          <CalendarDays className="h-4 w-4" />
          {formatDateRange(selectedRange)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col">
        <div className="flex">
          {/* Left Sidebar - Presets */}
          <div className="w-48 hidden sm:block p-4 border-r bg-gray-50">
            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                    selectedPreset === preset.value
                      ? "bg-white border border-gray-200"
                      : ""
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={handleCustomRangeClick}
                className={`w-full text-left px-3 py-2 text-sm rounded-md border hover:bg-gray-100 ${
                  selectedPreset === "custom"
                    ? "bg-white border-gray-400"
                    : "border-gray-200"
                }`}
              >
                Custom range
              </button>
            </div>
          </div>
          {/* Right Side - Calendar */}
          <div className="p-4">
            <Calendar
              mode="range"
              selected={
                tempRange
                  ? { from: tempRange.from, to: tempRange.to }
                  : undefined
              }
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setTempRange({ from: range.from, to: range.to });
                  setSelectedPreset("custom");
                } else if (range?.from) {
                  setTempRange({ from: range.from, to: range.from });
                  setSelectedPreset("custom");
                }
              }}
              numberOfMonths={1}
              className="rounded-md"
            />
            {/* Selected Range Display */}
          </div>
        </div>
          <div className="mt-4 p-4 border-t">
            <div className="flex items-center sm:flex-row flex-col gap-2 justify-between">
              <span className="text-sm text-gray-600">
                {tempRange ? formatDateRange(tempRange) : "Select dates"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleDone}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}