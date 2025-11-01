import { Button } from "@/components/ui/button";

export default function CursorPagination({
    onNext,
    onPrevious,
    onFirst,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalItems,
    currentItems,
}: {
    onNext: () => void;
    onPrevious: () => void;
    onFirst?: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    currentPage: number;
    totalItems?: number;
    currentItems?: number;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                    Page {currentPage}
                    {totalItems !== undefined && totalItems > 0 && ` • ${totalItems} total items`}
                    {currentItems !== undefined && currentItems > 0 && ` • Showing ${currentItems} items`}
                </span>
            </div>

            <div className="flex items-center gap-1">
                {onFirst && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onFirst}
                        disabled={!hasPreviousPage}
                    >
                        {"<<"}
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPrevious}
                    disabled={!hasPreviousPage}
                >
                    {"<"} Previous
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNext}
                    disabled={!hasNextPage}
                    className={hasNextPage ? "bg-black text-white hover:bg-black/90" : ""}
                >
                    Next {">"}
                </Button>
            </div>
        </div>
    );
}
