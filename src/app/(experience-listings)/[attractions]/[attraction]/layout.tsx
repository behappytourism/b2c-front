"use client";

import BackgroundSection from "@/components/BackgroundSection";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

import { Route } from "next";
import MobileFooterSticky from "../../../(listing-detail)/(components)/MobileFooterSticky";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DetailtLayout = ({ children }: { children: ReactNode }) => {


  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");

  const { attractionDestinations } = useSelector((state: RootState) => state.initials)

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };




  return (
    <div className="ListingDetailPage container mt-10">
      <div className=" ListingDetailPage__content ">{children}</div>

      {/* OTHER SECTION */}
      <div className=" pt-20">
        {/* <div className="relative py-16">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore by popular destinations"
            subHeading="Explore attractions based on types of destinations"
            categoryCardType="card5"
            itemPerRow={5}
            sliderStyle="style2"
            destinations={attractionDestinations}
          />
        </div> */}
        {/* <SectionSubscribe2 className="pt-24 lg:pt-32" /> */}
      </div>
    </div>
  );
};

export default DetailtLayout;
