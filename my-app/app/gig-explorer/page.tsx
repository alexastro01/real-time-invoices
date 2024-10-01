'use client';
import React, { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast';
import debounce from 'lodash/debounce';
import { ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';
import { fetchRecentGigs } from '@/utils/search/fetchSearchGigs';
import { SearchBar } from '@/components/gig-explorer/SearchBar';
import { ChainSelector } from '@/components/gig-explorer/ChainSelector';
import { GigGrid } from '@/components/gig-explorer/GigGrid';
import { Pagination } from '@/components/gig-explorer/Pagination';
import { GigData } from '@/types/types';

export default function EnhancedExplorerGigsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [selectedChain, setSelectedChain] = useState<ValidChainId | 'all'>('all')
    const [recentGigs, setRecentGigs] = useState<GigData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const { toast } = useToast();

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 500),
        []
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handlePageChange = (newPage: number) => {
        fetchRecentGigs(newPage, debouncedSearchTerm, setRecentGigs, setTotalPages, setCurrentPage, setIsLoading, toast);
    };

    useEffect(() => {
        fetchRecentGigs(1, debouncedSearchTerm, setRecentGigs, setTotalPages, setCurrentPage, setIsLoading, toast);
    }, [debouncedSearchTerm, toast]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Explore Gigs</h1>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
                {/* <ChainSelector selectedChain={selectedChain} onChainSelect={setSelectedChain} /> */}
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Most Recent Gigs</h2>
                <GigGrid gigs={recentGigs} isLoading={isLoading} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </div>
    )
}