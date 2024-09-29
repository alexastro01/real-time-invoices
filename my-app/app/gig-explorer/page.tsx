'use client';
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DollarSign, Search, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions'
import GigCreatorPreview from '@/components/gigs/GigCreatorPreview';
import GigPage from '@/components/gigs/GigPage';
import { Gig } from '@/types/types';



interface CreatorProfile {
    // Add creator profile properties here
    evmAddress: string;
    name: string;
    profile_picture: string;
}

interface GigData {
    gig: Gig;
    creatorProfile: CreatorProfile;
}

// Remove the mockGigs array as we'll fetch real data from the API

export default function EnhancedExplorerGigsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedChain, setSelectedChain] = useState<ValidChainId | 'all'>('all')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [recentGigs, setRecentGigs] = useState<GigData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRecentGigs = async () => {
            try {
                const response = await fetch('/api/get-recent-gigs');
                if (!response.ok) {
                    throw new Error('Failed to fetch recent gigs');
                }
                const data: GigData[] = await response.json();
                setRecentGigs(data);
            } catch (error) {
                console.error('Error fetching recent gigs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentGigs();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Explore Gigs</h1>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Search gigs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <Select value={selectedChain.toString()} onValueChange={(value) => setSelectedChain(value as ValidChainId | 'all')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Chains</SelectItem>
                        {Object.entries(chainInfo).map(([id, info]) => (
                            <SelectItem key={id} value={id}>
                                <div className="flex items-center">
                                    <Image src={info.logoUrl} alt={info.name} width={20} height={20} className="mr-2" />
                                    {info.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs> */}

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Most Recent Gigs</h2>
                {isLoading ? (
                    <p>Loading recent gigs...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                        {recentGigs.map(({ gig, creatorProfile }) => (
                            <GigPage
                                gigId={gig.gig_id}
                                initialData={{ gig, creatorProfile }}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}