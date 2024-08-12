// ActionButtons.tsx
import React, { useState, useCallback } from 'react';
import TokenDisplay from './TokenDisplay';
import { useAccount, useReadContract } from 'wagmi';
import { abi } from '../../abi/SablierLinear'
import { formatEther } from 'viem';
import { StreamData } from '@/types/types';
import CancelStream from './CancelStream';
import ShareInvoiceComponent from './ShareInvoiceComponent';
import WithdrawComponent from './WithdrawComponent';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { IInvoiceData } from '@/types/interfaces';
import ViewInvoiceDialog from './ViewInvoiceDialog';
import { useRouter } from 'next/navigation';

type ActionButtonsProps = {
  streamId: number,
  chain_id: ValidChainId,
  invoiceData: IInvoiceData,
  requestId: string
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  streamId,
  chain_id,
  invoiceData,
  requestId
}) => {
  const [isStreamCanceled, setIsStreamCanceled] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  const { data: streamData, isError, isLoading, error } = useReadContract({
    address: contracts[chain_id].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [BigInt(streamId)],
    chainId: chain_id
  })

  const { data: withdrawnAmount } = useReadContract({
    address: contracts[chain_id].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getWithdrawnAmount',
    args: [BigInt(streamId)],
    chainId: chain_id
  })

  const handleCancelSuccess = useCallback(() => {
  
    setIsStreamCanceled(true);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !streamData) {
    return <div>Error: {error?.message || 'Failed to load stream data'}</div>;
  }

  const typedStreamData = streamData as StreamData;

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      <TokenDisplay
        maxValue={Number(formatEther(typedStreamData.amounts.deposited))}
        tokenSymbol="tUSDC"
        startTime={Number(typedStreamData.startTime)}
        endTime={Number(typedStreamData.endTime)}
        wasCanceled={isStreamCanceled || typedStreamData.wasCanceled}
        refundedAmount={typedStreamData.amounts.refunded}
        withdrawnAmount={withdrawnAmount ? Number(formatEther(withdrawnAmount as bigint)) : 0}
      />
      {address === invoiceData.paymentDetails.payeeAddress && !isStreamCanceled && (
        <WithdrawComponent streamId={streamId} chain_id={chain_id} />
      )}
      <ShareInvoiceComponent requestId={requestId} />
      <ViewInvoiceDialog invoiceData={invoiceData} isFromActionButtons={true} />
      {address === invoiceData.paymentDetails.payerAddress && !isStreamCanceled && (
        <CancelStream 
          streamId={streamId} 
          chain_id={chain_id} 
          wasCanceled={typedStreamData.wasCanceled}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
};

export default ActionButtons;