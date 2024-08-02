import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, CreditCard, XCircle, Share2 } from 'lucide-react';
import CountUp from './CountUp';
import TokenDisplay from './TokenDisplay';
import { useReadContract } from 'wagmi';
import { abi } from '../../abi/SablierLinear'
import { sablierLinearV2LockUpAddress } from '@/constants/addresses';
import { formatEther } from 'viem';
import { StreamData } from '@/types/types';


type ActionButtonsProps = {
  streamId: number
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  streamId
}) => {

  const { data, isError, isLoading } = useReadContract({
    address: sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [streamId]
  })

  useEffect(() => {
    console.log(data)
  }, [data])

  const streamData = data as StreamData;

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      {data ? <TokenDisplay
        maxValue={Number(formatEther(streamData.amounts.deposited))}
        tokenSymbol="DAI"
        startTime={streamData.startTime}
        endTime={streamData.endTime}
      /> : null}
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