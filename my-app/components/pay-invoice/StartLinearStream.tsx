"use client";
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { sablierLinearV2LockUpAddress, tUSDCAddress } from '@/constants/addresses';
import { abi } from '../../abi/SablierLinear'
import { parseEther, decodeEventLog } from 'viem';
import Spinner from '../helpers/Spinner';
import { useToast } from '../ui/use-toast';
import { getTimeRemainingInSeconds } from '@/utils/sablier/getTimeToStreamInSeconds';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';

type StartLinearStreamProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    amountToStream: string;
    payeeAddress: string;
    dueDate: number;
    requestId: string;
}

const StartLinearStream = ({ setStep, amountToStream, payeeAddress, dueDate, requestId }: StartLinearStreamProps) => {
    const { toast } = useToast();
    const [streamId, setStreamId] = useState<string | null>(null);
    const [isAddingStreamId, setIsAddingStreamId] = useState(false);
    const [addStreamIdError, setAddStreamIdError] = useState<string | null>(null);

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    

    const { address, chainId } = useAccount();



    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } =
        useWaitForTransactionReceipt({
            hash,
        })

    const StartStreaming = useCallback(() => {
         const sablierLinearV2LockUpAddress = contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress
         const tUSDCAddress = contracts[chainId as ValidChainId].tUSDCAddress

        if (chainId && (chainId as ValidChainId) in contracts) {
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
    } else {
        alert("Bad chain")
    }
    }, [writeContract, address, payeeAddress, amountToStream, dueDate]);



    const getStreamIdFromReceipt = useCallback((receipt: any): string => {
        if (!receipt || !receipt.logs) {
            throw new Error("Invalid receipt: no logs found");
        }

        const log = receipt.logs.find(
            (log: any) => log.address.toLowerCase() === sablierLinearV2LockUpAddress.toLowerCase()
        );

        if (!log) {
            throw new Error("No log found for Sablier contract");
        }

        const event = decodeEventLog({
            abi,
            data: log.data,
            topics: log.topics,
        }) as any;

        if (event.eventName !== 'MetadataUpdate') {
            throw new Error(`Unexpected event: ${event.eventName}`);
        }

        const streamId = event?.args?._tokenId.toString();
        if (!streamId) {
            throw new Error("Stream ID not found in event args");
        }

        return streamId;
    }, []);


    const addStreamIdToInvoice = useCallback(async (streamId: string) => {
        setIsAddingStreamId(true);
        setAddStreamIdError(null);

        try {
            const response = await fetch('/api/add-stream-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId,
                    streamId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add stream ID to invoice');
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Unknown error occurred');
            }

            return true;
        } catch (error) {
            console.error('Error adding stream ID to invoice:', error);
            setAddStreamIdError(error instanceof Error ? error.message : 'Unknown error occurred');
            return false;
        } finally {
            setIsAddingStreamId(false);
        }
    }, [requestId]);

    useEffect(() => {
        if (isConfirmed && receipt) {
            const processReceipt = async () => {
                const parsedStreamId = await getStreamIdFromReceipt(receipt);
                if (parsedStreamId) {
                    const success = await addStreamIdToInvoice(parsedStreamId);
                    if (success) {
                        setStreamId(parsedStreamId);
                        toast({
                            title: "Stream Created",
                            description: `Stream created with ID: ${parsedStreamId}`,
                        });
                        setStep(2);
                    } else {
                        toast({
                            title: "Error",
                            description: addStreamIdError || "Failed to add stream ID to invoice",
                            variant: "destructive"
                        });
                    }
                } else {
                    toast({
                        title: "Stream Created",
                        description: "Stream was created, but ID couldn't be retrieved.",
                        variant: "destructive"
                    });
                }
            };

            processReceipt();
        }
    }, [isConfirmed, receipt, getStreamIdFromReceipt, addStreamIdToInvoice, addStreamIdError, toast, setStep]);

    useEffect(() => {
        if (error) {
            toast({
                description: `${error.message}`,
                variant: "destructive"
            })
        }
        console.log(error?.message)
        console.log(contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress)
    }, [error, toast])


   

    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Start Stream</DialogTitle>
            </DialogHeader>
            {isConfirming || isAddingStreamId ? (
                  <div className='flex justify-center'>
                <Spinner className='w-24 h-24' />
                </div>
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
                    disabled={isPending || isConfirming || isAddingStreamId}
                    onClick={StartStreaming}
                >
                    Start Streaming
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default StartLinearStream