"use client";

import React, { useState } from 'react'
import { ReceiverDetails } from './ReceiverDetails'
import { PaymentDetails } from './PaymentDetails';

const CreateInvoiceComponent = () => {
   
    const [step, setStep] = useState(0);

  return (
    <div className='flex justify-center mt-8'>
        {step === 0 &&   <ReceiverDetails setStep={setStep} /> }
        {step === 1 && <PaymentDetails setStep={setStep} />}
    </div>
  )
}

export default CreateInvoiceComponent