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
  totalAmount: number;
  chartColor: string;
}

function generateChartData(totalHours: number, cliffHour: number, totalAmount: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const baseValue = 0
  const cliffValue = totalAmount * 0.25
  const maxValue = totalAmount
  const startDate = new Date()

  for (let i = 0; i < totalHours; i++) {
    const currentDate = new Date(startDate.getTime() + i * 60 * 60 * 1000) // Increment by hour
    if (i < cliffHour) {
      data.push({ date: currentDate, value: baseValue })
    } else if (i === cliffHour) {
      // Add two data points for the cliff hour to create a vertical line
      data.push({ date: currentDate, value: baseValue })
      data.push({ date: currentDate, value: cliffValue })
    } else {
      const remainingHours = totalHours - cliffHour - 1
      const hourlyIncrement = (maxValue - cliffValue) / remainingHours
      data.push({ date: currentDate, value: cliffValue + (i - cliffHour) * hourlyIncrement })
    }
  }

  return data
}

export default function StreamForecastWithCliff({
  title,
  description,
  totalAmount,
  chartColor
}: StreamForecastProps) {
  const totalHours = 9 * 24 // 9 days
  const cliffHour = 2 * 24  // Cliff at day 2 (48 hours)
  const chartData = generateChartData(totalHours, cliffHour, totalAmount)

  const formatXAxis = (tickItem: Date) => {
    return tickItem.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const formatYAxis = (tickItem: number) => {
    return Math.round(tickItem).toString()  // Display as whole numbers
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary-foreground p-2 border border-gray-300 rounded shadow">
          <p className="label">{`Date: ${label.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}</p>
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
              // Show ticks every 6 hours to reduce clutter
              ticks={chartData
                .filter((_, index) => index % 6 === 0)
                .map(point => point.date.getTime())} // Convert Date to number
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