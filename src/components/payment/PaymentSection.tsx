import Image from 'next/image'
import React from 'react'
import paymentImage from "../../../public/paymentsection.jpeg"
import mastercardIcon from "../../../public/mastercard.png"
import visaIcon from "../../../public/visa.png"


function PaymentSection() {
  return (
    <div className='w-full flex md:flex-row flex-col md:gap-20 gap-10 container'>
        <div className='md:block hidden'>
        <Image className='md:max-h-[400px] md:max-w-[300px] rounded-2xl' height={1000} width={1000} src={paymentImage} alt='payment-cover' />
        </div>

        <div className='mt-10 md:mt-0'>
            <div className='xl:space-y-7 space-y-8'>
                <div className='bg-gray-100 w-fit px-4 py-3 rounded-3xl'>
                    <p className='font-semibold'>Easy & Secure payment</p>
                </div>

                <div>
                    <h2 className='font-extrabold text-4xl md:text-6xl'>Discover Dream <br /> Destinations with Ease</h2>
                </div>

                <div>
                    <p className='md:text-xl text-lg font-semibold opacity-60'>Book with confidence using our easy and secure payment options, powered by trusted payment providers for a hassle-free and smooth experience.</p>
                </div>

                <div className='flex gap-4 items-center text-center'>
                    <div className='border-2 border-gray-100 rounded-xl px-3'>
                <Image className='h-16 w-20' height={1000} width={1000} src={mastercardIcon} alt='mastercard icon' />
                    </div>

                    <div className='border-2 border-gray-100 rounded-xl px-3'>
                <Image className='h-16 w-20' height={1000} width={1000} src={visaIcon} alt='visa icon' />
                </div>
                </div>
            </div>
        </div>

        <div className='md:hidden'>
        <Image className='md:max-h-[400px] md:max-w-[300px] rounded-2xl' height={1000} width={1000} src={paymentImage} alt='payment-cover' />
        </div>
    </div>
  )
}

export default PaymentSection