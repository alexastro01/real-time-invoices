"use client";

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect } from 'react';
import Spinner from '@/components/helpers/Spinner';
import Invoice from '@/components/invoice/Invoice';
import { useParams } from 'next/navigation';

const Page = () => {
  const { data: session, status } = useSession();
  const params = useParams();

  useEffect(() => {
    console.log(session);
  }, [session]);

 

  return (
    <>
      <Navbar />
      {status === 'loading' ? (
        <div className='flex justify-center mt-8'>
          <Spinner className='mt-2' />
        </div>
      ) : status === 'authenticated' && session?.user?.name ? (
        <div className=''>
          <Invoice requestId={params.requestId as string} />
        </div>
      ) : (
        <NotConnected />
      )}
    </>
  );
};

export default Page;