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

export function GetTUSDC() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const { address } = useAccount();

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        writeContract({
            address: tUSDCAddress,
            abi,
            functionName: 'mint',
            args: [address as string, parseEther('10000')],
        })
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