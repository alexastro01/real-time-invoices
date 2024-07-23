import React from 'react'
import { InvoiceContentProps } from '@/types/interfaces';
import InvoiceContent from './InvoiceContent';
import ActionButtons from './ActionButtons';


const Invoice = () => {
    const mockData: InvoiceContentProps = {
        mockDataInvoice: {
          name: "Acme Corporation",
          email: "billing@acmecorp.com",
          address: "123 Main St",
          city: "Metropolis",
          state: "NY",
          zip: "10001",
          country: "USA",
          evmAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        },
        formData: {
          senderDetails: {
            name: "John Doe",
            email: "john.doe@example.com",
            address: "456 Elm St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA"
          },
          paymentDetails: {
            chain: "Ethereum",
            currency: "ETH",
            receiverAddress: "0x3F2e30B1E5954d777727c0D9dB0d9485a06C2708",
            dueDate: new Date("2024-08-15"),
            invoiceItems: [
              {
                name: "Web Development",
                quantity: 40,
                price: 100
              },
              {
                name: "UI/UX Design",
                quantity: 20,
                price: 150
              },
              {
                name: "Server Maintenance",
                quantity: 10,
                price: 80
              }
            ]
          },
          streamType: "Instant"
        },
        totalAmount: 8800
      };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center mt-8'>
        {/* Invoice */}
        <InvoiceContent 
        mockDataInvoice={mockData.mockDataInvoice}
        formData={mockData.formData}
        totalAmount={mockData.totalAmount}
      />

        <ActionButtons/>

    </div>
  )
}

export default Invoice