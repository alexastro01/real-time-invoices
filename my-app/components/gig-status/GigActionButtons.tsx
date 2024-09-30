import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, X } from 'lucide-react';
import WithdrawGig from './WithdrawGig';
import RejectGig from './RejectGig';

interface GigActionButtonsProps {
  streamId: number;
  chain_id: number;
  creator: string;
}

const GigActionButtons: React.FC<GigActionButtonsProps> = ({ streamId, chain_id, creator }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {streamId && (
        <WithdrawGig
          streamId={streamId}
          chain_id={chain_id}
        />
      )}
      <Button variant="outline">
        <FileText className="mr-2 h-4 w-4" /> View Invoice
      </Button>
     <RejectGig streamId={streamId} chain_id={chain_id} creator={creator} />
    </div>
  );
};

export default GigActionButtons;