import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceTable from './InvoiceTable';
import StatsCard from './StatsCard';
import { InvoiceChart } from './Chart';

const InvoiceDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard description={'Total expected amount'} amount={'$20,000'} />
        <StatsCard description={'Available to withdraw from streams'} amount={'$4,000'} />
        <StatsCard description={'Invoices sent'} amount={'10'} />
        <StatsCard description={'Clients'} amount={'2'} />
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