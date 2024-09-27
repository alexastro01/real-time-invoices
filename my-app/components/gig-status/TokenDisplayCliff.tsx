"use client"

import React, { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'
import useCountUp from '@/hooks/useCountUp'
import { timeToCancelationPeriodInSeconds } from '@/constants/timeToCancelationPeriod'

interface TokenDisplayCliffProps {
  maxValue: number
  tokenSymbol: string
  startTime: number
  endTime: number
  wasCanceled: boolean
  refundedAmount: bigint
  withdrawnAmount: number
  duration: number // Duration in days
}

export default function TokenDisplayCliff({
  maxValue,
  tokenSymbol,
  startTime,
  endTime,
  wasCanceled,
  refundedAmount,
  withdrawnAmount,
  duration
}: TokenDisplayCliffProps) {
  const totalDuration = endTime - startTime
  const cliffDuration = timeToCancelationPeriodInSeconds[duration] || 0
  const cliffEndTime = startTime + cliffDuration
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    if (wasCanceled) {
      const refundedEther = Number(formatEther(refundedAmount))
      const finalStreamedAmount = maxValue - refundedEther
      setCurrentValue(finalStreamedAmount)
    } else {
      const interval = setInterval(() => {
        const now = Date.now() / 1000
        if (now < cliffEndTime) {
          setCurrentValue(0)
        } else {
          const elapsedAfterCliff = Math.max(now - cliffEndTime, 0)
          const streamDuration = totalDuration - cliffDuration
          const percentageElapsed = Math.min((elapsedAfterCliff / streamDuration) * 100, 100)
          setCurrentValue(maxValue * (percentageElapsed / 100))
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [wasCanceled, startTime, endTime, totalDuration, maxValue, refundedAmount, cliffEndTime, cliffDuration])

  const remainingDuration = wasCanceled ? 0 : Math.max(endTime - Date.now() / 1000, 0)
  const countUpValue = useCountUp(currentValue, maxValue, remainingDuration * 1000)
  const displayValue = wasCanceled ? currentValue : countUpValue

  const streamedPercentage = (currentValue / maxValue) * 100
  const withdrawnPercentage = (withdrawnAmount / maxValue) * 100
  const cliffPercentage = (cliffDuration / totalDuration) * 100
  const now = Date.now() / 1000
  const elapsedPercentage = ((now - startTime) / totalDuration) * 100

  const formattedNumber = displayValue.toFixed(8)
  const [integerPart, decimalPart] = formattedNumber.split('.')

  const renderIntegerPart = () => {
    const paddedInteger = integerPart.padStart(3, '0')
    return paddedInteger.split('').map((digit, index) => (
      <span key={index} className={
        index < paddedInteger.length - integerPart.length
          ? "text-muted-foreground"
          : "text-foreground"
      }>
        {digit}
      </span>
    ))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Token Stream</CardTitle>
        <CardDescription className="text-center">Current token stream progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-5xl font-bold font-mono">
            {renderIntegerPart()}.
            <span className="text-2xl">{decimalPart}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {maxValue.toFixed(4)} {tokenSymbol} Total
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Amount Streamed</span>
              <span className="text-sm font-bold">{streamedPercentage.toFixed(2)}%</span>
            </div>
            <div className="relative">
              <Progress value={streamedPercentage} className="h-3" />
              {cliffPercentage > 0 && (
                <div 
                  className="absolute top-0 h-3 border-r-2 border-red-500" 
                  style={{ left: `${cliffPercentage}%` }}
                />
              )}
            </div>
            <div className="mt-1 text-xs text-muted-foreground text-right">
              {displayValue.toFixed(4)} / {maxValue} {tokenSymbol}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Amount Withdrawn</span>
              <span className="text-sm font-bold">{withdrawnPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={withdrawnPercentage} className="h-3" />
            <div className="mt-1 text-xs text-muted-foreground text-right">
              {withdrawnAmount.toFixed(4)} / {maxValue} {tokenSymbol}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant={wasCanceled ? "destructive" : now < cliffEndTime ? "secondary" : "default"}>
            {wasCanceled ? "Canceled" : now < cliffEndTime ? "In Cliff" : "Streaming"}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                {wasCanceled ? (
                  <p>Stream was canceled. Refunded: {Number(formatEther(refundedAmount)).toFixed(4)} {tokenSymbol}</p>
                ) : now < cliffEndTime ? (
                  <p>Tokens become withdrawable: {new Date(cliffEndTime * 1000).toLocaleString()}</p>
                ) : (
                  <p>Stream is active and tokens are being released</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}