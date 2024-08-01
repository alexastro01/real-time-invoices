import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, CreditCard, XCircle, Share2 } from 'lucide-react';
import CountUp from './CountUp';
import TokenDisplay from './TokenDisplay';

const ActionButtons: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
          <TokenDisplay 
      maxValue={1500}
      duration={60000} // 5 minutes in milliseconds
      tokenSymbol="DAI"
    />
      <Button variant="default" className="w-full">
        <CreditCard className="mr-2 h-4 w-4" /> Withdraw
      </Button>
      <Button variant="destructive" className="w-full">
        <XCircle className="mr-2 h-4 w-4" /> Cancel Invoice
      </Button>
      <Button variant="outline" className="w-full">
        <Download className="mr-2 h-4 w-4" /> Download PDF
      </Button>
      <Button variant="secondary" className="w-full">
        <Share2 className="mr-2 h-4 w-4" /> Share Invoice
      </Button>
    </div>
  );
};

export default ActionButtons;