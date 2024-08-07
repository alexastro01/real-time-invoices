import React, { useState, useCallback, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useAccount } from 'wagmi';

type InvoiceTableProps = {
    type: string;
}

type Invoice = {
  id: string;
  created_at: string;
  payer_evm_address: string;
  payee_evm_address: string;
  expected_amount: string;
  status: string;
  request_id: string;
};


const InvoiceTable = ({ type }: InvoiceTableProps) => {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {address} = useAccount();
  
    useEffect(() => {
      if (type === "invoicesSent") {
        fetchInvoices();
      }
    }, [type, address]);
  
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming you have access to the current user's payer address
        const payeeAddress = address as string; // Replace this with the actual payer address
        const response = await fetch(`/api/get-payee-invoices?payee_address=${payeeAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError('Error fetching invoices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };


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
            <TableCell>{format(new Date(invoice.created_at), 'MMM dd, yyyy')}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span>{sliceAddress(invoice.payee_evm_address)}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard(invoice.payee_evm_address)}
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
                  onClick={() => copyToClipboard(invoice.payer_evm_address)}
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