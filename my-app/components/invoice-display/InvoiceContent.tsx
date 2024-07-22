import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, getUnixTime } from 'date-fns';

interface MockDataInvoice {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    evmAddress: string;
  }
  
  interface SenderDetails {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
  
  interface PaymentDetails {
    chain: string;
    currency: string;
    receiverAddress: string;
    dueDate: Date | null;
    invoiceItems: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }
  
  interface FormData {
    senderDetails: SenderDetails;
    paymentDetails: PaymentDetails;
    streamType: string;
  }
  
  interface InvoiceContentProps {
    mockDataInvoice: MockDataInvoice;
    formData: FormData;
    totalAmount: number;
  }

// New InvoiceContent component
const InvoiceContent: React.FC<InvoiceContentProps> = ({ mockDataInvoice, formData, totalAmount }) => (
  <CardContent className="pt-6">
    <div className="flex justify-between mb-8">
      <div>
        <h3 className="font-semibold text-lg mb-2">Seller:</h3>
        <p>{mockDataInvoice.name}</p>
        <p>{mockDataInvoice.email}</p>
        <p>{mockDataInvoice.address}</p>
        <p>{mockDataInvoice.city} {mockDataInvoice.state} {mockDataInvoice.zip}</p>
        <p>{mockDataInvoice.country}</p>
        <p className="mt-2">EVM Address:</p>
        <p className="font-mono">{mockDataInvoice.evmAddress}</p>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Client:</h3>
        <p>{formData.senderDetails.name}</p>
        <p>{formData.senderDetails.email}</p>
        <p>{formData.senderDetails.address}</p>
        <p>{formData.senderDetails.city} {formData.senderDetails.state} {formData.senderDetails.zip}</p>
        <p>{formData.senderDetails.country}</p>
        <p className="mt-2">EVM Address:</p>
        <p className="font-mono">{formData.paymentDetails.receiverAddress}</p>
      </div>
    </div>

    <div className="mb-8">
      <h3 className="font-semibold text-lg mb-2">Payment Details:</h3>
      <p>Chain: {formData.paymentDetails.chain}</p>
      <p>Currency: {formData.paymentDetails.currency}</p>
      <p>Stream Type: {formData.streamType}</p>
      <p>Due Date: {formData.paymentDetails.dueDate ? format(formData.paymentDetails.dueDate, 'PP') : 'Not set'}</p>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formData.paymentDetails.invoiceItems.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">{(item.quantity * item.price).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <div className="mt-4 text-right">
      <p className="font-semibold">Total Amount: {totalAmount.toFixed(2)} {formData.paymentDetails.currency}</p>
    </div>
  </CardContent>
);

export default InvoiceContent;
