import React from 'react'
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import InvoiceContent from './InvoiceContent'
import { IInvoiceData } from '@/types/interfaces'

interface InvoiceContentProps {
    invoiceData: IInvoiceData;
}

const ViewInvoiceDialog = ({ invoiceData }: InvoiceContentProps) => {



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-[100%]'>View Invoice</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">

                <InvoiceContent invoiceData={invoiceData} />
            </DialogContent>
        </Dialog>)
}

export default ViewInvoiceDialog