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
import ApproveUSDCDialog from './ApproveUSDCDialog';
import StartLinearStream from './StartLinearStream';
import StreamCreatedSuccess from './StreamCreatedSuccess';

type PaymentDialogProps = {
    totalAmount: string;
    requestId: string
}

const PaymentDialog = ({
    totalAmount,
    requestId
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
            {
                step === 0 && <ApproveUSDCDialog setStep={setStep} />
            }

            {
                step === 1 && <StartLinearStream setStep={setStep} />
            }

            {
                step === 2 && <StreamCreatedSuccess requestId={requestId} />
            }
        </Dialog>
    )
}

export default PaymentDialog