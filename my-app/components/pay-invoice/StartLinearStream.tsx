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
import { chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions';

type StartLinearStreamProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    amountToStream: string;
    payeeAddress: string;
    dueDate: number;
    requestId: string;
    chain_id: number;
    payerAddress: string;
}

const StartLinearStream = ({ setStep, amountToStream, payeeAddress, dueDate, requestId, chain_id, payerAddress }: StartLinearStreamProps) => {
    const { toast } = useToast();
    const [streamId, setStreamId] = useState<string | null>(null);
    const [isAddingStreamId, setIsAddingStreamId] = useState(false);
    const [addStreamIdError, setAddStreamIdError] = useState<string | null>(null);
    const [isWaitingForStreamId, setIsWaitingForStreamId] = useState(false);

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
        const sablierLinearV2LockUpAddress = contracts[chain_id as ValidChainId]?.sablierLinearV2LockUpAddress
        const tUSDCAddress = contracts[chain_id as ValidChainId]?.tUSDCAddress

      
        if (chainId === chain_id) {
             if(address === payerAddress) {
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
                chainId:chain_id
            })
            } else {
                toast({
                    title: `You are not the payer of this invoice`,
                    variant: "destructive"
                })
            }
        } else {
            toast({
                title: `You are on the wrong chain, switch to ${chainInfo[chain_id as ValidChainId].name}`,
                variant: "destructive"
            })
        }
    }, [writeContract, address, payeeAddress, amountToStream, dueDate, chainId, toast]);

    const getStreamIdAndAddToInvoice = useCallback(async (transactionHash: string) => {
        setIsWaitingForStreamId(true);
        try {
            console.log('Preparing to call API...');
            console.log('Transaction Hash:', transactionHash);
            console.log('Chain ID:', chainId);
            console.log('Request ID:', requestId);

            const apiUrl = '/api/get-stream-id';
            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionHash,
                    chainId: chainId?.toString(),
                    requestId,
                }),
            });

            console.log('API response status:', response.status);
            const responseText = await response.text();
            console.log('API response text:', responseText);

            if (!response.ok) {
                throw new Error(`Failed to get stream ID and add to invoice: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                throw new Error('Invalid JSON response from API');
            }

            console.log('Parsed API response:', data);
            return data.streamId;
        } catch (error) {
            console.error('Error in getStreamIdAndAddToInvoice:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to get stream ID and add to invoice",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsWaitingForStreamId(false);
        }
    }, [chainId, requestId, toast]);

    useEffect(() => {
        if (isConfirmed && hash) {
            console.log('Transaction confirmed. Hash:', hash);
            const processTransaction = async () => {
                const streamId = await getStreamIdAndAddToInvoice(hash);
                if (streamId) {
                    setStreamId(streamId);
                    toast({
                        title: "Stream Created",
                        description: `Stream created with ID: ${streamId} and added to invoice`,
                    });
                    setStep(2);
                } else {
                    console.error('Failed to get stream ID');
                    toast({
                        title: "Error",
                        description: "Failed to get stream ID",
                        variant: "destructive"
                    });
                }
            };

            processTransaction();
        }
    }, [isConfirmed, hash, getStreamIdAndAddToInvoice, setStep, toast]);

    useEffect(() => {
        if (error) {
            console.error('Contract write error:', error);
            toast({
                title: "Error",
                description: `${error.message}`,
                variant: "destructive"
            })
        }
    }, [error, toast])

    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Start Stream</DialogTitle>
            </DialogHeader>
            {isConfirming || isWaitingForStreamId ? (
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
                    disabled={isPending || isConfirming || isWaitingForStreamId}
                    onClick={StartStreaming}
                >
                    Start Streaming
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default StartLinearStream