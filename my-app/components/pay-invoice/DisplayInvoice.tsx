import React, { useEffect, useState } from 'react'
import { InvoiceContentProps } from '@/types/interfaces';
import ActionButtons from '../invoice/ActionButtons';
import Spinner from '../helpers/Spinner';
import InvoiceContent from '../invoice/InvoiceContent';
import PaymentDialog from './PaymentDialog';

// New type definition
type InvoiceData = {
    partiesDetails: {
        seller: {
            name: string;
            email: string;
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        client: {
            name: string;
            email: string;
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
    };
    paymentDetails: {
        payeeAddress: string;
        payerAddress: string;
        chain: string;
        currency: string;
        streamType: string;
        dueDate: number;
        totalAmount: string;
        invoiceItems: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
    };
};

type InvoiceProps = {
    requestId: string
}

const DisplayInvoice = ({
    requestId
}: InvoiceProps) => {
    const [invoiceData, setInvoiceData] = useState<InvoiceData | undefined>();

    async function getInvoiceData(requestId: string): Promise<InvoiceData> {
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
            {invoiceData ?

                <InvoiceContent
                    invoiceData={invoiceData}
                />

                :
                <Spinner className='w-24 h-24' />
            }

            {invoiceData ?

                <div className='mt-2'>
                    <PaymentDialog
                        totalAmount={invoiceData.paymentDetails.totalAmount}
                        requestId={requestId}
                        payeeAddress={invoiceData.paymentDetails.payeeAddress}

                    />
                </div>

                :
                null
            }

        </div>
    )
}

export default DisplayInvoice