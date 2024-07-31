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
import { abi } from '../../abi/SablierLinear'
import { parseEther, decodeEventLog } from 'viem';
import Spinner from '../helpers/Spinner';
import { useToast } from '../ui/use-toast';
import { getTimeRemainingInSeconds } from '@/utils/sablier/getTimeToStreamInSeconds';

type StartLinearStreamProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    amountToStream: string;
    payeeAddress: string;
    dueDate: number;
}

const StartLinearStream = ({ setStep, amountToStream, payeeAddress, dueDate }: StartLinearStreamProps) => {
    const { toast } = useToast();
    const [streamId, setStreamId] = useState<string | null>(null);

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const { address } = useAccount();

    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } =
        useWaitForTransactionReceipt({
            hash,
        })

    async function StartStreaming() {
        writeContract({
            address: sablierLinearV2LockUpAddress,
            abi,
            functionName: 'createWithDurations',
            args: [
                [
                    address,
                    payeeAddress,
                    parseEther(amountToStream),
                    tUSDCAddress,
                    true,
                    false,
                    [parseEther('0'), getTimeRemainingInSeconds(dueDate)],
                    ['0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f', 0]
                ]
            ],
        })
    }

    const getStreamIdFromReceipt = (receipt: any) => {
        if (!receipt) return null;
        
        const log = receipt.logs.find(
            (log: any) => log.address.toLowerCase() === sablierLinearV2LockUpAddress.toLowerCase()
        );
    
        if (!log) return null;
      
        try {
            const event = decodeEventLog({
                abi,
                data: log.data,
                topics: log.topics,
            }) as any;
    
            if (event.eventName === 'MetadataUpdate') {
                return event?.args?._tokenId.toString()
            }
        } catch (error) {
            console.error('Failed to decode event log:', error)
        }
    
        return null
    }

    useEffect(() => {
        if (isConfirmed && receipt) {
            const parsedStreamId = getStreamIdFromReceipt(receipt);
            if (parsedStreamId) {
                setStreamId(parsedStreamId);
                toast({
                    title: "Stream Created",
                    description: `Stream created with ID: ${parsedStreamId}`,
                })
                setStep(2)
            } else {
                toast({
                    title: "Stream Created",
                    description: "Stream was created, but ID couldn't be retrieved.",
                    variant: "destructive"
                })
            }
        }
    }, [isConfirmed, receipt]);

    useEffect(() => {
        if (error) {
            toast({
                description: `${error.message}`,
                variant: "destructive"
            })
        }
    }, [error])

    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Start Stream</DialogTitle>
            </DialogHeader>
            {isConfirming ? (
                <Spinner className='w-24 h-24' />
            ) : streamId ? (
                <div className="py-4 text-center">
                    <p className="text-lg font-semibold">Stream created with ID: {streamId}</p>
                </div>
            ) : (
                <div className="py-4 text-center">
                    <p className="text-lg font-semibold">Stream {amountToStream} USDC to {payeeAddress}</p>
                </div>
            )}
            <DialogFooter>
                <Button 
                    className="w-full" 
                    disabled={isPending || isConfirming} 
                    onClick={() => StartStreaming()}
                >
                    Start Streaming
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default StartLinearStream