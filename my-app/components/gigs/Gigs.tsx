'use client';

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import Gig from "./Gig"
import AddGigCard from "./AddGigCard"
import GigProfile from './GigProfile';

interface GigType {
  gig_id: string;
  title: string;
  description: string;
  delivery_time: string;
  price: number;
  // Add other fields as necessary
}

interface GigsProps {
  creator: string;
  editMode: boolean;
}

export default function Gigs({ creator, editMode }: GigsProps) {
  const [gigs, setGigs] = useState<GigType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch(`/api/get-user-gigs?creator=${creator}`)
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
     <GigProfile creator={creator} editMode={editMode} />

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