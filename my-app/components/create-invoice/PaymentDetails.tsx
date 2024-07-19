import * as React from "react"
import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PaymentDetailsProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

export function PaymentDetails({
  setStep
}: PaymentDetailsProps) {
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [chain, setChain] = useState("EDU");
  const [currency, setCurrency] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<InvoiceItem>({ name: "", quantity: 0, price: 0 });
  const [formError, setFormError] = useState("");
  const { toast } = useToast();

  const grandTotal = React.useMemo(() => {
    return invoiceItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  }, [invoiceItems]);

  function validateAndProceed() {
    if (receiverName.trim() === "" || receiverEmail.trim() === "" || receiverAddress.trim() === "" || amount.trim() === "") {
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

  function goBack() {
    setStep(0);
  }

  function addInvoiceItem() {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      setInvoiceItems([...invoiceItems, newItem]);
      setNewItem({ name: "", quantity: 0, price: 0 });
    }
  }

  return (
    <div className="w-[50%]" >
      <Progress value={66} className="my-8" />
      <Card className="">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Please input the payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
           
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="receiverAddress">Sender's EVM Address<span className="text-red-600">*</span></Label>
                <Input 
                  id="receiverAddress" 
                  placeholder="EVM Address" 
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="chain">Chain</Label>
                <Select value={chain} onValueChange={setChain}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EDU">
                      <div className="flex items-center font-semibold">
                        <img src="https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg" alt="EDU Chain" className="w-6 h-6 mr-2" />
                        EDU Chain
                      </div>
                    </SelectItem>
                    {/* Add other chains as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">
                      <div className="flex items-center font-semibold">
                        <img src="./usdc.png" alt="USDC" className="w-6 h-6 mr-2" />
                        USDC
                      </div>
                    </SelectItem>
                    {/* Add other currencies as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount<span className="text-red-600">*</span></Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="Amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Invoice Items</h3>
              <div className="flex space-x-2 mt-2">
                <Input 
                  placeholder="Item name" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
                <Input 
                  type="number" 
                  placeholder="Quantity" 
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                />
                <Input 
                  type="number" 
                  placeholder="Price" 
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                />
                <Button onClick={addInvoiceItem}>Add</Button>
              </div>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.quantity * item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Grand Total</TableCell>
                    <TableCell>{grandTotal.toFixed(2)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </form>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goBack}>Back</Button>
          <Button onClick={validateAndProceed}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}