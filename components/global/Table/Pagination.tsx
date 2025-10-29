import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Pagination({
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    previousPage
}: {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    nextPage: boolean;
    previousPage: boolean;
}) {

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    console.log("Pagination component rendered with currentPage:", currentPage, "totalPages:", totalPages);
    
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page</span>
                <Select value={currentPage.toString()} onValueChange={(value) => setCurrentPage(Number.parseInt(value))}>
                    <SelectTrigger className="w-16">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>

            <div className="flex items-center gap-1">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCurrentPage(1)} 
                    disabled={!previousPage || currentPage === 1}
                >
                    {"<<"}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={!previousPage || currentPage === 1}
                >
                    {"<"}
                </Button>

                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className={currentPage === page ? "bg-black text-bg-text hover:bg-black" : ""}
                        >
                            {page}
                        </Button>
                    )
                ))}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={!nextPage || currentPage === totalPages}
                >
                    {">"}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={!nextPage || currentPage === totalPages}
                >
                    {">>"}
                </Button>
            </div>
        </div>
    );
}