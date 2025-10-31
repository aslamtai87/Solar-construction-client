import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { DateRangePicker } from "@/components/global/DateRangePicker";

interface TableHeaderProps {
    searchValue?: string;
    onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd?: () => void;
    addButtonText?: string;
    showDatePicker?: boolean;
    onDateRangeChange?: (range: any) => void;
    showSearch?: boolean;
    searchPlaceholder?: string;
    children?: React.ReactNode;
    addButtonOutline?: boolean;
    addButtonIcon?: React.ReactNode;
}

export const DataTableHeader = ({
    searchValue = "",
    onSearchChange,
    onAdd,
    addButtonText = "Add New",
    showDatePicker = true,
    onDateRangeChange,
    showSearch = true,
    searchPlaceholder = "Search",
    children,
    addButtonOutline = false,
    addButtonIcon = null,
}: TableHeaderProps) => {
    return (
        <div className="flex flex-col xl:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start sm:items-center">
                {showSearch && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                            placeholder={searchPlaceholder} 
                            className="pl-10 w-64" 
                            value={searchValue}
                            onChange={onSearchChange} 
                        />
                    </div>
                )}
                {children}
            </div>

            <div className="flex sm:flex-row flex-col gap-2">
                {showDatePicker && (
                    <DateRangePicker onDateRangeChange={onDateRangeChange || (() => {})} />
                )}
                {onAdd && (
                    <Button className="flex items-center gap-2 cursor-pointer bg-[#1a1d29] hover:bg-[#1a1d29]/90" onClick={onAdd} variant={addButtonOutline ? "outline" : "default"}>
                        {addButtonIcon ? addButtonIcon : <Plus className="h-4 w-4" />}
                        {addButtonText}
                    </Button>
                )}
            </div>
        </div>
    );
};