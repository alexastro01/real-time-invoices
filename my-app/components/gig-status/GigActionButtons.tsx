import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, X } from 'lucide-react';
import WithdrawGig from './WithdrawGig';
import RejectGig from './RejectGig';
import CancelStream from '../invoice/CancelStream';

interface GigActionButtonsProps {
    streamId: number;
    chain_id: number;
    creator: string;
    isRejected: boolean;
}

const GigActionButtons: React.FC<GigActionButtonsProps> = ({ streamId, chain_id, creator, isRejected }) => {


    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {streamId && !isRejected && (
                <WithdrawGig
                    streamId={streamId}
                    chain_id={chain_id}
                />
            )}

            {!isRejected && <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> View Invoice
            </Button>}
            {!isRejected && <RejectGig streamId={streamId} chain_id={chain_id} creator={creator} />}
            {
                isRejected && (
                    <CancelStream streamId={streamId} chain_id={chain_id} />
                )
            }
        </div>
    );
};

export default GigActionButtons;