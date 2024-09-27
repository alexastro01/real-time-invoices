import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import StreamForecastWithCliff from '../stream-forecast/StreamForecastWithCliff'
import { BarChartIcon } from 'lucide-react';

interface StreamForecastDialogCliffProps {
  title: string;
  description: string;
  totalAmount: number;
  chartColor: string;
  duration: number;
  startTime?: number;
  endTime?: number;
}

const StreamForecastDialogCliff: React.FC<StreamForecastDialogCliffProps> = ({
  title,
  description,
  totalAmount,
  chartColor,
  duration,
  startTime,
  endTime
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><BarChartIcon className="mr-2" />View Stream Forecast</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Stream Forecast</DialogTitle>
          <DialogDescription>
            View your token stream forecast over time.
          </DialogDescription>
        </DialogHeader>
        <StreamForecastWithCliff
          title={title}
          description={description}
          totalAmount={totalAmount}
          chartColor={chartColor}
          duration={duration}
          startTime={startTime}
          endTime={endTime}
        />
      </DialogContent>
    </Dialog>
  )
}

export default StreamForecastDialogCliff