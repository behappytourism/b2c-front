import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';
import DestinationCard from './DestinationCard';

function DestinationsSection() {

    const { attractionDestinations } = useSelector(
        (state: RootState) => state.initials
      );
      
  return (
    <div className=''>
      <h2 className='md:text-4xl text-3xl font-bold'>Popular Destinations</h2>
      <p className='text-blue-500 md:text-base text-lg mt-3'>Favorite destinations based on customer reviews</p>

      <div className='flex flex-wrap gap-4 mt-10'>
      {attractionDestinations
  ?.filter((destination) => Number(destination?.attractionCount) > 0)
  .map((destination, index) => (
    <DestinationCard key={index} data={destination} />
  ))}


<div className='md:max-w-[300px] md:min-w-[300px] w-full p-4 border rounded-3xl space-y-3'>
      <h2 className='text-3xl font-bold opacity-60'>Crafting Your Perfect Travel Experience</h2> 

        <a href="/destinations">
      <div className='bg-black mt-5 cursor-pointer text-white rounded-xl py-2 px-4 flex justify-between'>

        <p className='text-xl font-semibold w-8/12'>Browse <br /> All Destinations</p>
        <div className='w-4/12 flex flex-col justify-center items-center text-center'>
        <p className='h-8 w-8 rounded-full bg-white text-black flex flex-col justify-center text-xl'>&#x2192;</p>
        </div>
      </div>
        </a>
    </div>


    </div>

    </div>
  )
}

export default DestinationsSection