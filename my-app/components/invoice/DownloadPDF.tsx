import React from 'react'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

const DownloadPDF = () => {
  return (
    <Button variant="outline" className="w-full">
    <Download className="mr-2 h-4 w-4" /> Download PDF
  </Button>
  )
}

export default DownloadPDF