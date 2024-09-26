'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ValidChainId, chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions'
import Image from 'next/image'
import StreamForecastWithCliffChart from '../stream-forecast/StreamForecastWithCliff'
import { timeToCancelationPeriod } from '@/constants/timeToCancelationPeriod'
import CreateRequestFromGig from './request-network/CreateRequestFromGig'

interface UserDetails {
  evmAddress: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  created_at: string;
}

interface PaymentInformationProps {
  gigPrice: number;
  recipientAddress: string;
  duration: string;
  chainId: ValidChainId;
  userDetails: UserDetails | null;
  gigId: string;
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({ 
  gigPrice, 
  recipientAddress, 
  duration, 
  chainId,
  gigId,
  userDetails 
}) => {
  const chainData = chainInfo[chainId];
  const [note, setNote] = useState('');

  const dueDate = useMemo(() => {
    const durationInDays = parseInt(duration);
    const cancelationPeriod = timeToCancelationPeriod[durationInDays] || 0;
    const totalDays = durationInDays + cancelationPeriod;
    
    const date = new Date();
    date.setDate(date.getDate() + totalDays);
    return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
  }, [duration]);

  const handlePayment = () => {
    console.log("Payment Confirmed", chainData, "Note:", note)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pay with Streambill</CardTitle>
        <CardDescription>Payment method details</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
      <div>
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input id="recipient" value={recipientAddress} readOnly />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input id="amount" value={gigPrice} readOnly />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" value={`${duration} days`} readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="chain">Chain</Label>
          <div className="flex items-center border rounded-md p-2">
            <Image
              src={chainData.logoUrl}
              alt={`${chainData.name} logo`}
              width={24}
              height={24}
              className="w-6 h-6 mr-2"
            />
            <span>{chainData.name}</span>
          </div>
        </div>
        <div>
          <Label htmlFor="note">Leave a note (requirements, specifics, contact details)</Label>
          <Textarea 
            id="note" 
            placeholder="Enter any additional requirements or specifics about the payment..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1"
          />
        </div>
        <StreamForecastWithCliffChart
          title="Payment schedule preview"
          description="Preview of the payment schedule based on the gig price and duration"
          duration={Number(duration)}
          totalAmount={gigPrice}
          chartColor="#ff9800"
        />
      </CardContent>
      <CardContent className="text-sm text-gray-500">
        Streaming {gigPrice} USDC to {recipientAddress} over {duration} days and {24 * timeToCancelationPeriod[Number(duration)]} hours on {chainData.name}
        <br />
        You can cancel the order within {24 * timeToCancelationPeriod[Number(duration)]} hours for free.
      </CardContent>
      <Separator className="my-4" />
      <CardContent>
        <CreateRequestFromGig 
          payerDetails={userDetails}
          gigPrice={gigPrice}
          recipientAddress={recipientAddress}
          dueDate={dueDate}
          gigId={gigId}
          chainId={chainId.toString()}
        />
      </CardContent>
    </Card>
  )
}

export default PaymentInformation