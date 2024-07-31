import React from 'react'
import Invoice from '../invoice/Invoice'
import DisplayInvoice from './DisplayInvoice'

type PayInvoiceParentType = {
    requestId: string
}

const PayInvoiceParent = ({
    requestId
}: PayInvoiceParentType) => {
  return (
    <div>
            <DisplayInvoice requestId={requestId as string} />
         
    </div>
  )
}

export default PayInvoiceParent