import React, { FC, ReactNode } from "react";
import { DEMO_EXPERIENCES_LISTINGS } from "@/data/listings";
import { ExperiencesDataType, StayDataType } from "@/data/types";
import { Pagination } from "@/shared/Pagination";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import ExperiencesCard from "@/components/Attraction/ExperiencesCard";
import HeaderFilter from "../HeaderFilter";
import { UUID } from "crypto";
import { SearchByDestination } from "@/data/attraction/types";

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
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  setDest?: (dest: string) => void
}


const SectionGridFilterAttractionCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data,
  heading = "Attractions",
  subHeading = "Popular places to visit that BeHappy recommends for you",
  headingIsCenter,
  tabs = ["dubai"],
  setDest
}) => {

  const handleOnclickTab = (item: string) => {
    if (setDest) {
      setDest(item)
    }
  }
  return (
    <div className={`nc-SectionGridFilterCard ${className}`}>
      {/* <Heading2
        heading="Experiences in Tokyo"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            233 experiences
            <span className="mx-2">·</span>
            Aug 12 - 18
            <span className="mx-2">·</span>2 Guests
          </span>
        }
      /> */}
      <HeaderFilter
        tabActive={"dubai"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
        onClickTab={handleOnclickTab}
      />

      {/* <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div> */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data?.attractions?.data.map((excursion, indx) => (
          <ExperiencesCard key={excursion._id} data={excursion} />
        ))}
      </div>
      {/* <div className="flex mt-16 justify-center items-center">
        <Pagination />
      </div> */}
    </div>
  );
};

export default SectionGridFilterAttractionCard;
