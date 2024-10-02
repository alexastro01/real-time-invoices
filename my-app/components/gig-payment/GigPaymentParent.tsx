import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Gig from '../gigs/Gig'
import BillingInformation from './BillingInformation'
import PaymentInformation from './PaymentInformation'
import { ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions'
import { useAccount } from 'wagmi'
import { Skeleton } from '../ui/skeleton'

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

export default function GigPaymentParent({ gigId }: GigPaymentParentProps) {
  const [gigData, setGigData] = useState<GigData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gigResponse, userResponse] = await Promise.all([
          fetch(`/api/get-gig?gig_id=${gigId}`),
          address ? fetch(`/api/get-user-details?address=${address}`) : Promise.resolve(null)
        ]);

        const gigData = await gigResponse.json();
        if (gigResponse.ok) {
          setGigData(gigData.gig);
        } else {
          console.error('Error fetching gig:', gigData.error);
        }

        if (userResponse) {
          const userData = await userResponse.json();
          if (userResponse.ok) {
            setUserDetails(userData);
          } else {
            console.error('Error fetching user details:', userData.error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gigId, address]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (!gigData) {
    return <div>Gig not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BillingInformation userDetails={userDetails} />
          <PaymentInformation 
            gigPrice={gigData.price} 
            recipientAddress={gigData.creator_address} 
            duration={gigData.delivery_time} 
            chainId={gigData.chain_id as ValidChainId}
            userDetails={userDetails}
            gigId={gigData.gig_id}
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