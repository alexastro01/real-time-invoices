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
import { useAccount, useTransactionReceipt, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { sablierLinearV2LockUpAddress, tUSDCAddress } from '@/constants/addresses';
import { abi } from '../../abi/SablierLinear'
import { parseEther } from 'viem';
import Spinner from '../helpers/Spinner';
import { useToast } from '../ui/use-toast';


type StartLinearStreamProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;

}


const StartLinearStream = ({
    setStep
}:
StartLinearStreamProps
) => {

    const { toast } = useToast();

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()
 

    const {address} = useAccount();


    async function StartStreaming() {
        writeContract({
            address: sablierLinearV2LockUpAddress,
            abi,
            functionName: 'createWithDurations',
            args: [
                [
                    //SENDER
                    address,
                    //RECIPIENT
                    '0x308a6b3375E708b2d254974FFBd36e3a4193b55c',
                    //TOTAL AMOUNT
                    parseEther('10'),
                    //asset address
                    tUSDCAddress,
                    //cancelable
                    true,
                    //transferable
                    false,
                    //DURATIONS TUPLE
                    [
                     //CLIFF
                     parseEther('0'),
                     //TOTAL TIME IN SECONDS
                     3600
                    ],
                    //BROKER TUPLE
                    [
                    //Address
                     '0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f',
                     //fee
                     0
                    ]
                ]
            ],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed, data: confirmedData } =
        useWaitForTransactionReceipt({
            hash,
        })



    useEffect(() => {
        if (isConfirmed) {
          console.log(confirmedData)
            setStep(2)
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
                <DialogTitle>Start Stream</DialogTitle>
            </DialogHeader>
            {isConfirming ?
                <Spinner className='w-24 h-24' /> :
                <div className="py-4 text-center">
                    <p className="text-lg font-semibold">Stream stream of .amount. to .address.</p>
                </div>

            }

            <DialogFooter>
                <Button className="w-full" disabled={isPending} onClick={() => StartStreaming()}>Start Streaming</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default StartLinearStream