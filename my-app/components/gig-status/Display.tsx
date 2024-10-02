"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import TokenDisplay from '../invoice/TokenDisplay'

interface ChartDataPoint {
  date: Date
  value: number
}

interface TokenDisplayProps {
  title: string
  description: string
  totalAmount: number
  chartData: ChartDataPoint[]
  cliffHour: number
  totalHours: number
}

export default function Display({
  title,
  description,
  totalAmount,
  chartData,
  cliffHour,
  totalHours
}: TokenDisplayProps) {
  const [currentTokens, setCurrentTokens] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isInCliff, setIsInCliff] = useState(false)
  const [cliffEndPercent, setCliffEndPercent] = useState(0)

  useEffect(() => {
    const updateTokenDisplay = () => {
      const now = new Date()
      const currentDataPoint = chartData.find((point, index) => 
        index < chartData.length - 1 && now >= point.date && now < chartData[index + 1].date
      ) || chartData[chartData.length - 1]

      setCurrentTokens(Math.round(currentDataPoint.value))
      
      const elapsedHours = (now.getTime() - chartData[0].date.getTime()) / (60 * 60 * 1000)
      setProgress((elapsedHours / totalHours) * 100)
      setIsInCliff(elapsedHours < cliffHour)
      setCliffEndPercent((cliffHour / totalHours) * 100)
    }

    updateTokenDisplay()
    const intervalId = setInterval(updateTokenDisplay, 1000) // Update every second

    return () => clearInterval(intervalId)
  }, [chartData, cliffHour, totalHours])

  // Function to render the integer part with grayed out leading zeros
  const renderIntegerPart = () => {
    const integerPart = Math.floor(currentTokens).toString();
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

  // Get the decimal part
  const decimalPart = (currentTokens % 1).toFixed(8).slice(2);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
          {/* Big beautiful number */}
   
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">{currentTokens}</span>
          <span className="text-xl ml-2">/ {totalAmount} tokens</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Progress: {progress.toFixed(2)}%</span>
          <Badge variant={isInCliff ? "secondary" : "default"}>
            {isInCliff ? "In Cliff" : "Streaming"}
          </Badge>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-4" />
          <div 
            className="absolute top-0 h-4 border-r-2 border-red-500" 
            style={{ left: `${cliffEndPercent}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Cliff ends at {cliffEndPercent.toFixed(2)}% of the total duration
        </p>
      </CardContent>
    </Card>
  )
}