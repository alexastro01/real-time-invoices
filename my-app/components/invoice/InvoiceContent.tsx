import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, getUnixTime } from 'date-fns';
import {
  IInvoiceData

} from '@/types/interfaces';
import Image from 'next/image';
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';
import { contracts } from '@/utils/contracts/contracts';


interface InvoiceContentProps {
  invoiceData: IInvoiceData;
}

// New InvoiceContent component
const InvoiceContent = ({ invoiceData }: InvoiceContentProps) => {

  const { seller, client } = invoiceData.partiesDetails;
  const { payeeAddress, payerAddress, currency, streamType, dueDate, totalAmount, invoiceItems, chain_id } = invoiceData.paymentDetails;

  return (
    <div className="w-full max-w-4xl px-4 mx-auto">
      <Card className="border-2">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Invoice</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row justify-between mb-8 gap-8">
            <div className="w-full lg:w-1/2">
              <h3 className="font-semibold text-lg mb-2">Seller:</h3>
              <p>{seller.name}</p>
              <p>{seller.email}</p>
              <p>{seller.address}</p>
              <p>{seller.city} {seller.state} {seller.zip}</p>
              <p>{seller.country}</p>
              <p className="mt-2">EVM Address:</p>
              <p className="font-mono text-xs lg:text-sm break-all">{payeeAddress}</p>
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="font-semibold text-lg mb-2">Client:</h3>
              <p>{client.name}</p>
              <p>{client.email}</p>
              <p>{client.address}</p>
              <p>{client.city} {client.state} {client.zip}</p>
              <p>{client.country}</p>
              <p className="mt-2">EVM Address:</p>
              <p className="font-mono text-xs lg:text-sm break-all">{payerAddress}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-2">Payment Details:</h3>
            <div className='flex items-center'>
              <p className='mr-2'>Chain:</p>
              <Image src={chainInfo[chain_id as ValidChainId].logoUrl} alt="chain logo" width={24} height={24} />
            </div>
            <p>Currency: {contracts[chain_id as ValidChainId].tUSDCAddress}</p>
            <p>Stream Type: {streamType}</p>
            <p>Due Date: {dueDate ? format(dueDate, 'PP') : 'Not set'}</p>
          </div>
          
          <div className="overflow-x-auto">
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
                {invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-right">
            <p className="font-semibold">Total Amount: {parseFloat(totalAmount as string).toFixed(2)} USDC</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceContent;
