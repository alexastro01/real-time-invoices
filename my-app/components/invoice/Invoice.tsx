import React, { useEffect, useState } from 'react'
import { IInvoiceData, InvoiceContentProps } from '@/types/interfaces';
import InvoiceContent from './InvoiceContent';
import ActionButtons from './ActionButtons';
import Spinner from '../helpers/Spinner';
import NotPaidInvoice from './NotPaidInvoice';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import ViewInvoiceDialog from './ViewInvoiceDialog';


type InvoiceProps = {
  requestId: string
}

const Invoice = ({
  requestId
}: InvoiceProps) => {
  const [invoiceData, setInvoiceData] =  useState<IInvoiceData | null>(null);


  async function getInvoiceData(requestId: string) {
    const res = await fetch(`/api/get-invoice?request_id=${requestId}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch invoice data');
    }
    return res.json();
  }

  useEffect(() => {
    async function fetchInvoiceData() {
      if (requestId) {
        try {
          const data = await getInvoiceData(requestId as string);
          setInvoiceData(data)
          console.log('Invoice Data:', data);
        } catch (error) {
          console.error('Error fetching invoice data:', error);
        }
      }
    }

    fetchInvoiceData();
  }, [requestId]);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-1 items-center justify-items-center mt-8'>
      {/* Invoice Summary */}
 

      {invoiceData && (
        invoiceData.paymentDetails.stream_id ? (
          <ActionButtons streamId={invoiceData.paymentDetails.stream_id} chain_id={invoiceData.paymentDetails.chain_id} />
        ) : (
          <NotPaidInvoice requestId={requestId} />
        )
      )}

{invoiceData ? (
        <div className='mt-4'>
          {/* <h2>Invoice Summary</h2>
          <p>Invoice Number: {invoiceData.paymentDetails.invoiceNumber}</p>
          <p>Total Amount: {invoiceData.paymentDetails.totalAmount}</p>
          <p>Due Date: {invoiceData.paymentDetails.dueDate}</p>
           */}
        <ViewInvoiceDialog invoiceData={invoiceData} />
        </div>
      ) : (
        <Spinner className='w-24 h-24' />
      )}
    </div>
  )
}

export default Invoice