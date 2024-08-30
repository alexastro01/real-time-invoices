import React, { useState, useCallback, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAccount } from 'wagmi';
import { InvoiceItem } from './InvoiceItem';
import { InvoiceItemSkeleton } from './InvoiceItemSkeleton';
import { ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';
import { useToast } from '../ui/use-toast';

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
  chain_id: number;
  due_date: string;
  stream_id: number | string;
};

const InvoiceTable = ({ type }: InvoiceTableProps) => {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {address, chainId} = useAccount();

    const {toast} = useToast();
  
    useEffect(() => {
      if (type === "invoicesSent") {
        fetchInvoicesSent();
      } else if (type === "invoicesReceived") {
        fetchInvoicesReceived();
      }
      console.log(chainId)
    }, [type, address]);
  
    const fetchInvoicesSent = async () => {
      setLoading(true);
      setError(null);
      try {
        const payeeAddress = address as string;
        const response = await fetch(`/api/get-payee-invoices?payee_address=${payeeAddress}`, {
          next: { revalidate: 300 } // Cache for 5 minutes (300 seconds)
        });
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
        console.log(data)
      } catch (err) {
        setError('Error fetching invoices');
        toast({
          title: 'Error fetching invoices in InvoiceTable as payee',
          variant: 'destructive',
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
      
    const fetchInvoicesReceived = async () => {
      setLoading(true);
      setError(null);
      try {
        const payerAddress = address as string;
        const response = await fetch(`/api/get-payer-invoices?payer_address=${payerAddress}`, {
          next: { revalidate: 300 } // Cache for 5 minutes (300 seconds)
        });
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
        console.log(data)
      } catch (err) {
        setError('Error fetching invoices');
        toast({
          title: 'Error fetching invoices in InvoiceTable as payer',
          variant: 'destructive',
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const sliceAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    const copyToClipboard = useCallback((text: string) => {
      navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    }, []);

    const renderTableContent = () => {
      if (loading) {
        return Array(5).fill(null).map((_, index) => (
          <InvoiceItemSkeleton key={index} />
        ));
      }

      return invoices.map((invoice) => (
        <InvoiceItem 
          key={invoice.request_id}
          invoice={invoice}
          copiedAddress={copiedAddress}
          onCopyAddress={copyToClipboard}
          sliceAddress={sliceAddress}
          stream_id={invoice.stream_id as number}
          requestId={invoice.request_id}
          chainId={invoice.chain_id as ValidChainId}
          type={type as 'invoicesSent' | 'invoicesReceived'}
        />
      ));
    };

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="font-semibold">Payee</TableHead>
            <TableHead className="font-semibold">Payer</TableHead>
            <TableHead className="font-semibold">Chain</TableHead>
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