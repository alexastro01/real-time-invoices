"use client";

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React from 'react';
import Spinner from '@/components/helpers/Spinner';
import { useParams } from 'next/navigation';
import GigStatusParent from '@/components/gig-status/GigStatusParent';

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
        return session?.user?.name &&
        <GigStatusParent gigId={params.gigId as string} />
      
        
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