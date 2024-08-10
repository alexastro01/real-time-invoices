import React, { useEffect } from 'react';
import TokenDisplay from './TokenDisplay';
import { useReadContract } from 'wagmi';
import { abi } from '../../abi/SablierLinear'
import { formatEther } from 'viem';
import { StreamData } from '@/types/types';
import CancelStream from './CancelStream';
import DownloadPDF from './DownloadPDF';
import ShareInvoiceComponent from './ShareInvoiceComponent';
import WithdrawComponent from './WithdrawComponent';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';

type ActionButtonsProps = {
  streamId: number,
  chain_id: number
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  streamId,
  chain_id
}) => {
  const { data: streamData, isError, isLoading, error } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [streamId],
    chainId: chain_id
  })

  const { data: withdrawnAmount } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getWithdrawnAmount',
    args: [streamId],
    chainId: chain_id
  })

  useEffect(() => {
    console.log(streamData)
    console.log(error?.message)
  }, [streamData, error])

  const typedStreamData = streamData as StreamData;

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      {streamData  ? (
        <TokenDisplay
          maxValue={Number(formatEther(typedStreamData.amounts.deposited))}
          tokenSymbol="DAI"
          startTime={typedStreamData.startTime}
          endTime={typedStreamData.endTime}
          wasCanceled={typedStreamData.wasCanceled}
          refundedAmount={typedStreamData.amounts.refunded}
          withdrawnAmount={Number(formatEther(withdrawnAmount as bigint))}
        />
      ) : null}
      {streamData ? <WithdrawComponent streamId={streamId} chain_id={chain_id} /> : null}
      {streamData ? <CancelStream streamId={streamId} chain_id={chain_id} wasCanceled={typedStreamData.wasCanceled} /> : null}
      <DownloadPDF />
      <ShareInvoiceComponent />
    </div>
  );
};

export default ActionButtons;