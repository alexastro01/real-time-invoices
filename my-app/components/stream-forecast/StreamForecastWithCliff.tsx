import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ChartDataPoint {
  date: Date;
  value: number;
}

interface StreamForecastProps {
  title: string;
  description: string;
  trendPercentage: number;
  totalAmount: number;
  chartColor: string;
}

function generateChartData(totalDays: number, cliffDay: number, totalAmount: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const baseValue = 0
  const cliffValue = totalAmount * 0.25
  const maxValue = totalAmount
  const startDate = new Date()

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    if (i < cliffDay) {
      data.push({ date: currentDate, value: baseValue })
    } else if (i === cliffDay) {
      // Add two data points for the cliff day to create a vertical line
      data.push({ date: currentDate, value: baseValue })
      data.push({ date: currentDate, value: cliffValue })
    } else {
      const remainingDays = totalDays - cliffDay - 1
      const dailyIncrement = (maxValue - cliffValue) / remainingDays
      data.push({ date: currentDate, value: cliffValue + (i - cliffDay) * dailyIncrement })
    }
  }

  return data
}

export default function StreamForecastWithCliff({
  title,
  description,
  trendPercentage,
  totalAmount,
  chartColor
}: StreamForecastProps) {
  const totalDays = 250
  const cliffDay = 50  // Cliff at day 50
  const chartData = generateChartData(totalDays, cliffDay, totalAmount)

  const formatXAxis = (tickItem: Date) => {
    return tickItem.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatYAxis = (tickItem: number) => {
    return Math.round(tickItem).toString()  // Display as whole numbers
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="label">{`Date: ${label.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}</p>
          <p className="value">{`Tokens: ${Math.round(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          </div>
          <div className="text-sm text-right">
            <div className="font-medium">{trendPercentage}% increase</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              ticks={[0, 50, 100, 150, 200, 249].map(day => chartData[day].date.toISOString())}
            />
            <YAxis tickFormatter={formatYAxis} domain={[0, totalAmount]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="stepAfter" dataKey="value" stroke={chartColor} fill={chartColor} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}