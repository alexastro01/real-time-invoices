import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Clock, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface GigProps {
  // Add properties that a Gig should have
  id: number;
  title: string;
  description: string;
  deliveryTime: string;
  link: string;
  price: number; // Add price property
  viewGig?: boolean;
  
  // Add seller property
  
  // Add more properties as needed
}

const Gig: React.FC<GigProps> = ({ id, title, description, deliveryTime, link, price, viewGig }) => {
  // Function to format the Ethereum address
  const formatEvmAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Delivery: {deliveryTime} days</span>
          </div>
          {price !== undefined && (
            <Badge variant="outline" className="text-lg font-bold">
              <DollarSign className="h-4 w-4 mr-1" />
              {price.toFixed(2)}
            </Badge>
          )}
        </div>
        {/* Seller Information */}
        

      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full" variant={'secondary'}>
          {viewGig && <Link href={link}>View Gig</Link>}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Gig