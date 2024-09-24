import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Clock, DollarSign, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions'
import Image from 'next/image'

interface Gig {
  gig_id: string;
  creator_address: string;  // This is now the evmAddress
  title: string;
  description: string | null;
  price: number;
  chain_id: number;
  delivery_time: string;
  created_at: string;
}

export default function GigPage({
    gigId
}: {
    gigId: string
}) {
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (gigId) {
      fetchGig()
    }
  }, [gigId])

  const fetchGig = async () => {
    try {
      const response = await fetch(`/api/get-gig?gig_id=${gigId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch gig')
      }
      const data = await response.json()
      console.log("Fetched gig data:", data)
      setGig(data.gig)
    } catch (err: any) {
      console.error("Error fetching gig:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatEvmAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!gig) return <div>Gig not found</div>

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="mx-auto w-[600px]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{gig.title}</CardTitle>
          <CardDescription className="text-lg mt-2">{gig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between text-sm space-x-4">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              <span className="text-base">Delivery: {gig.delivery_time} days</span>
            </div>
            <Badge variant="outline" className="text-xl font-bold py-1 px-3">
              <DollarSign className="h-5 w-5 mr-1" />
              {(gig.price / 100).toFixed(2)} {/* Assuming price is stored in cents */}
              <Image src={chainInfo[gig.chain_id as ValidChainId].logoUrl} alt="chain logo" width={30} height={30} className='ml-2' />
            </Badge>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Creator</h3>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{gig.creator_address.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">{formatEvmAddress(gig.creator_address)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            Order Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}