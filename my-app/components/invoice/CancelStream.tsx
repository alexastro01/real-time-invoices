// CancelStream.tsx
import React, { useCallback, useEffect } from 'react'
import { Button } from '../ui/button'
import { XCircle, Loader2 } from 'lucide-react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { contracts, ValidChainId } from '@/utils/contracts/contracts'
import { abi } from '../../abi/SablierLinear'
import { useToast } from '../ui/use-toast'
import { chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions'

type CancelStreamProps = {
  streamId: number,
  chain_id: ValidChainId,
  wasCanceled: boolean,
  onCancelSuccess: () => void
}

const CancelStream: React.FC<CancelStreamProps> = ({
  streamId,
  chain_id,
  wasCanceled,
  onCancelSuccess
}) => {
  const { toast } = useToast();
  const { chainId } = useAccount();

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const cancelStream = useCallback(() => {
    const sablierLinearV2LockUpAddress = contracts[chain_id]?.sablierLinearV2LockUpAddress
    if (chainId !== chain_id) {
      toast({
        title: `You are on the wrong chain, switch to ${chainInfo[chain_id].name}`,
        variant: "destructive"
      })
    } else {
      writeContract({
        address: sablierLinearV2LockUpAddress,
        abi,
        functionName: 'cancel',
        args: [BigInt(streamId)],
        chainId: chain_id
      })
    }
  }, [chainId, chain_id, streamId, toast, writeContract])

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
      onCancelSuccess()
    }
  }, [isConfirmed, streamId, toast, onCancelSuccess])

  if (wasCanceled) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      className="w-full"
      onClick={cancelStream}
      disabled={isPending || isConfirming}
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

export default React.memo(CancelStream)