"use client";

import { useSession } from 'next-auth/react';
import CreateInvoiceComponent from '@/components/create-invoice/CreateInvoiceComponent';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/helpers/Spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.name) {
        try {
          const response = await fetch(`/api/get-user-details?address=${session.user.name}`);
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserDetails();
    }
  }, [session, status]);

  const handleCreateProfile = () => {
    router.push('/create-profile');
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Navbar />
        <div className='flex justify-center mt-8'>
          <Spinner className='mt-2' />
        </div>
      </>
    );
  }

  if (status !== 'authenticated' || !session?.user?.name) {
    return (
      <>
        <Navbar />
        <NotConnected />
      </>
    );
  }

  if (!userDetails) {
    return (
      <>
        <Navbar />
        <div className='flex flex-col items-center justify-center mt-8'>
          <p className='text-lg mb-4'>You need to create a profile before creating an invoice</p>
          <Button onClick={handleCreateProfile}>Create Profile</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CreateInvoiceComponent />
    </>
  );
};

export default Page;