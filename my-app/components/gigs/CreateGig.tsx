import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useRouter } from 'next/router'

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
              <Input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                placeholder="e.g., 3 days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Link</label>
              <Input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price (ETH)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                required
                placeholder="0.00"
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