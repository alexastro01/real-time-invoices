"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { supabaseClient } from '@/lib/supabaseClient'
import { Progress } from "../ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useToast } from '../ui/use-toast';
import { useAccount } from 'wagmi';

interface SenderDetails {
  evmAddress: string
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}



export function CreateProfile() {

    const {address} = useAccount();
  const [senderDetails, setSenderDetails] = useState<SenderDetails>({
    evmAddress: address as string,
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const {toast} = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setSenderDetails(prev => ({ ...prev, [id]: value }))
  }

  const validateAndProceed = async () => {
    if (!senderDetails.name || !senderDetails.email) {
      alert('Name and Email are required fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(senderDetails),
      })

      if (!response.ok) {
        throw new Error('Failed to save user details')
      }

      const result = await response.json()
      console.log('Details saved successfully:', result)

    } catch (error) {
      console.error('Error saving details:', error)
      alert('Failed to save details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-[50%]" >
      <Progress value={33} className="my-8" />
      <Card className="">
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>Please input your details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name<span className="text-red-600">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Full name" 
                  value={senderDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email<span className="text-red-600">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email address" 
                  value={senderDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="Street address" 
                  value={senderDetails.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  placeholder="City" 
                  value={senderDetails.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="state">State/Province</Label>
                <Input 
                  id="state" 
                  placeholder="State or Province" 
                  value={senderDetails.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="zip">Zip/Postal Code</Label>
                <Input 
                  id="zip" 
                  placeholder="Zip or Postal Code" 
                  value={senderDetails.zip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  placeholder="Country" 
                  value={senderDetails.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
  
          <Button onClick={validateAndProceed} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}