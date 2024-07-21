"use client";

import { useSession } from 'next-auth/react';
import CreateInvoiceComponent from '@/components/create-invoice/CreateInvoiceComponent';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import React, { useEffect } from 'react';
import Spinner from '@/components/helpers/Spinner';

const Page = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session)
  }, [session])

  return (
    <>
      <Navbar />
      {status === 'loading' ? (
        // You can add a loading spinner or message here
        <div className='flex justify-center mt-8'>
       <Spinner className='mt-2' />
       </div>
      ) : status === 'authenticated' && session?.user?.name? (
        <CreateInvoiceComponent />
      ) : (
        <NotConnected />
      )}
    </>
  );
};

export default Page;