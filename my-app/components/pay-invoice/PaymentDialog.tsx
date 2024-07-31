"use client";

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ShimmerButton from '../magicui/shimmer-button'

type PaymentDialogProps = {
    totalAmount: string;
}

const PaymentDialog = ({
    totalAmount
}: PaymentDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

    //approve usdc
    //set step on confirmation
    //different component for approval
    //step 0 = approve
    //step 1 = create stream, with desired parameters ( different component )


    return (
        <Dialog>
            <DialogTrigger asChild>
                <ShimmerButton>
                    {loading ? "Loading..." : "Pay invoice"}
                </ShimmerButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve USDC</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-center">
                    <p className="text-lg font-semibold">Approve 100 USDC</p>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full">Approve</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentDialog