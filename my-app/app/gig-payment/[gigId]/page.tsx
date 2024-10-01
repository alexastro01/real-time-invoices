"use client";

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/helpers/Spinner';
import GigPaymentParent from '@/components/gig-payment/GigPaymentParent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Page = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const gigId = params.gigId as string;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.name) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/get-user-details?address=${session.user.name}`);
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast({
            title: 'Error fetching user details',
            description: error as string,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserDetails();
    }
  }, [status, session?.user?.name, toast]);

  const handleCreateProfile = () => {
    router.push(`/profile?redirect=gig-payment/${gigId}`);
  };

  const renderContent = () => {
    if (status === 'loading' || isLoading) {
      return (
        <div className='flex justify-center items-center h-screen'>
          <Spinner className='' />
        </div>
      );
    }

    if (status !== 'authenticated' || !session?.user?.name) {
      return <NotConnected />;
    }

    if (!userDetails) {
      return (
        <div className='flex flex-col justify-center items-center h-screen'>
          <p className='text-lg mb-4'>You need to create a profile before accessing gig payment</p>
          <Button onClick={handleCreateProfile}>Create Profile</Button>
        </div>
      );
    }

    return <GigPaymentParent gigId={gigId} />;
  };

  return (
    <>
      <Navbar />
      {renderContent()}
    </>
  );
};

export default Page;