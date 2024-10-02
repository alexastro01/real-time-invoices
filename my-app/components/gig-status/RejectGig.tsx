import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Loader2 } from 'lucide-react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { abi } from '../../abi/SablierLinear';
import { useToast } from '../ui/use-toast';

interface RejectGigProps {
  streamId: number;
  chain_id: number;
  creator: string;
  client: string;
}

const RejectGig: React.FC<RejectGigProps> = ({ streamId, chain_id, creator, client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleReject = () => {
    writeContract({
      address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
      abi: abi,
      functionName: 'withdrawMaxAndTransfer',
      args: [streamId, client],
      chainId: chain_id
    });
  };

useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `${error.message}`,
        variant: "destructive"
      });
    }
  }, [error, toast]);

useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Gig Rejected",
        description: "The gig has been successfully rejected and the stream transferred back to the creator.",
        variant: "default"
      });
      setIsOpen(false);
    }
  }, [isConfirmed, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <X className="mr-2 h-4 w-4" /> Reject Gig
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Reject Gig
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-center">
          <p>Are you sure you want to reject this gig?</p>
          <p className="text-sm text-gray-500 mt-2">
            This action will transfer the stream back to its creator and cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleReject}
            disabled={isPending || isConfirming}
            variant="destructive"
            className="w-full"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirming...
              </>
            ) : (
              <>
                <X className="mr-2 h-5 w-5" /> Confirm Rejection
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectGig;