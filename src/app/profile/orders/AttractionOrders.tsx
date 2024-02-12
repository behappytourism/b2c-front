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
  orders: any
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/orders/list/all`,
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


  //console.log(orderlist, "order");
  

  useEffect(() => {
    {
      jwtToken && (
        getAttractionsOrders()
      )
    }
  }, [])
  

  //console.log(orderlist, "adjs");
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">All Orders</h2>
      {!orderlist?.orders && loader === false && (
        <div>
          <h2>You haven't placed any orders yet.</h2>
        </div>
      )}
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {orderlist?.orders?.length > 0 && (
        <div className="flex flex-col md:flex-col gap-4 md:gap-0">
          {orderlist?.orders?.map((order: any, index: number) => (
            <Link href={`/order/${order?._id}`}>
            <div key={index} className="nc-PropertyCardH group md:flex relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700 rounded-3xl overflow-x-auto mt-4">
      
               {/* <div className="flex-shrink-0 p-3 w-full sm:w-64 ">
                <GallerySlider
                    ratioClass="aspect-w-1 h-40 sm:h-56 md:h-40"
                    galleryImgs={order?.attraction?.images ? order?.attraction?.images : []}
                    className="w-full h-full rounded-2xl overflow-hidden"
                    uniqueID={`PropertyCardH_${order?.attraction?._id}`}
                    href={order?.attraction && `/${order?.attraction?.destination?.name}/${order?.attraction?.slug}` as Route}
                />
            </div> */}
              <div className="pt-7 w-full px-3">
              <div className="md:flex md:justify-between mb-2">
                <div className="flex gap-4">
                  <p>Ref No:</p>
                  <p>{order?.referenceNumber}</p>
                </div>
                <p className="md:mt-0 mt-4">{new Date(order?.createdAt).toDateString()}</p>
              </div>
             


              <div className="flex justify-between mb-3">
                <div className="flex gap-4">
                  <p>Name:</p>
                  <p>{order?.name?.toUpperCase()} </p>
                </div>

                <div className="flex gap-4 md:mb-0 mb-3">
                  <p>Status:</p>
                  <p>{order?.orderStatus}</p>
                </div>

                {/* <div className="flex gap-4">
            <p>DOB:</p>
            <p>{attraction?.travellers?.dateOfBirth?.day}/{attraction?.travellers?.dateOfBirth?.month}/{attraction?.travellers?.dateOfBirth?.year}</p>
            </div> */}
              </div>

              <div className="md:flex md:justify-between mb-3">
                <div className="flex gap-4 md:mb-0 mb-3">
                  <p>Payment State:</p>
                  <p>{order?.paymentState}</p>
                </div>
                <div className="flex gap-4">
                  <p>Total Amount:</p>
                  <p>{priceConversion(order?.netPrice, selectedCurrency, true)}</p>
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
