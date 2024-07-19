import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "../ui/progress"
import {useState} from 'react'
import { useToast } from "../ui/use-toast"

type ReceiverDetailsProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};
export function SenderDetails({
  setStep
}: ReceiverDetailsProps) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const { toast } = useToast()


  function validateAndProceed() {
    if (name.trim() === "" || email.trim() === "") {
      setFormError("Please fill in all required fields.");
      toast({
        variant: "destructive",
        title: "Please fill out all required forms",
      })
    } else {
      setFormError("");
      setStep(1);
    }
  }




  return (
    <div className="w-[50%]" >
      <Progress value={33} className="my-8" />
      <Card className="">
        <CardHeader>
          <CardTitle>Sender's Details</CardTitle>
          <CardDescription>Please input the sender's information</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name<span className="text-red-600">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email<span className="text-red-600">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address </Label>
                <Input id="address" placeholder="Street address" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" placeholder="State or Province" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="zip">Zip/Postal Code</Label>
                <Input id="zip" placeholder="Zip or Postal Code" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Country" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
        <Button variant={"ghost"}>Back</Button>
          <Button onClick={validateAndProceed}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}