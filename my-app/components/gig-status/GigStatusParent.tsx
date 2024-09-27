import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import ActionButtonsGig from './ActionButtonsGig'

import { IInvoiceData } from '@/types/interfaces'

const GigStatusParent = ({
    requestId
}: {
    requestId: string
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<IInvoiceData | null>(null);
  const [gigData, setGigData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch invoice data
        const invoiceResponse = await fetch(`/api/get-gig-invoice?request_id=${requestId}`);
        if (!invoiceResponse.ok) {
          throw new Error('Failed to fetch invoice data');
        }
        const invoiceData = await invoiceResponse.json();
        setInvoiceData(invoiceData);

        // Fetch gig data using the gig_id from the invoice data
        if (invoiceData.gig_id) {
          const gigResponse = await fetch(`/api/get-gig?gig_id=${invoiceData.gig_id}`);
          if (!gigResponse.ok) {
            throw new Error('Failed to fetch gig data');
          }
          const gigData = await gigResponse.json();
          console.log("gig DATAA", gigData)
          setGigData(gigData.gig);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='flex items-center justify-center min-h-screen w-full p-4'>
    <div className='w-full max-w-md'>
      {loading ? (
        <div className='space-y-4'>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : invoiceData && gigData ? (
        <div className='grid grid-cols-1 lg:grid-cols-1 items-center justify-items-center w-full'>
          {invoiceData.paymentDetails.stream_id ? (
            <ActionButtonsGig requestId={requestId} streamId={invoiceData.paymentDetails.stream_id} chain_id={invoiceData.paymentDetails.chain_id} invoiceData={invoiceData} gigData={gigData} />

          ) : (
          null
          )}
     
        </div>
      ) : (
        <div>No invoice data available.</div>
      )}
    </div>
  </div>
  )
}

export default GigStatusParent