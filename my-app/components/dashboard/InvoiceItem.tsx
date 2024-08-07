// InvoiceItem.tsx
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface InvoiceItemProps {
  invoice: {
    id: string;
    created_at: string;
    payee_evm_address: string;
    payer_evm_address: string;
    expected_amount: string;
    status: string;
  
  };
  copiedAddress: string | null;
  onCopyAddress: (address: string) => void;
  getStatusColor: (status: string) => string;
  sliceAddress: (address: string) => string;
  requestId: string;
}

export const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  copiedAddress,
  onCopyAddress,
  getStatusColor,
  sliceAddress,
  requestId
}) => {
  return (
    <TableRow key={invoice.id} className="hover:bg-gray-50">
      <TableCell>{format(new Date(invoice.created_at), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span>{sliceAddress(invoice.payee_evm_address)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onCopyAddress(invoice.payee_evm_address)}
            className="h-6 w-6"
          >
            {copiedAddress === invoice.payee_evm_address ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span>{sliceAddress(invoice.payer_evm_address)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onCopyAddress(invoice.payer_evm_address)}
            className="h-6 w-6"
          >
            {copiedAddress === invoice.payer_evm_address ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell className="font-medium">{invoice.expected_amount} USD</TableCell>
      <TableCell>
        <span className={`font-medium ${getStatusColor('pending')}`}>
          Pending
        </span>
      </TableCell>
      <TableCell>
        <Link href={`/invoice/${requestId}`} >
        <Button variant="outline" size="sm" className="flex items-center space-x-1">
          <ExternalLink className="h-4 w-4" />
          <span>View Invoice</span>
        </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};