import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

type GigCreatorPreviewProps = {
  creatorAddress: string
  formatEvmAddress: (address: string) => string
}

type CreatorProfile = {
  name: string
  profile_image: string | null
}

const GigCreatorPreview: React.FC<GigCreatorPreviewProps> = ({ creatorAddress, formatEvmAddress }) => {
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/get-user-view?address=${creatorAddress}`)
        if (!response.ok) {
          throw new Error('Failed to fetch creator profile')
        }
        const data = await response.json()
        setCreatorProfile(data)
      } catch (err) {
        console.error('Error fetching creator profile:', err)
        setError('Failed to load creator profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreatorProfile()
  }, [creatorAddress])

  if (isLoading) {
    return (
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Creator</h3>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Creator</h3>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Creator</h3>
      <div className="flex items-center space-x-4">
        <Avatar>
          {creatorProfile?.profile_image ? (
            <AvatarImage src={creatorProfile.profile_image} alt={creatorProfile.name} />
          ) : (
            <AvatarFallback>{creatorProfile?.name ? creatorProfile.name.charAt(0).toUpperCase() : creatorAddress.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{creatorProfile?.name || 'Unknown Creator'}</p>
          <p className="text-sm text-muted-foreground">{formatEvmAddress(creatorAddress)}</p>
        </div>
      </div>
    </div>
  )
}

export default GigCreatorPreview