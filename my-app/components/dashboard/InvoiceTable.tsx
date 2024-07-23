import React, { useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from 'lucide-react';
import { format } from 'date-fns';
import { invoices } from '@/helper/mockDataInvoice';
type InvoiceTableProps = {
    type: string;
}

const InvoiceTable = ({ type }: InvoiceTableProps) => {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);


    const sliceAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    const copyToClipboard = useCallback((text: string) => {
      navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
      // You might want to add a toast notification here
    }, []);

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pending': return 'text-yellow-500';
        case 'paid': return 'text-green-500';
        case 'overdue': return 'text-red-500';
        default: return 'text-gray-500';
      }
    };

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">Created Date</TableHead>
            <TableHead className="font-semibold">Payee</TableHead>
            <TableHead className="font-semibold">Payer</TableHead>
            <TableHead className="font-semibold">Total Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-gray-50">
              <TableCell>{format(new Date(invoice.createdDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{sliceAddress(invoice.payee)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard(invoice.payee)}
                    className="h-6 w-6"
                  >
                    {copiedAddress === invoice.payee ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{sliceAddress(invoice.payer)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard(invoice.payer)}
                    className="h-6 w-6"
                  >
                    {copiedAddress === invoice.payer ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
              <TableCell className="font-medium">{invoice.totalAmount}</TableCell>
              <TableCell>
                <span className={`font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Invoice</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

export default InvoiceTable;