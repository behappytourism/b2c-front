"use client"

import SectionHeroArchivePage from "@/app/(server-components)/SectionHeroArchivePage";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import React, { FC } from "react";
import SectionGridFilterCard from "../SectionGridFilterCard";
import SectionHero from "@/app/(server-components)/SectionHero";

export interface ListingFlightsPageProps { }

const ListingFlightsPage: FC<ListingFlightsPageProps> = ({ }) => {
  return (
    <div className={`nc-ListingFlightsPage relative overflow-hidden `}>
      <BgGlassmorphism />

      <div className=" relative">
        {/* SECTION HERO */}
        <SectionHero
          currentPage="Flights"
          currentTab="Flights"

          className="hidden lg:block pt-10 pb-24 lg:pb-28 lg:pt-16 bg-primary-6000 "
        />
        <div className="container">
          {/* SECTION */}
          <SectionGridFilterCard className="pt-10 lg:pt-24 pb-24 lg:pb-28" />

          {/* SECTION 1 */}
          {/* <SectionSliderNewCategories
            heading="Explore top destination ✈"
            subHeading="Explore thousands of destinations around the world"
            categoryCardType="card4"
            itemPerRow={4}
          /> */}

          {/* SECTION */}
          {/* <SectionSubscribe2 className="py-24 lg:py-28" /> */}
        </div>
      </div>
    </div>
  );
};

export default ListingFlightsPage;
