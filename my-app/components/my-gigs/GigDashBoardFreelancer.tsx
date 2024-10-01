'use client';

import React, { useState, useEffect } from 'react'

import AddGigCard from "../my-gigs/AddGigCard"

import GigsTable from "@/components/my-gigs/GigsTable";
import GigProfile from '../gigs/GigProfile';
import Gig from '../gigs/Gig';
import { useAccount } from 'wagmi';

interface GigType {
  gig_id: string;
  title: string;
  description: string;
  delivery_time: string;
  price: number;
  // Add other fields as necessary
}


export default function GigDashBoardFreelancer() {
  const [gigs, setGigs] = useState<GigType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {address} = useAccount();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch(`/api/get-user-gigs?creator=${address as string}`)
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
  }, [address])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-full mx-auto p-4">
     <GigProfile creator={address as string} editMode={true} />

      <h3 className="text-2xl font-semibold mb-4">Gigs</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* Add the GigsTable component here */}
      <div className="mt-8">
        <GigsTable />
      </div>
    </div>
  )
}