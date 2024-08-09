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
import CancelStream from './CancelStream';
import DownloadPDF from './DownloadPDF';
import ShareInvoiceComponent from './ShareInvoiceComponent';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';


type ActionButtonsProps = {
  streamId: number,
  chain_id: number
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  streamId,
  chain_id
}) => {

  const { data, isError, isLoading, error } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [streamId],
    chainId:chain_id
  })

  useEffect(() => {
    console.log(data)
    console.log(error?.message)
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
      <CancelStream />
      <DownloadPDF />
      <ShareInvoiceComponent />
    </div>
  );
};

export default ActionButtons;