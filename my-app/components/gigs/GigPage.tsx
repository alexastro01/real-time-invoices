import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Clock, DollarSign, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions'
import Image from 'next/image'
import Link from 'next/link'
import { Gig } from '@/types/types'
import GigCreatorPreview from './GigCreatorPreview'
import { Skeleton } from '../ui/skeleton'

interface GigPageProps {
  gigId: string;
  initialData?: {
    gig: Gig;
    creatorProfile: any;
  };
}

export default function GigPage({ gigId, initialData }: GigPageProps) {
  const [gig, setGig] = useState<Gig | null>(initialData?.gig || null)
  const [creatorProfile, setCreatorProfile] = useState<any>(initialData?.creatorProfile || null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (gigId && !initialData) {
      fetchGigAndProfile()
    }
  }, [gigId, initialData])

  const fetchGigAndProfile = async () => {
    try {
      const response = await fetch(`/api/get-gig?gig_id=${gigId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch gig and profile')
      }
      const data = await response.json()
      console.log("Fetched data:", data)
      setGig(data.gig)
      setCreatorProfile(data.creatorProfile)
    } catch (err: any) {
      console.error("Error fetching gig and profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatEvmAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="w-full p-4">
        <Card className="w-full h-[400px]">
          <CardHeader>
            <Skeleton className="h-9 w-3/4 mb-2" />
            <Skeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm space-x-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-16 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }
  if (error) return <div className="w-full p-4">Error: {error}</div>
  if (!gig) return <div className="w-full p-4">Gig not found</div>

  return (
    <div className="w-full p-4">
      <Card className="w-full h-[400px] flex flex-col">
        <CardHeader className="flex-grow-0 pb-2">
          <CardTitle className="text-xl font-bold line-clamp-2">{gig.title}</CardTitle>
          <CardDescription className="text-sm mt-2 line-clamp-3">{gig.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-sm">Delivery: {gig.delivery_time} days</span>
            </div>
            <Badge variant="secondary" className="text-lg font-bold py-1 px-3 flex items-center">
     <DollarSign className="h-5 w-5 mr-1" />
     {gig.price}
     <Image src={chainInfo[gig.chain_id as ValidChainId].logoUrl} alt="chain logo" width={24} height={24} className="ml-2" />
   </Badge>
          </div>
          
          <GigCreatorPreview 
            creatorAddress={gig?.creator_address || ''} 
            formatEvmAddress={formatEvmAddress} 
            creatorProfile={creatorProfile}
            isLoading={loading}
          />
        </CardContent>
        <CardFooter className="flex-grow-0 pt-2">
          <Link href={`/gig-payment/${gig.gig_id}`} className='w-full'>
            <Button className="w-full" size="lg">
              Order Now
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}