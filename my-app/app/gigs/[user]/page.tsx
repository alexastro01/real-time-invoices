"use client";

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect } from 'react';
import Spinner from '@/components/helpers/Spinner';
import Invoice from '@/components/invoice/Invoice';
import Gigs from '@/components/gigs/Gigs';
import { useAccount } from 'wagmi';

const Page = () => {
  const { data: session, status } = useSession();
  const {address} = useAccount();


  const params = useParams();

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className='flex justify-center items-center h-screen'>
            <Spinner className='' />
          </div>
        );
      case 'authenticated':
        //@ts-ignore
        return <Gigs creator={params.user as string} editMode={false} />;
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