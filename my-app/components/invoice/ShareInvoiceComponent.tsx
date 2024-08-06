import React from 'react'
import { Button } from '../ui/button'
import { ShareIcon } from 'lucide-react'

const ShareInvoiceComponent = () => {
  return (
    <Button variant="outline" className="w-full">
    <ShareIcon className="mr-2 h-4 w-4" /> Share invoice
  </Button>
  )
}

export default ShareInvoiceComponent