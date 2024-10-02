import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import GigPage from '@/components/gigs/GigPage';
import { GigData } from '@/types/types';

interface GigGridProps {
    gigs: GigData[];
    isLoading: boolean;
}

export function GigGrid({ gigs, isLoading }: GigGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="space-y-3">
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {gigs.map(({ gig, creatorProfile }) => (
                <GigPage
                    key={gig.gig_id}
                    gigId={gig.gig_id}
                    initialData={{ gig, creatorProfile }}
                />
            ))}
        </div>
    );
}