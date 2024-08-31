"use client";
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { abi } from '../../abi/tUSDC'
import { formatUnits, parseEther } from 'viem';
import Spinner from '../helpers/Spinner';
import { useToast } from '../ui/use-toast';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions';
import PingAnimation from '../helpers/PingAnimation';
import Image from 'next/image';
import { coinAddressToIcon } from '@/utils/contracts/coinAddressToIcon';


type ApproveUSDCDialogProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    amountToApprove: string;
    chain_id: number;
    currency: string;

}


const ApproveUSDCDialog = ({
    setStep,
    amountToApprove,
    chain_id,
    currency
}:
    ApproveUSDCDialogProps
) => {

    const { toast } = useToast();
    const { chainId } = useAccount();
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()


   useEffect(() => {
   console.log('Amount to approve', amountToApprove)
   }, [])

    async function Approve() {
        if (chainId !== chain_id) {
            toast({
                title: `You are on the wrong chain, switch to ${chainInfo[chain_id as ValidChainId].name}`,
                variant: "destructive"
            })
        } else {
            if (chainId && (chainId as ValidChainId) in contracts) {
                writeContract({

                    address: contracts[chainId as ValidChainId].tUSDCAddress,
                    abi,
                    functionName: 'approve',
                    args: [contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress, chainId === 2810 ? formatUnits(parseEther(amountToApprove), 12) :parseEther(amountToApprove) ],
                })
            }
        }
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

    useEffect(() => {
        console.log('---------currency prop ')
   console.log(currency)
    }, [currency])

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Approve USDC <PingAnimation color="green" size="small" /></DialogTitle>
            </DialogHeader>
            {isConfirming ?
                <div className='flex justify-center'>
                    <Spinner className='w-24 h-24' />
                </div> :
                <div className="py-4 flex justify-center">
                    <p className="text-2xl font-semibold">{amountToApprove}</p>
                    <Image src={coinAddressToIcon[contracts[chain_id as ValidChainId].tUSDCAddress]} width={32} height={32} alt={'STABLECOIN LOGO'} className='ml-1'/>
                </div>

            }

            <DialogFooter>
                <Button className="w-full" disabled={isPending || isConfirming} onClick={() => Approve()}>Approve</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default ApproveUSDCDialog