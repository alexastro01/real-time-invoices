import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { IInvoiceData } from '@/types/interfaces'
import GigPaymentDashboard from './GigDashboard'
import { useAccount } from 'wagmi'
import { AlertCircle } from 'lucide-react' // Import the AlertCircle icon from lucide-react

const GigStatusParent = ({
    requestId
}: {
    requestId: string
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<IInvoiceData | null>(null);
  const [gigData, setGigData] = useState(null);
  const {address} = useAccount()

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
        <div className="max-w-full w-full space-y-4">
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

  const isUserInvolved = address && invoiceData && (
    address.toLowerCase() === invoiceData.paymentDetails.payeeAddress.toLowerCase() ||
    address.toLowerCase() === invoiceData.paymentDetails.payerAddress.toLowerCase()
  );

  if (!isUserInvolved) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-4 space-y-4">
        <AlertCircle size={48} className="text-yellow-500" />
        <div className="text-center text-xl font-semibold">You're not part of this transaction</div>
      </div>
    );
  }

  return (
    <div className='w-full flex items-center justify-center p-4'>
      <div className='w-full'>
        {invoiceData && gigData && invoiceData.paymentDetails.stream_id ? (
          <GigPaymentDashboard 
            requestId={requestId} 
            streamId={invoiceData.paymentDetails.stream_id} 
            chain_id={invoiceData.paymentDetails.chain_id} 
            invoiceData={invoiceData} 
            gigData={gigData} 
          />
        ) : (
          <div className="text-center">No invoice data available.</div>
        )}
      </div>
    </div>
  )
}

export default GigStatusParent