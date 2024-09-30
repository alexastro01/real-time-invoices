"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, DollarSign, Download, FileText, AlertCircle, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { generateChartDataWithTimeRange } from '@/utils/chart/generateChartDataWithTimeRange'
import WithdrawGig from './WithdrawGig'
import TokenDisplay from '../invoice/TokenDisplay'
import TokenDisplayWithCliff from './TokenDisplayCliff'
import GigDetails from './GigDetails'
import GigActionButtons from './GigActionButtons'

// Mock data for the chart (representing money unlocking over time)
const chartData = [
  { day: 1, amount: 100 },
  { day: 5, amount: 250 },
  { day: 10, amount: 400 },
  { day: 15, amount: 600 },
  { day: 20, amount: 800 },
  { day: 25, amount: 900 },
  { day: 30, amount: 1000 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

type GigDashBoardProps = {
  streamId: number,
  chain_id: number,
  invoiceData: IInvoiceData,
  requestId: string,
  gigData: GigType
}

export default function GigPaymentDashboard({
  streamId,
  chain_id,
  invoiceData,
  requestId,
  gigData
}: GigDashBoardProps) {


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
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-background to-muted min-h-screen">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r primary-muted to primary-muted-foreground rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-primary">Gig Payment Status</CardTitle>
          <CardDescription className="text-primary/80">Track your payment progress</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
       

              <TokenDisplayWithCliff
                maxValue={totalAmount}
                tokenSymbol="tUSDC"
                startTime={Number(typedStreamData.startTime)}
                endTime={Number(typedStreamData.endTime)}
                wasCanceled={typedStreamData.wasCanceled}
                refundedAmount={typedStreamData.amounts.refunded}
                withdrawnAmount={Number(formatEther(typedStreamData.amounts.withdrawn))}
                cliffHour={cliffHour}
                totalHours={totalHours}
              />

<StreamForecastWithCliff
              title="Payment Schedule"
              description="Track your payment progress"
              totalAmount={totalAmount}
              chartColor="#00edbe"
              duration={duration}
              startTime={typedStreamData.startTime}
              endTime={typedStreamData.endTime}
            />
          </div>

          <Separator className="my-6" />

     <GigActionButtons streamId={streamId} chain_id={chain_id} creator={gigData.creator_address} />
        </CardContent>
      </Card>
 
     <GigDetails
     title={gigData.title ?? ''}
     description={gigData.description ?? ''}
     delivery_time={Number(gigData.delivery_time) ?? 0}
     totalAmount={totalAmount}
     creator={gigData.creator_address}
 /> 
 

    </div>
  )
}