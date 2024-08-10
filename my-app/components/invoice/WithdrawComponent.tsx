import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { abi } from '../../abi/SablierLinear';
import { formatEther, parseEther } from 'viem';
import { useToast } from '../ui/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';

type WithdrawComponentProps = {
  streamId: number;
  chain_id: number;
}

const WithdrawComponent: React.FC<WithdrawComponentProps> = ({ streamId, chain_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [availableToWithdraw, setAvailableToWithdraw] = useState('0');
  const { address } = useAccount();
  const { toast } = useToast();

  const { data: streamData } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [streamId],
    chainId: chain_id
  });

  const {
    data: withdrawableAmount,
    refetch: refetchWithdrawableAmount
  } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'withdrawableAmountOf',
    args: [streamId],
    chainId: chain_id
  });

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (withdrawableAmount) {
      setAvailableToWithdraw(formatEther(withdrawableAmount as bigint));
    }
  }, [withdrawableAmount]);

  useEffect(() => {
    if (isOpen) {
      refetchWithdrawableAmount();
    }
  }, [isOpen, refetchWithdrawableAmount]);

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
        title: "Withdrawal Successful",
        description: `You have successfully withdrawn ${amountToWithdraw} tokens.`,
        variant: "default"
      });
      setIsOpen(false);
      setAmountToWithdraw('');
    }
  }, [isConfirmed, amountToWithdraw]);

  const handleWithdraw = () => {
    if (!address) return;
    
    const amount = parseEther(amountToWithdraw);
    writeContract({
      address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
      abi: abi,
      functionName: 'withdraw',
      args: [streamId, address, amount],
      chainId: chain_id
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <CreditCard className="mr-2 h-4 w-4" /> Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Available to withdraw:</label>
            <p className="text-lg font-bold">{parseFloat(availableToWithdraw).toFixed(4)} tokens</p>
          </div>
          <div>
            <label htmlFor="withdrawAmount" className="text-sm font-medium">Amount to withdraw:</label>
            <Input
              id="withdrawAmount"
              type="number"
              value={amountToWithdraw}
              onChange={(e) => setAmountToWithdraw(e.target.value)}
              max={availableToWithdraw}
              step="0.0001"
            />
          </div>
          <Button 
            onClick={handleWithdraw} 
            disabled={isPending || isConfirming || parseFloat(amountToWithdraw) > parseFloat(availableToWithdraw) || parseFloat(amountToWithdraw) <= 0}
            className="w-full"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
              </>
            ) : (
              'Withdraw'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawComponent;