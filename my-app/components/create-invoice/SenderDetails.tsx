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
import { useToast } from "../ui/use-toast"

type SenderDetailsProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  senderDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  updateSenderDetails: (newDetails: Partial<SenderDetailsProps['senderDetails']>) => void;
};

export function SenderDetails({
  setStep,
  senderDetails,
  updateSenderDetails
}: SenderDetailsProps) {

  const [formError, setFormError] = React.useState("");
  const { toast } = useToast()

  function validateAndProceed() {
    if (senderDetails.name.trim() === "" ||
     senderDetails.email.trim() === "") {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSenderDetails({ [e.target.id]: e.target.value });
  };

  return (
    <div className="w-[90%] lg:w-[85%] xl:w-[50%]" >
      <Progress value={33} className="my-8" />
      <Card className="">
        <CardHeader>
          <CardTitle>Customer information</CardTitle>
          <CardDescription>Who will pay the invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name<span className="text-red-600">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Full name" 
                  value={senderDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email<span className="text-red-600">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email address" 
                  value={senderDetails.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address </Label>
                <Input 
                  id="address" 
                  placeholder="Street address" 
                  value={senderDetails.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  placeholder="City" 
                  value={senderDetails.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="state">State/Province</Label>
                <Input 
                  id="state" 
                  placeholder="State or Province" 
                  value={senderDetails.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="zip">Zip/Postal Code</Label>
                <Input 
                  id="zip" 
                  placeholder="Zip or Postal Code" 
                  value={senderDetails.zip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  placeholder="Country" 
                  value={senderDetails.country}
                  onChange={handleInputChange}
                />
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