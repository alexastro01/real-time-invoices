'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '../ui/button';
import { useAccount } from 'wagmi';



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

const BillingInformation = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {address} = useAccount();

  useEffect(() => {
    const fetchUserDetails = async () => {
        if(address){
      try {
        const response = await fetch(`/api/get-user-details?address=${address}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUserDetails(data as UserDetails);
        console.log('User details:', data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };
}

    fetchUserDetails();
  }, [address]);

  if (loading) {
    return <Card className="w-full mb-6"><CardContent>Loading...</CardContent></Card>;
  }

  if (error) {
    return <Card className="w-full mb-6"><CardContent>Error: {error}</CardContent></Card>;
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Your invoice will be issued according to the details listed here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Name:</span>
          <span>{userDetails?.name || 'No name provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{userDetails?.email || 'No email provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Address:</span>
          <span>{userDetails?.address || 'No address provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">City:</span>
          <span>{userDetails?.city || 'No city provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">State:</span>
          <span>{userDetails?.state || 'No state provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Zip/Postal Code:</span>
          <span>{userDetails?.zip || 'No zip code provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Country:</span>
          <span>{userDetails?.country || 'No country provided'}</span>
        </div>
      </CardContent>
 
    </Card>
  );
}

export default BillingInformation;