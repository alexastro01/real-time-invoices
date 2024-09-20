'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '../ui/button';
import { useAccount } from 'wagmi';


interface UserDetails {
  name: string;
  email: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  zipPostalCode?: string;
  country?: string;
}

const BillingInformation = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {address} = useAccount();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/get-user-details?address=${address}`); // Replace with actual address
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: UserDetails = await response.json();
        setUserDetails(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

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
        {userDetails?.address && (
          <div className="flex justify-between">
            <span className="font-semibold">Address:</span>
            <span>{userDetails.address}</span>
          </div>
        )}
        {userDetails?.city && (
          <div className="flex justify-between">
            <span className="font-semibold">City:</span>
            <span>{userDetails.city}</span>
          </div>
        )}
        {userDetails?.stateProvince && (
          <div className="flex justify-between">
            <span className="font-semibold">State/Province:</span>
            <span>{userDetails.stateProvince}</span>
          </div>
        )}
        {userDetails?.zipPostalCode && (
          <div className="flex justify-between">
            <span className="font-semibold">Zip/Postal Code:</span>
            <span>{userDetails.zipPostalCode}</span>
          </div>
        )}
        {userDetails?.country && (
          <div className="flex justify-between">
            <span className="font-semibold">Country:</span>
            <span>{userDetails.country}</span>
          </div>
        )}
      </CardContent>
 
    </Card>
  );
}

export default BillingInformation;