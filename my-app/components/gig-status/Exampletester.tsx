"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, DollarSign, Download, FileText, AlertCircle } from 'lucide-react'
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
            <StreamForecastWithCliff
            title="Payment Schedule"
            description="Track your payment progress"
            totalAmount={totalAmount}
            chartColor="green-400"
            duration={duration}
            startTime={typedStreamData.startTime}
            endTime={typedStreamData.endTime}
            />

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Total Gig Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
                </CardContent>
              </Card>

              <Display
                 title="Payment Schedule"
                 description="Available to withdraw"
                 totalAmount={totalAmount}
                 chartData={chartData}
                 cliffHour={cliffHour}
                 totalHours={totalHours}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap gap-4 justify-center">
             {streamId && (
                <WithdrawGig
                streamId={streamId}
                chain_id={chain_id}
                />
              ) }
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> View Invoice
            </Button>
            <Button variant="secondary">
              <AlertCircle className="mr-2 h-4 w-4" /> Report an Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Gig Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-primary">Web Development Project</h3>
              <p className="text-muted-foreground">Custom website development using React and Next.js</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <Clock className="mr-1 h-4 w-4" />
                30 days project
              </Badge>
              <Badge variant="outline" className="text-lg font-bold">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatCurrency(totalAmount)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}