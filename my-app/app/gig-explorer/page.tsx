'use client';
import React, { useState } from 'react'
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

// Mock data for gigs
const mockGigs = [
  {
    gig_id: 'ec581cb3-c2e7-440a-aaf1-dc6a4ef45651',
    title: 'Create a stunning logo',
    description: 'I will design a professional and eye-catching logo for your brand',
    delivery_time: 3,
    price: 50,
    chain_id: 2810 as ValidChainId,
    creator_address: '0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f',
    category: 'Design',
    created_at: '2023-09-15T10:30:00Z',
    featured: true,
    creator_profile: {
      name: 'Harry Zhang',
      profile_image: '/harry_zhang.jpg',
    },
  },
  {
    gig_id: 'ec581cb3-c2e7-440a-aaf1-dc6a4ef45651',
    title: 'Develop a smart contract',
    description: 'I will create a secure and efficient smart contract for your DApp',
    delivery_time: 7,
    price: 500,
    chain_id: 2810 as ValidChainId,
    creator_address: '0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f',
    category: 'Development',
    created_at: '2023-09-20T14:45:00Z',
    featured: false,
    creator_profile: {
        name: 'Harry Zhang',
        profile_image: '/harry_zhang.jpg',
      },
  },
  {
    gig_id: 'ec581cb3-c2e7-440a-aaf1-dc6a4ef45651',
    title: 'Write engaging blog content',
    description: 'I will craft SEO-optimized blog posts to boost your online presence',
    delivery_time: 2,
    price: 30,
    chain_id: 2810 as ValidChainId,
    creator_address: '0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f',
    category: 'Writing',
    created_at: '2023-09-25T09:15:00Z',
    featured: true,
    creator_profile: {
        name: 'Harry Zhang',
        profile_image: '/harry_zhang.jpg',
      },
  },
  {
    gig_id: 'ec581cb3-c2e7-440a-aaf1-dc6a4ef45651',
    title: 'Design a responsive website',
    description: 'I will create a modern, mobile-friendly website for your business',
    delivery_time: 14,
    price: 1000,
    chain_id: 2810 as ValidChainId,
    creator_address: '0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f',
    category: 'Development',
    created_at: '2023-09-28T16:00:00Z',
    featured: false,
    creator_profile: {
        name: 'Harry Zhang',
        profile_image: '/harry_zhang.jpg',
      },
  },
]

const formatEvmAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

const categories = ['All', 'Design', 'Development', 'Writing', 'Marketing']

const GigCard = ({ gig }: { gig: typeof mockGigs[0] }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle className="text-xl font-bold">{gig.title}</CardTitle>
      <CardDescription className="text-sm mt-2">{gig.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="flex items-center justify-between text-sm space-x-4 mb-4">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          <span>Delivery: {gig.delivery_time} days</span>
        </div>
        <Badge variant="outline" className="text-lg font-bold py-1 px-2">
          <DollarSign className="h-4 w-4 mr-1" />
          {gig.price}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src={chainInfo[gig.chain_id].logoUrl} alt="chain logo" width={20} height={20} />
          <span className="text-sm">{chainInfo[gig.chain_id].name}</span>
        </div>
        <Badge variant="secondary">{gig.category}</Badge>
      </div>
    </CardContent>
    <CardFooter>
     <GigCreatorPreview creatorAddress={gig.creator_address} formatEvmAddress={formatEvmAddress} />
      <Link href={`/gig/${gig.gig_id}`} className="w-full">
        <Button className="w-full" size="sm">
          View Gig
        </Button>
      </Link>
    </CardFooter>
  </Card>
)

export default function EnhancedExplorerGigsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChain, setSelectedChain] = useState<ValidChainId | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredGigs = mockGigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedChain === 'all' || gig.chain_id === selectedChain) &&
    (selectedCategory === 'All' || gig.category === selectedCategory)
  )

  const mostRecentGigs = [...mockGigs].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 3)

  const featuredGigs = mockGigs.filter(gig => gig.featured).slice(0, 3)

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

      <Tabs defaultValue="all" className="mb-8">
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
      </Tabs>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Gigs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGigs.map(gig => (
            <GigPage gigId={gig.gig_id} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Most Recent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mostRecentGigs.map(gig => (
           <GigPage gigId={gig.gig_id} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Gigs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map(gig => (
             <GigPage gigId={gig.gig_id} />
          ))}
        </div>
      </section>
    </div>
  )
}