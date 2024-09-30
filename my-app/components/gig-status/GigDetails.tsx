import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '../ui/badge'
import { Clock, DollarSign } from 'lucide-react'
import GigCreatorPreview from '../gigs/GigCreatorPreview'

const GigDetails = ({
    title,
    description,
    delivery_time,
    totalAmount,
    creator
}: {
    title: string;
    description: string;
    delivery_time: number;
    totalAmount: number;
    creator: string;
}) => {
  return (
    <Card>
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-primary">Gig Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <p className='text-xs text-muted-foreground mt-2'>Freelancer: {creator}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Clock className="mr-1 h-4 w-4" />
            {delivery_time} days project
          </Badge>
          <Badge variant="outline" className="text-lg font-bold">
            <DollarSign className="h-4 w-4 mr-1" />
            {totalAmount} tUSDC
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default GigDetails