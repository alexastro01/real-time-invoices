"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EditProfileDialog from './EditProfileDialog'

const GigProfile = ({
    creator,
    editMode,
}: {
    creator: string;
    editMode: boolean;
}) => {
  const [name, setName] = useState("Tester")
  const [image, setImage] = useState<string | null>(null)

  const handleSave = (newName: string, newImage: string | null) => {
    setName(newName)
    setImage(newImage)
    // You can add additional logic here, such as API calls to save the changes
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24">
              {image ? (
                <AvatarImage src={image} alt={name} />
              ) : (
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground break-all">{creator}</p>
            </div>
          </div>
          {editMode && (
            <EditProfileDialog
              currentName={name}
              currentImage={image}
              onSave={handleSave}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default GigProfile