import React from 'react'
import { NeonGradientCard } from '../../../components/magicui/neon-gradient-card'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'
import { DialogContent, DialogHeader } from '../../../components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'


type GigPaymentSuccessProps = {
  requestId: string
}

const StreamCreatedSuccess = ({
  requestId
}:
GigPaymentSuccessProps
) => {
  return (
<div className='flex justify-center'>
    <NeonGradientCard className="max-w-sm items-center justify-center text-center flex">
      <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#67bd6e] from-35% to-[#59ec91] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_2px_4px_rgba(111,211,161,0.4)]">
        Gig Started
      </span>

      <div className="flex justify-center mt-6 z-10">
        <Link href={`/gig-status/${requestId}`}>
          <Button size={"lg"}>Go to Status</Button>
        </Link>
      </div>
    </NeonGradientCard>
    </div>
  )
}

export default StreamCreatedSuccess