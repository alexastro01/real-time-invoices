import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvoiceTable from './InvoiceTable';

const InvoiceDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice Dashboard</h1>
      <Tabs defaultValue="sender">
        <TabsList>
          <TabsTrigger value="sender">As Sender</TabsTrigger>
          <TabsTrigger value="receiver">As Receiver</TabsTrigger>
        </TabsList>
        <TabsContent value="sender">
          <InvoiceTable type="sender" />
        </TabsContent>
        <TabsContent value="receiver">
          <InvoiceTable type="receiver" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceDashboard;