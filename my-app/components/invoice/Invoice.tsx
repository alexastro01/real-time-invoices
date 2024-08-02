import React, { useEffect, useState } from 'react'
import { IInvoiceData, InvoiceContentProps } from '@/types/interfaces';
import InvoiceContent from './InvoiceContent';
import ActionButtons from './ActionButtons';
import Spinner from '../helpers/Spinner';
import NotPaidInvoice from './NotPaidInvoice';


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
    <div className='grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center mt-8'>
      {/* Invoice */}

      {invoiceData ?
        <InvoiceContent
          invoiceData={invoiceData}
        /> :
        <Spinner className='w-24 h-24' />
      }
   {invoiceData && (
      invoiceData.paymentDetails.stream_id ? (
        <ActionButtons streamId={invoiceData.paymentDetails.stream_id } />
      ) : (
        <NotPaidInvoice requestId={requestId} />
      )
    )}
    </div>
  )
}

export default Invoice