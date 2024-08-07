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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserDetails();
    }
  }, [status]);

  const handleCreateProfile = () => {
    router.push('/profile?redirect=create-invoice');
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className='flex justify-center mt-8 h-screen'>
          <Spinner className='mt-2' />
        </div>
      );
    }

    if (status !== 'authenticated' || !session?.user?.name) {
      return <NotConnected />;
    }

    if (isLoading) {
      return (
        <div className='flex justify-center mt-8'>
          <Spinner className='mt-2' />
        </div>
      );
    }

    if (!userDetails) {
      return (
        <div className='flex flex-col items-center justify-center mt-8'>
          <p className='text-lg mb-4'>You need to create a profile before creating an invoice</p>
          <Button onClick={handleCreateProfile}>Create Profile</Button>
        </div>
      );
    }

    return <CreateInvoiceComponent />;
  };

  return (
    <>
      <Navbar />
      {renderContent()}
    </>
  );
};

export default Page;