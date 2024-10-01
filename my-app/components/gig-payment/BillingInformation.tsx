'use client';
import React from 'react';
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

interface BillingInformationProps {
  userDetails: UserDetails | null;
}

const BillingInformation: React.FC<BillingInformationProps> = ({ userDetails }) => {
  if (!userDetails) {
    return <Card className="w-full mb-6"><CardContent>Loading...</CardContent></Card>;
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Your invoice will be issued according to the details listed here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-md font-semiboldtext-primary mb-4">
          To protect your data during testnet, only your wallet address will appear on the invoice
        </p>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">Name:</span>
          <span>{userDetails?.name || 'No name provided'}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">Email:</span>
          <span>{userDetails?.email || 'No email provided'}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">Address:</span>
          <span>{userDetails?.address || 'No address provided'}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">City:</span>
          <span>{userDetails?.city || 'No city provided'}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">State:</span>
          <span>{userDetails?.state || 'No state provided'}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">Zip/Postal Code:</span>
          <span>{userDetails?.zip || 'No zip code provided'}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="font-semibold">Country:</span>
          <span>{userDetails?.country || 'No country provided'}</span>
        </div>
      </CardContent>
 
    </Card>
  );
}

export default BillingInformation;