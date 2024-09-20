import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Clock } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface GigProps {
  // Add properties that a Gig should have
  id: number;
  title: string;
  description: string;
  deliveryTime: string;
  link: string;
  price: number; // Add price property
  // Add more properties as needed
}

const Gig: React.FC<GigProps> = ({ id, title, description, deliveryTime, link, price }) => {
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
            <span>Delivery: {deliveryTime}</span>
          </div>
          <span className="font-semibold text-primary ">${price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={link}>View Gig</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Gig