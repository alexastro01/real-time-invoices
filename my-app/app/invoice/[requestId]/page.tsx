"use client";

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React from 'react';
import Spinner from '@/components/helpers/Spinner';
import Invoice from '@/components/invoice/Invoice';
import { useParams } from 'next/navigation';
import Profile from '@/components/profile/Profile';

const Page = () => {
  const { data: session, status } = useSession();
  const params = useParams();

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className='flex justify-center mt-8'>
            <Spinner className='mt-2' />
          </div>
        );
      case 'authenticated':
        return session?.user?.name &&
          <Invoice requestId={params.requestId as string} />
        
      case 'unauthenticated':
        return <NotConnected />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      {renderContent()}
    </>
  );
};

export default Page;