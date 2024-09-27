"use client";

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

import StartLinearStreamWithCliff from './StartLinearStreamWithCliff';
import ApproveUSDCGig from './ApproveUSDCGig';
import GigPaymentSuccess from './GigPaymentSuccess';

type PaymentDialogProps = {
    totalAmount: string;
    requestId: string;
    payeeAddress: string;
    dueDate: any;
    chain_id: number;
    payerAddress: string;
    payerName: string;
    payeeName: string;
    receiverEmail: string;
    link: string
    durationInDays: number;
}

const PayParentGig = ({
    totalAmount,
    requestId,
    payeeAddress,
    dueDate,
    chain_id,
    payerAddress,
    payerName,
    payeeName,
    receiverEmail,
    link,
    durationInDays
}: PaymentDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const { toast } = useToast();
    //approve usdc
    //set step on confirmation
    //different component for approval
    //step 0 = approve
    //step 1 = create stream, with desired parameters ( different component )


    useEffect(() => {
        if (step === 2) {
            sendStreamCreatedEmail();
        }
    }, [step]);

    const sendStreamCreatedEmail = async () => {
        try {
            const response = await fetch('/api/send-stream-started-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payerName,
                    payeeName,
                    totalAmount,
                    dueDate,
                    receiverEmail,
                    link
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send stream created email');
            }

            console.log('Stream created email sent successfully');
        } catch (error) {
            console.error('Error sending stream created email:', error);
            toast({
                title: 'Error sending email, other processes successful',
                variant: 'default'
            })

        }
    };

    const isPastDue = dueDate ? new Date(dueDate) < new Date() : false


    return ( 
<>
            {
                step === 0 && <ApproveUSDCGig setStep={setStep} amountToApprove={totalAmount} chain_id={chain_id} />
            }

            {
                step === 1 && <StartLinearStreamWithCliff setStep={setStep} amountToStream={totalAmount} payeeAddress={payeeAddress} dueDate={dueDate} requestId={requestId} chain_id={chain_id} payerAddress={payerAddress} durationInDays={durationInDays} />
            }

            {
                step === 2 && <GigPaymentSuccess requestId={requestId} />
            }
        </>
    )
}

export default PayParentGig