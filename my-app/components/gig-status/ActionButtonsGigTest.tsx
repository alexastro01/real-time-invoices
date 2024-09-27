import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { abi } from '../../abi/SablierLinear';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { timeToCancelationPeriod } from '@/constants/timeToCancelationPeriod';
import { Gig as GigType, StreamData } from '@/types/types';
import { IInvoiceData } from '@/types/interfaces';
import ShareInvoiceComponent from '../invoice/ShareInvoiceComponent';
import WithdrawComponent from '../invoice/WithdrawComponent';
import ViewInvoiceDialog from '../invoice/ViewInvoiceDialog';
import StreamForecastWithCliff from '../stream-forecast/StreamForecastWithCliff';
import Display from './Display';

import Gig from '../gigs/Gig';
import { generateChartDataWithTimeRange } from '@/utils/chart/generateChartDataWithTimeRange';
import TokenDisplay from '../invoice/TokenDisplay';

type ActionButtonsGigProps = {
    streamId: number,
    chain_id: number,
    invoiceData: IInvoiceData,
    requestId: string,
    gigData: GigType
}

const ActionButtonsGigTest: React.FC<ActionButtonsGigProps> = ({
    streamId,
    chain_id,
    invoiceData,
    requestId,
    gigData
}) => {
    const { data: streamData } = useReadContract({
        address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
        abi: abi,
        functionName: 'getStream',
        args: [BigInt(streamId)],
        chainId: chain_id
    });

    const { address } = useAccount();

    const typedStreamData = streamData as StreamData | undefined;

    const totalAmount = typedStreamData ? Number(formatEther(typedStreamData.amounts.deposited)) : 0;
    const duration = Number(gigData.delivery_time);
    const totalHours = (duration + timeToCancelationPeriod[duration]) * 24;
    const cliffHour = timeToCancelationPeriod[duration] * 24;

    const chartData = typedStreamData ? generateChartDataWithTimeRange(
        totalHours,
        cliffHour,
        totalAmount,
        Number(typedStreamData.startTime),
        Number(typedStreamData.endTime)
    ) : [];

    if (!typedStreamData) {
        return <div>Loading stream data...</div>;
    }

    return (
        <div className="flex flex-col space-y-6">
            <Gig
                id={gigData.gig_id}
                title={gigData.title}
                description={gigData.description || ''}
                deliveryTime={gigData.delivery_time.toString()}
                link={`/gig/${gigData.gig_id}`}
                price={Number(formatEther(typedStreamData.amounts.deposited))}
                viewGig={false}
            />
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-2/3">
                    <StreamForecastWithCliff
                        title="Stream Forecast"
                        description="View the stream forecast for this gig"
                        totalAmount={totalAmount}
                        chartColor="blue"
                        duration={duration}
                        startTime={Number(typedStreamData.startTime)}
                        endTime={Number(typedStreamData.endTime)}
                    />
                </div>
                <div>
                    <TokenDisplay
                        maxValue={totalAmount}
                        tokenSymbol="tUSDC"
                        startTime={Number(typedStreamData.startTime)}
                        endTime={Number(typedStreamData.endTime)}
                        wasCanceled={typedStreamData.wasCanceled}
                        refundedAmount={typedStreamData.amounts.refunded}
                        withdrawnAmount={Number(formatEther(typedStreamData.amounts.withdrawn))}
                    />
                </div>
                <div className="w-full lg:w-1/3 flex flex-col space-y-4">
                    <Display
                        title="Token Stream"
                        description="Your current token stream progress"
                        totalAmount={totalAmount}
                        chartData={chartData}
                        cliffHour={cliffHour}
                        totalHours={totalHours}
                    />
                    {address === invoiceData.paymentDetails.payeeAddress && (
                        <WithdrawComponent streamId={streamId} chain_id={chain_id} />
                    )}
                    <ShareInvoiceComponent requestId={requestId} />
                    <ViewInvoiceDialog invoiceData={invoiceData} isFromActionButtons={true} />
                </div>
            </div>
        </div>
    );
};

export default ActionButtonsGigTest;