import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type StreamType = "linear" | "monthly";

interface StreamTypeSelectorProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export function StreamTypeSelector({ setStep }: StreamTypeSelectorProps) {
  const [selectedStream, setSelectedStream] = useState<StreamType>("linear")

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  }

  const handleNext = () => {
    if (selectedStream) {
      setStep((prevStep) => prevStep + 1);
    }
  }

  const LinearStreamSVG = () => (
    <svg width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
      <line x1="0" y1="100" x2="200" y2="0" stroke="orange" strokeWidth="2" />
    </svg>
  );
  

  return (
    <div className="w-[50%]">
      <Progress value={85} className="my-8" />
      <Card>
        <CardHeader>
          <CardTitle>Type of Stream</CardTitle>
          <CardDescription>Select the type of stream for asset distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedStream} onValueChange={(value) => setSelectedStream(value as StreamType)}>
            <div className="grid grid-cols-2 gap-4">
            <Card className={`cursor-pointer bg-gray-800 ${ "border-orange-500"}`}>
                <CardHeader>
                  <CardTitle className="text-white">Linear Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24">
                    <LinearStreamSVG />
                  </div>
                  <CardDescription className="text-gray-400 mt-2">
                    Distribute assets at a constant rate/second
                  </CardDescription>
                  <RadioGroupItem value="linear" className="sr-only" />
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    Pick this <span className="ml-2 text-orange-500">Popular</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card className={`cursor-pointer ${selectedStream === "monthly" ? "border-primary" : ""}`}>
                <CardHeader>
                  <CardTitle>Monthly Unlocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24 flex items-end">
                    <div className="w-1/4 bg-primary h-4 mr-1"></div>
                    <div className="w-1/4 bg-primary h-8 mr-1"></div>
                    <div className="w-1/4 bg-primary h-12 mr-1"></div>
                    <div className="w-1/4 bg-primary h-16"></div>
                  </div>
                  <CardDescription className="mt-2">
                    Unlock assets on the same day every month
                  </CardDescription>
                  <RadioGroupItem value="monthly" className="sr-only" />
                </CardContent>
              </Card>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>Back</Button>
          <Button onClick={handleNext}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}