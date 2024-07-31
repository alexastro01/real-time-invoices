import { GetTUSDC } from '@/components/mint-tusdc/GetTUSDC'
import Navbar from '@/components/Navbar'
import React from 'react'

const Page = () => {


  return (
    <div>
     <Navbar />
     <div className='flex justify-center mt-12'>
     <GetTUSDC />
     </div>
    </div>
  )
}

export default Page