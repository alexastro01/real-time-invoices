import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { XCircle, Loader2 } from 'lucide-react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { contracts, ValidChainId } from '@/utils/contracts/contracts'
import { abi } from '../../abi/SablierLinear'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

type CancelStreamProps = {
  streamId: number,
  chain_id: number,
  wasCanceled?: boolean
}

const CancelStream = ({
  streamId,
  chain_id,
  wasCanceled
}: CancelStreamProps) => {
  const router = useRouter()
  const { toast } = useToast();
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

  function cancelStream() {
    const sablierLinearV2LockUpAddress = contracts[chainId as ValidChainId]?.sablierLinearV2LockUpAddress

    writeContract({
      address: sablierLinearV2LockUpAddress,
      abi,
      functionName: 'cancel',
      args: [
        streamId
      ],
      chainId: chain_id
    })
  }

  useEffect(() => {
    if (error) {
      console.error('Contract write error');
      toast({
        title: "Error",
        description: `${error.message}`,
        variant: "destructive"
      })
    }
  }, [error, toast])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: `Stream canceled : ${streamId}`,

        variant: "default"
      })
      router.push('/dashboard')
    }

  }, [isConfirmed])

  return (
    <Button
      variant="destructive"
      className="w-full"
      onClick={cancelStream}
      disabled={isPending || isConfirming || wasCanceled}
    >
      {isConfirming ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
        </>
      ) : (
        <>
          <XCircle className="mr-2 h-4 w-4" /> Cancel Stream
        </>
      )}
    </Button>
  )
}

export default CancelStream