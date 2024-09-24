import React, { FC, useState, useEffect } from "react";
import { DEMO_EXPERIENCES_LISTINGS } from "@/data/listings";
import { ExperiencesDataType, StayDataType } from "@/data/types";
import TabFilters from "./TabFilters";
import ExperiencesCard from "@/components/Attraction/ExperiencesCard";
import HeaderFilter from "../HeaderFilter";
import { UUID } from "crypto";
import { SearchByDestination } from "@/data/attraction/types";

interface ResponseData {
  attractions: {
    _id: UUID | string | null;
    totalAttractions: number;
    data: SearchByDestination[];
  };
  skip: number;
  limit: number;
}

export interface SectionGridFilterCardProps {
  className?: string;
  data?: ResponseData;
  heading?: React.ReactNode;
  subHeading?: React.ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  setDest?: (dest: string) => void;
}

const SectionGridFilterAttractionCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data,
  heading = "Attractions",
  subHeading = "Popular places to visit that BeHappy recommends for you",
  headingIsCenter,
  tabs = ["all"],
  setDest,
}) => {
  const [visibleData, setVisibleData] = useState(4); // State to track how many items to display

  const handleOnclickTab = (item: string) => {
    if (setDest) {
      setDest(item);
    }
  };

  const handleScroll = () => {
    // Check if the user has scrolled to the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      // Load more data by increasing the visibleData count
      setVisibleData((prevVisibleData) => prevVisibleData + 4);
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight + 500) {
      // Load more data by increasing the visibleData count
      setVisibleData((prevVisibleData) => prevVisibleData - 4);
    }
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  

  return (
    <div className={`nc-SectionGridFilterCard ${className}`}>
      <HeaderFilter
        tabActive={"all"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
        onClickTab={handleOnclickTab}
      />

      <div className="grid grid-cols-1 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data?.attractions?.data.slice(0, visibleData).map((excursion, indx) => (
          <ExperiencesCard key={excursion._id} data={excursion} />
        ))}
      </div>
    </div>
  );
};

export default SectionGridFilterAttractionCard;
