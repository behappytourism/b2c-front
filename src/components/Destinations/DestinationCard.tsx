import Image from 'next/image'
import React, { FC } from 'react'

interface DestinationProps {
    data: {
        name?: string;
        slug?: string;
        image: string;
        attractionCount?: string;
    }
}


const DestinationCard: FC<DestinationProps> = ({ data }) =>  {    
  return (
    <a href={`/${data?.slug}`}>
    <div className='md:max-w-[300px] md:min-w-[300px] p-4 border rounded-3xl space-y-3'>

        <div className='rounded-2xl overflow-hidden'>
            <Image className='max-h-[130px] hover:scale-125 transition-all duration-300' height={1000} width={1000} src={process.env.NEXT_PUBLIC_CDN_URL + data?.image} alt="destination image" />
        </div>

        <div>
            <h2 className='font-semibold text-xl md:text-lg capitalize'>{data?.name}</h2>
            <p className='font-semibold md:text-lg text-base opacity-60'>{data?.attractionCount} Tours</p>
        </div>


    </div>
    </a>
  )
}

export default DestinationCard