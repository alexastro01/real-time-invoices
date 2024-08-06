import React from 'react'
import { Button } from '../ui/button'
import { XCircle } from 'lucide-react'

const CancelStream = () => {
  return (
    <Button variant="destructive" className="w-full">
    <XCircle className="mr-2 h-4 w-4" /> Cancel Invoice
  </Button>
  )
}

export default CancelStream