"use client";

import DestinationCard from '@/components/Destinations/DestinationCard';
import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

function DestinationsPage() {

    const { attractionDestinations } = useSelector(
        (state: RootState) => state.initials
      );
      
  return (
    <div className='container'>
      <h2 className='md:text-5xl text-3xl font-extrabold'>Popular Destinations</h2>
      <p className='font-semibold md:text-xl text-lg mt-3'>Favorite destinations based on customer reviews</p>

      <div className='grid md:grid-cols-4 gap-4 mt-10'>
      {attractionDestinations
  ?.filter((destination) => Number(destination?.attractionCount) > 0)
  .map((destination, index) => (
    <DestinationCard key={index} data={destination} />
  ))}

    </div>

    </div>
  )
}

export default DestinationsPage