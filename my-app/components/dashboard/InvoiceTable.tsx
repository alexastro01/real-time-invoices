import React, { useState, useCallback, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useAccount } from 'wagmi';
import { InvoiceItem } from './InvoiceItem';
import { InvoiceItemSkeleton } from './InvoiceItemSkeleton';

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

    const renderTableContent = () => {
      if (loading) {
        return Array(5).fill(null).map((_, index) => (
          <InvoiceItemSkeleton key={index} />
        ));
      }

      return invoices.map((invoice) => (
        <InvoiceItem 
          key={invoice.id}
          invoice={invoice}
          copiedAddress={copiedAddress}
          onCopyAddress={copyToClipboard}
          getStatusColor={getStatusColor}
          sliceAddress={sliceAddress}
          requestId={invoice.request_id}
        />
      ));
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
          {renderTableContent()}
        </TableBody>
      </Table>
    );
  };

export default InvoiceTable;