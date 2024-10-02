'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from '../ui/button'

import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox' // Add this import

import { ValidChainId } from '../../utils/multi-chain/MultiChainSelectOptions';
import ChainSelector from '../helpers/ChainSelector'
import { useAccount } from 'wagmi'
import { useToast } from '@/components/ui/use-toast' // Import useToast
import { Loader2 } from 'lucide-react'

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
  const { address } = useAccount()
  const { toast } = useToast() // Initialize useToast
  const [mainnetAccept, setMainnetAccept] = useState(false) // Add this state
  const [contactInfo, setContactInfo] = useState('') // Add this state

  const router = useRouter()

  const handleCreateGig = async () => {
    // Validate inputs
    if (!title || !description || !deliveryTime || !price || selectedChain === null || !contactInfo) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields, including contact information.',
        variant: 'destructive',
      })
      return
    }
  
    const newGig = {
      title,
      description,
      delivery_time: deliveryTime, // Changed to match backend expectation
      price: price,
      chain_id: selectedChain,
      mainnet_accept: mainnetAccept, // Add this field
      contact_info: contactInfo, // Add this field
    }
  
    toast({
      title: "Creating Gig",
      description: (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Please wait while we create your gig...</span>
        </div>
      ),
      variant: "default",
    })
  
    try {
      const response = await fetch('/api/create-gig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGig),
      })
  
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Gig created successfully!',
          variant: "default"
        })
        router.push(`/gigs/${address}`) // Redirect to gigs page
      } else {
        const errorData = await response.json()
        console.log(errorData)
        toast({
          title: 'Error',
          description: `Error: ${errorData.error || errorData.message}`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating gig:', error)
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      })
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
                  <SelectItem value="1">1 day (+ 6 hours cancelation period)</SelectItem>
                  <SelectItem value="3">3 days (+ 12 hours cancelation period)</SelectItem>
                  <SelectItem value="5">5 days (+ 1 day cancelation period)</SelectItem>
                  <SelectItem value="7">7 days (+ 2 days cancelation period)</SelectItem>
                  <SelectItem value="14">14 days (+ 3 days cancelation period)</SelectItem>
                  <SelectItem value="30">30 days (+ 5 days cancelation period)</SelectItem>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mainnet-accept"
                checked={mainnetAccept}
                onCheckedChange={(checked: boolean) => setMainnetAccept(checked as boolean)}
              />
              <label
                htmlFor="mainnet-accept"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I want this gig to be live on mainnet launch as well
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Info</label>
              <Input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
                placeholder="Telegram handle, X handle, or email"
              />
              <p className="text-sm text-gray-500 mt-1">
                Please provide your Telegram handle, X handle, or email for contact.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              If you selected that you want the gig to be live on launch as well, we may contact you for additional information.
              The gigs listed on mainnet will have to pass certain quality checks. (e.g. no spam)
            </p>
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