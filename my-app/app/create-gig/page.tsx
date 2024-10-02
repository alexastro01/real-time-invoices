"use client";

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React from 'react';
import Spinner from '@/components/helpers/Spinner';
import CreateGig from '@/components/my-gigs/CreateGig';

const Page = () => {
  const { data: session, status } = useSession();
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
        return <CreateGig />
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