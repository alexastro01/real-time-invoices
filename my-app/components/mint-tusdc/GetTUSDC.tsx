"use client";
import * as React from 'react'
import {
    type BaseError,
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { abi } from '../../abi/tUSDC'
import { parseEther } from 'viem'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { tUSDCAddress } from '@/constants/addresses'
import { contracts, ValidChainId } from '@/utils/contracts/contracts';

export function GetTUSDC() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const { address, chainId } = useAccount();

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()


        if (chainId && (chainId as ValidChainId) in contracts) {
            writeContract({
                address: contracts[chainId as ValidChainId].tUSDCAddress,
                abi,
                functionName: 'mint',
                args: [address as string, parseEther('10000')],
                chainId: chainId as ValidChainId
            });
        } else {
            console.error('Invalid or unsupported chain ID');
            // Handle the error case, perhaps show a message to the user
        }

    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <form onSubmit={submit}>
            <p className='text-2xl font-bold'>Get 10000 tUSDC</p>
            <Button
                disabled={isPending}
                type="submit"
                className='w-auto'
            >
                {isPending ? 'Confirming...' : 'Mint'}
            </Button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </form>
    )
}