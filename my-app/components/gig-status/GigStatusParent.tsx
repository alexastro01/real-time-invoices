import React, { useEffect, useState } from 'react'

const GigStatusParent = ({
    requestId
}: {
    requestId: string
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/get-gig-invoice?request_id=${requestId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoice data');
        }
        const data = await response.json();
        setInvoiceData(data);
        console.log('Invoice data:', data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching invoice data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [requestId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Gig Status for Request ID: {requestId}</h2>
      {invoiceData && (
        <pre>{JSON.stringify(invoiceData, null, 2)}</pre>
      )}
    </div>
  )
}

export default GigStatusParent