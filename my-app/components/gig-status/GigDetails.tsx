import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '../ui/badge'
import { Clock, DollarSign } from 'lucide-react'
import GigCreatorPreview from '../gigs/GigCreatorPreview'

interface GigDetailsProps {
  title: string;
  description: string;
  delivery_time: number;
  totalAmount: number;
  creator: string;
  isRejected: boolean;
  client: string;
}

const GigDetails: React.FC<GigDetailsProps> = ({
  title,
  description,
  delivery_time,
  totalAmount,
  creator,
  isRejected,
  client
}: GigDetailsProps) => {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
          <CardDescription>
            {isRejected ? "This gig has been rejected" : `Delivery Time: ${delivery_time} days`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-sm sm:text-base">{description}</p>

          <p className="mt-4 text-sm sm:text-base">Total Amount: {totalAmount} tUSDC</p>
          <p className='text-xs sm:text-sm text-gray-500'>Freelancer: {creator}</p>
          <p className='text-xs sm:text-sm text-gray-500'>Client: {client}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Contact / Project specifics</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-center text-gray-500 text-sm sm:text-base">Coming Soon</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GigDetails