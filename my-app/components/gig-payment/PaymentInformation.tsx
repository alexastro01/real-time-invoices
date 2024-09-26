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
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({ 
  gigPrice, 
  recipientAddress, 
  duration, 
  chainId,
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
        {/* ... (previous content remains the same) ... */}
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
          chainId={chainId.toString()}
        />
      </CardContent>
    </Card>
  )
}

export default PaymentInformation