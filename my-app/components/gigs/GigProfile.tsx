import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'
import { Button } from '../ui/button'
import { Share2Icon } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

const GigProfile = ({
    creator,
    editMode,
}: {
    creator: string;
    editMode: boolean;
}) => {
  const [name, setName] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/get-user-view?address=${creator}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setName(data.name)
        setProfileImage(data.profile_image || null)
      } catch (err) {
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [creator])

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/gigs/${creator}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied successfully",
        description: "The profile link has been copied to your clipboard.",
      })
    }).catch((err) => {
      console.error('Failed to copy: ', err)
      toast({
        title: "Failed to copy link",
        description: "An error occurred while copying the link.",
        variant: "destructive",
      })
    })
  }

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={name || ''} />
              ) : (
                <AvatarFallback>{name ? name.slice(0, 2).toUpperCase() : 'NA'}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{name || 'No Name'}</h2>
              <p className="text-sm text-muted-foreground break-all">{creator}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {editMode && (
              <Link href="/profile">
                <Button variant="outline">
                  Edit profile
                </Button>
              </Link>
            )}
            <Button variant="outline" onClick={handleShare}>
              <Share2Icon className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GigProfile