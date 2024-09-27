import React, { useEffect } from 'react';
import TokenDisplay from '../invoice/TokenDisplay';
import { useAccount, useReadContract } from 'wagmi';
import { abi } from '../../abi/SablierLinear'
import { formatEther } from 'viem';
import { Gig, StreamData } from '@/types/types';
import CancelStream from '../invoice/CancelStream';
import ShareInvoiceComponent from '../invoice/ShareInvoiceComponent';
import WithdrawComponent from '../invoice/WithdrawComponent';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { IInvoiceData } from '@/types/interfaces';
import ViewInvoiceDialog from '../invoice/ViewInvoiceDialog';
import StreamForecastDialog from '../stream-forecast/StreamForecastDialog';
import StreamForecastDialogCliff from './StreamForecastDialogCliff';
import TokenDisplayCliff from './TokenDisplayCliff';


type ActionButtonsGigProps = {
    streamId: number,
    chain_id: number,
    invoiceData: IInvoiceData,
    requestId: string,
    gigData: Gig
}

const ActionButtonsGig: React.FC<ActionButtonsGigProps> = ({
    streamId,
    chain_id,
    invoiceData,
    requestId,
    gigData
}) => {
    const { data: streamData, isError, isLoading, error } = useReadContract({
        address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
        abi: abi,
        functionName: 'getStream',
        args: [streamId],
        chainId: chain_id
    })



    const { address } = useAccount();

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
        console.log(gigData)
    }, [streamData, error, gigData])

    const typedStreamData = streamData as StreamData;

    return (
        <div className="flex flex-col space-y-4 w-full max-w-md">
        {streamData ? (
    <TokenDisplayCliff
        maxValue={Number(formatEther(typedStreamData.amounts.deposited))}
        tokenSymbol="tUSDC"
        startTime={typedStreamData.startTime}
        endTime={typedStreamData.endTime}
        wasCanceled={typedStreamData.wasCanceled}
        refundedAmount={typedStreamData.amounts.refunded}
        withdrawnAmount={withdrawnAmount ? Number(formatEther(withdrawnAmount as bigint)) : 0}
        duration={Number(gigData.delivery_time)}
    />
) : null}
            {streamData && address === invoiceData.paymentDetails.payeeAddress ? <WithdrawComponent streamId={streamId} chain_id={chain_id} /> : null}
            {streamData && invoiceData.paymentDetails.stream_id ? <StreamForecastDialogCliff
                title="Stream Forecast"
                description="View the stream forecast for this gig"
                totalAmount={Number(formatEther(typedStreamData.amounts.deposited))}
                chartColor="blue"
                duration={Number(gigData.delivery_time)}
                startTime={typedStreamData.startTime}
                endTime={typedStreamData.endTime}
          
            /> : null}


            {/* <DownloadPDF invoiceData={invoiceData} /> */}
            <ShareInvoiceComponent requestId={requestId} />
            <ViewInvoiceDialog invoiceData={invoiceData} isFromActionButtons={true} />
            {streamData && address === invoiceData.paymentDetails.payerAddress ? <CancelStream streamId={streamId} chain_id={chain_id} wasCanceled={typedStreamData.wasCanceled} /> : null}
        </div>
    );
};

export default ActionButtonsGig;