import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

const NotConnected = () => {
  return (
    <div className=' grid  justify-items-center justify-center space-y-2 mt-8 '>
    <p className=' text-gray-800 font-semibold text-xl'>Please connect your wallet to continue</p>
<ConnectButton />
</div>
  )
}

export default NotConnected