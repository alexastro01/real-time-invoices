import React from 'react';
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface SearchBarProps {
    searchTerm: string;
    onSearch: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
    return (
        <div className="relative flex-grow">
            <Input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
}