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
    requestId: string;
    payeeAddress: string;
    dueDate: any;
    chain_id: number;
    payerAddress:string;
}

const PaymentDialog = ({
    totalAmount,
    requestId,
    payeeAddress,
    dueDate,
    chain_id,
    payerAddress
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
                step === 0 && <ApproveUSDCDialog setStep={setStep} amountToApprove={totalAmount} chain_id={chain_id} />
            }

            {
                step === 1 && <StartLinearStream setStep={setStep} amountToStream={totalAmount} payeeAddress={payeeAddress} dueDate={dueDate} requestId={requestId} chain_id={chain_id} payerAddress={payerAddress} />
            }

            {
                step === 2 && <StreamCreatedSuccess requestId={requestId} />
            }
        </Dialog>
    )
}

export default PaymentDialog