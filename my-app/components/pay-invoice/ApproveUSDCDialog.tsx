"use client";
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { sablierLinearV2LockUpAddress, tUSDCAddress } from '@/constants/addresses';
import { abi } from '../../abi/tUSDC'
import { parseEther } from 'viem';
import Spinner from '../helpers/Spinner';
import { useToast } from '../ui/use-toast';


type ApproveUSDCDialogProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;

}


const ApproveUSDCDialog = ({
    setStep
}:
    ApproveUSDCDialogProps
) => {

    const { toast } = useToast();

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()



    async function Approve() {
        writeContract({
            address: tUSDCAddress,
            abi,
            functionName: 'approve',
            args: [sablierLinearV2LockUpAddress, parseEther('10000')],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })



    useEffect(() => {
        if (isConfirmed) {
            setStep(1)
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (error) {
            toast({
                description: `${error.message}`,
                variant: "destructive"
            })
        }
    }, [error])

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Approve USDC</DialogTitle>
            </DialogHeader>
            {isConfirming ?
                <Spinner className='w-24 h-24' /> :
                <div className="py-4 text-center">
                    <p className="text-lg font-semibold">Approve 100 USDC</p>
                </div>

            }

            <DialogFooter>
                <Button className="w-full" disabled={isPending} onClick={() => Approve()}>Approve</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default ApproveUSDCDialog