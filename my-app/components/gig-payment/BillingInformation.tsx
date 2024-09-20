import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from '../ui/button'

const BillingInformation = () => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Your invoice will be issued according to the details listed here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Name:</span>
          <span>John Doe</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Country:</span>
          <span>Canada</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Edit Details</Button>
      </CardFooter>
    </Card>
  )
}

export default BillingInformation