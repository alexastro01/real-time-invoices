'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from '../ui/button'

import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface CreateGigProps {
  // Define any props if needed
}

const CreateGig: React.FC<CreateGigProps> = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [link, setLink] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!title || !description || !deliveryTime || !price) {
      alert('Please fill in all required fields.')
      return
    }

    const newGig = {
      title,
      description,
      deliveryTime,
      link,
      price: Number(price),
    }

    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGig),
      })

      if (response.ok) {
        alert('Gig created successfully!')
        router.push('/my-gigs') // Redirect to gigs page
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error creating gig:', error)
      alert('An unexpected error occurred.')
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
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
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Gig
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default CreateGig