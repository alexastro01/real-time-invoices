import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type GigCreatorPreviewProps = {
  creatorAddress: string
  formatEvmAddress: (address: string) => string
}

const GigCreatorPreview: React.FC<GigCreatorPreviewProps> = ({ creatorAddress, formatEvmAddress }) => {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Creator</h3>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{creatorAddress.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">{formatEvmAddress(creatorAddress)}</p>
        </div>
      </div>
    </div>
  )
}

export default GigCreatorPreview