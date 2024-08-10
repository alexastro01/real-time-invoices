import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceTable from './InvoiceTable';
import StatsCard from './StatsCard';
import { InvoiceChart } from './Chart';
import { useAccount } from 'wagmi';

interface InvoiceStats {
  totalExpectedAmount: string;
  totalInvoices: number;
}

const InvoiceDashboard = () => {
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats>({
    totalExpectedAmount: '0',
    totalInvoices: 0
  });
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchInvoiceStats = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/user-invoice-stats?user_address=${address}`);
        if (!response.ok) throw new Error('Failed to fetch invoice stats');
        const data = await response.json();
        setInvoiceStats(data);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceStats();
  }, [address]);

  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          description={'Total expected amount'} 
          amount={loading ? 'Loading...' : `$${invoiceStats.totalExpectedAmount}`} 
        />
        <StatsCard description={'Available to withdraw from streams'} amount={'$0'} />
        <StatsCard 
          description={'Invoices sent'} 
          amount={loading ? 'Loading...' : invoiceStats.totalInvoices.toString()} 
        />
        <StatsCard description={'Invoices Received'} amount={'1'} />
      </div>

      <div>
        <InvoiceChart />
      </div>
     
      <Tabs defaultValue="invoicesSent">
        <TabsList>
          <TabsTrigger value="invoicesSent">Invoices sent</TabsTrigger>
          <TabsTrigger value="invoicesReceived">Invoices received</TabsTrigger>
        </TabsList>
        <TabsContent value="invoicesSent">
          <InvoiceTable type="invoicesSent" />
        </TabsContent>
        <TabsContent value="invoicesReceived">
          <InvoiceTable type="invoicesReceived" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceDashboard;