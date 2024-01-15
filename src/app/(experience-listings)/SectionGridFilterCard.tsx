import React, { FC, useEffect, useState } from "react";
import { Pagination } from "@/shared/Pagination";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import ExperiencesCard from "@/components/Attraction/ExperiencesCard";
import { FiltersType, SearchByDestination } from "@/data/attraction/types";
import { UUID } from "crypto";
import ComponentLoader from "@/components/loader/ComponentLoader";


interface ResponseData {
  attractions: {
    _id: UUID | string | null
    totalAttractions: number
    data: SearchByDestination[]
  }
  skip: number
  limit: number
}



export interface SectionGridFilterCardProps {
  className?: string;
  data?: ResponseData;
  params?: string
  filters?: FiltersType
  setFilters?: (newFilters: FiltersType) => void;
  isLoading?: boolean
}


const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data,
  params,
  filters,
  setFilters,
  isLoading = true
}) => {
  const [isLoadings, setIsLoadings] = useState<boolean>(true)

  useEffect(() => {
    setIsLoadings(isLoading)
  }, [isLoading])


  return (
    <div className={`nc-SectionGridFilterCard ${className}`}>
      <Heading2
        className="capitalize"
        heading={params && `Experiences in ${params?.replace("%20", " ")}`}
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            {data && data?.attractions && data?.attractions?.totalAttractions + " Attractions"}
          </span>
        }
      />

      <div className="mb-8 lg:mb-11">
        <TabFilters setFilters={setFilters} filters={filters} />
      </div>

      {isLoadings ? (
        <div className="space-y-3">
          <ComponentLoader />
          <ComponentLoader />
          <ComponentLoader />
        </div>
      ) : (
        <>
          {data?.attractions?.data?.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {data && data.attractions?.data.map((attraction: SearchByDestination) => (
                  <ExperiencesCard key={attraction._id} data={attraction} />
                ))}
              </div>
              {data && data.attractions?.totalAttractions && (
                <div className="flex mt-16 justify-center items-center">
                  <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={data && data.attractions?.totalAttractions}
                    incOrDecSkip={(number) => {
                      if (setFilters && filters) { // Check if setFilters is defined
                        setFilters({
                          ...filters,
                          skip: filters.skip + number,
                        }
                        )
                      }
                    }}

                    updateSkip={(skip: number) => {
                      if (setFilters && filters) { // Check if setFilters is defined
                        setFilters({
                          ...filters,
                          skip: Number(skip),
                        });
                      }
                    }}
                  />
                </div>
              )}
            </>
          ) : <>
            <div className="w-full flex justify-start h-full items-center ">
              <p className="font-mono text-lg tracking-wide text-gray-500">Sorry! No attraction found for this query.</p>
            </div>
          </>}
        </>
      )}
    </div>
  );
};

export default SectionGridFilterCard;
