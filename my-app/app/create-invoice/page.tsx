"use client";

import CreateInvoiceComponent from '@/components/create-invoice/CreateInvoiceComponent';
import Navbar from '@/components/Navbar';
import NotConnected from '@/components/NotConnected';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react'
import { useAccount } from 'wagmi'

const Page = () => {
    


    const {address} = useAccount();

  return (
    <>
       <Navbar />
       {
        address !== undefined ? <CreateInvoiceComponent /> : <NotConnected />
       }
    </>
  )
}

export default Page