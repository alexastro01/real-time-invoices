import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Gig from '../gigs/Gig'
import BillingInformation from './BillingInformation'
import PaymentInformation from './PaymentInformation'

interface GigProps {
  id: number;
  title: string;
  description: string;
  deliveryTime: string;
  link: string;
  price: number;
  seller: {
    name: string;
    evmAddress: string;
  };
}

export default function GigPaymentParent() {
  const gigData: GigProps = {
    id: 1,
    title: "Web Development Gig",
    description: "Full-stack web application development using React and Node.js",
    deliveryTime: "3 weeks",
    link: "/gigs/1",
    price: 500,
    seller: {
      name: "John Doe",
      evmAddress: "0x308a6b3375E708b2d254974FFBd36e3a4193b55c"
    }
  }


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BillingInformation />
          <PaymentInformation gigPrice={gigData.price} recipientAddress="0x308a6b3375E708b2d254974FFBd36e3a4193b55c" duration="3 weeks" />
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Gig {...gigData} />
          
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}