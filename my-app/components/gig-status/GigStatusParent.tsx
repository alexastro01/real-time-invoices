import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import ActionButtonsGigTest from './ActionButtonsGigTest'
import { IInvoiceData } from '@/types/interfaces'
import GigPaymentDashboard from './Exampletester'

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
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex items-center justify-center p-4'>
      {/* <div className='max-w-6xl w-full'>
        {invoiceData && gigData && invoiceData.paymentDetails.stream_id ? (
          <ActionButtonsGigTest 
            requestId={requestId} 
            streamId={invoiceData.paymentDetails.stream_id} 
            chain_id={invoiceData.paymentDetails.chain_id} 
            invoiceData={invoiceData} 
            gigData={gigData} 
          />
        ) : (
          <div className="text-center">No invoice data available.</div>
        )}
      </div> */}
      <GigPaymentDashboard />
    </div>
  )
}

export default GigStatusParent