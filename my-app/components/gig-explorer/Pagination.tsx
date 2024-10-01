import React from 'react';
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center mt-4 space-x-2">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                Previous
            </Button>
            <span className="py-2 px-4 bg-muted text-muted-foreground rounded">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                Next
            </Button>
        </div>
    );
}