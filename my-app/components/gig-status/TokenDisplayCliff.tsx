import React, { useEffect, useState } from 'react';
import useCountUp from '@/hooks/useCountUp';
import { Progress } from "@/components/ui/progress";
import { formatEther } from 'viem';
import { Badge } from "@/components/ui/badge";

interface TokenDisplayWithCliffProps {
  maxValue: number;
  tokenSymbol: string;
  startTime: number;
  endTime: number;
  wasCanceled: boolean;
  refundedAmount: bigint;
  withdrawnAmount: number;
  cliffHour: number;
  totalHours: number;
  isRejected: boolean;
}

const TokenDisplayWithCliff: React.FC<TokenDisplayWithCliffProps> = ({ 
  maxValue, 
  tokenSymbol, 
  endTime, 
  startTime, 
  wasCanceled,
  refundedAmount,
  withdrawnAmount,
  cliffHour,
  totalHours,
  isRejected
}) => {
  const totalDuration = endTime - startTime;
  const [currentValue, setCurrentValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isInCliff, setIsInCliff] = useState(false);
  const [remainingCliffTime, setRemainingCliffTime] = useState(0);
  const cliffEndPercent = (cliffHour / totalHours) * 100;

  useEffect(() => {
    const updateValues = () => {
      const now = Date.now() / 1000;
      const elapsedTime = Math.max(now - startTime, 0);
      const percentageElapsed = Math.min((elapsedTime / totalDuration) * 100, 100);
      
      if (wasCanceled || isRejected) {
        const refundedEther = Number(formatEther(refundedAmount));
        const finalStreamedAmount = isRejected ? 0 : maxValue - refundedEther;
        setCurrentValue(finalStreamedAmount);
        setProgress(100);
      } else {
        setCurrentValue(maxValue * (percentageElapsed / 100));
        setProgress(percentageElapsed);
      }
      
      const cliffEndTime = startTime + (cliffHour * 3600);
      const isStillInCliff = now < cliffEndTime;
      setIsInCliff(isStillInCliff);
      
      if (isStillInCliff) {
        const remainingCliffSeconds = cliffEndTime - now;
        setRemainingCliffTime(Math.max(0, remainingCliffSeconds));
      } else {
        setRemainingCliffTime(0);
      }
    };

    updateValues();
    const interval = setInterval(updateValues, 1000);
    return () => clearInterval(interval);
  }, [wasCanceled, isRejected, startTime, endTime, totalDuration, maxValue, refundedAmount, cliffHour]);

  const remainingDuration = wasCanceled || isRejected ? 0 : Math.max(endTime - Date.now() / 1000, 0);
  const countUpValue = useCountUp(currentValue, maxValue, remainingDuration * 1000);
  const displayValue = wasCanceled || isRejected ? currentValue : countUpValue;

  const streamedPercentage = (currentValue / maxValue) * 100;
  const withdrawnPercentage = (withdrawnAmount / maxValue) * 100;

  const formattedNumber = displayValue.toFixed(8);
  const [integerPart, decimalPart] = formattedNumber.split('.');

  const renderIntegerPart = () => {
    const paddedInteger = integerPart.padStart(3, '0');
    return paddedInteger.split('').map((digit, index) => (
      <span key={index} className={
        index < paddedInteger.length - integerPart.length
          ? "text-gray-400 dark:text-gray-500"
          : "text-gray-800 dark:text-gray-200"
      }>
        {digit}
      </span>
    ));
  };

  const formatRemainingCliffTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8 p-4 sm:p-8 rounded-2xl shadow-lg
                    bg-gradient-to-br from-white via-gray-100 to-gray-100
                    dark:from-gray-800 dark:via-gray-900 dark:to-gray-900
                    border border-gray-200 dark:border-gray-700
                    transition-all duration-300 ease-in-out
                    hover:shadow-xl hover:scale-105">
      <div className="text-3xl sm:text-5xl lg:text-7xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-zinc-600 dark:from-gray-300 dark:to-zinc-300">
        {renderIntegerPart()}.
        <span className="text-xl sm:text-2xl lg:text-4xl">{decimalPart}</span>
      </div>
      
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount Streamed</span>
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{streamedPercentage.toFixed(2)}%</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-yellow-100 dark:bg-yellow-900 rounded-full" 
                      indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-full" />
            <div 
              className="absolute top-0 h-3 border-r-2 border-red-500" 
              style={{ left: `${cliffEndPercent}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            {displayValue.toFixed(4)} / {maxValue} {tokenSymbol}
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Cliff ends at {cliffEndPercent.toFixed(2)}% of the total duration
          </div>
          {isInCliff && !isRejected && (
            <div className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Cliff ends in {formatRemainingCliffTime(remainingCliffTime)}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount Withdrawn</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{withdrawnPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={withdrawnPercentage} className="h-3 bg-green-100 dark:bg-green-900 rounded-full" 
                    indicatorClassName="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full" />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            {withdrawnAmount.toFixed(4)} / {maxValue} {tokenSymbol}
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600 dark:text-gray-400 font-medium">
        <Badge variant={isRejected ? "destructive" : isInCliff ? "secondary" : "default"}>
          {isRejected ? "Rejected" : isInCliff ? "In Cliff" : "Streaming"}
        </Badge>
        {wasCanceled && (
          <div className="text-red-500 dark:text-red-400 mt-2">
            Stream Canceled
            <div className="text-sm">
              Refunded: {Number(formatEther(refundedAmount)).toFixed(4)} {tokenSymbol}
            </div>
          </div>
        )}
        {isRejected && (
          <div className="text-red-500 dark:text-red-400 mt-2">
            Gig Rejected
            <div className="text-sm">
             Stream returned to client
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDisplayWithCliff;