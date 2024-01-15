"use client"

import React, { FC } from "react";
import { DEMO_CAR_LISTINGS } from "@/data/listings";
import { CarDataType } from "@/data/types";
import StartRating from "@/components/StartRating";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import SaleOffBadge from "@/components/SaleOffBadge";
import Badge from "@/shared/Badge";
import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "@/shared/ButtonPrimary";
import priceConversion from "@/utils/priceConversion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Route } from "next";
import { VisaDataType } from "@/data/visa/types";
export interface CarCardProps {
  className?: string;
  data?: VisaDataType;
  size?: "default" | "small";
  destination?: string;
  nationality?: string;
}



const CarCard: FC<CarCardProps> = ({
  size = "default",
  className = "",
  data,
  destination,
  nationality
}) => {

  if (data === undefined) {
    return null
  }
  const {
    title,
    href,
    like,
    saleOff,
    isAds,
    price,
    reviewStart,
    reviewCount,
    seats,
    gearshift,
  } = data;


  const { selectedCurrency } = useSelector((state: RootState) => state.initials)

  const renderContent = () => {
    return (
      <div className={size === "default" ? "p-5  space-y-4" : "p-3  space-y-2"}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {isAds && <Badge name="ADS" color="green" />}
            <h2
              className={`  capitalize ${size === "default"
                ? "text-xl font-semibold"
                : "text-base font-medium"
                }`}
            >
              <span className="line-clamp-1">{data?.visaName}</span>
            </h2>
          </div>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-2">
            <span className="">{data?.visaName}</span>
            {/* <span>-</span> */}
            {/* <span className="">{gearshift} </span> */}
          </div>
        </div>
        <div className="w-14  border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">
            {priceConversion(data?.adultPrice, selectedCurrency, true)}
            {` `}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                /Adult
              </span>
            )}
          </span>

          <span className="text-base font-semibold">
            {priceConversion(data?.childPrice, selectedCurrency, true)}
            {` `}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                /Child
              </span>
            )}
          </span>
          {/* <StartRating reviewCount={reviewCount} point={reviewStart} /> */}
        </div>

        <div className="flex flex-col text-left justify-start">
          <span className="text-sm font-semibold">
            Adult Age Limit: 12 to {data?.ageTo}
          </span>
          <span className="text-sm font-semibold">
            Child Age Limit: {data?.ageFrom} to 11.99
          </span>
        </div>

        <div className="w-full">
          <ButtonPrimary className="w-full" href={`/visa/${destination}/apply?nationality=${nationality}&visaType=${data?._id}` as Route}>
            Apply Now
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-CarCard group relative border border-neutral-200 dark:border-neutral-700 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`}
      data-nc-id="CarCard"
    >
      {/* <Link href={"/"} className="flex flex-col"> */}
      {/* {renderSliderGallery()} */}
      {renderContent()}
      {/* </Link> */}
    </div>
  );
};

export default CarCard;
