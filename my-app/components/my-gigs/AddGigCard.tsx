import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

const AddGigCard: React.FC = () => {
  return (
    <Link href="/create-gig" passHref>
  
        <Card className="flex flex-col hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-48">
            <Plus className="h-12 w-12 text-gray-500" />
            <CardTitle className="mt-2 text-lg text-muted">New Gig</CardTitle>
          </CardContent>
          <CardFooter>
          <Button variant={'ghost'} className='w-full'>Create Gig</Button>
        </CardFooter>
        </Card>
     
 
    </Link>
  )
}

export default AddGigCard