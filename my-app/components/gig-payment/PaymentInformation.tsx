import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

interface PaymentInformationProps {
  gigPrice: number;
  recipientAddress: string;
  duration: string;
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({ gigPrice, recipientAddress, duration }) => {
  const handlePayment = () => {
    // Implement payment logic here
    console.log("Payment Confirmed")
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
      </CardContent>
      <CardContent className="text-sm text-gray-500">
        Streaming {gigPrice} USDC to {recipientAddress} over {duration}
      </CardContent>
      <Separator className="my-4" />
      <CardContent>
        <Button className="w-full">
          Confirm & Start Streaming
        </Button>
      </CardContent>
    </Card>
  )
}

export default PaymentInformation