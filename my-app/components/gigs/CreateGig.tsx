'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from '../ui/button'

import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

import { ValidChainId } from '../../utils/multi-chain/MultiChainSelectOptions';
import ChainSelector from '../helpers/ChainSelector'
import { useAccount } from 'wagmi'

interface CreateGigProps {
  // Define any props if needed
}

const CreateGig: React.FC<CreateGigProps> = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [link, setLink] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [selectedChain, setSelectedChain] = useState<ValidChainId | null>(null);
  const {address} = useAccount()

  const router = useRouter()

  const handleCreateGig = async () => {
    // Validate inputs
    if (!title || !description || !deliveryTime || !price || selectedChain === null) {
      alert('Please fill in all required fields.')
      return
    }
  
    const priceInCents = Math.round(Number(price) * 100) // Convert to cents
  
    const newGig = {
      title,
      description,
      price: priceInCents,
      chain_id: selectedChain,
      delivery_time: deliveryTime,
    }
  
    try {
      const response = await fetch('/api/create-gig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGig),
      })
  
      if (response.ok) {
        const data = await response.json()
        alert('Gig created successfully!')
        router.push('/my-gigs') // Redirect to gigs page
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to create gig'}`)
      }
    } catch (error) {
      console.error('Error creating gig:', error)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Create a New Gig</CardTitle>
          <CardDescription>Fill in the details of your gig below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Gig Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Gig Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Delivery Time</label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
        
            <div>
              <label className="block text-sm font-medium">Price (USDC)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                required
                placeholder="100"
              />
            </div>
            <ChainSelector onSelectionChange={setSelectedChain} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateGig} className="w-full">
            Create Gig
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreateGig