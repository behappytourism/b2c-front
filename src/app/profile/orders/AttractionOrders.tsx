"use client"

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SkeletonLoader from "./SkeletonLoader";
import priceConversion from "@/utils/priceConversion";
import GallerySlider from "@/components/GallerySlider";
import { Route } from "next";
import Link from "next/link";

export interface AttractionOrdersPageProps { }

interface OrderList {
  result: any
}

const AttractionOrders = () => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const [orderlist, setOrderList] = useState<OrderList>();
  const [loader, setLoader] = useState(false);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );


  const attractionsOrders = async () => {
    setLoader(true);
    try {
      const visaDetails = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/all?limit=50`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return visaDetails.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getAttractionsOrders() {
    try {
      const response = await attractionsOrders();
      setOrderList(response);
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      jwtToken && (
        getAttractionsOrders()
      )
    }
  }, [])
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Attraction Orders</h2>
      {!orderlist?.result?.data && loader === false && (
        <div>
          <h2>You haven't placed any orders yet.</h2>
        </div>
      )}
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {orderlist?.result?.data?.length > 0 && (
        <div className="flex flex-col md:flex-col gap-4 md:gap-0">
          {orderlist?.result?.data?.map((attraction: any, index: number) => (
            <Link href={`/order/${attraction?._id}`}>
            <div key={index} className="nc-PropertyCardH group md:flex relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700 rounded-3xl overflow-x-auto mt-4">
      
               <div className="flex-shrink-0 p-3 w-full sm:w-64 ">
                <GallerySlider
                    ratioClass="aspect-w-1 h-40 sm:h-56 md:h-40"
                    galleryImgs={attraction?.attraction?.images ? attraction?.attraction?.images : []}
                    className="w-full h-full rounded-2xl overflow-hidden"
                    uniqueID={`PropertyCardH_${attraction?.attraction?._id}`}
                    href={attraction?.attraction && `/${attraction?.attraction?.destination?.name}/${attraction?.attraction?.slug}` as Route}
                />
                {/* {data?.isPromoCode ? <SaleOffBadge desc={"Promotion available"} className="absolute left-5 top-5 !bg-orange-500" /> : ""} */}
            </div>
              <div className="pt-7 w-full px-3">
              <div className="md:flex md:justify-between mb-2">
                <div className="flex gap-4">
                  <p>Ref No:</p>
                  <p>{attraction?.referenceNumber}</p>
                </div>
                <p className="md:mt-0 mt-4">{new Date(attraction?.createdAt).toDateString()}</p>
              </div>
             


              <div className="flex justify-between mb-3">
                <div className="flex gap-4">
                  <p>Name:</p>
                  <p>{attraction?.attraction?.title?.toUpperCase()} </p>
                </div>

                {/* <div className="flex gap-4">
            <p>DOB:</p>
            <p>{attraction?.travellers?.dateOfBirth?.day}/{attraction?.travellers?.dateOfBirth?.month}/{attraction?.travellers?.dateOfBirth?.year}</p>
            </div> */}
              </div>
              <div className="flex justify-between mb-3">
                <div className="flex gap-4">
                  <p>Adult Count:</p>
                  <p>{attraction?.activities?.adultsCount}</p>
                </div>
                {attraction?.activities?.childrenCount > 0 && (
                <div className="flex gap-4">
                  <p>Children Count:</p>
                  <p>{attraction?.activities?.childrenCount}</p>
                </div>
                )}

                {attraction?.activities?.infantCount > 0 && (
                <div className="flex gap-4">
                  <p>Infants Count:</p>
                  <p>{attraction?.activities?.infantCount}</p>
                </div>
                )}
              </div>

              <div className="md:flex md:justify-between mb-3">
                <div className="flex gap-4 md:mb-0 mb-3">
                  <p>Status:</p>
                  <p>{attraction?.orderStatus}</p>
                </div>
                <div className="flex gap-4">
                  <p>Total Amount:</p>
                  <p>{priceConversion(attraction?.totalAmount, selectedCurrency, true)}</p>
                </div>
              </div>
              </div>

            </div>
            </Link>
          ))}
        </div>
      )}

      {orderlist === undefined && (
        <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      )}
    </div>
  );
};

export default AttractionOrders;
