import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'


const GigPaymentDialog = ({
    
}) => {

    function handlePayment() {
        console.log("Payment Confirmed")
    }

  return (
    <Button className="w-full" onClick={handlePayment}>
    <Image src="/logo_cropped.png" alt="Streambill" width={30} height={30} className="w-6 h-6 mr-2" /> Pay with Streambill
   </Button>
  )
}

export default GigPaymentDialog