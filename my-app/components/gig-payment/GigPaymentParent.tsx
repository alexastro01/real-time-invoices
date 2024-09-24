import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Gig from '../gigs/Gig'
import BillingInformation from './BillingInformation'
import PaymentInformation from './PaymentInformation'

interface GigPaymentParentProps {
  gigId: string;
}

interface GigData {
  gig_id: string;
  title: string;
  description: string;
  delivery_time: string;
  price: number;
  creator_address: string;
  chain_id: number;
}

export default function GigPaymentParent({ gigId }: GigPaymentParentProps) {
  const [gigData, setGigData] = useState<GigData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await fetch(`/api/get-gig?gig_id=${gigId}`);
        const data = await response.json();
        if (response.ok) {
          setGigData(data.gig);
        } else {
          console.error('Error fetching gig:', data.error);
        }
      } catch (error) {
        console.error('Error fetching gig:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [gigId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gigData) {
    return <div>Gig not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BillingInformation />
          <PaymentInformation 
            gigPrice={gigData.price} 
            recipientAddress={gigData.creator_address} 
            duration={gigData.delivery_time} 
          />
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Gig
                id={gigData.gig_id}
                title={gigData.title}
                description={gigData.description}
                deliveryTime={gigData.delivery_time}
                price={gigData.price}
        
                link={`/gig/${gigData.gig_id}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}