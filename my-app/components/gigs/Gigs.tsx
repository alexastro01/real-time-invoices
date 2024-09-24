'use client';

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import Gig from "./Gig"
import AddGigCard from "./AddGigCard"

interface GigType {
  gig_id: string;
  title: string;
  description: string;
  delivery_time: string;
  price: number;
  // Add other fields as necessary
}

interface GigsProps {
  creator: string
}

export default function Gigs({ creator }: GigsProps) {
  const [gigs, setGigs] = useState<GigType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch(`/api/fetch-user-gigs?creator=${creator}`)
        if (!response.ok) {
          throw new Error('Failed to fetch gigs')
        }
        const data = await response.json()
        console.log(data.gigs)
        setGigs(data.gigs)
      } catch (err) {
        setError('Failed to load gigs')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGigs()
  }, [creator])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">Tester</h2>
              <p className="text-sm text-muted-foreground break-all">{creator}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-2xl font-semibold mb-4">Gigs</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {gigs.map((gig) => (
          <Gig 
            key={gig.gig_id}
            id={gig.gig_id}
            title={gig.title}
            description={gig.description}
            deliveryTime={gig.delivery_time}
            price={gig.price}
            link={`/gig/${gig.gig_id}`}
            viewGig={true}
          />
        ))}
        <AddGigCard />
      </div>
    </div>
  )
}