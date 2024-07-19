"use client";

import React, { useState } from 'react'
import { SenderDetails } from './SenderDetails'
import { PaymentDetails } from './PaymentDetails';
import { StreamTypeSelector } from './StreamTypeSelector';

const CreateInvoiceComponent = () => {
   
    const [step, setStep] = useState(0);

  return (
    <div className='flex justify-center mt-8'>
        {step === 0 &&   <SenderDetails setStep={setStep} /> }
        {step === 1 && <PaymentDetails setStep={setStep} />}
        {step === 2 && <StreamTypeSelector setStep={setStep} />}
    </div>
  )
}

export default CreateInvoiceComponent