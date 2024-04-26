"use client";
import React, { FC, useEffect, useState } from "react";
import SectionGridFilterCard from "../SectionGridFilterCard";
import SectionHeroArchivePage from "@/app/(server-components)/SectionHeroArchivePage";
import { FiltersType } from "@/data/attraction/types";
import { MagnifyingGlassCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import HeroSearchForm from "@/app/(client-components)/(HeroSearchForm)/HeroSearchForm";

export interface ListingExperiencesPageProps {
  params: { attractions: string };
}

interface responsesType {
  appliedFilters: {
   destination: string;
  }
  destination: {
    name: string;
  }
  attractions: {
    _id: string | null
    totalAttractions: number
    data: []
  }
  skip: number
  limit: number
}

const ListingExperiencesPage: FC<ListingExperiencesPageProps> = ({
  params,
}) => {
  const { attractions } = params;
  const [responses, setResponses] = useState<responsesType>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tab, setTab] = useState("");

  const [filters, setFilters] = useState<FiltersType>({
    skip: 0,
    limit: 12,
    category: [],
    rating: [],
    duration: [],
    priceFrom: 0,
    priceTo: 9000
  });


  const findAttractions = async (destination: string) => {
    try {
      setIsLoading(true)
      const attraction = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/all?limit=${filters?.limit}&skip=${filters?.skip}&destination=${destination}&categories=${JSON.stringify(filters.category)}&ratings=${JSON.stringify(filters.rating)}&durations=${JSON.stringify(filters.duration)}&priceFrom=${JSON.stringify(filters.priceFrom)}&priceTo=${JSON.stringify(filters.priceTo)}`
      );
      return attraction.json();
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    findAttractions(attractions).then(setResponses).then(() => {
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })
  }, [attractions, filters]); 
  
  return (
    <>

      {tab === "search" && (
        <div className="fixed w-full hidden md:block h-full z-50 left-0 top-0 backdrop-blur-xl bg-opacity-30 bg-black">
          <div className="flex container w-full justify-between">
            <div
              onClick={() => setTab("")}
              className="fixed md:top-[24px] z-10 right-0 mr-[80px]  bg-white rounded-full cursor-pointer"
            >
              <XMarkIcon height={40} width={40} />
            </div>
            <div className="backdrop-blur-xl bg-opacity-30 bg-secondary-200 md:mt-[16px]  m-5 md:m-0 md:w-full p-2 text-center min-h-[220px]  py-5 rounded-xl shadow-2xl">      
              <div className="">
              <HeroSearchForm currentPage="Experiences" currentTab="Experiences" />
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="container relative pt-5">
        <div
          className="absolute md:flex items-center border rounded-lg p-1 px-3 gap-3 hidden right-10 cursor-pointer"
          onClick={() => setTab("search")}
        >
          <p>Modify Search</p>
          <MagnifyingGlassIcon height={30} width={30} />
        </div>
        <SectionGridFilterCard
          data={responses ? responses : undefined}
          params={responses?.appliedFilters?.destination || attractions}
          filters={filters}
          setFilters={setFilters}
          isLoading={isLoading}
          className="pb-20 lg:pb-24"
        />
      </div>
    </>
  );
};

export default ListingExperiencesPage;
