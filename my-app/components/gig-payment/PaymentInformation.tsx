'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ValidChainId, chainInfo, getChainOptions } from '@/utils/multi-chain/MultiChainSelectOptions'
import Image from 'next/image'

interface PaymentInformationProps {
  gigPrice: number;
  recipientAddress: string;
  duration: string;
//   availableChainIds: ValidChainId[];
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({ gigPrice, recipientAddress, duration }) => {
  const morphHoleskyChainId: ValidChainId = 2810;
  const morphHoleskyInfo = chainInfo[morphHoleskyChainId];
  const [note, setNote] = useState('');

  const handlePayment = () => {
    // Implement payment logic here
    console.log("Payment Confirmed", morphHoleskyChainId, "Note:", note)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Money Streaming Escrow</CardTitle>
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
            <Input id="duration" value={duration} readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="chain">Chain</Label>
          <div className="flex items-center border rounded-md p-2">
            <Image
              src={morphHoleskyInfo.logoUrl}
              alt={`${morphHoleskyInfo.name} logo`}
              width={24}
              height={24}
              className="w-6 h-6 mr-2"
            />
            <span>{morphHoleskyInfo.name}</span>
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
      </CardContent>
      <CardContent className="text-sm text-gray-500">
        Streaming {gigPrice} USDC to {recipientAddress} over {duration} on {morphHoleskyInfo.name}
      </CardContent>
      <Separator className="my-4" />
      <CardContent>
        <Button className="w-full" onClick={handlePayment}>
          Confirm & Start Streaming
        </Button>
      </CardContent>
    </Card>
  )
}

export default PaymentInformation